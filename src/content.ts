import "./content-globals"

import * as Sentry from "@sentry/browser";

import $ from "jquery";

import * as faceapi from 'face-api.js';
import * as L from 'leaflet'
import * as DOMPurify from 'dompurify';
import Swal from 'sweetalert2'
import * as utils from "./utils"

import {hotkeys} from "./content-hotkeys";
import "./content-sentry"
import "./background-listener"
import "./content-swal-context-invalidated"
import {updStats} from "./content-controls-tab-stats";
import {injectInterface, outputsize, resizemap} from "./content-controls";
import {switchMode} from "./content-swal-switchmode";

require('arrive')
require('tooltipster')

utils.addStyle(` .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-tile-container, .leaflet-pane > svg, .leaflet-pane > canvas, .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer {position: absolute;left: 0;top: 0;}.leaflet-container {overflow: hidden;}.leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow {-webkit-user-select: none;-moz-user-select: none;user-select: none;-webkit-user-drag: none;}.leaflet-tile::selection {background: transparent;}.leaflet-safari .leaflet-tile {image-rendering: -webkit-optimize-contrast;}.leaflet-safari .leaflet-tile-container {width: 1600px;height: 1600px;-webkit-transform-origin: 0 0;}.leaflet-marker-icon, .leaflet-marker-shadow {display: block;}.leaflet-container .leaflet-overlay-pane svg {max-width: none !important;max-height: none !important;}.leaflet-container .leaflet-marker-pane img, .leaflet-container .leaflet-shadow-pane img, .leaflet-container .leaflet-tile-pane img, .leaflet-container img.leaflet-image-layer, .leaflet-container .leaflet-tile {max-width: none !important;max-height: none !important;width: auto;padding: 0;}.leaflet-container.leaflet-touch-zoom {-ms-touch-action: pan-x pan-y;touch-action: pan-x pan-y;}.leaflet-container.leaflet-touch-drag {-ms-touch-action: pinch-zoom;touch-action: none;touch-action: pinch-zoom;}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {-ms-touch-action: none;touch-action: none;}.leaflet-container {-webkit-tap-highlight-color: transparent;}.leaflet-container a {-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);}.leaflet-tile {filter: inherit;visibility: hidden;}.leaflet-tile-loaded {visibility: inherit;}.leaflet-zoom-box {width: 0;height: 0;-moz-box-sizing: border-box;box-sizing: border-box;z-index: 800;}.leaflet-overlay-pane svg {-moz-user-select: none;}.leaflet-pane {z-index: 400;}.leaflet-tile-pane {z-index: 200;}.leaflet-overlay-pane {z-index: 400;}.leaflet-shadow-pane {z-index: 500;}.leaflet-marker-pane {z-index: 600;}.leaflet-tooltip-pane {z-index: 650;}.leaflet-popup-pane {z-index: 700;}.leaflet-map-pane canvas {z-index: 100;}.leaflet-map-pane svg {z-index: 200;}.leaflet-vml-shape {width: 1px;height: 1px;}.lvml {behavior: url(#default#VML);display: inline-block;position: absolute;}.leaflet-control {position: relative;z-index: 800;pointer-events: visiblePainted;pointer-events: auto;}.leaflet-top, .leaflet-bottom {position: absolute;z-index: 1000;pointer-events: none;}.leaflet-top {top: 0;}.leaflet-right {right: 0;}.leaflet-bottom {bottom: 0;}.leaflet-left {left: 0;}.leaflet-control {float: left;clear: both;}.leaflet-right .leaflet-control {float: right;}.leaflet-top .leaflet-control {margin-top: 10px;}.leaflet-bottom .leaflet-control {margin-bottom: 10px;}.leaflet-left .leaflet-control {margin-left: 10px;}.leaflet-right .leaflet-control {margin-right: 10px;}.leaflet-fade-anim .leaflet-popup {opacity: 0;-webkit-transition: opacity 0.2s linear;-moz-transition: opacity 0.2s linear;transition: opacity 0.2s linear;}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {opacity: 1;}.leaflet-zoom-animated {-webkit-transform-origin: 0 0;-ms-transform-origin: 0 0;transform-origin: 0 0;}svg.leaflet-zoom-animated {will-change: transform;}.leaflet-zoom-anim .leaflet-zoom-animated {-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition: -moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition: transform 0.25s cubic-bezier(0,0,0.25,1);}.leaflet-zoom-anim .leaflet-tile, .leaflet-pan-anim .leaflet-tile {-webkit-transition: none;-moz-transition: none;transition: none;}.leaflet-zoom-anim .leaflet-zoom-hide {visibility: hidden;}.leaflet-interactive {cursor: pointer;}.leaflet-grab {cursor: -webkit-grab;cursor: -moz-grab;cursor: grab;}.leaflet-crosshair, .leaflet-crosshair .leaflet-interactive {cursor: crosshair;}.leaflet-popup-pane, .leaflet-control {cursor: auto;}.leaflet-dragging .leaflet-grab, .leaflet-dragging .leaflet-grab .leaflet-interactive, .leaflet-dragging .leaflet-marker-draggable {cursor: move;cursor: -webkit-grabbing;cursor: -moz-grabbing;cursor: grabbing;}.leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-image-layer, .leaflet-pane > svg path, .leaflet-tile-container {pointer-events: none;}.leaflet-marker-icon.leaflet-interactive, .leaflet-image-layer.leaflet-interactive, .leaflet-pane > svg path.leaflet-interactive, svg.leaflet-image-layer.leaflet-interactive path {pointer-events: visiblePainted;pointer-events: auto;}.leaflet-container {background: #ddd;outline-offset: 1px;}.leaflet-container a {color: #0078A8;}.leaflet-zoom-box {border: 2px dotted #38f;background: rgba(255,255,255,0.5);}.leaflet-container {font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;font-size: 12px;font-size: 0.75rem;line-height: 1.5;}.leaflet-bar {box-shadow: 0 1px 5px rgba(0,0,0,0.65);border-radius: 4px;}.leaflet-bar a {background-color: #fff;border-bottom: 1px solid #ccc;width: 26px;height: 26px;line-height: 26px;display: block;text-align: center;text-decoration: none;color: black;}.leaflet-bar a, .leaflet-control-layers-toggle {background-position: 50% 50%;background-repeat: no-repeat;display: block;}.leaflet-bar a:hover, .leaflet-bar a:focus {background-color: #f4f4f4;}.leaflet-bar a:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}.leaflet-bar a:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-bottom: none;}.leaflet-bar a.leaflet-disabled {cursor: default;background-color: #f4f4f4;color: #bbb;}.leaflet-touch .leaflet-bar a {width: 30px;height: 30px;line-height: 30px;}.leaflet-touch .leaflet-bar a:first-child {border-top-left-radius: 2px;border-top-right-radius: 2px;}.leaflet-touch .leaflet-bar a:last-child {border-bottom-left-radius: 2px;border-bottom-right-radius: 2px;}.leaflet-control-zoom-in, .leaflet-control-zoom-out {font: bold 18px 'Lucida Console', Monaco, monospace;text-indent: 1px;}.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out {font-size: 22px;}.leaflet-control-layers {box-shadow: 0 1px 5px rgba(0,0,0,0.4);background: #fff;border-radius: 5px;}.leaflet-control-layers-toggle {background-image: url(images/layers.png);width: 36px;height: 36px;}.leaflet-retina .leaflet-control-layers-toggle {background-image: url(images/layers-2x.png);background-size: 26px 26px;}.leaflet-touch .leaflet-control-layers-toggle {width: 44px;height: 44px;}.leaflet-control-layers .leaflet-control-layers-list, .leaflet-control-layers-expanded .leaflet-control-layers-toggle {display: none;}.leaflet-control-layers-expanded .leaflet-control-layers-list {display: block;position: relative;}.leaflet-control-layers-expanded {padding: 6px 10px 6px 6px;color: #333;background: #fff;}.leaflet-control-layers-scrollbar {overflow-y: scroll;overflow-x: hidden;padding-right: 5px;}.leaflet-control-layers-selector {margin-top: 2px;position: relative;top: 1px;}.leaflet-control-layers label {display: block;font-size: 13px;font-size: 1.08333em;}.leaflet-control-layers-separator {height: 0;border-top: 1px solid #ddd;margin: 5px -10px 5px -6px;}.leaflet-default-icon-path {background-image: url(images/marker-icon.png);}.leaflet-container .leaflet-control-attribution {background: #fff;background: rgba(255, 255, 255, 0.8);margin: 0;}.leaflet-control-attribution, .leaflet-control-scale-line {padding: 0 5px;color: #333;line-height: 1.4;}.leaflet-control-attribution a {text-decoration: none;}.leaflet-control-attribution a:hover, .leaflet-control-attribution a:focus {text-decoration: underline;}.leaflet-attribution-flag {display: inline !important;vertical-align: baseline !important;width: 1em;height: 0.6669em;}.leaflet-left .leaflet-control-scale {margin-left: 5px;}.leaflet-bottom .leaflet-control-scale {margin-bottom: 5px;}.leaflet-control-scale-line {border: 2px solid #777;border-top: none;line-height: 1.1;padding: 2px 5px 1px;white-space: nowrap;-moz-box-sizing: border-box;box-sizing: border-box;background: rgba(255, 255, 255, 0.8);text-shadow: 1px 1px #fff;}.leaflet-control-scale-line:not(:first-child) {border-top: 2px solid #777;border-bottom: none;margin-top: -2px;}.leaflet-control-scale-line:not(:first-child):not(:last-child) {border-bottom: 2px solid #777;}.leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {box-shadow: none;}.leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {border: 2px solid rgba(0,0,0,0.2);background-clip: padding-box;}.leaflet-popup {position: absolute;text-align: center;margin-bottom: 20px;}.leaflet-popup-content-wrapper {padding: 1px;text-align: left;border-radius: 12px;}.leaflet-popup-content {margin: 13px 24px 13px 20px;line-height: 1.3;font-size: 13px;font-size: 1.08333em;min-height: 1px;}.leaflet-popup-content p {margin: 17px 0;margin: 1.3em 0;}.leaflet-popup-tip-container {width: 40px;height: 20px;position: absolute;left: 50%;margin-top: -1px;margin-left: -20px;overflow: hidden;pointer-events: none;}.leaflet-popup-tip {width: 17px;height: 17px;padding: 1px;margin: -10px auto 0;pointer-events: auto;-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);transform: rotate(45deg);}.leaflet-popup-content-wrapper, .leaflet-popup-tip {background: white;color: #333;box-shadow: 0 3px 14px rgba(0,0,0,0.4);}.leaflet-container a.leaflet-popup-close-button {position: absolute;top: 0;right: 0;border: none;text-align: center;width: 24px;height: 24px;font: 16px/24px Tahoma, Verdana, sans-serif;color: #757575;text-decoration: none;background: transparent;}.leaflet-container a.leaflet-popup-close-button:hover, .leaflet-container a.leaflet-popup-close-button:focus {color: #585858;}.leaflet-popup-scrolled {overflow: auto;}.leaflet-oldie .leaflet-popup-content-wrapper {-ms-zoom: 1;}.leaflet-oldie .leaflet-popup-tip {width: 24px;margin: 0 auto;-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);}.leaflet-oldie .leaflet-control-zoom, .leaflet-oldie .leaflet-control-layers, .leaflet-oldie .leaflet-popup-content-wrapper, .leaflet-oldie .leaflet-popup-tip {border: 1px solid #999;}.leaflet-div-icon {background: #fff;border: 1px solid #666;}.leaflet-tooltip {position: absolute;padding: 6px;background-color: #fff;border: 1px solid #fff;border-radius: 3px;color: #222;white-space: nowrap;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;pointer-events: none;box-shadow: 0 1px 3px rgba(0,0,0,0.4);}.leaflet-tooltip.leaflet-interactive {cursor: pointer;pointer-events: auto;}.leaflet-tooltip-top:before, .leaflet-tooltip-bottom:before, .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {position: absolute;pointer-events: none;border: 6px solid transparent;background: transparent;content: "";}.leaflet-tooltip-bottom {margin-top: 6px;}.leaflet-tooltip-top {margin-top: -6px;}.leaflet-tooltip-bottom:before, .leaflet-tooltip-top:before {left: 50%;margin-left: -6px;}.leaflet-tooltip-top:before {bottom: 0;margin-bottom: -12px;border-top-color: #fff;}.leaflet-tooltip-bottom:before {top: 0;margin-top: -12px;margin-left: -6px;border-bottom-color: #fff;}.leaflet-tooltip-left {margin-left: -6px;}.leaflet-tooltip-right {margin-left: 6px;}.leaflet-tooltip-left:before, .leaflet-tooltip-right:before {top: 50%;margin-top: -6px;}.leaflet-tooltip-left:before {right: 0;margin-right: -12px;border-left-color: #fff;}.leaflet-tooltip-right:before {left: 0;margin-left: -12px;border-right-color: #fff;}@media print {.leaflet-control {-webkit-print-color-adjust: exact;print-color-adjust: exact;}}`)

