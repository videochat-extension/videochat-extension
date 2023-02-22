import $ from "jquery";
import * as DOMPurify from "dompurify";
import Swal from "sweetalert2";
import * as utils from "./utils";
import {stopAndStart} from "./content";



export const onUpdateIP = function () {

    if ((document.getElementById("remoteIP") as HTMLElement).innerText === "-" || (document.getElementById("remoteIP") as HTMLElement).innerText === "")
        return

    let newIp = (document.getElementById("remoteIP") as HTMLElement).innerText.replace("[", "").replace("]", "")

    if (globalThis.curIps.includes(newIp)) {
        return
    }

    console.dir("IP CHANGE DETECTED")
    globalThis.requestToSkip = false
    if (globalThis.local.ips.includes((document.getElementById("remoteIP") as HTMLElement).innerText)) {
        globalThis.settings.stats.countDup++
        console.dir("old ip")
        if (globalThis.settings.skipSound)
            globalThis.ban.play();
        stopAndStart()
    } else {
        globalThis.curIps.push(newIp)
        console.dir(globalThis.curIps)
        globalThis.settings.stats.countNew++
        console.dir("new ip")
        switch (globalThis.api) {
            case 2:
                doLookupRequest2(newIp)
                break;
            case 1:
                doLookupRequest1(newIp)
                break;
            default:
                break;
        }

    }
}

export function doLookupRequest1(ip: string) {
    console.dir('sending request to ip-api.com...')
    $.getJSON("http://ip-api.com/json/" + ip, {
        lang: globalThis.language,
        fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
    })
        .done(function (json) {
            console.dir('ip-api.com responded: 200')
            processData(json, ip)
        })
        .fail(function (jqxhr) {
            console.dir(`ip-api.com request failed: ${jqxhr.status}`)
            console.dir(jqxhr)
            if (!globalThis.settings.minimalism) {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + jqxhr.status + "</b>")
            }
            if (globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) {
                if (jqxhr.status === 429) {
                    stopAndStart(5000)
                }
            }
        });
}

export function doLookupRequest2(ip: string) {
    chrome.runtime.sendMessage({remoteIP: ip, language: globalThis.language}, function (response) {
        console.dir(`request to send ip-api request sent to service worker: ${response}`)
    });
}

export function checkTorrents(ip: string) {
    if (globalThis.settings.torrentsEnable) {
        if (globalThis.torrenstsConfirmed || !globalThis.settings.torrentsInfo) {
            let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
            chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
            });
        } else {
            Swal.fire({
                title: 'iknowwhatyoudownload',
                heightAuto: false,
                showCancelButton: true,
                confirmButtonText: chrome.i18n.getMessage("YKWYDConfirmButtonText"),
                cancelButtonText: chrome.i18n.getMessage("YKWYDCancelButtonText"),
                html: chrome.i18n.getMessage("YKWYDHtml"),
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    globalThis.torrenstsConfirmed = true;
                    let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
                    chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                        console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
                    });
                }
            })
        }
    }
}

