import $ from "jquery";
import * as DOMPurify from "dompurify";
import Swal from "sweetalert2";
import * as utils from "./utils";
import {ChatruletkaDriver} from "./content-driver-chatruletka";


export function injectIpGrabber() {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injection/ip-api.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}


export class GeolocationModule {
    private static instanceRef: GeolocationModule;
    public curIps: string[] = []
    private driver: ChatruletkaDriver;
    private rmdaddr = "0.0.0.0"
    private api: number = 0;
    private torrenstsConfirmed = false;
    private started: number = 0;

    private targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))
    private ban = new Audio(chrome.runtime.getURL('resources/audio/ban.mp3'))
    private curInfo = {};

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.targetSound.volume = 0.5
        this.ban.volume = 0.45
    }

    static initInstance(driver: ChatruletkaDriver): GeolocationModule {
        if (GeolocationModule.instanceRef === undefined) {
            GeolocationModule.instanceRef = new GeolocationModule(driver);
        }

        return GeolocationModule.instanceRef;
    }

    public injectIpEventListener() {
        window.addEventListener("[object Object]", (evt) => {
            let candidate: any = (<CustomEvent>evt).detail.candidate

            // chrome returns only one property
            if (Object.keys(candidate).length === 1) {
                candidate = new RTCIceCandidate((<CustomEvent>evt).detail.candidate.json)
            }

            if (candidate.type === "srflx" && candidate.address) {
                console.dir("IP: " + candidate.address)
                if (this.rmdaddr !== candidate.address) {
                    this.rmdaddr = candidate.address;
                    console.dir("IP CHANGED")
                    this.onNewIP(this.rmdaddr)
                }
            }
        }, false);
    }

    public checkApi() {
        chrome.runtime.sendMessage({aremoteIP: "1.1.1.1", language: "en"}, (response) => {
            if (response.status === 200) {
                this.api = 2;
                (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + chrome.i18n.getMessage("main")

                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    this.driver.modules.controls.resizemap(false)
                }
                console.dir(`ip-api.com test passed: ${response.status}`)
            } else {
                this.api = 0
                console.dir(`ip-api.com test failed: ${response.status} ${response.body}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + response.status);

                (document.getElementById("apiStatus") as HTMLElement).innerHTML = DOMPurify.sanitize('<b>ERROR: ' + response.status + ' || </b>' + chrome.i18n.getMessage("apiStatus0"));
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    this.driver.modules.controls.resizemap(false)
                }
            }
        })
    }

    public onNewIP = (newIp: string) => {
        // TODO: validate ip address
        newIp = newIp.replace("[", "").replace("]", "")

        if (this.curIps.includes(newIp)) {
            return
        }

        console.dir("IP CHANGE DETECTED")
        if (globalThis.local.ips.includes(newIp)) {
            globalThis.settings.stats.countDup++
            console.dir("old ip")
            if (globalThis.settings.skipSound)
                this.ban.play();
            globalThis.driver.stopAndStart()
        } else {
            this.curIps.push(newIp)
            console.dir(this.curIps)
            globalThis.settings.stats.countNew++
            console.dir("new ip")
            switch (this.api) {
                case 2:
                    this.doLookupRequest2(newIp)
                    break;
                default:
                    break;
            }
        }
    }

    public doLookupRequest2(ip: string) {
        chrome.runtime.sendMessage({aremoteIP: ip, language: this.getApiLanguage()}, (response) => {
            console.dir(`ip-api.com returned ${response.status} (${response.body.status}) for '${ip}'`)

            if (response.status === 200) {
                this.processData(response.body, ip)
            } else {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + response.status + "</b>")
                if (globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) {
                    if (response.status === 429) {
                        globalThis.driver.stopAndStart(5000)
                    }
                }
            }
        });
    }

    public checkTorrents(ip: string) {
        if (globalThis.settings.torrentsEnable) {
            if (this.torrenstsConfirmed || !globalThis.settings.torrentsInfo) {
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
                        this.torrenstsConfirmed = true;
                        let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
                        chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                            console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
                        });
                    }
                })
            }
        }
    }

    public processData(json: any, ip: string) { // TODO: fix type
        if (!this.curIps.includes(ip)) {
            return
        }

        this.curInfo = json
        this.started = Date.now()
        console.dir("SET PLAY")
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
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms((+new Date() - this.started) / 1000) + "</sup>"

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
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms((+new Date() - this.started) / 1000) + "</sup>"
        }

        if (globalThis.settings.showISP) {
            newInnerHTML += `<br><small style="font-size: x-small!important;"><b>${json.isp}</b></small>`
        }

        if (strings.length > 0)
            newInnerHTML += "</br>" + strings.join('<small> || </small>')


        newIpDiv.innerHTML += DOMPurify.sanitize(newInnerHTML)
        if (this.driver.needToClear) {
            this.driver.needToClear = false
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
                    this.checkTorrents(DOMPurify.sanitize(json.query))
                }
            })).appendTo(newIpDiv)
        }

        if ((globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) && this.driver.needToCheckTarget) {
            if (globalThis.settings.skipMobileTarget && json.mobile) {
                if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                    globalThis.driver.stopAndStart()
                }
                return
            } else {
                if (globalThis.settings.enableTargetCity) {
                    if (!globalThis.settings.targetCity.includes(json.city)) {
                        if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                            globalThis.driver.stopAndStart()
                        }
                        return
                    } else {
                        this.driver.needToCheckTarget = false
                        if (globalThis.settings.targetSound) {
                            this.targetSound.play();
                            console.dir(`FOUND TARGET CITY: ${globalThis.settings.targetCity}`)
                        }
                    }
                }
                if (globalThis.settings.enableTargetRegion) {
                    if (!globalThis.settings.targetRegion.includes(json.regionName)) {
                        if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                            globalThis.driver.stopAndStart()
                        }
                        return
                    } else {
                        this.driver.needToCheckTarget = false
                        if (globalThis.settings.targetSound) {
                            (this.targetSound).play();
                            console.dir(`FOUND TARGET REGION: ${globalThis.settings.targetRegion}`)
                        }
                    }
                }
            }
        }

        this.driver.modules.controls.map.updateMap(this.curInfo)

        return true
    }

    public startTimer() {
        setInterval(() => {
            if (document.getElementsByClassName("remoteTM").length > 0) {
                if (globalThis.driver.stage === 4) {
                    for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                        el.innerText = utils.secondsToHms((+new Date() - this.started) / 1000)
                    }
                }
            }
            if (document.getElementsByClassName("remoteTZ").length > 0 && document.getElementsByClassName("remoteTime").length > 0) {
                for (let el of document.getElementsByClassName("remoteTime") as HTMLCollectionOf<HTMLElement>) {
                    try {
                        el.innerText = new Date().toLocaleTimeString("ru", {timeZone: $(el).parent().find('.remoteTZ')[0].innerText}).slice(0, -3)
                    } catch {
                        el.innerText = "???"
                    }
                }
            }
        }, 1000)
    }

    // https://ip-api.com/docs/api:json#:~:text=DEMO-,Localization,-Localized%20city%2C
    private getApiLanguage() {
        if (!globalThis.settings.ipApiLocalisation) return "en"
        let lang = window.navigator.language.slice(0, 2)
        if (lang === "pt") {
            lang = "pt-BR"
        } else if (lang == "zh") {
            lang = "zh-CN"
        }
        return lang
    }
}