// "controls/header.js",
// "controls/tab-about.js",
// "controls/tab-api.js",
// "controls/tab-bans.js",
// "controls/tab-map.js",
// "controls/tab-settings.js",
// "controls/tab-settings-automation.js",
// "controls/tab-settings-blacklist.js",
// "controls/tab-settings-faceapi.js",
// "controls/tab-settings-geolocation.js",
// "controls/tab-settings-hotkeys.js",
// "controls/tab-settings-interface.js",
// "controls/tab-settings-misc.js",
// "controls/tab-settings-stats.js",
// "controls/tab-settings-streamer.js",
// "controls/tab-stats.js",
// "content.js",


if (globalThis.language === "pt")
    globalThis.language = "pt-BR"
else if (globalThis.language === "zh")
    globalThis.language = "zh-CN"

const s = document.createElement('script');
s.src = chrome.runtime.getURL('injection/ip-api.js');
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);

const c = document.createElement('link');
c.rel = "stylesheet";
c.href = chrome.runtime.getURL('libs/css/css-tooltip.min.css');

const cs = document.createElement('link');
cs.rel = "stylesheet";
cs.href = chrome.runtime.getURL("libs/css/tooltipster.bundle.min.css");

globalThis.dark = document.createElement('link');
globalThis.dark.rel = "stylesheet";
globalThis.dark.id = "darkMode"
if (location.href.includes('videochatru')) {
    chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
    globalThis.dark.href = chrome.runtime.getURL("resources/dark-mode.css");
} else if (location.href.includes('ome.tv')) {
    chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
    globalThis.dark.href = chrome.runtime.getURL("resources/dark-mode-ometv.css");
}