export function processData(json: any, ip: string) { // TODO: fix type
    if (!globalThis.curIps.includes(ip)) {
        return
    }

    if (globalThis.settings.minimalism) {
        setTimeout(() => {
            if ($('span[data-tr="connection"]').length === 1) {
                if (json.status === "success") {
                    let ipApiString = ``

                    if (json.mobile) {
                        ipApiString += `<b>${json.country}.</b>`
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainMobile")}`
                    } else {
                        ipApiString += `<b>${json.city} (${json.regionName}), ${json.country}.</b>`
                    }
                    if (json.proxy) {
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainProxy")}`
                    }
                    if (json.hosting) {
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainHosting")}`
                    }

                    $('<br><span>' + DOMPurify.sanitize(ipApiString) + '</span>').appendTo($(".message-bubble")[0])
                }
            }
        }, 250)
        return
    }

    globalThis.curInfo = json
    globalThis.startDate = +new Date() / 1000
    let strings = []
    let newInnerHTML = ''
    let newIpDiv = utils.createElement('div')
    if (globalThis.settings.showMoreEnabledByDefault && (json.mobile || json.proxy || json.hosting)) {
        if (json.mobile) {
            if (globalThis.settings.hideMobileLocation || globalThis.settings.showCT) {
                if (!globalThis.settings.showCT) {
                    strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobileHidden')}]</small>`)
                } else {
                    strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobile')}]</small>`)
                }
            } else {
                strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobile')}]</small>`)
            }
        }
        if (json.proxy && json.hosting) {
            strings.push(`<small>PROXY+HOSTING [${chrome.i18n.getMessage('apiProxy')}]</small>`)
        } else {
            if (json.proxy)
                strings.push(`<small>PROXY [${chrome.i18n.getMessage('apiProxy')}]</small>`)
            if (json.hosting)
                strings.push(`<small>HOSTING [${chrome.i18n.getMessage('apiHosting')}]</small>`)
        }
    }

    if ((globalThis.settings.hideMobileLocation || globalThis.settings.showCT) && json.mobile) {
        newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br></br>"

        if (globalThis.settings.showCT) {
            newInnerHTML += chrome.i18n.getMessage("apiCT") + `${json.city}/${json.regionName}</br>`
            try {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
            } catch {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + "???" + "</sup>) </br>"
            }
        } else {
            newInnerHTML += "<br><br><br>"
        }
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(+new Date() / 1000 - globalThis.startDate) + "</sup>"

    } else {
        newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br>"

        newInnerHTML += "</br>" +
            chrome.i18n.getMessage("apiCity") + json.city + " (" + json.region + ") </br>" +
            chrome.i18n.getMessage("apiRegion") + json.regionName + "</br>"
        try {
            newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
        } catch {
            newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + "???" + "</sup>) </br>"
        }
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(+new Date() / 1000 - globalThis.startDate) + "</sup>"
    }

    if (globalThis.settings.showISP) {
        newInnerHTML += `<br><small style="font-size: x-small!important;"><b>${json.isp}</b></small>`
    }

    if (strings.length > 0)
        newInnerHTML += "</br>" + strings.join('<small> || </small>')


    newIpDiv.innerHTML += DOMPurify.sanitize(newInnerHTML)
    if (globalThis.needToClear) {
        globalThis.needToClear = false
        $(document.getElementById("ipApiContainer") as HTMLElement).parent().children(':not(#ipApiContainer)').remove()
        $(document.getElementById("ipApiContainer") as HTMLElement).children().remove();
    }
    $(newIpDiv).appendTo(document.getElementById("ipApiContainer") as HTMLElement)
    console.dir("RENDER ++")

    if (globalThis.settings.torrentsEnable && !json.mobile && !json.proxy && !json.hosting) {
        newIpDiv.innerHTML += `<br><br>`
        $(utils.createElement('button', {
            innerHTML: "<b>" + chrome.i18n.getMessage("YKWYDButtonText") + "</b>",
            onclick: () => {
                checkTorrents(DOMPurify.sanitize(json.query))
            }
        })).appendTo(newIpDiv)
    }

    if ((globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) && globalThis.needToCheckTarget) {
        if (globalThis.settings.skipMobileTarget && json.mobile) {
            if (globalThis.curIps.indexOf(ip) + 1 === globalThis.curIps.length) {
                stopAndStart()
            }
            return
        } else {
            if (globalThis.settings.enableTargetCity) {
                if (!globalThis.settings.targetCity.includes(json.city)) {
                    if (globalThis.curIps.indexOf(ip) + 1 === globalThis.curIps.length) {
                        stopAndStart()
                    }
                    return
                } else {
                    globalThis.needToCheckTarget = false
                    if (globalThis.settings.targetSound) {
                        globalThis.targetSound.play();
                        console.dir(`FOUND TARGET CITY: ${globalThis.settings.targetCity}`)
                    }
                }
            }
            if (globalThis.settings.enableTargetRegion) {
                if (!globalThis.settings.targetRegion.includes(json.regionName)) {
                    if (globalThis.curIps.indexOf(ip) + 1 === globalThis.curIps.length) {
                        stopAndStart()
                    }
                    return
                } else {
                    globalThis.needToCheckTarget = false
                    if (globalThis.settings.targetSound) {
                        (globalThis.targetSound).play();
                        console.dir(`FOUND TARGET REGION: ${globalThis.settings.targetRegion}`)
                    }
                }
            }
        }
    }

    globalThis.mapModule.updateMap(globalThis.curInfo)

    return true
}