const css = document.createElement('style')
css.textContent = "small {font-size: xx-small!important;}";

chrome.storage.local.get(null, function (result) {
    globalThis.local = result;
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync")
        chrome.storage.sync.get(null, function (result) {
            globalThis.settings = result;
        });
});


try {
    let new_el = $(document.createElement("div"))

    new_el[0].innerHTML = chrome.i18n.getMessage("loginWindow")

    new_el[0].style.marginTop = "15px"
    new_el[0].style.marginBottom = "15px"

    new_el.insertAfter(document.querySelector('[data-tr="sign_in_to"]') as HTMLElement)
    $(".login-popup__item.right")[0].style.overflowY = "auto"
} catch (e) {
    console.dir(e)
}

export function stopAndStart(delay?: number | undefined) {
    globalThis.requestToSkip = false

    if (typeof delay !== "undefined") {
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
        clearTimeout(globalThis.timeout)
        globalThis.timeout = setTimeout(() => {
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
        }, delay)
    } else {
        globalThis.requestToStartTiming = +new Date();
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
    }
}

const onUpdateIP = function () {

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
            (document.getElementById('ban') as HTMLAudioElement).play();
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

function doLookupRequest1(ip: string) {
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

function doLookupRequest2(ip: string) {
    chrome.runtime.sendMessage({remoteIP: ip, language: globalThis.language}, function (response) {
        console.dir(`request to send ip-api request sent to service worker: ${response}`)
    });
}

function checkTorrents(ip: string) {
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
                        (document.getElementById('targetSound') as HTMLAudioElement).play();
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
                        (document.getElementById('targetSound') as HTMLAudioElement).play();
                        console.dir(`FOUND TARGET REGION: ${globalThis.settings.targetRegion}`)
                    }
                }
            }
        }
    }

    updateMap(globalThis.curInfo)

    return true
}

export function updateMap(json: any) {
    if (!$(document.getElementById("mapTabButton") as HTMLElement).hasClass("active") || Object.keys(globalThis.curInfo).length === 0) {
        return
    }

    if (typeof globalThis.marker !== 'undefined')
        globalThis.map.removeLayer(globalThis.marker)

    if (typeof globalThis.circle !== 'undefined')
        globalThis.map.removeLayer(globalThis.circle)

    if (globalThis.settings.hideMobileLocation && json.mobile) {
        globalThis.circle = L.circle([json.lat, json.lon], 300000, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2
        })

        globalThis.map.setView(new L.LatLng(json.lat, json.lon), 5);
        globalThis.marker = new L.Marker([json.lat, json.lon]);
    } else {
        globalThis.circle = L.circle([json.lat, json.lon], 30000, {
            color: 'blue',
            fillColor: '#808080',
            fillOpacity: 0.1
        })

        globalThis.map.setView(new L.LatLng(json.lat, json.lon), 13);
        globalThis.marker = new L.Marker([json.lat, json.lon]);
    }

    globalThis.map.addLayer(globalThis.circle)
    globalThis.map.addLayer(globalThis.marker)
}

const onChangeStage = function (mutations: any[]) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {

            if (globalThis.stage === 3) {
                globalThis.settings.stats.time += Math.ceil((Date.now() - globalThis.play) / 1000)
            }

            const attributeValue = String($(mutation.target).prop(mutation.attributeName));
            if (attributeValue.includes("s-search")) {
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                globalThis.stage = 1
                globalThis.curIps = []
                globalThis.needToClear = true
                globalThis.needToCheckTarget = true
                // console.dir("СТАДИЯ ПОИСКА")
                // offline.play()

                clearInterval(globalThis.tim);
                (document.getElementById("localStage") as HTMLElement).innerText = '1'
                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                if (globalThis.play < globalThis.search) {
                    // console.log("Dialog ended before even started")
                }

                globalThis.search = Date.now()
            } else if (attributeValue.includes("s-found")) {
                // console.dir("СТАДИЯ НАШЕЛ")

                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                globalThis.stage = 2;
                (document.getElementById("localStage") as HTMLElement).innerText = '2'
                globalThis.needToCheckTarget = true

                globalThis.found = Date.now()
                if (globalThis.requestToSkip)
                    stopAndStart()
            } else if (attributeValue.includes("s-play")) {
                // online.play()
                // console.dir("СТАДИЯ ВОСПРОИЗВЕДЕНИЯ")

                globalThis.stage = 3;
                (document.getElementById("localStage") as HTMLElement).innerText = '3'

                clearInterval(globalThis.tim)
                globalThis.tim = setTimeout(detectGender, 0)

                globalThis.play = Date.now()
                console.log("Loading took: ", ((globalThis.play - globalThis.found) / 1000).toFixed(2), "sec")


                if (globalThis.requestToSkip || (document.getElementById("remoteIP") as HTMLElement).innerText === "-") {
                    globalThis.requestToStartTiming = +new Date();
                    (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
                } else
                    globalThis.settings.stats.countAll++
            } else if (attributeValue.includes("s-stop")) {
                // offline.play()
                clearInterval(globalThis.tim)
                // console.dir("СТАДИЯ СТОП")
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                globalThis.curIps = []
                // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                globalThis.needToClear = true;
                (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                globalThis.stage = 0;
                (document.getElementById("localStage") as HTMLElement).innerText = '0'

                if (globalThis.requestToStartTiming !== 0 && +new Date() - globalThis.requestToStartTiming < 1000) {
                    globalThis.requestToStartTiming = 0;
                    (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                }
            }

            updStats(false)
        }
    });
}

export function syncBlackList() {
    if (globalThis.settings.dontBanMobile) {
        if (!globalThis.curInfo.mobile) {
            globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
            chrome.storage.local.set({"ips": globalThis.local.ips});

            if (globalThis.settings.skipSound)
                (document.getElementById('male') as HTMLAudioElement).play();
        }
    } else {
        globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
        chrome.storage.local.set({"ips": globalThis.local.ips});

        if (globalThis.settings.skipSound)
            (document.getElementById('male') as HTMLAudioElement).play();
    }
}


async function detectGender() {
    if (!globalThis.settings.skipMale && !globalThis.settings.skipFemale && !globalThis.settings.enableFaceApi)
        return
    let stop = false
    let skip_m = false
    let skip_f = false
    let text = ''
    if (globalThis.stage === 3) {
        console.time("faceapi: detectAllFaces()")

        clearInterval(globalThis.tim)

        let array = await faceapi.detectAllFaces(document.getElementById('remote-video') as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

        for (let i = 0; i < array.length; i++) {
            text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
            if (array[i].gender === "male" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_m = true
                stop = true
                globalThis.settings.stats.countMales++
            }
            if (array[i].gender === "female" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_f = true
                stop = true
                globalThis.settings.stats.countFemales++
            }
        }

        if (skip_m && globalThis.settings.skipMale) {
            text += `<b>male skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("MALE SKIPPED")
            globalThis.settings.stats.countMaleSkip++
            globalThis.settings.stats.countManSkip--

            if (globalThis.settings.autoBan) {
                syncBlackList()
            }
        }

        if (skip_f && globalThis.settings.skipFemale) {
            text += `<b>female skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("FEMALE SKIPPED")
            globalThis.settings.stats.countFemaleSkip++
            globalThis.settings.stats.countManSkip--

            if (globalThis.settings.autoBan) {
                syncBlackList()
            }
        }

        if (text !== '')
            (document.getElementById("remoteFace") as HTMLElement).innerHTML = text

        console.timeEnd("faceapi: detectAllFaces()")
    }
    if (!stop)
        globalThis.tim = setTimeout(detectGender, 500)
}

function checkApi() {
    console.dir(`attemping to connect to http://ip-api.com directly (will fail unless user allow unsecure content)`)
    $.getJSON("http://ip-api.com/json/", {
        fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
    }).done(function (json) {
        console.dir('direct ip-api.com connection test passed! proceeding with best possible speed')
        // best case
        globalThis.api = 1
        if (globalThis.settings.minimalism) {
            if ($('span[data-tr="rules"]').length === 1) {
                $("<span> </span>" + chrome.i18n.getMessage("apiStatus1")).appendTo($(".message-bubble")[0])
            }
        } else {
            (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
            (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus1") + "</br></br>" + chrome.i18n.getMessage("main")
            if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                resizemap(false)
            }
        }
    }).fail(function (jqxhr, textStatus, error) {
        console.dir('direct ip-api.com connection test failed! trying to connect via extension\'s service worker')
        chrome.runtime.sendMessage({testApi: true}, function (response) {
            console.dir(`request to send test ip-api request sent to service worker: ${response}`)
        });
    });
}

chrome.storage.sync.get(null, function (result) {
    Sentry.wrap(function () {
        globalThis.settings = result;

        let switchModeButton = utils.createElement('button', {
            onclick: () => {
                switchMode()
            },
        }, [
            utils.createElement('b', {
                innerText: chrome.i18n.getMessage("switchModeButtonText")
            })
        ])

        if (globalThis.settings.askForMode) {
            switchMode()
            return
        } else {
            if (globalThis.settings.minimalism) {
                $(utils.createElement('p', {
                    id: "remoteIP", style: "display: none;"
                })).appendTo($("body"))

                const onChangeStageMinimalism = function (mutations: MutationRecord[]) {
                    mutations.forEach(function (mutation: MutationRecord) {
                        if (mutation.attributeName === "class") {
                            const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                            if (attributeValue.includes("s-search")) {
                                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                                globalThis.curIps = []
                            } else if (attributeValue.includes("s-stop")) {
                                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                                globalThis.curIps = []
                            }
                        }
                    });
                }

                var observer3 = new MutationObserver(onChangeStageMinimalism)
                observer3.observe(document.getElementById('remote-video-wrapper') as HTMLElement, {attributes: true});

                const observer = new MutationObserver(onUpdateIP)
                observer.observe(document.getElementById('remoteIP') as HTMLElement, {
                    attributes: true,
                    childList: true,
                    characterData: true
                });

                if ($("[data-tr=\"rules\"]").length === 1) {
                    $("<br><br>").appendTo($(".message-bubble")[0])
                    $(switchModeButton).appendTo($(".message-bubble")[0])
                    checkApi()
                }

                document.arrive("[data-tr=\"rules\"]", function (el) {
                    $("<br><br>").appendTo($(".message-bubble")[0])
                    $(switchModeButton).appendTo($(".message-bubble")[0])
                    checkApi()
                })

                return true
            }
        }

        if ($("[data-tr=\"rules\"]").length === 1) {
            $("<br><br>").appendTo($(".message-bubble")[0])
            $(switchModeButton).appendTo($(".message-bubble")[0])
        }

        document.arrive("[data-tr=\"rules\"]", function (el) {
            $("<br><br>").appendTo($(".message-bubble")[0])
            $(switchModeButton).appendTo($(".message-bubble")[0])
            document.unbindArrive("[data-tr=\"rules\"]");
        });

        (document.head || document.documentElement).appendChild(c);
        (document.head || document.documentElement).appendChild(cs);
        (document.head || document.documentElement).appendChild(css);

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
            if (globalThis.stage === 3)
                globalThis.settings.stats.countManSkip++

            clearTimeout(globalThis.timeout)
        })

        document.getElementsByClassName('buttons__button stop-button')[0].addEventListener("click", (e: any) => { // TODO: fix type
            if (e.pointerType !== "") {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                checkApi()
            }
            clearTimeout(globalThis.timeout)
        })

        injectInterface()

        setInterval(() => {
            if (document.getElementsByClassName("remoteTM").length > 0) {
                if ((document.getElementById("localStage") as HTMLElement).innerText === "3") {
                    for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                        el.innerText = utils.secondsToHms(+new Date() / 1000 - globalThis.startDate)
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

        checkApi()

        if (globalThis.settings.hideLogo) {
            try {
                document.getElementById("logo-link")!.style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (globalThis.settings.hideHeader) {
            $("#header").hide();
            document.getElementById("app")!.style.height = "100%"
            window.dispatchEvent(new Event('resize'));
        }

        if (globalThis.settings.hideWatermark || globalThis.settings.streamer) {
            try {
                (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (globalThis.settings.hideBanner || globalThis.settings.streamer) {
            try {
                (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (globalThis.settings.doNotReflect) {
            $("#local-video").removeClass("video-container-local-video")
        }

        if (globalThis.settings.doNotCover) {
            $("#remote-video").css({"object-fit": "contain"})
            // $(".preview").css({"background-size": "contain"})
        }

        if (globalThis.settings.hideCamera) {
            $("#local-video-wrapper")[0].style.display = "none"
        }

        setInterval(() => {
            if (globalThis.settings.skipFourSec) {
                try {
                    if ((globalThis.stage === 2) && (globalThis.found + 4000 < Date.now())) {
                        console.dir("Skipping due to loading time limit");
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                        //settings.stats.countManSkip--
                    }
                } catch (e) {
                    //console.dir(e)
                }
            }
        }, 1000)

        if (globalThis.settings.autoResume) {
            (document.getElementById('overlay') as HTMLElement).style.background = "none";
            // document.getElementById('overlay').style.position = "unset"

            (document.getElementById('local-video-warning-popup') as HTMLElement).style.filter = "opacity(0)"
            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                        if (mutation.attributeName === "class") {
                            if ((mutation.target as HTMLElement).className.includes("disabled")) {
                                $(".ok").removeClass("disabled");
                                let disabledButton: HTMLElement = (document.getElementsByClassName("video-warning__btn")[0]).firstElementChild as HTMLElement
                                disabledButton.click()
                            }
                        }
                    }
                )
            }).observe($(".ok")[0], {attributes: true});
        }

        if (!globalThis.settings.ipApiLocalisation)
            globalThis.language = "en"

        if (globalThis.settings.hotkeys) {
            document.removeEventListener('keyup', hotkeys)
            document.addEventListener('keyup', hotkeys)
        }

        if (globalThis.settings.skipMale || globalThis.settings.skipFemale || globalThis.settings.enableFaceApi) {
            setTimeout(async () => {
                console.time("faceapi: loading models")
                await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL('resources/models'))
                await faceapi.nets.ageGenderNet.loadFromUri(chrome.runtime.getURL('resources/models'))
                console.timeEnd("faceapi: loading models")

                console.time("faceapi: initial facedetect");
                (document.getElementById("remoteFace") as HTMLElement).innerHTML = chrome.i18n.getMessage("initialFaceDetect")
                let tempImage = document.createElement('img')
                tempImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
                await faceapi.detectAllFaces(tempImage, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
                console.timeEnd("faceapi: initial facedetect");
                (document.getElementById("remoteFace") as HTMLElement).innerHTML = ""

                globalThis.faceApiLoaded = true

                globalThis.tim = setTimeout(detectGender, 200)
            }, 0)
        }

        if (globalThis.settings.streamer) {
            if (globalThis.settings.blurReport)
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"

            if (globalThis.settings.cover || globalThis.settings.coverPreview || globalThis.settings.coverNoise || globalThis.settings.coverStop) {
                $(utils.createElement('img', {
                    src: globalThis.settings.coverSrc,
                    id: "cover",
                    style: "height:100%; position: absolute; display:none"
                })).insertBefore("#remote-video")

                $(utils.createElement('img', {
                    src: globalThis.settings.coverSrc,
                    id: "cover2",
                    style: "height:100%; position: absolute; transform: scaleX(-1)"
                })).insertBefore("#local-video")

                $(".remote-video__preview").insertBefore("#cover")

                $(".remote-video__noise").insertBefore("#cover")
            }

            const streamerModeScript = document.createElement('script');
            streamerModeScript.src = chrome.runtime.getURL('injection/streamer-mode.js');
            streamerModeScript.onload = () => streamerModeScript.remove();
            (document.head || document.documentElement).appendChild(streamerModeScript);
        }

        if (globalThis.settings.darkMode)
            (document.body || document.documentElement).appendChild(dark);
        document.arrive(".test-elem", function () {
            // 'this' refers to the newly created element
        });
        document.arrive(".tr-country", function (el: any) { // TODO: FIX TYPE
            if (globalThis.settings.skipwrongcountry) {
                try {
                    if (el.parentElement?.className === "message-bubble") {
                        let expectedCountry = "ZZ"

                        if ($(".country-filter-popup__country").filter(".all").filter(".selected").length == 0) {
                            expectedCountry = $(".country-filter-popup__country").filter(".selected").children('span[data-tr]')[0].getAttribute('data-tr')!
                        }
                        let receivedCountry = el.dataset.tr
                        if (expectedCountry !== "ZZ" && expectedCountry !== receivedCountry) {
                            stopAndStart()
                            console.dir(el)
                            console.dir(`SKIPPED WRONG COUNTRY. EXPECTED: ${expectedCountry}, RECEIVED: ${receivedCountry}.`)
                        }
                    }
                } catch (e) {
                    console.dir("SKIP WRONG COUNTRY EXCEPTION BEGIN")
                    console.dir(e)
                    console.dir("SKIP WRONG COUNTRY EXCEPTION END")
                }
            }
        })

        new ResizeObserver(outputsize).observe(document.getElementById("overlay") as HTMLElement)

        const observer = new MutationObserver(onUpdateIP)
        observer.observe(document.getElementById('remoteIP') as HTMLElement, {
            attributes: true,
            childList: true,
            characterData: true
        });

        var observer2 = new MutationObserver(onChangeStage)
        observer2.observe(document.getElementById('remote-video-wrapper') as HTMLElement, {attributes: true});
        if (!globalThis.settings.swalInfoCompleted) {
            globalThis.info.showFromStart()
        } else {
            if (globalThis.settings.lastVersion !== chrome.runtime.getManifest().version) {
                globalThis.changelog.showFromVersion(globalThis.settings.lastVersion)
            }
        }

        chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
    })
});
