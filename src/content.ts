// "sentry.js",
import * as Sentry from "@sentry/browser";
import {ErrorEvent} from "@sentry/types";

require('arrive')
require('tooltipster')
import * as faceapi from 'face-api.js';
import * as L from 'leaflet'
import * as DOMPurify from 'dompurify';
import Swal, {SweetAlertResult} from 'sweetalert2'
import $ from "jquery";

function addStyle(styleString: string) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

addStyle(` .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-tile-container, .leaflet-pane > svg, .leaflet-pane > canvas, .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer {position: absolute;left: 0;top: 0;}.leaflet-container {overflow: hidden;}.leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow {-webkit-user-select: none;-moz-user-select: none;user-select: none;-webkit-user-drag: none;}.leaflet-tile::selection {background: transparent;}.leaflet-safari .leaflet-tile {image-rendering: -webkit-optimize-contrast;}.leaflet-safari .leaflet-tile-container {width: 1600px;height: 1600px;-webkit-transform-origin: 0 0;}.leaflet-marker-icon, .leaflet-marker-shadow {display: block;}.leaflet-container .leaflet-overlay-pane svg {max-width: none !important;max-height: none !important;}.leaflet-container .leaflet-marker-pane img, .leaflet-container .leaflet-shadow-pane img, .leaflet-container .leaflet-tile-pane img, .leaflet-container img.leaflet-image-layer, .leaflet-container .leaflet-tile {max-width: none !important;max-height: none !important;width: auto;padding: 0;}.leaflet-container.leaflet-touch-zoom {-ms-touch-action: pan-x pan-y;touch-action: pan-x pan-y;}.leaflet-container.leaflet-touch-drag {-ms-touch-action: pinch-zoom;touch-action: none;touch-action: pinch-zoom;}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {-ms-touch-action: none;touch-action: none;}.leaflet-container {-webkit-tap-highlight-color: transparent;}.leaflet-container a {-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);}.leaflet-tile {filter: inherit;visibility: hidden;}.leaflet-tile-loaded {visibility: inherit;}.leaflet-zoom-box {width: 0;height: 0;-moz-box-sizing: border-box;box-sizing: border-box;z-index: 800;}.leaflet-overlay-pane svg {-moz-user-select: none;}.leaflet-pane {z-index: 400;}.leaflet-tile-pane {z-index: 200;}.leaflet-overlay-pane {z-index: 400;}.leaflet-shadow-pane {z-index: 500;}.leaflet-marker-pane {z-index: 600;}.leaflet-tooltip-pane {z-index: 650;}.leaflet-popup-pane {z-index: 700;}.leaflet-map-pane canvas {z-index: 100;}.leaflet-map-pane svg {z-index: 200;}.leaflet-vml-shape {width: 1px;height: 1px;}.lvml {behavior: url(#default#VML);display: inline-block;position: absolute;}.leaflet-control {position: relative;z-index: 800;pointer-events: visiblePainted;pointer-events: auto;}.leaflet-top, .leaflet-bottom {position: absolute;z-index: 1000;pointer-events: none;}.leaflet-top {top: 0;}.leaflet-right {right: 0;}.leaflet-bottom {bottom: 0;}.leaflet-left {left: 0;}.leaflet-control {float: left;clear: both;}.leaflet-right .leaflet-control {float: right;}.leaflet-top .leaflet-control {margin-top: 10px;}.leaflet-bottom .leaflet-control {margin-bottom: 10px;}.leaflet-left .leaflet-control {margin-left: 10px;}.leaflet-right .leaflet-control {margin-right: 10px;}.leaflet-fade-anim .leaflet-popup {opacity: 0;-webkit-transition: opacity 0.2s linear;-moz-transition: opacity 0.2s linear;transition: opacity 0.2s linear;}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {opacity: 1;}.leaflet-zoom-animated {-webkit-transform-origin: 0 0;-ms-transform-origin: 0 0;transform-origin: 0 0;}svg.leaflet-zoom-animated {will-change: transform;}.leaflet-zoom-anim .leaflet-zoom-animated {-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition: -moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition: transform 0.25s cubic-bezier(0,0,0.25,1);}.leaflet-zoom-anim .leaflet-tile, .leaflet-pan-anim .leaflet-tile {-webkit-transition: none;-moz-transition: none;transition: none;}.leaflet-zoom-anim .leaflet-zoom-hide {visibility: hidden;}.leaflet-interactive {cursor: pointer;}.leaflet-grab {cursor: -webkit-grab;cursor: -moz-grab;cursor: grab;}.leaflet-crosshair, .leaflet-crosshair .leaflet-interactive {cursor: crosshair;}.leaflet-popup-pane, .leaflet-control {cursor: auto;}.leaflet-dragging .leaflet-grab, .leaflet-dragging .leaflet-grab .leaflet-interactive, .leaflet-dragging .leaflet-marker-draggable {cursor: move;cursor: -webkit-grabbing;cursor: -moz-grabbing;cursor: grabbing;}.leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-image-layer, .leaflet-pane > svg path, .leaflet-tile-container {pointer-events: none;}.leaflet-marker-icon.leaflet-interactive, .leaflet-image-layer.leaflet-interactive, .leaflet-pane > svg path.leaflet-interactive, svg.leaflet-image-layer.leaflet-interactive path {pointer-events: visiblePainted;pointer-events: auto;}.leaflet-container {background: #ddd;outline-offset: 1px;}.leaflet-container a {color: #0078A8;}.leaflet-zoom-box {border: 2px dotted #38f;background: rgba(255,255,255,0.5);}.leaflet-container {font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;font-size: 12px;font-size: 0.75rem;line-height: 1.5;}.leaflet-bar {box-shadow: 0 1px 5px rgba(0,0,0,0.65);border-radius: 4px;}.leaflet-bar a {background-color: #fff;border-bottom: 1px solid #ccc;width: 26px;height: 26px;line-height: 26px;display: block;text-align: center;text-decoration: none;color: black;}.leaflet-bar a, .leaflet-control-layers-toggle {background-position: 50% 50%;background-repeat: no-repeat;display: block;}.leaflet-bar a:hover, .leaflet-bar a:focus {background-color: #f4f4f4;}.leaflet-bar a:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}.leaflet-bar a:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-bottom: none;}.leaflet-bar a.leaflet-disabled {cursor: default;background-color: #f4f4f4;color: #bbb;}.leaflet-touch .leaflet-bar a {width: 30px;height: 30px;line-height: 30px;}.leaflet-touch .leaflet-bar a:first-child {border-top-left-radius: 2px;border-top-right-radius: 2px;}.leaflet-touch .leaflet-bar a:last-child {border-bottom-left-radius: 2px;border-bottom-right-radius: 2px;}.leaflet-control-zoom-in, .leaflet-control-zoom-out {font: bold 18px 'Lucida Console', Monaco, monospace;text-indent: 1px;}.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out {font-size: 22px;}.leaflet-control-layers {box-shadow: 0 1px 5px rgba(0,0,0,0.4);background: #fff;border-radius: 5px;}.leaflet-control-layers-toggle {background-image: url(images/layers.png);width: 36px;height: 36px;}.leaflet-retina .leaflet-control-layers-toggle {background-image: url(images/layers-2x.png);background-size: 26px 26px;}.leaflet-touch .leaflet-control-layers-toggle {width: 44px;height: 44px;}.leaflet-control-layers .leaflet-control-layers-list, .leaflet-control-layers-expanded .leaflet-control-layers-toggle {display: none;}.leaflet-control-layers-expanded .leaflet-control-layers-list {display: block;position: relative;}.leaflet-control-layers-expanded {padding: 6px 10px 6px 6px;color: #333;background: #fff;}.leaflet-control-layers-scrollbar {overflow-y: scroll;overflow-x: hidden;padding-right: 5px;}.leaflet-control-layers-selector {margin-top: 2px;position: relative;top: 1px;}.leaflet-control-layers label {display: block;font-size: 13px;font-size: 1.08333em;}.leaflet-control-layers-separator {height: 0;border-top: 1px solid #ddd;margin: 5px -10px 5px -6px;}.leaflet-default-icon-path {background-image: url(images/marker-icon.png);}.leaflet-container .leaflet-control-attribution {background: #fff;background: rgba(255, 255, 255, 0.8);margin: 0;}.leaflet-control-attribution, .leaflet-control-scale-line {padding: 0 5px;color: #333;line-height: 1.4;}.leaflet-control-attribution a {text-decoration: none;}.leaflet-control-attribution a:hover, .leaflet-control-attribution a:focus {text-decoration: underline;}.leaflet-attribution-flag {display: inline !important;vertical-align: baseline !important;width: 1em;height: 0.6669em;}.leaflet-left .leaflet-control-scale {margin-left: 5px;}.leaflet-bottom .leaflet-control-scale {margin-bottom: 5px;}.leaflet-control-scale-line {border: 2px solid #777;border-top: none;line-height: 1.1;padding: 2px 5px 1px;white-space: nowrap;-moz-box-sizing: border-box;box-sizing: border-box;background: rgba(255, 255, 255, 0.8);text-shadow: 1px 1px #fff;}.leaflet-control-scale-line:not(:first-child) {border-top: 2px solid #777;border-bottom: none;margin-top: -2px;}.leaflet-control-scale-line:not(:first-child):not(:last-child) {border-bottom: 2px solid #777;}.leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {box-shadow: none;}.leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {border: 2px solid rgba(0,0,0,0.2);background-clip: padding-box;}.leaflet-popup {position: absolute;text-align: center;margin-bottom: 20px;}.leaflet-popup-content-wrapper {padding: 1px;text-align: left;border-radius: 12px;}.leaflet-popup-content {margin: 13px 24px 13px 20px;line-height: 1.3;font-size: 13px;font-size: 1.08333em;min-height: 1px;}.leaflet-popup-content p {margin: 17px 0;margin: 1.3em 0;}.leaflet-popup-tip-container {width: 40px;height: 20px;position: absolute;left: 50%;margin-top: -1px;margin-left: -20px;overflow: hidden;pointer-events: none;}.leaflet-popup-tip {width: 17px;height: 17px;padding: 1px;margin: -10px auto 0;pointer-events: auto;-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);transform: rotate(45deg);}.leaflet-popup-content-wrapper, .leaflet-popup-tip {background: white;color: #333;box-shadow: 0 3px 14px rgba(0,0,0,0.4);}.leaflet-container a.leaflet-popup-close-button {position: absolute;top: 0;right: 0;border: none;text-align: center;width: 24px;height: 24px;font: 16px/24px Tahoma, Verdana, sans-serif;color: #757575;text-decoration: none;background: transparent;}.leaflet-container a.leaflet-popup-close-button:hover, .leaflet-container a.leaflet-popup-close-button:focus {color: #585858;}.leaflet-popup-scrolled {overflow: auto;}.leaflet-oldie .leaflet-popup-content-wrapper {-ms-zoom: 1;}.leaflet-oldie .leaflet-popup-tip {width: 24px;margin: 0 auto;-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);}.leaflet-oldie .leaflet-control-zoom, .leaflet-oldie .leaflet-control-layers, .leaflet-oldie .leaflet-popup-content-wrapper, .leaflet-oldie .leaflet-popup-tip {border: 1px solid #999;}.leaflet-div-icon {background: #fff;border: 1px solid #666;}.leaflet-tooltip {position: absolute;padding: 6px;background-color: #fff;border: 1px solid #fff;border-radius: 3px;color: #222;white-space: nowrap;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;pointer-events: none;box-shadow: 0 1px 3px rgba(0,0,0,0.4);}.leaflet-tooltip.leaflet-interactive {cursor: pointer;pointer-events: auto;}.leaflet-tooltip-top:before, .leaflet-tooltip-bottom:before, .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {position: absolute;pointer-events: none;border: 6px solid transparent;background: transparent;content: "";}.leaflet-tooltip-bottom {margin-top: 6px;}.leaflet-tooltip-top {margin-top: -6px;}.leaflet-tooltip-bottom:before, .leaflet-tooltip-top:before {left: 50%;margin-left: -6px;}.leaflet-tooltip-top:before {bottom: 0;margin-bottom: -12px;border-top-color: #fff;}.leaflet-tooltip-bottom:before {top: 0;margin-top: -12px;margin-left: -6px;border-bottom-color: #fff;}.leaflet-tooltip-left {margin-left: -6px;}.leaflet-tooltip-right {margin-left: 6px;}.leaflet-tooltip-left:before, .leaflet-tooltip-right:before {top: 50%;margin-top: -6px;}.leaflet-tooltip-left:before {right: 0;margin-right: -12px;border-left-color: #fff;}.leaflet-tooltip-right:before {left: 0;margin-left: -12px;border-right-color: #fff;}@media print {.leaflet-control {-webkit-print-color-adjust: exact;print-color-adjust: exact;}}`)

Sentry.init({
    dsn: "https://09512316dbc3422f931ad37d4fb12ed2@o1272228.ingest.sentry.io/6533563",
    release: "videochatru-extension@" + chrome.runtime.getManifest().version,
    beforeSend(event: ErrorEvent) { // suppress error if user forbids error reporting
        let sentryCheck: HTMLInputElement = document.getElementById("sentryCheck") as HTMLInputElement;
        if (typeof sentryCheck == 'object' && sentryCheck.checked) return event;
        if (typeof sentryCheck == 'undefined') return event;
        return null;
    },
    autoSessionTracking: false // disable session tracking
});

// "controls.js",
function createStyle() {
    return createElement('style', {
        textContent: `.tabs__content {
                display: none;
                padding-left: 5px;
                padding-right: 5px;
              }
              
              .tabs__content.active {
                display: block;
              }
              
              .tabs {
                position: relative;
                word-break: break-word;
                user-select: text;
              }
              
              .tabs__caption {
                display: flex;
                flex-wrap: wrap;
                list-style-type: none;
                bottom: 0px;
                background: #f8f8f8;
                margin: 0;
                position: absolute;
                width: 100%;
                border-bottom: 1px solid lightgray;
                user-select: none;
              }
              
              .tabs__caption li {
                padding: 0.2rem 0.5rem;
                text-decoration: none;
                color: black;
                text-align: center;
                flex-shrink: 0;
                flex-grow: 1;
              }
      
              .tabs__caption li:not(.active) {
                cursor: pointer;
              }
              
              .tabs__caption .active {
                font-weight: bold;
              }
              
              .row:after {
                content: "";
                display: table;
                box-sizing: border-box;
                clear: both;
              }
              
              dd {
                margin-inline-start: 20px!important;
              }
              
              input {
                margin-left: 5px!important;
              }
              
              p {
                display: inline-block;
              }
              `
    })
}

function createTabs() {
    return createElement('ul', {
        className: "tabs__caption"
    }, [createElement('li', {
        className: "active", innerText: chrome.i18n.getMessage("tab1"),
    }), createElement('li', {
        id: "mapTabButton",
        innerText: chrome.i18n.getMessage("tab2")
    }), createElement('li', {
        innerText: chrome.i18n.getMessage("tabBans")
    }), createElement('li', {
        innerText: chrome.i18n.getMessage("tabStats")
    }), createElement('li', {
        innerText: chrome.i18n.getMessage("tab3")
    }), createElement('li', {
        innerText: chrome.i18n.getMessage("tab4")
    })])
}

function createControls() {
    return createElement('div', {
        className: 'chat', id: 'controls', style: "width:390px; margin-right: calc(100vh / 768 * 10);"
    }, [createElement('div', {
        className: "tabs chat"
    }, [createStyle(), createElement('p', {
        id: "remoteIP", style: "display: none;"
    }), createElement('div', {
        id: "remoteIPInfo", style: "display: none;"
    }), createElement('div', {
        id: "localStage", style: "display: none"
    }), createHeader(), createTabs(),
        createTabApi(), createTabMap(), createTabBans(), createTabStats(), createTabSettings(), createTabAbout(),])])
}

function injectInterface() {
    controls = createControls();
    ($(".gender-selector")[0] as HTMLElement).parentElement!.remove()

    $(controls).insertBefore(".chat");

    $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

        updateMap(curInfo)

        if (this.innerText === chrome.i18n.getMessage("tab3")) {
            resizemap(true)
        } else {
            resizemap(false)
        }
    });

    $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

    L.Icon.Default.imagePath = chrome.runtime.getURL('libs/js/leaflet/');

    if (language === "ru") {
        map = L.map('mapid', {attributionControl: false, zoomControl: false}).setView([54.39554, 39.266102], 17);
    } else {
        map = L.map('mapid', {attributionControl: false, zoomControl: false}).setView([47.75409, 12.832031], 3);
    }

    map.locate({setView: true});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        minZoom: 3, maxZoom: 18
    }).addTo(map);


    var male = new Audio(chrome.runtime.getURL('resources/audio/male.mp3'))
    var ban = new Audio(chrome.runtime.getURL('resources/audio/ban.mp3'))
    var targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))

    male.volume = 0.3
    ban.volume = 0.45
    targetSound.volume = 0.5
}

let videoContainerHeight = 0, chatContainerHeight = 0

// TODO: FIX IT ON OME.TV: GO SETTINGS -> resize window -> GO OTHER TAB -> size wont change
function resizemap(extend: boolean) {
    if (extend && settings.expand) {
        let newVideoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height)
        let newChatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height)

        if (newVideoContainerHeight !== (newVideoContainerHeight + newChatContainerHeight) / 2) {
            videoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height);
            chatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height);

            (document.getElementById("video-container") as HTMLElement).style.height = (videoContainerHeight + chatContainerHeight) / 2 + "px";
            (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = (videoContainerHeight + chatContainerHeight) / 2 + "px"
        }
    } else {
        if (videoContainerHeight !== 0 && chatContainerHeight !== 0) {
            (document.getElementById("video-container") as HTMLElement).style.height = videoContainerHeight + "px";
            (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = chatContainerHeight + "px"
        }
    }

    let tabs = $(".tabs__caption")[0]

    let mapid = (document.getElementById("mapid") as HTMLElement)
    mapid.style.height = $("#faceapiContent")[0].offsetHeight - tabs.offsetHeight + "px"
    mapid.style.height = $("#faceapiContent")[0].offsetHeight - tabs.offsetHeight + "px"

    let remoteInfo = (document.getElementById("remoteInfo") as HTMLElement)
    remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $("#apiStatus")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $("#apiStatus")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    let aboutInfo = (document.getElementById("aboutInfo") as HTMLElement)
    aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    let settingsInfo = (document.getElementById("settingsInfo") as HTMLElement)
    settingsInfo.style.height = $("#settingsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    settingsInfo.style.height = $("#settingsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    let bansInfo = (document.getElementById("bansInfo") as HTMLElement)
    bansInfo.style.height = $("#bansPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    bansInfo.style.height = $("#bansPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    let statsInfo = (document.getElementById("statsInfo") as HTMLElement)
    statsInfo.style.height = $("#statsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    statsInfo.style.height = $("#statsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    map.invalidateSize()
}

function outputsize() {
    videoContainerHeight = 0
    chatContainerHeight = 0

    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
        resizemap(true)
    } else {
        resizemap(false)
    }

    clearTimeout(resize)
    resize = setTimeout(() => {
        // let controls = (document.getElementById("controls") as HTMLElement)
        // let buttons = (document.getElementById("buttons") as HTMLElement)
        // let chat = (document.getElementById("chat") as HTMLElement)

        let mar = parseInt(window.getComputedStyle(controls).marginRight)
        buttons.style.width = (parseInt(buttons.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
        chat.style.width = (parseInt(chat.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
        // resize = false // TODO: I COMMENTED IT OUT
        if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
            resizemap(true)
        } else {
            resizemap(false)
        }
    }, 500)
}

// "controls/header.js",
function createHeader() {
    return createElement('center', {
        style: "user-select:none"
    }, [
        createElement('div', {
            style: "position:absolute; left:0;top:0",
        }, [
            createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_remote"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: "color: green; height:15px",
                title: "pip remote",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("remote-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("remote-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: function f() {
                    if (settings.streamer && settings.streamerPip) {
                        return "height:15px"
                    } else {
                        return "display:none"
                    }
                }(),
                title: "pip remote clone (for streamers)",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("echo-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("echo-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
        createElement('a', {
            target: "_blank",
            style: (() => {
                if (settings.darkMode)
                    return "text-decoration: none!important; color: #E8E6E3;"
                else
                    return "text-decoration: none!important; color: #000000;"
            })(),
            href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
        }, [
            createElement('b', {
                innerText: chrome.i18n.getMessage("extension_name").replace(" (ome.tv) ", " ") + " v" + chrome.runtime.getManifest().version.substring(0, 3),
                id: "connectionStatus",
            })
        ]),
        createElement('div', {
            style: "position:absolute; right:0; top:0",
        }, [
            createElement('button', {
                style: "color: green; height:15px",
                title: "pip local",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("local-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("local-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_local"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
    ])
}

// "controls/tab-about.js",
function createTabAbout() {
    return createElement('div', {
        className: "tabs__content",
        id: "aboutPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "aboutInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('span', {
                    innerHTML: chrome.i18n.getMessage("desc"),
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {}, [
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-right: 3px",
                        href: "https://discord.gg/YZKnbKGWen"
                    }, [
                        createElement('img', {
                            src: chrome.i18n.getMessage("discordBadge"),
                        }),
                    ]),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important;",
                        href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/chrome-web-store/users/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20users&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAW80lEQVR42u1deZAc1X3%2Bfj2zh6Rdg5B2V6t7zSlVYhuE%2FwjgQiATkhgMhBhcJlRSDuVUyoFQhjihTBUJTnAqOKbAiZ04NoQQsMuADSQOlihRgDh8CRSDkLhWq2NXQqx2de1qd7rf%2B%2BWPd3bPzB4zPbOzUr%2Farpnp7unued%2F3%2B37He91LzIysnbgtyLogI0DWMgJkLSNA1jICZC0jQNYyAmQtI0DWMgJkLSNA1jICZO14b%2Fmp7khEDXfxewYGbnrpxZfutSuKhjW8FWUuf9ojIYkvnHfe%2BX%2BxfNmS%2Bxqtb6Y6xjNrFWDPwMBNUsh7J6FtFUhPfkgAkFLcu2t3%2F02ZC2gE8GdIpGYzCYLj0%2FIrNugqSCBnJQmC4x%2F8GriBMsGBIsGemzIC1AT8vVMDvx5ugCZTgtlDgllBgD39e1OV%2FVqzYzaRIJgV4MvZAn5CCfY0PgloqvniTNUBdu3u54mc%2BPJlS2e0QNG3c1eJYoNbtXLF8hm5vuO0DkDI2gnmAijDPAsCZ0%2FjjABZywiQtYwAWcsIkLXZkVdNNV8c2LuXq8053f7lgiaaZP8pBFpU6jtT%2BB5Pb0P5n0wVfKf0uabWqxzrOXOOnpUrKFOAEzCqr7sLyG4uzmKArJ2oBFDWn0lAo7ibStQ4qDf4J6rLaNTfna%2F8h3DKjM%2BK%2Fg1NgJl6lEwlp505a5t9JA4aHcwTLS2r9y8NGuPnUY0NkDNezTQBsnrBCUyAiUu51KCk4Tp%2F7wSIAarrHK6AbJmazTgBJk4bU7R%2BOj4s8rgiwMQgUurWP7OKXQ2Zq3M31YTQ%2BfoAzykSJws00%2Fzt%2BdpeCNfH%2Bqk2ljVjMUYdiZOvv9XTcWzFs%2B%2Fi8%2BkBXr3VV%2BQ6qAriZPHhdMYCqulNmkXWWMn3ZiIAbAgXwBV3zGy0%2FsZyT5yKaeVr02NUZcfyDFn%2FzJ%2BzIi7zjClA9TJfMfhUC6vkuv3uWRgEpv9DawM%2B1wRnnvUuo3SbsUmh6cv%2BbEz%2FeDYpQK2An2ZH1Mz6Z17%2BeZp70mxTgBkHP%2FWax8zLf7Xnyc%2FsRXJ9jS1xOu7tBQignp4TUv5rTgBOS25p%2BirCWzYD72wHDx1A8P6AkjsenxKnImoGQOCuxeD5HaDTzwJ99GMNJf%2Bp5W5Tne27p3%2BAqwO9tuDzjj7ITRsR7N4BGj%2BCIKAJny8zEXwsGcwCJABmqWZES0C2nQJe2QP6xMWg5T2o%2FCbQ4n6oxP9PdJ6p3hxaNQGm7oMqYO4k4HNfH%2BSGp0C9b4Eg1ZPMAgIFAUABKEBZEtCE4EuQfoX3CslgCUAKyFwz%2BIzfQHDp74GWr6zaCBqeALv3DHCtxW2q4Iv1TwObNgIjwwhyBKYAAREQBArwgEBEYCKQfu8TgcowmSUAA7qUmhBCb1MqYEkhGMRSEWb%2BQtDaSxB88tIaW%2F%2BsIUCVfqoM%2BNGPfwhsehYojINyDuggAJgCrQCB%2Br52AQQCBwRCoK6LyDs8A0xgSBBDAQtt6cyAlAA88CWDpHEJmiSGHCyBlrngiy9F7oqray7%2FaDwCpBCcUGn3Ej3zU%2BC%2FHwcKYwrAIFDWnSMQARQE2uIBMr6fNBGgPweApkPshApwfTJmtZWN9StisLZ8EuzAt0qhv2fcBDO4tQ3BVdcgWHfJjMh%2FjQjQX9u8pYTVyzdeh3joAWBwL4gCZdXGsgMt%2FYEiARupD0hjThp8z%2FKTD%2B%2FQnxXs5CyeWe0n1S1xyuq1AmjZd5bvqQUbpdDvFy9F7vobQKtX11X%2BZxcByln9v38b%2FOJzaruWdguwRwLj30lbuXIFsIrgyFAmINQnZKk7l40YaLC1a3BAJ8F3lu%2FHCNaNCAatuxT5G76QmvXjuCBAGSzk7l2I7r4LGBrUkTx5JHBWThQ4aTdBXiwAVCdxmOv35D96mGIdqfqCtexbJniAe9ZtCMETgO%2BrQWc38rfdhmDx0ppbf2MToLwRInryCYjHfgBEhZi1K%2Fl3%2Ftx%2B1ioAxInAIKX80AFfQOokBLCfDRipB3n%2B36zzLR6etWuXYYH3APeUIQa%2B0AA2NSO47jrkL%2Ft0xcWftAlQn8EgmrxoFN77DYhNzzsLDgCSxlAliPU6mEhdh3QcAMRqO7FWAoBZbyfty60auJNKNpcmXSpoNvgkMIAirgomRoDNBmBJYRRAHVpHkmNjkN%2F9LsIdfWi68aaKujHtMYZ8PQEvl9cX%2Fv7vIH%2F1CxXFK2VWrwEAAVDAynLZBILab0P7WAo0%2BM7PU6CUIBZcUrFhxW9cYucK2LN8oMgdEHv7SS87sL7MZBNs%2BWW%2Byxs2oHB0BE233TaLxgJSKH0ngedDhzH%2B5VvAe%2FeCjJxLBgIGCwJYq4Gx3kCCBQBpqnyaBgE71ug8nw3aNhVMqGnyM%2BtMgKVLDw3AHnhk3YEv%2FYgpgNlGXoqp3IFHgk2bUOjrQ9PdXwd9qH3KwV%2FarW53BxeBf%2FgIxv7yFsj%2BfttpbNMt%2Fbt9y5IMFibIEmAhVKea9SwBIQEp1XHMItyCSCkGBAMRu21S6P3dK4RQxxISiCQ4YkCoY8J8z782EwsIBul0EbpAZK4zlj1IhuzbifDWW8GHj1RkQHUdDBo%2BeJArtfRSbfT66yF377JBHJn0zgRwscgeLtUjz9I9yUegfL4KAlnvq4lE5ccErNSbmgCzOg67qqC%2FX8ziE%2FGAcxHacg0xvGqie882EKGelWh96MHJK4bTIEBXZ0ftnxTKXHqZrI3dcQdkX1%2B8kmas1NTXPSs2VmssGnoxqsCSlZUKpQzwrJ6lsXhZehFOXcyx7XGi%2BDnc9sR1Cf96tdXb3%2BMBrtfbIFOvl%2B%2F2ovC3X03R%2Bjn9GCAt%2BRm%2F%2B%2BsIn9mordIL%2BowFCngKwACpAJCIrJ9ncnV80gUeNhavzZlMvk9ed1CZqhMnV3nrjaWb7MAG9drHJwNGmVAI3%2Bq9%2FVxxSX2OfrIeaGtH8y03p1dab5g0UP%2BgwpNPofDYj2zBxkTYRCbKV%2BAr2SSvru%2F2Q6Br%2FhpZ9os7JgMgKgadynQqF5OBEZd9lQ7CRf6AHi423%2FOAt4NJKCoiFYHvB4kMhN%2F%2FIYIzTkf%2B8k%2FVxfqnFQMMDR%2BsZGacy7n7BzBy3R8BIyOOAMY3U6KoYwd1XARvC0Nw5V02Eb%2B%2FTzJkpsSbood5x2MAN0KoUz24lI%2FYU4hYHOCBnXyfIEZ8HyTIA1BbG%2BY88h%2Bgxd1VEaCrs5PqTICJNw9eeQ1o50405YJ4ABcL7EoQIRnoee8dG9havdnO2reY3Xmy4opC2%2BOBIwCY4umgB54NDG3BxwNYemQpZfW%2BW%2FEDszNOw5xHHqzQ9U6PAMH0DjzRUr49vvV%2B7BvagTERQQhp0zsbHJk0ScKmdSp1MsGXlw6aICwyAZWboKECMqneRy5dhJAgs0i96M8sBCCFDixdoGfH%2BwXblNNdlwlI9XkleymnDjqNzxfq9%2FlTy9gfWCrR5NvvovCd76FSxZ0OaWpeB9g1uhNPHnsGj%2F3pqWDJGI0iSClVfVyPq5clgl2kB74hjkx0vJ%2F3qxw%2Blj3YWgLbY9j8XHhA%2BQSLvBzeHt%2BvR7hzwiv0WOCF9H4fEhnBxP0Wfud%2BiLfeqXlkVnMC%2FNeuB0EAdpwG9Pa0gpkxEoYQeuy9mAjSI4Ijhg%2ByUwZVoDFpGIQ3GicSxaBIlFhk0X4xsCXr45t0UsZSQmP9lrR%2BmuhZvK3%2BCZ6WeRb%2B6d6K4q2GIcDm4V9h%2B5FtOt8gPH5jj73U0SiEiKSTQxG3eiPJClQkXISXmxvCxIDRlholLb7EYvaLVQY5UVUsBThbslj18CqCEIido5I8Wr76GsRzL1RVbp9RAjy868FYRH7wFIGXLl7gSCC0OzAxQWJ41aqC18nxzvcKMYJjZd%2BSpWDplsn2tf7d9%2BlJ0A3pOE4OTk4UqaIVvnFvzay%2FpnWATYPPY7AwGK%2B9EGHj1R1Y8%2FIQWsfYkmBuLq%2BYaPJ69sZvTCHHjPbZYV29IyVz%2FcQ2b%2FCHAeRPOxVB2zzkuheBuruQ6wohh%2FZCDu2DHBqAPLDPqx%2FbMccEkBx%2FZVaDT0UDHiWy0eRhaLJ1vZDrH0Fw6edqUqybRho4PK3Df%2Bn%2FbowTwCPCOT%2BXuPpb78Q6Z24ur6Z2F12hlw6yN6pH3khf%2FG0s56e2NjRfeAHmXHUFms44Dcg3FdULSM0e0ZnJMUSHtiDc%2F2OEg8%2BAxSFHBDZFK9ajl1Jfm55JZEcj2V6z2qYqk64vOJYBu3oV64kscU7TnC4cXvrapNbvQ7moq7O%2BE0L8k28e%2FiUGxwfjYPmxwccY5y1uQvdAGHMH8%2FJNxcOeZhDGqIAmAQFunJ3cxB7TKbnFizHv5i%2Bi5aK1FvDkq6VLENhzETWjufNCNHddCGag8P4TOPbeXeDxPQg04AGxBVb9sTcJWeoqJnt1LOkRYgLA9bHM7wtyjFwOoGAALWNPY7z1d1Mv1U9ZAQ4MTV0BvrbtTmw%2Fus0r5BTv0%2FNeDjfc%2BWZsXQ6EOfn89Me%2B%2FYphezvab70ZLVdcbieHuk5Xb8YFsP9IZAFhAJ1tLWjJ%2BapDKibRyl7ofwCFHXcC4qAmDWKW7rssIo7NSHcAx9dbEpjalgY8yLEikHc3dNh0HoYXPDEl658RBbAVv%2FEPsP3Im67UW6btWBlh29nzseq1YbtOgHEsiqZPAl2Vazp3DU76138GtbZo4BX4x0LGq%2F1j6BsOsWu4gFAycgTkgsC6W8lH0BQQls9vxlmdrVjV1YLWfGBP0LL082jquAzjW38fPPp6kdXa9yUAj29z%2BwY5Ri4oBrxUayq8jJzYDZFblupAXeoE2PTB81PbMUf4nz9chJ5tB9E6xlWToPWzn0Hb7X%2FtAU8YGhVY%2F%2FYoNvePIR8AOSLk9CsCM6Ln6jcFwdi6bxy%2F3juOSALnLGnF75zVjvlzAjAzgpZOtJ69CeF7N0MOPhCbbETECRUoJkeQYwQBkJsC4KVa89jTODbvCxVX%2FeriAr605c9xIBx09X5gQiW4%2BEeHse7JvcX8mIY7aL32M5h3%2B1%2FFwP%2FJ9lE8%2FdaoAj6AtnhCTt89FpCbaOyX6022KZghJNCcI1x46jx8alWbHQlkZoi%2Bm8GD9%2BtZx14y4sl8tYAnLTyiZRjq2jyh9M%2BoCxgc%2FwCD44M2sJlKe%2Bm3T8LZz%2B%2FHKQdFbP1UlSAJ%2FoFRiX955TAGDkfIBaRm%2Fko9x0AymBS5pDcQmRyplRp8wcDRAuOprUfx5vvj%2BOL58zEnr64mWHGPYtDQ92I%2BPA3Ay4qm2KPdwNJUrD%2FlwSDG5qFfTm7yiTbextj4Bysg%2FYkXCRKU%2B535c9dg7le%2BbD%2FvPBjh9g3D2DkcFQEZSVe%2FiQQjkmoJJdR7b13kJh3Z2s%2B2%2FQV8beMQdh2MLNmw7B7kT74ALa0SrXMFWlolmpql8um1mMVJQPOx%2F23csYBth9%2Bs6HuvfTzAO8uby5NARMV90d6O9m%2B5KtkHIwJf3XgIRwtsi3fCk3JhZoEJNxssFIoMoYhvs%2FNH7awxdYwdwyG%2B%2FcohjBSkPW%2B09GFQ04dqA3ipYHD85dSsP3UCbD9UGQGoNYfnrl2pOpq5iAiCGWMi7iLm%2Fc1XgJZmAMBIgfGPLxzB0YKEN3hnSWCs2gKvl8h7jWQxCRTwHDtW71CIOzYMORXIzUe44B%2Fqgz6rbCDN2cGpEWDnyE6MitHKh41XEzavOUmTQBaRIGRpSZA783Tk111kt%2F3g16PoHYriFu9bsCUBFwHtq4Ejg%2BcK2LkDFSAyeodCfH%2BLm8odtl8PmV9ec%2FBVnekw8uHWxiPArpG%2BKiMcwvpruzDSAqsESTUwJGi54fP2a71DAk9uG4uB7st%2BnAQ%2BuIxQuMVfnySHiwnccR9%2B9SjeP%2BpUqbDgLtSr5QtvNB4BPhj7wE9OKjpGuDiPn52%2FMEaApBrI7i7k1621n%2F%2FtFyNu7kcMcC45CzwssnbPFYji95FHHD82EAw8tPmoiwXmXgEOTqoLAQKxu%2FEIUGkAmGwvXH0yDrQHFvykGrRetNbuu%2B%2BIwJa9Ycwyfen3pTxMSr9wsUCY%2BOy7CSHZKkqUOMdP3x7FviNOBcK26%2BqjADoQrCsByt0EUvKGEK5cB3InNeOZK5cWgW8IMffKy%2B2%2Bj20d86ySJ7j%2Fg4tiAGvlwoHvCJJwByLpRpybebFvzKnAh%2F64Zr7fpNbMSPWWgdQUwGYAKVzcexfOQ293UxH4ghn500%2Bzk0de7Y8S0s9WqkUCMBfoOZ8fekusFiAmuJFIsnUvQgLP9bqHT4r8WTWNAdmmgq80Zh0gZvlVMJXm5PDsdT1F4Defu8buc7TAePuAKJL%2BkhF%2FKZ8u4u4g6RLCskoSdwWb9xTcbCYAovk3ayMAQE1uFgpqc6XVtwMfacbPPtoWcwVoa7Od%2Ffag0JY4FemPAx8DOun7E0Wh0HMHpZRFMPD2YGTHCGoSCPrGlHisTUMqQBEZKpmq1BTg559dgtEmlxY2nXmG3X54XFoAojIRv5N%2BJ%2FHhBBJvXEQUcwnlXAEsAQ%2BPe5XBlgvqUQ5IzRrzqcs%2Fw3sUC8Vm1023iZ5WvHBBBy7ZuB8MhjRTraGszjyfMdCzdHIESCL%2FQWKI3WluB4B4YmPz7gVN3M5nxxj8OaLsT2qtiUtNBICT3aM1jcvIp3qtXGbyYxV18tevWoBzXtmP%2BaPxDmZ7oyZBmLu39GwcRQCKE8B7RZm5KrHb%2FhC%2F8Vfq8yVnhRvpr7W1x55mNvGjrmvlAiYZDUz0Xlpdku9sxfqrliqrg7utalGbepwLq8d4QnKJip8oTv38nL9UIagoFpB%2BpdDtL%2B1dw9L5%2F1qpQML%2FT%2FQY%2FumePp%2F6hfoLJbZXqAT7181H79MDmL%2Bn33Zwd5t%2BLp%2B7qxSknhlun8vkpJ9jKlBOlPw7xX0%2B%2B67AdbSZHCJj4OcKr9dE%2FosfaFWd9KfvAtjdpm%2Bx1gEBV%2BcFELTl8cKfnIrVz%2B6xHb%2BojSCl0I%2BCCWJEMBqv5uprwP0Z5SVIUOIxAUX%2FCNvdGs72IVLMjDVLmpy340M1kX93akr1X%2BZMJwu4b7Ir5tgzdErUA6pQx5GPzMHG6D37ubs9h0XzGFIKSCnAUkCyvotXP5jJ3p%2BngYrd2FMyqvcCO%2B975njwj6vPe8YCiilA0%2FhL6WZTJeS%2F1H9cS6y7rxYE%2BOZEG1edtKrMXeOcSpmAWnJ446pujPT22s4%2BuzsHlhFYRpYEzOZVus8xQvgLe0tim93fkUrq4znSRThnSZM9Rj7annI2TbFg1PSpaD1vMr%2F%2FzdQJ0LFw4bvMeHTS8QBOZCpTTF2mlBaunotXtmywHX7Zma2QIipepFmEtVRpiCFFHFxOkEQ6AllS6eOxdMc36z69aq6z%2FqP%2FmX7wp%2B94UUQoDgJLgP%2Fo4u5F79aqEPQ5ACXHIledvNq6AfhugFNxVbZt6NhqO%2FycJS3omscQIoSUoQY9BGsixAATwpJCAShKLJG1bh9kKRPEEiGkCHHO4iac2dFss4Dmsern63GJ3J%2FZd7GEaM555dLP3Rqj2lQCOzsWRgA%2BDODRIoVo7Ug8DMkD3z5jr3rDOLRgBH27HQlu%2BcTJCpAotMAI6d478MK49ZrtIorva7eVUBXhnUOE%2BLPfOtleR%2FP4c8hVO06f8P1sH2TtWb8EZH5pKUt6FMCHF3cvimpaCu7sWBh1diy8BsDpfrCxon2FfSYyyxLBYIoq8PjIU7bj1546D2d35yFEASIqQESODMIDzAdaxABOvg8T%2B8VfhShAihBre%2Bbg48uU%2FEsp0Xr0npr5frb%2FtUSRQLas9o3pPgCnL%2B5edM10wVdZC8%2Fm%2F9mbtcYaDMpaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWoO0%2Fwchgys9ixzDyQAAAABJRU5ErkJggg%3D%3D&amp;style=plastic"
                        }),
                    ]),
                ]),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerHTML: chrome.i18n.getMessage("github"),
                }),
                createElement('br'),
                createElement('br'),
                createElement('dl', {},
                    [
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("author")
                        }),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/qrlk",
                                innerText: "qrlk",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("inspired"),
                        }),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/fippo/rtcstats",
                                innerText: "rtcstats",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("libs")
                        }),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://jquery.com/",
                                innerText: "jquery",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/justadudewhohacks/face-api.js",
                                innerText: "face-api.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/uzairfarooq/arrive",
                                innerText: "arrive.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/Leaflet/Leaflet",
                                innerText: "leaflet",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/calebjacob/tooltipster",
                                innerText: "tooltipster",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/sweetalert2/sweetalert2",
                                innerText: "sweetalert2",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/cure53/DOMPurify",
                                innerText: "DOMPurify",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: "<b>Css:</b>"
                        }),

                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://darkreader.org/",
                                innerText: "dark reader",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),

                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/alterebro/css-tooltip",
                                innerText: "css-tooltip",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("3rdparty")
                        }),

                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://ip-api.com/",
                                innerText: "ip-api",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://carto.com",
                                innerText: "carto",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ])
                    ]),
                createElement('br'),
                createElement('button', {
                    onclick: () => {
                        showSwalChangelog(settings.lastVersion)
                    },
                }, [
                    createElement('b', {
                        innerText: chrome.i18n.getMessage("changelogButtonText")
                    })
                ]),
                createElement('br'),
                createElement('button', {
                    onclick: () => {
                        showSwalInfo()
                    },
                }, [
                    createElement('b', {
                        innerText: chrome.i18n.getMessage("welcomeButtonText")
                    })
                ]),
            ]
        )
    ])
}

// "controls/tab-api.js",
function createTabApi() {
    return createElement('div', {
        className: "tabs__content active row",
        id: "apiInfoContent",
        style: "height:100%;"
    }, [
        createElement('div', {
            id: "remoteFace",
        }),
        createElement('div', {
            id: "streamerStatus",
            // style: "display: none;"
        }),
        createElement('div', {
            id: "nsfwInfo",
            style: "display: none;"
        }),
        createElement('div', {
            id: "apiStatus",
            style: "margin-top: 3px"
        }),
        createElement('div', {
            id: "remoteInfo",
            style: "overflow-y: auto;margin-top: 3px"
        })
    ])
}

// "controls/tab-bans.js",
function createTabBans() {
    return createElement('div', {
        className: "tabs__content",
        id: "bansPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "bansInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('span', {
                    innerText: chrome.i18n.getMessage("bannedips")
                }),
                createElement('span', {
                    id: 'stBnCt'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("goodips")
                }),
                createElement('span', {
                    id: 'stNwIp'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("badips")
                }),
                createElement('span', {
                    id: 'stBnIp'
                }),
            ]
        )
    ])
}

// "controls/tab-map.js",
function createTabMap() {
    return createElement('div', {
        className: "tabs__content",
        id: "faceapiContent",
        style: "height:100%;"
    }, [
        createElement('div', {
            id: "mapid",
            style: "width: 100%; margin-top: 1px;"
        })
    ])
}

// "controls/tab-settings.js",
let needReload = false

function confirmAndReload() {
    if (!needReload) {
        needReload = true
        let connectionStatus: HTMLElement = document.getElementById("connectionStatus") as HTMLElement
        connectionStatus.setAttribute("data-tooltip", chrome.i18n.getMessage("reloadRequired"))
        connectionStatus.className = "tooltip-multiline tooltip-bottom";
        (connectionStatus.parentElement as HTMLAnchorElement).href = ".";
        (connectionStatus.parentElement as HTMLAnchorElement).target = ""
        connectionStatus.style.color = "red"

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener('click', () => {
            if (confirm(chrome.i18n.getMessage("reloadRequired"))) {
                location.reload()
            }
        })
    }
}

function createTabSettings() {
    return createElement('div', {
        className: "tabs__content",
        id: "settingsPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "settingsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('dl', {},
                    [
                        createSettingsInterface(),
                        createElement('br'),

                        createSettingsAutomation(),
                        createElement('br'),

                        createSettingsGeolocation(),
                        createElement('br'),

                        createSettingsFaceapi(),
                        createElement('br'),

                        createSettingsBlacklist(),
                        createElement('br'),

                        createSettingsHotkeys(),
                        createElement('br'),

                        createSettingsRisky(),
                        createElement('br', {
                            style: function f() {
                                if (isDevMode()) {
                                    return ""
                                } else {
                                    return "display:none"
                                }
                            }(),
                        }),

                        createSettingsStreamer(),
                        createElement('br'),

                        createSettingsMisc(),
                        createElement('br'),

                        createSettingsStats()
                    ]
                ),
            ])
    ])
}

// "controls/tab-settings-automation.js",
function createSettingsAutomation() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage('settingsAutomation')
        }),

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipfour"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipFour")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipFourSec,
                    style: "margin",
                    id: "skipFourSecCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipFourSec": (document.getElementById("skipFourSecCheck") as HTMLInputElement).checked});
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("autoresume"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoresume")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.autoResume,
                    id: "autoResumeCheck",
                    onclick: () => {
                        chrome.storage.sync.set({
                            "autoResume": (document.getElementById("autoResumeCheck") as HTMLInputElement).checked
                        }, () => {
                            confirmAndReload()
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipwrongcountry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskipWrongCountry")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipwrongcountry,
                    style: "margin",
                    id: "skipWrongCountryCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipwrongcountry": (document.getElementById("skipWrongCountryCheck") as HTMLInputElement).checked});
                    }
                })
            ]),
        ]),
    ])
}

// "controls/tab-settings-blacklist.js",
function createSettingsBlacklist() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsBlacklist")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskip"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskip")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.autoBan,
                    id: "autoBanCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"autoBan": (document.getElementById("autoBanCheck") as HTMLInputElement).checked}, function () {
                            //confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("donotbanmobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipDonotbanmobile")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.dontBanMobile,
                    id: "dontBanMobileCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"dontBanMobile": (document.getElementById("dontBanMobileCheck") as HTMLInputElement).checked}, function () {
                            //confirmAndReload()
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("ban_sound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipSound")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipSound,
                    id: "skipSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipSound": (document.getElementById("skipSoundCheck") as HTMLInputElement).checked}, function () {
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('button', {
                style: "margin-top: 2px",
                onclick: () => {
                    const result = confirm("Clear?");
                    if (result) {
                        local.ips = []
                        chrome.storage.local.set({"ips": []}, function () {
                            updStats(true)
                        });
                    }
                },
            }, [
                createElement('b', {
                    innerText: chrome.i18n.getMessage("clearblacklist")
                })
            ])
        ])
    ])
}

// "controls/tab-settings-faceapi.js",
function createSettingsFaceapi() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("genderRecognition")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("forcedApi"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipForcedRecognition")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.enableFaceApi,
                    id: "enableFaceApiCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableFaceApi": (document.getElementById("enableFaceApiCheck") as HTMLInputElement).checked}, function () {
                            if (!faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_males"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipMales")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipMale,
                    id: "skipMaleCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipMale": (document.getElementById("skipMaleCheck") as HTMLInputElement).checked}, function () {
                            if (!faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_females"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipFemales")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipFemale,
                    id: "skipFemaleCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipFemale": (document.getElementById("skipFemaleCheck") as HTMLInputElement).checked}, function () {
                            if (!faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
    ])
}

// "controls/tab-settings-geolocation.js",
function createSettingsGeolocation() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsGeolocation"),
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("apiLocalisation"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipApiLocalisation")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.ipApiLocalisation,
                    id: "ipApiLocalisationCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"ipApiLocalisation": (document.getElementById("ipApiLocalisationCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("ipApiLocalisationCheck") as HTMLInputElement).checked) {
                                language = window.navigator.language.slice(0, 2)

                                if (language === "pt")
                                    language = "pt-BR"
                                else if (language === "zh")
                                    language = "zh-CN"
                            } else {
                                language = "en"
                            }
                        });
                    }
                })
            ]),
        ]),

        createElement('br'),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("hideMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideMobile")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideMobileLocation,
                    id: "hideMobileLocationCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideMobileLocation": (document.getElementById("hideMobileLocationCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("showCT"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowCT")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showCT,
                    id: "tooltipShowCTCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showCT": (document.getElementById("tooltipShowCTCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('br'),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("showMoreInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowMoreInfo")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showMoreEnabledByDefault,
                    id: "showMoreCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showMoreEnabledByDefault": (document.getElementById("showMoreCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("showISP"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowISP")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showISP,
                    id: "showISPCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showISP": (document.getElementById("showISPCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        createElement('br'),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("targetCity"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetCity")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.enableTargetCity,
                    id: "targetCityCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableTargetCity": (document.getElementById("targetCityCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("targetCityCheck") as HTMLInputElement).checked)
                                (document.getElementById("targetCityDiv") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("targetCityDiv") as HTMLElement).style.display = "none"
                        });
                    }
                })
            ]),
        ]),
        createElement('div', {
            id: "targetCityDiv",
            style: function f() {
                if (settings.enableTargetCity) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('dd', {}, [
                createElement('button', {
                        id: "targetCityButton",
                        style: "margin-top: 2px",
                        onclick: () => {
                            const result = prompt(chrome.i18n.getMessage("promptTargetCity"), settings.targetCity)
                            if (result) {
                                chrome.storage.sync.set({"targetCity": result}, function () {
                                    ((document.getElementById("targetCityButton") as HTMLElement).children[0] as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                                });
                            }
                        },
                    },
                    [
                        createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetCity") + settings.targetCity
                        })
                    ]),
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("targetRegion"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetRegion")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.enableTargetRegion,
                    id: "targetRegionCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableTargetRegion": (document.getElementById("targetRegionCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("targetRegionCheck") as HTMLInputElement).checked)
                                (document.getElementById("targetRegionDiv") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("targetRegionDiv") as HTMLElement).style.display = "none"
                        });
                    }
                })
            ]),
        ]),
        createElement('div', {
            id: "targetRegionDiv",
            style: function f() {
                if (settings.enableTargetRegion) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('dd', {}, [
                createElement('button', {
                        id: "targetRegionButton",
                        style: "margin-top: 2px",
                        onclick: () => {
                            const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), settings.targetRegion)
                            if (result) {
                                chrome.storage.sync.set({"targetRegion": result}, function () {
                                    ((document.getElementById("targetRegionButton") as HTMLElement).children[0] as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                                });
                            }
                        },
                    },
                    [
                        createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetRegion") + settings.targetRegion
                        })
                    ]),
            ]),
        ]),
        createElement('br'),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSkipMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSkipMobile")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipMobileTarget,
                    id: "skipMobileTargetCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipMobileTarget": (document.getElementById("skipMobileTargetCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSound")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.targetSound,
                    id: "targetSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"targetSound": (document.getElementById("targetSoundCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('br'),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsEnable"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsEnable")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.torrentsEnable,
                    id: "torrentsEnableCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsEnable": (document.getElementById("torrentsEnableCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsInfo")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.torrentsInfo,
                    id: "torrentsInfoCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsInfo": (document.getElementById("torrentsInfoCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

    ])
}

// "controls/tab-settings-hotkeys.js",
function createSettingsHotkeys() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsHotkeys")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("b", {
                    innerText: chrome.i18n.getMessage("enablehotkeys"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipEnableHotkeys")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hotkeys,
                    id: "hotkeysCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hotkeys": (document.getElementById("hotkeysCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hotkeysCheck") as HTMLInputElement).checked) {
                                document.removeEventListener('keyup', hotkeys)
                                document.addEventListener('keyup', hotkeys)
                            } else {
                                document.removeEventListener('keyup', hotkeys)
                            }
                        });
                    }
                })
            ]),
        ]),
        createElement('br'),
        createElement('span', {
            innerHTML: chrome.i18n.getMessage("hotkeys")
        }),
    ])
}


// "controls/tab-settings-interface.js",
function createSettingsInterface() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsInterface")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("hideLogo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideLogo"),
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideLogo,
                    id: "hideLogoCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideLogo": (document.getElementById("hideLogoCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideLogoCheck") as HTMLInputElement).checked) {
                                (document.getElementById("logo-link") as HTMLElement).style.display = "none"
                            } else {
                                (document.getElementById("logo-link") as HTMLElement).style.display = ""
                            }
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("hideHeader"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideHeader"),
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideHeader,
                    id: "hideHeaderCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideHeader": (document.getElementById("hideHeaderCheck") as HTMLInputElement).checked}, function () {
                            confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("watermark"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipWatermark"),
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideWatermark,
                    id: "hideWatermarkCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideWatermark": (document.getElementById("hideWatermarkCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideWatermarkCheck") as HTMLInputElement).checked) {
                                try {
                                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
                                } catch (e) {
                                    console.dir(e)
                                }
                            } else {
                                try {
                                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = ""
                                } catch (e) {
                                    console.dir(e)
                                }
                            }
                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("banner"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipBanner')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideBanner,
                    id: "hideBannerCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideBanner": (document.getElementById("hideBannerCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideBannerCheck") as HTMLInputElement).checked) {
                                try {
                                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
                                } catch (e) {
                                    console.dir(e)
                                }
                            } else {
                                try {
                                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = ""
                                } catch (e) {
                                    console.dir(e)
                                }
                            }
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotReflect'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotReflect')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.doNotReflect,
                    id: "doNotReflectCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"doNotReflect": (document.getElementById("doNotReflectCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("doNotReflectCheck") as HTMLInputElement).checked) {
                                $("#local-video").removeClass("video-container-local-video")
                            } else {
                                $("#local-video").addClass("video-container-local-video")
                            }
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotCover'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotCover')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.doNotCover,
                    id: "doNotCoverCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"doNotCover": (document.getElementById("doNotCoverCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("doNotCoverCheck") as HTMLInputElement).checked) {
                                $("#remote-video").css({"object-fit": "contain"})
                                // $(".preview").css({"background-size": "contain"})
                            } else {
                                $("#remote-video").css({"object-fit": ""})
                                // $(".preview").css({"background-size": ""})
                            }
                        });
                    }
                })
            ]),
        ]),


        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage('hideCamera'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltiphideCamera')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.hideCamera,
                    id: "hideCameraCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideCamera": (document.getElementById("hideCameraCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideCameraCheck") as HTMLInputElement).checked) {
                                $("#local-video-wrapper")[0].style.display = "none"
                            } else {
                                $("#local-video-wrapper")[0].style.display = ""
                            }
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage('darkMode'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDarkMode')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.darkMode,
                    id: "darkModeCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"darkMode": (document.getElementById("darkModeCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("darkModeCheck") as HTMLInputElement).checked) {
                                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#E8E6E3";
                                (document.body || document.documentElement).appendChild(dark);
                            } else {
                                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#000000"
                                if (typeof (document.getElementById("darkMode") as HTMLElement) != "undefined")
                                    (document.getElementById("darkMode") as HTMLElement).remove()
                            }
                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage('expand'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipExpand')
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.expand,
                    id: "expandCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"expand": (document.getElementById("expandCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("expandCheck") as HTMLInputElement).checked) {
                                setTimeout(() => {
                                    resizemap(true)
                                }, 100)
                            } else {
                                resizemap(false)
                            }
                        });
                    }
                })
            ]),
        ]),
    ])
}

// "controls/tab-settings-misc.js",
function createSettingsMisc() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage('settingsMisc')
        }),

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("sentry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSentry")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.sentry,
                    style: "margin",
                    id: "sentryCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"sentry": (document.getElementById("sentryCheck") as HTMLInputElement).checked});
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('button', {
                onclick: () => {
                    switchMode()
                },
            }, [
                createElement('b', {
                    innerText: chrome.i18n.getMessage("switchModeButtonText")
                })
            ])
        ])
    ])
}

// "controls/tab-settings-risky.js",
function createSettingsRisky() {
    return createElement('div', {
        style: function f() {
            if (isDevMode()) {
                return ""
            } else {
                return "display:none"
            }
        }(),
    }, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("risky"),
            style: "display: inline-block",
            className: "tooltip",
            title: chrome.i18n.getMessage("tooltipEnableRisky")
        }),

        createElement('br'),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("enableRisky"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipEnableRisky")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.risky,
                    id: "riskyCheck",
                    onclick: () => {
                        chrome.storage.sync.set({
                            "risky": (document.getElementById("riskyCheck") as HTMLInputElement).checked,
                            "showDangerWarning": (document.getElementById("riskyCheck") as HTMLInputElement).checked,
                        }, function () {
                            if ((document.getElementById("riskyCheck") as HTMLInputElement).checked) {
                                (document.getElementById("riskyList") as HTMLElement).style.display = ""
                                showDangerWarning()
                            } else {
                                (document.getElementById("riskyList") as HTMLElement).style.display = "none"
                            }

                            if (settings.ws || settings.mirror || settings.mirrorAlt || settings.prikol)
                                confirmAndReload()
                        })
                    }
                })
            ]),
        ]),

        createElement('dd', {
            id: "riskyList",
            style: function f() {
                if (settings.risky && isDevMode()) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('br'),
            createElement('dt', {
                innerHTML: chrome.i18n.getMessage("settingsCameraHijack"),
                className: "tooltip",
                style: "display: inline-block",
                title: chrome.i18n.getMessage("warningCameraHijack")
            }),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("mirror"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipMirror1")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.mirror,
                        id: "mirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "mirror": (document.getElementById("mirrorCheck") as HTMLInputElement).checked,
                                "mirrorAlt": false,
                                "prikol": false
                            }, function () {
                                (document.getElementById("mirrorAltCheck") as HTMLInputElement).checked = false;
                                (document.getElementById("prikolCheck") as HTMLInputElement).checked = false
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("mirror2"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipMirror2")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.mirrorAlt,
                        id: "mirrorAltCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "": false,
                                "mirrorAlt": (document.getElementById("mirrorAltCheck") as HTMLInputElement).checked,
                                "prikol": false
                            }, function () {
                                (document.getElementById("mirrorCheck") as HTMLInputElement).checked = false;
                                (document.getElementById("prikolCheck") as HTMLInputElement).checked = false;
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {
                style: function f() {
                    if (isDevMode()) {
                        return ""
                    } else {
                        return "display:none"
                    }
                }()
            }, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("prikol"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPrikol")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.prikol,
                        id: "prikolCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "mirror": false,
                                "mirrorAlt": false,
                                "prikol": (document.getElementById("prikolCheck") as HTMLInputElement).checked
                            }, function () {
                                (document.getElementById("mirrorCheck") as HTMLInputElement).checked = false;
                                (document.getElementById("mirrorAltCheck") as HTMLInputElement).checked = false;
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('br'),
            createElement('dt', {
                innerHTML: chrome.i18n.getMessage("settingsWS"),
                className: "tooltip",
                style: "display: inline-block",
                title: chrome.i18n.getMessage("warningWS")
            }),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("b", {
                        innerText: chrome.i18n.getMessage("enableWS"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipEnableWS")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.ws,
                        id: "wsCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"ws": (document.getElementById("wsCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('br'),
                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("skipSoundWS"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipSkipSoundWS")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.theyskipsound,
                            id: "wsconfigtheyskipsoundCheck",
                            onclick: () => {
                                settings.wsconfig.theyskipsound = (document.getElementById("wsconfigtheyskipsoundCheck") as HTMLInputElement).checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("skipWrongCountry"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipSkipWrongCountry")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.skipwrongcountry,
                            id: "wsconfigskipwrongcountryCheck",
                            onclick: () => {
                                settings.wsconfig.skipwrongcountry = (document.getElementById("wsconfigskipwrongcountryCheck") as HTMLInputElement).checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("replacePreview"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipReplacePreview")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.replacePic,
                            id: "wsconfigreplacePicCheck",
                            onclick: () => {
                                settings.wsconfig.replacePic = (document.getElementById("wsconfigreplacePicCheck") as HTMLInputElement).checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("deletePreview"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipDeletePreview")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.deletePic,
                            id: "wsconfigdeletePicCheck",
                            onclick: () => {
                                settings.wsconfig.deletePic = (document.getElementById("wsconfigdeletePicCheck") as HTMLInputElement).checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),


                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("replaceReportPic"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipReplaceReportPic")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.replaceReportPics,
                            id: "wsconfigreplaceReportPicsCheck",
                            onclick: () => {
                                settings.wsconfig.replaceReportPics = (document.getElementById("wsconfigreplaceReportPicsCheck") as HTMLInputElement).checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

            ])
        ])
    ])
}

// "controls/tab-settings-stats.js",
function createSettingsStats() {
    return createElement('div', {}, [
        createElement('dt', {
            style: "margin-top: 2px",
            innerHTML: chrome.i18n.getMessage("settingsStats")
        }),
        createElement('dd', {}, [
            createElement('button', {
                onclick: () => {
                    const result = confirm("Clear?");
                    if (result) {
                        let stats = {
                            stats: {
                                countAll: 0,
                                countNew: 0,
                                countDup: 0,
                                countMales: 0,
                                countFemales: 0,
                                countManSkip: 0,
                                countMaleSkip: 0,
                                countFemaleSkip: 0,
                                time: 0
                            }
                        }
                        settings.stats = stats.stats
                        chrome.storage.sync.set(settings, function () {
                            updStats(true)
                        });
                    }
                },
            }, [
                createElement('b', {
                    innerText: chrome.i18n.getMessage("clearStats")
                })
            ]),
        ])
    ])
}

// "controls/tab-settings-streamer.js",
function createSettingsStreamer() {
    return createElement('div', {}, [

        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsExperiments")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("b", {
                    innerText: chrome.i18n.getMessage("streamerMode"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipStreamerMode")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.streamer,
                    id: "streamerCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"streamer": (document.getElementById("streamerCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("streamerCheck") as HTMLInputElement).checked)
                                (document.getElementById("streamerList") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("streamerList") as HTMLElement).style.display = "none"

                            confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('div', {
            id: "streamerList",
            style: function f() {
                if (settings.streamer) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('br'),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerHotkeys"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerHotkeys")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerKeys,
                        id: "streamerKeysCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerKeys": (document.getElementById("streamerKeysCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('span', {
                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
            }),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerPip"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerPip")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerPip,
                        id: "streamerPipCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerPip": (document.getElementById("streamerPipCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('br'),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurOnStart"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurOnStart")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurOnStart,
                        id: "blurOnStartCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurOnStart": (document.getElementById("blurOnStartCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurReport"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurReport")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurReport,
                        id: "blurReportCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurReport": (document.getElementById("blurReportCheck") as HTMLInputElement).checked}, function () {
                                if ((document.getElementById("blurReportCheck") as HTMLInputElement).checked) {
                                    (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
                                } else {
                                    (document.getElementById("report-screen") as HTMLElement).style.filter = ""
                                }
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("remoteBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipRemoteBlurStrength")
                    }),
                    createElement('input', {
                        type: "range",
                        id: "blurFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: settings.blurFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurFilter": (document.getElementById("blurFilter") as HTMLInputElement).value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurPreviews"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurPreviews")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurPreview,
                        id: "blurPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurPreview": (document.getElementById("blurPreviewCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("previewBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPreviewBlurStrength")
                    }),
                    createElement('input', {
                        type: "range",
                        id: "blurPreviewFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: settings.blurPreviewFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurPreviewFilter": (document.getElementById("blurPreviewFilter") as HTMLInputElement).value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),

            createElement('br'),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurCoverLocal"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurCoverLocal")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerMirror,
                        id: "streamerMirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerMirror": (document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),

            createElement('br'),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverBlur"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverBlur")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.cover,
                        id: "coverCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"cover": (document.getElementById("coverCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverPreview"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverPreview")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.coverPreview,
                        id: "coverPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverPreview": (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverNoise"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverNoise")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.coverNoise,
                        id: "coverNoiseCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverNoise": (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverStop"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverStop")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.coverStop,
                        id: "coverStopCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverStop": (document.getElementById("coverStopCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),


            createElement('dd', {}, [
                createElement('button', {
                    style: "margin-top: 2px",
                    onclick: () => {
                        const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), settings.coverSrc)
                        if (result) {
                            chrome.storage.sync.set({"coverSrc": result}, function () {
                                (document.getElementById('cover') as HTMLImageElement).src = result
                            });
                        }
                    },
                }, [
                    createElement('b', {
                        innerText: chrome.i18n.getMessage("coverSrc")
                    })
                ]),
            ]),

            createElement('div', {
                style: function f() {
                    if (isDevMode()) {
                        return ""
                    } else {
                        return "display:none"
                    }
                }(),
            }, [
                createElement('br'),
                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("b", {
                            innerText: chrome.i18n.getMessage("nsfwjsAlfa"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipNsfwjsAlfa")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.nsfw,
                            id: "nsfwCheck",
                            onclick: () => {
                                chrome.storage.sync.set({"nsfw": (document.getElementById("nsfwCheck") as HTMLInputElement).checked}, function () {
                                    confirmAndReload()
                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("letUnblurInitial"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipLetUnblurInitial")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.nsfwjsUnblur,
                            id: "nsfwjsUnblurCheck",
                            onclick: () => {
                                chrome.storage.sync.set({"nsfwjsUnblur": (document.getElementById("nsfwjsUnblurCheck") as HTMLInputElement).checked}, function () {
                                    confirmAndReload()
                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("letUnblurAuto"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipLetUnblurAuto")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.letUnblur,
                            id: "letUnblurCheck",
                            onclick: () => {
                                chrome.storage.sync.set({"letUnblur": (document.getElementById("letUnblurCheck") as HTMLInputElement).checked}, function () {
                                    confirmAndReload()
                                });
                            }
                        })
                    ]),
                ]),


                createElement('br'),
                createElement('dd', {}, [
                    createElement('details', {}, [
                        createElement("summary", {
                            innerText: chrome.i18n.getMessage("nsfwjsConfig")
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("blurDuration"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipBlurDuration")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.BLUR_DURATION,
                                    min: 1,
                                    max: 20,
                                    step: 1,
                                    id: "sBlurDuration",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("delay"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipDelay")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.TIMEOUT,
                                    min: 50,
                                    max: 10000,
                                    step: 10,
                                    id: "sTimeout",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("predicationsArraySize"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipPredicationsArraySize")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.PREDICATIONS_ARRAY_SIZE,
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    id: "sPredicationsArraySize",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),


                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("scoreToBlur"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipScoreToBlur")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.BLUR_PANIC,
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    id: "sBlurPanic",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("propabilityToCount"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipPropabilityToCount")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.PANIC_PROPABILITY,
                                    min: 0.1,
                                    max: 1.0,
                                    step: 0.05,
                                    id: "sPanicPropability",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("pornWeight"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipPornWeight")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.WEIGHT_PORN,
                                    min: 0,
                                    max: 10,
                                    step: 1,
                                    id: "sWeightPorn",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("sexyWeight"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipSexyWeight")
                                }),

                                createElement('input', {
                                    type: "number",
                                    value: settings.nsfwjs.WEIGHT_SEXY,
                                    min: 0,
                                    max: 10,
                                    step: 1,
                                    id: "sWeightSexy",
                                    onkeydown: (e: KeyboardEvent) => {
                                        e.preventDefault()
                                    }
                                }),
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dd', {}, [
                            createElement('button', {
                                onclick: () => {
                                    const result = confirm(chrome.i18n.getMessage("saveConfirm"))
                                    if (result) {
                                        let nsfwjs = {
                                            nsfwjs: {
                                                PREDICATIONS_ARRAY_SIZE: (document.getElementById("sPredicationsArraySize") as HTMLInputElement).value,
                                                PANIC_PROPABILITY: (document.getElementById("sPanicPropability") as HTMLInputElement).value,
                                                WEIGHT_PORN: (document.getElementById("sWeightPorn") as HTMLInputElement).value,
                                                WEIGHT_SEXY: (document.getElementById("sWeightSexy") as HTMLInputElement).value,
                                                BLUR_DURATION: (document.getElementById("sBlurDuration") as HTMLInputElement).value,
                                                BLUR_PANIC: (document.getElementById("sBlurPanic") as HTMLInputElement).value,
                                                TIMEOUT: (document.getElementById("sTimeout") as HTMLInputElement).value
                                            }
                                        }
                                        settings.nsfwjs = nsfwjs.nsfwjs
                                        chrome.storage.sync.set(settings, function () {
                                            confirmAndReload()
                                        });
                                    }
                                },
                            }, [
                                createElement('b', {
                                    innerText: chrome.i18n.getMessage("save")
                                })
                            ]),

                            createElement('button', {
                                onclick: () => {
                                    const result = confirm(chrome.i18n.getMessage("resetConfirm"))
                                    if (result) {
                                        let nsfwjs = {
                                            nsfwjs: {
                                                PREDICATIONS_ARRAY_SIZE: 4,
                                                PANIC_PROPABILITY: 0.8,
                                                WEIGHT_PORN: 2,
                                                WEIGHT_SEXY: 1,
                                                BLUR_DURATION: 5,
                                                BLUR_PANIC: 6,
                                                TIMEOUT: 100
                                            }
                                        }
                                        settings.nsfwjs = nsfwjs.nsfwjs
                                        chrome.storage.sync.set(settings, function () {
                                            confirmAndReload()
                                        });
                                    }
                                },
                            }, [
                                createElement('b', {
                                    innerText: chrome.i18n.getMessage("reset")
                                })
                            ]),
                        ]),
                    ]),
                ]),
            ])
        ])
    ])
}

// "controls/tab-stats.js",
function createTabStats() {
    return createElement('div', {
        className: "tabs__content",
        id: "statsPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "statsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsWhole")
                }),
                createElement('span', {
                    id: 'stWhole'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsTimeSpent")
                }),
                createElement('span', {
                    id: 'stTime'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMaleSkip")
                }),
                createElement('span', {
                    id: 'stMlSk'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFemaleSkip")
                }),
                createElement('span', {
                    id: 'stFmlSk'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsManualSkip")
                }),
                createElement('span', {
                    id: 'stMnSk'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMlCount")
                }),
                createElement('span', {
                    id: 'stMlCnt'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFmlCount")
                }),
                createElement('span', {
                    id: 'stFmlCnt'
                }),
            ]
        )
    ])
}

function updStats(force: boolean) {
    (document.getElementById("stWhole") as HTMLElement).innerText = settings.stats.countAll;
    (document.getElementById("stMlSk") as HTMLElement).innerText = settings.stats.countMaleSkip;
    (document.getElementById("stFmlSk") as HTMLElement).innerText = settings.stats.countFemaleSkip;
    (document.getElementById("stMlCnt") as HTMLElement).innerText = settings.stats.countMales;
    (document.getElementById("stFmlCnt") as HTMLElement).innerText = settings.stats.countFemales;
    (document.getElementById("stMnSk") as HTMLElement).innerText = settings.stats.countManSkip;
    (document.getElementById("stBnCt") as HTMLElement).innerText = local.ips.length;
    (document.getElementById("stNwIp") as HTMLElement).innerText = settings.stats.countNew;
    (document.getElementById("stBnIp") as HTMLElement).innerText = settings.stats.countDup;

    (document.getElementById("stTime") as HTMLElement).innerText = secondsToHms(settings.stats.time)
    countBeforeSaveStats += 1
    if (force || countBeforeSaveStats >= 10) {
        countBeforeSaveStats = 0
        chrome.storage.sync.set({"stats": settings.stats});
    }

}

// "content.js",

let settings: any = {}, // TODO: fix type
    api = 1,
    local: any = {ips: ["-"]}, // TODO: deal with the 'never[]' issue | fix type
    stage = 0,
    search = 0,
    found = 0,
    startDate: number,
    curInfo: any = {},
    curIps: any[] = [], // TODO: fix type
    needToClear = false,
    needToCheckTarget = false,
    play = 0,
    map: any, // TODO: fix type
    marker: any, // TODO: fix type
    circle: any, // TODO: fix type
    countBeforeSaveStats = 0,
    tim: NodeJS.Timeout,
    dc,
    faceApiLoaded = false,
    buttons = $(".buttons")[0],
    chat = $(".chat")[0],
    controls: HTMLElement,
    resize: NodeJS.Timeout,
    language = window.navigator.language.slice(0, 2),
    timeout: NodeJS.Timeout,
    requestToStartTiming = 0,
    requestToSkip = false,
    torrenstsConfirmed = false

if (language === "pt")
    language = "pt-BR"
else if (language === "zh")
    language = "zh-CN"

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

const dark = document.createElement('link');
dark.rel = "stylesheet";
dark.id = "darkMode"
if (location.href.includes('videochatru')) {
    chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
    dark.href = chrome.runtime.getURL("resources/dark-mode.css");
} else if (location.href.includes('ome.tv')) {
    chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
    dark.href = chrome.runtime.getURL("resources/dark-mode-ometv.css");
}

const css = document.createElement('style')
css.textContent = "small {font-size: xx-small!important;}";

chrome.storage.local.get(null, function (result) {
    local = result;
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync")
        chrome.storage.sync.get(null, function (result) {
            settings = result;
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

function stopAndStart(delay?: number | undefined) {
    requestToSkip = false

    if (typeof delay !== "undefined") {
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
        }, delay)
    } else {
        requestToStartTiming = +new Date();
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
    }
}

const onUpdateIP = function () {

    if ((document.getElementById("remoteIP") as HTMLElement).innerText === "-" || (document.getElementById("remoteIP") as HTMLElement).innerText === "")
        return

    let newIp = (document.getElementById("remoteIP") as HTMLElement).innerText.replace("[", "").replace("]", "")

    if (curIps.includes(newIp)) {
        return
    }

    console.dir("IP CHANGE DETECTED")
    requestToSkip = false
    if (local.ips.includes((document.getElementById("remoteIP") as HTMLElement).innerText)) {
        settings.stats.countDup++
        console.dir("old ip")
        if (settings.skipSound)
            (document.getElementById('ban') as HTMLAudioElement).play();
        stopAndStart()
    } else {
        curIps.push(newIp)
        console.dir(curIps)
        settings.stats.countNew++
        console.dir("new ip")
        switch (api) {
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
        lang: language,
        fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
    })
        .done(function (json) {
            console.dir('ip-api.com responded: 200')
            processData(json, ip)
        })
        .fail(function (jqxhr) {
            console.dir(`ip-api.com request failed: ${jqxhr.status}`)
            console.dir(jqxhr)
            if (!settings.minimalism) {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + jqxhr.status + "</b>")
            }
            if (settings.enableTargetCity || settings.enableTargetRegion) {
                if (jqxhr.status === 429) {
                    stopAndStart(5000)
                }
            }
        });
}

function doLookupRequest2(ip: string) {
    chrome.runtime.sendMessage({remoteIP: ip, language: language}, function (response) {
        console.dir(`request to send ip-api request sent to service worker: ${response}`)
    });
}

function checkTorrents(ip: string) {
    if (settings.torrentsEnable) {
        if (torrenstsConfirmed || !settings.torrentsInfo) {
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
                    torrenstsConfirmed = true;
                    let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
                    chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                        console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
                    });
                }
            })
        }
    }
}

function processData(json: any, ip: string) { // TODO: fix type
    if (!curIps.includes(ip)) {
        return
    }

    if (settings.minimalism) {
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

    curInfo = json
    startDate = +new Date() / 1000
    let strings = []
    let newInnerHTML = ''
    let newIpDiv = createElement('div')
    if (settings.showMoreEnabledByDefault && (json.mobile || json.proxy || json.hosting)) {
        if (json.mobile) {
            if (settings.hideMobileLocation || settings.showCT) {
                if (!settings.showCT) {
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

    if ((settings.hideMobileLocation || settings.showCT) && json.mobile) {
        newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br></br>"

        if (settings.showCT) {
            newInnerHTML += chrome.i18n.getMessage("apiCT") + `${json.city}/${json.regionName}</br>`
            try {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
            } catch {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + "???" + "</sup>) </br>"
            }
        } else {
            newInnerHTML += "<br><br><br>"
        }
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + secondsToHms(+new Date() / 1000 - startDate) + "</sup>"

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
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + secondsToHms(+new Date() / 1000 - startDate) + "</sup>"
    }

    if (settings.showISP) {
        newInnerHTML += `<br><small style="font-size: x-small!important;"><b>${json.isp}</b></small>`
    }

    if (strings.length > 0)
        newInnerHTML += "</br>" + strings.join('<small> || </small>')


    newIpDiv.innerHTML += DOMPurify.sanitize(newInnerHTML)
    if (needToClear) {
        needToClear = false
        $(document.getElementById("ipApiContainer") as HTMLElement).parent().children(':not(#ipApiContainer)').remove()
        $(document.getElementById("ipApiContainer") as HTMLElement).children().remove();
    }
    $(newIpDiv).appendTo(document.getElementById("ipApiContainer") as HTMLElement)
    console.dir("RENDER ++")

    if (settings.torrentsEnable && !json.mobile && !json.proxy && !json.hosting) {
        newIpDiv.innerHTML += `<br><br>`
        $(createElement('button', {
            innerHTML: "<b>" + chrome.i18n.getMessage("YKWYDButtonText") + "</b>",
            onclick: () => {
                checkTorrents(DOMPurify.sanitize(json.query))
            }
        })).appendTo(newIpDiv)
    }

    if ((settings.enableTargetCity || settings.enableTargetRegion) && needToCheckTarget) {
        if (settings.skipMobileTarget && json.mobile) {
            if (curIps.indexOf(ip) + 1 === curIps.length) {
                stopAndStart()
            }
            return
        } else {
            if (settings.enableTargetCity) {
                if (!settings.targetCity.includes(json.city)) {
                    if (curIps.indexOf(ip) + 1 === curIps.length) {
                        stopAndStart()
                    }
                    return
                } else {
                    needToCheckTarget = false
                    if (settings.targetSound) {
                        (document.getElementById('targetSound') as HTMLAudioElement).play();
                        console.dir(`FOUND TARGET CITY: ${settings.targetCity}`)
                    }
                }
            }
            if (settings.enableTargetRegion) {
                if (!settings.targetRegion.includes(json.regionName)) {
                    if (curIps.indexOf(ip) + 1 === curIps.length) {
                        stopAndStart()
                    }
                    return
                } else {
                    needToCheckTarget = false
                    if (settings.targetSound) {
                        (document.getElementById('targetSound') as HTMLAudioElement).play();
                        console.dir(`FOUND TARGET REGION: ${settings.targetRegion}`)
                    }
                }
            }
        }
    }

    updateMap(curInfo)

    return true
}

function updateMap(json: any) {
    if (!$(document.getElementById("mapTabButton") as HTMLElement).hasClass("active") || Object.keys(curInfo).length === 0) {
        return
    }

    if (typeof marker !== 'undefined')
        map.removeLayer(marker)

    if (typeof circle !== 'undefined')
        map.removeLayer(circle)

    if (settings.hideMobileLocation && json.mobile) {
        circle = L.circle([json.lat, json.lon], 300000, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2
        })

        map.setView(new L.LatLng(json.lat, json.lon), 5);
        marker = new L.Marker([json.lat, json.lon]);
    } else {
        circle = L.circle([json.lat, json.lon], 30000, {
            color: 'blue',
            fillColor: '#808080',
            fillOpacity: 0.1
        })

        map.setView(new L.LatLng(json.lat, json.lon), 13);
        marker = new L.Marker([json.lat, json.lon]);
    }

    map.addLayer(circle)
    map.addLayer(marker)
}

const onChangeStage = function (mutations: any[]) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {

            if (stage === 3) {
                settings.stats.time += Math.ceil((Date.now() - play) / 1000)
            }

            const attributeValue = String($(mutation.target).prop(mutation.attributeName));
            if (attributeValue.includes("s-search")) {
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                stage = 1
                curIps = []
                needToClear = true
                needToCheckTarget = true
                // console.dir("СТАДИЯ ПОИСКА")
                // offline.play()

                clearInterval(tim);
                (document.getElementById("localStage") as HTMLElement).innerText = '1'
                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                if (play < search) {
                    // console.log("Dialog ended before even started")
                }

                search = Date.now()
            } else if (attributeValue.includes("s-found")) {
                // console.dir("СТАДИЯ НАШЕЛ")

                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                stage = 2;
                (document.getElementById("localStage") as HTMLElement).innerText = '2'
                needToCheckTarget = true

                found = Date.now()
                if (requestToSkip)
                    stopAndStart()
            } else if (attributeValue.includes("s-play")) {
                // online.play()
                // console.dir("СТАДИЯ ВОСПРОИЗВЕДЕНИЯ")

                stage = 3;
                (document.getElementById("localStage") as HTMLElement).innerText = '3'

                clearInterval(tim)
                tim = setTimeout(detectGender, 0)

                play = Date.now()
                console.log("Loading took: ", ((play - found) / 1000).toFixed(2), "sec")


                if (requestToSkip || (document.getElementById("remoteIP") as HTMLElement).innerText === "-") {
                    requestToStartTiming = +new Date();
                    (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
                } else
                    settings.stats.countAll++
            } else if (attributeValue.includes("s-stop")) {
                // offline.play()
                clearInterval(tim)
                // console.dir("СТАДИЯ СТОП")
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                curIps = []
                // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                needToClear = true;
                (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                (document.getElementById("nsfwInfo") as HTMLElement).style.display = "none"

                stage = 0;
                (document.getElementById("localStage") as HTMLElement).innerText = '0'

                if (requestToStartTiming !== 0 && +new Date() - requestToStartTiming < 1000) {
                    requestToStartTiming = 0;
                    (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                }
            }

            updStats(false)
        }
    });
}

function syncBlackList() {
    if (settings.dontBanMobile) {
        if (!curInfo.mobile) {
            local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
            chrome.storage.local.set({"ips": local.ips});

            if (settings.skipSound)
                (document.getElementById('male') as HTMLAudioElement).play();
        }
    } else {
        local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
        chrome.storage.local.set({"ips": local.ips});

        if (settings.skipSound)
            (document.getElementById('male') as HTMLAudioElement).play();
    }
}


async function detectGender() {
    if (!settings.skipMale && !settings.skipFemale && !settings.enableFaceApi)
        return
    let stop = false
    let skip_m = false
    let skip_f = false
    let text = ''
    if (stage === 3) {
        console.time("faceapi: detectAllFaces()")

        clearInterval(tim)

        let array = await faceapi.detectAllFaces(document.getElementById('remote-video') as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

        for (let i = 0; i < array.length; i++) {
            text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
            if (array[i].gender === "male" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_m = true
                stop = true
                settings.stats.countMales++
            }
            if (array[i].gender === "female" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_f = true
                stop = true
                settings.stats.countFemales++
            }
        }

        if (skip_m && settings.skipMale) {
            text += `<b>male skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("MALE SKIPPED")
            settings.stats.countMaleSkip++
            settings.stats.countManSkip--

            if (settings.autoBan) {
                syncBlackList()
            }
        }

        if (skip_f && settings.skipFemale) {
            text += `<b>female skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("FEMALE SKIPPED")
            settings.stats.countFemaleSkip++
            settings.stats.countManSkip--

            if (settings.autoBan) {
                syncBlackList()
            }
        }

        if (text !== '')
            (document.getElementById("remoteFace") as HTMLElement).innerHTML = text

        console.timeEnd("faceapi: detectAllFaces()")
    }
    if (!stop)
        tim = setTimeout(detectGender, 500)
}

function checkApi() {
    console.dir(`attemping to connect to http://ip-api.com directly (will fail unless user allow unsecure content)`)
    $.getJSON("http://ip-api.com/json/", {
        fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
    }).done(function (json) {
        console.dir('direct ip-api.com connection test passed! proceeding with best possible speed')
        // best case
        api = 1
        if (settings.minimalism) {
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

function switchMode() {
    let preselect = settings.minimalism
    Swal.fire({
        title: chrome.i18n.getMessage("switchModeTitle"),
        allowOutsideClick: false,
        heightAuto: false,
        html: `${chrome.i18n.getMessage("switchModeText")}<br><br>
 <form id="modeSelector">
 <input type="radio" id="minimalism" name="mode" value="minimalism">
 <label for="minimalism">${chrome.i18n.getMessage("switchModeLabelMod1")}<br><img src="${chrome.runtime.getURL('resources/img/' + chrome.i18n.getMessage("minimalismImg"))}" style="border:1px solid" width="300px"></label><br>
 <br>
 <input type="radio" id="full" name="mode" value="full">
 <label for="full">${chrome.i18n.getMessage("switchModeLabelMod2")}</label></form>`,
        preConfirm: () => {
            let newMode = $("#modeSelector").serializeArray()[0]['value']
            if (typeof newMode === "undefined") {
                return false
            } else {
                if (!settings.askForMode && newMode === "minimalism" && preselect) {
                    return true
                } else if (!settings.askForMode && newMode === "full" && !preselect) {
                    return true
                } else {
                    if (newMode === "minimalism") {
                        chrome.storage.sync.set({askForMode: false, minimalism: true}, function () {
                            location.reload()
                        });
                    } else {
                        chrome.storage.sync.set({askForMode: false, minimalism: false}, function () {
                            location.reload()
                        });
                    }
                }
            }
        },
        didRender: () => {
            if (settings.minimalism) {
                (document.getElementById('minimalism') as HTMLInputElement).checked = true  // TODO: check if it works, was 'checked' before, but ts didnt like
            } else {
                (document.getElementById('full') as HTMLInputElement).checked = true // TODO: check if it works, was 'checked' before, but ts didnt like
            }
        }
    })
}

chrome.storage.sync.get(null, function (result) {
    Sentry.wrap(function () {
        settings = result;

        let switchModeButton = createElement('button', {
            onclick: () => {
                switchMode()
            },
        }, [
            createElement('b', {
                innerText: chrome.i18n.getMessage("switchModeButtonText")
            })
        ])

        if (settings.askForMode) {
            switchMode()
            return
        } else {
            if (settings.minimalism) {
                $(createElement('p', {
                    id: "remoteIP", style: "display: none;"
                })).appendTo($("body"))

                const onChangeStageMinimalism = function (mutations: MutationRecord[]) {
                    mutations.forEach(function (mutation: MutationRecord) {
                        if (mutation.attributeName === "class") {
                            const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                            if (attributeValue.includes("s-search")) {
                                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                                curIps = []
                            } else if (attributeValue.includes("s-stop")) {
                                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                                curIps = []
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
            if (stage === 3)
                settings.stats.countManSkip++

            clearTimeout(timeout)
        })

        document.getElementsByClassName('buttons__button stop-button')[0].addEventListener("click", (e: any) => { // TODO: fix type
            if (e.pointerType !== "") {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                checkApi()
            }
            clearTimeout(timeout)
        })

        injectInterface()

        setInterval(() => {
            if (document.getElementsByClassName("remoteTM").length > 0) {
                if ((document.getElementById("localStage") as HTMLElement).innerText === "3") {
                    for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                        el.innerText = secondsToHms(+new Date() / 1000 - startDate)
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

        if (settings.hideLogo) {
            try {
                document.getElementById("logo-link")!.style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (settings.hideHeader) {
            $("#header").hide();
            document.getElementById("app")!.style.height = "100%"
            window.dispatchEvent(new Event('resize'));
        }

        if (settings.hideWatermark || settings.streamer) {
            try {
                (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (settings.hideBanner || settings.streamer) {
            try {
                (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
            } catch (e) {
                console.dir(e)
            }
        }

        if (settings.doNotReflect) {
            $("#local-video").removeClass("video-container-local-video")
        }

        if (settings.doNotCover) {
            $("#remote-video").css({"object-fit": "contain"})
            // $(".preview").css({"background-size": "contain"})
        }

        if (settings.hideCamera) {
            $("#local-video-wrapper")[0].style.display = "none"
        }

        setInterval(() => {
            if (settings.skipFourSec) {
                try {
                    if ((stage === 2) && (found + 4000 < Date.now())) {
                        console.dir("Skipping due to loading time limit");
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                        //settings.stats.countManSkip--
                    }
                } catch (e) {
                    //console.dir(e)
                }
            }
        }, 1000)

        if (settings.autoResume) {
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

        if (!settings.ipApiLocalisation)
            language = "en"

        if (settings.hotkeys) {
            document.removeEventListener('keyup', hotkeys)
            document.addEventListener('keyup', hotkeys)
        }

        if (settings.skipMale || settings.skipFemale || settings.enableFaceApi) {
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

                faceApiLoaded = true

                tim = setTimeout(detectGender, 200)
            }, 0)
        }

        if (settings.streamer) {
            if (settings.blurReport)
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"

            if (settings.cover || settings.coverPreview || settings.coverNoise || settings.coverStop) {
                $(createElement('img', {
                    src: settings.coverSrc,
                    id: "cover",
                    style: "height:100%; position: absolute; display:none"
                })).insertBefore("#remote-video")

                $(createElement('img', {
                    src: settings.coverSrc,
                    id: "cover2",
                    style: "height:100%; position: absolute; transform: scaleX(-1)"
                })).insertBefore("#local-video")

                $(".remote-video__preview").insertBefore("#cover")

                $(".remote-video__noise").insertBefore("#cover")
            }

            if (settings.nsfw && isDevMode()) {
                const nsfwjs = document.createElement('script');
                nsfwjs.src = chrome.runtime.getURL('libs/js/nsfwjs.min.js');
                nsfwjs.onload = () => {
                    nsfwjs.remove()
                    const nsfw = document.createElement('script');
                    nsfw.src = chrome.runtime.getURL('injection/streamer-mode.js');
                    nsfw.onload = () => nsfw.remove();
                    (document.head || document.documentElement).appendChild(nsfw);
                };
                (document.head || document.documentElement).appendChild(nsfwjs);
            } else {
                const nsfw = document.createElement('script');
                nsfw.src = chrome.runtime.getURL('injection/streamer-mode.js');
                nsfw.onload = () => nsfw.remove();
                (document.head || document.documentElement).appendChild(nsfw);
            }
        }

        if (settings.darkMode)
            (document.body || document.documentElement).appendChild(dark);
        document.arrive(".test-elem", function () {
            // 'this' refers to the newly created element
        });
        document.arrive(".tr-country", function (el: any) { // TODO: FIX TYPE
            if (settings.skipwrongcountry) {
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
        if (!settings.swalInfoCompleted) {
            showSwalInfo()
        } else {
            if (settings.lastVersion !== chrome.runtime.getManifest().version) {
                showSwalChangelog(settings.lastVersion)
            } else {
                if ((+new Date() - settings.lastShowedDangerWarning) > 24 * 3600 * 1000 && settings.risky && isDevMode()) {
                    showDangerWarning()
                }
            }
        }

        chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
    })
});
// "swal-info.js",

const showSwalInfo = async function () {
    const steps = ['1', '2', '3', '4', '5', '6', '7']

    const titles = [
        chrome.i18n.getMessage("swalInfoTitle1"),
        chrome.i18n.getMessage("swalInfoTitle2"),
        chrome.i18n.getMessage("swalInfoTitle3"),
        chrome.i18n.getMessage("swalInfoTitle4"),
        chrome.i18n.getMessage("swalInfoTitle5"),
        chrome.i18n.getMessage("swalInfoTitle6"),
        "License"
    ]

    const values = [
        chrome.i18n.getMessage("swalInfoText1"),
        chrome.i18n.getMessage("swalInfoText2"),
        chrome.i18n.getMessage("swalInfoText3"),
        chrome.i18n.getMessage("swalInfoText4"),
        chrome.i18n.getMessage("swalInfoText5"),
        chrome.i18n.getMessage("swalInfoText6"),
        `<div style="max-height: 300px">MIT License<br><br>

Copyright (c) 2021-2022 <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"http://qrlk.me\">Fyodor Kurlyuk</a><br><br>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br><br>

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br><br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</div>`
    ]

    let currentStep = 0

    const swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEnterKey: true,
        showDenyButton: true,
        preDeny: () => {
            chrome.storage.sync.set({"swalInfoCompleted": true})
        },
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        denyButtonText: chrome.i18n.getMessage('denyButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps,
    })

    const selectStep = function (step: number) {
        swalQueueStep.update({
            title: titles[currentStep],
            html: `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${values[currentStep]}</div></div>`,
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,
        })
    }

    const arrowHotkeys = function (e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
                if (currentStep !== 0) {
                    Swal.getCancelButton()!.click()
                    Swal.getCancelButton()!.focus()
                } else {
                    Swal.getConfirmButton()!.focus()
                }
                break;

            case "ArrowUp":
                Swal.getDenyButton()!.click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton()!.click()
                Swal.getConfirmButton()!.focus()
                break;
        }
        e.preventDefault()
    }

    const result = await swalQueueStep.fire(
        {
            title: titles[currentStep],
            html: `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${values[currentStep]}</div></div>`,
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,

            willOpen: (e) => {
                (e.querySelector('.swal2-cancel') as HTMLElement).onclick = (e: any) => {
                    if (currentStep - 1 >= 0) {
                        currentStep = currentStep - 1
                        selectStep(currentStep)
                        Swal.getCancelButton()!.focus()
                    } else {
                        Swal.close()
                    }
                };
                (e.querySelector('.swal2-confirm') as HTMLElement).onclick = (e: any) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                        Swal.getConfirmButton()!.focus()
                    } else {
                        Swal.close()
                        chrome.storage.sync.set({"swalInfoCompleted": true})
                    }
                }
            },
            didOpen: () => {
                document.removeEventListener('keyup', arrowHotkeys)
                document.addEventListener('keyup', arrowHotkeys)
            },
            didRender: () => {
                let progressSteps = $(".swal2-progress-step")
                progressSteps.css({
                    "user-select": "none",
                    'cursor': 'pointer'
                })
                progressSteps.click(function (el) {
                    currentStep = steps.indexOf(el.target.innerText)
                    selectStep(currentStep)
                })
            },
            willClose: () => {
                document.removeEventListener('keyup', arrowHotkeys)
            }
        }
    )
}
// "swal-changelog.js",

const showSwalChangelog = async function (version: string) {
    if (version === "") {
        version = chrome.runtime.getManifest().version
    }

    const steps = [
        '0.1',
        '0.2',
        '0.3',
        '0.4',
        '0.5',
        '0.6',
        '0.7',
        '0.7.1',
        '1.0',
        '1.1',
        '1.1.1',
        '1.1.2',
        '1.1.3',
        '1.1.4',
        '1.2.0',
        '1.3.0',
        '1.3.1',
        '1.3.2',
        '1.3.3',
        '1.4.0',
        '1.4.1',
        '1.4.2',
        '1.5.0',
        '1.5.1',
        '1.5.2',
        '1.5.3',
        '1.5.4',
        '1.5.5',
        '1.6.0',
        '1.6.1',
        '1.6.2',
        '1.6.3'
    ]

    const getGitHub = (tag: string, date: string) => {
        return `<a href="https://github.com/qrlk/videochatru-extension/releases/tag/${tag}" style=\"text-decoration: none!important;\" target=\"_blank\">${tag} ${date}</a>`
    }

    const titles = [
        getGitHub('v0.1', '(2021-09-27)'),
        getGitHub('v0.2', '(2021-10-01)'),
        getGitHub('v0.3', '(2021-10-13)'),
        getGitHub('v0.4', '(2021-11-01)'),
        getGitHub('v0.5', '(2021-12-27)'),
        getGitHub('v0.6', '(2021-12-31)'),
        getGitHub('v0.7', '(2022-01-03)'),
        getGitHub('v0.7.1', '(2022-01-07)'),
        getGitHub('v1.0', '(2022-05-24)'),
        getGitHub('v1.1', '(2022-05-27)'),
        getGitHub('v1.1.1', '(2022-08-04)'),
        getGitHub('v1.1.2', '(2022-08-04)'),
        getGitHub('v1.1.3', '(2022-08-04)'),
        getGitHub('v1.1.4', '(2022-08-05)'),
        getGitHub('v1.2.0', '(2022-08-05)'),
        getGitHub('v1.3.0', '(2022-08-07)'),
        getGitHub('v1.3.1', '(2022-08-07)'),
        getGitHub('v1.3.2', '(2022-08-09)'),
        getGitHub('v1.3.3', '(2022-08-12)'),
        getGitHub('v1.4.0', '(2022-09-01)'),
        getGitHub('v1.4.1', '(2022-09-02)'),
        getGitHub('v1.4.2', '(2022-09-02)'),
        getGitHub('v1.5.0', '(2022-09-05)'),
        getGitHub('v1.5.1', '(2022-09-08)'),
        getGitHub('v1.5.2', '(2022-09-11)'),
        getGitHub('v1.5.3', '(2022-10-06)'),
        getGitHub('v1.5.4', '(2022-10-19)'),
        getGitHub('v1.5.5', '(2022-10-19)'),
        getGitHub('v1.6.0', '(2022-11-17)'),
        getGitHub('v1.6.1', '(2022-11-25)'),
        getGitHub('v1.6.2', '(2023-01-15)'),
        getGitHub('v1.6.3', '(2023-01-15)')
    ]

    const values: { [key: string]: any } = {
        "en": [
            // v0.1 (2021-09-27)
            '<b>The first known version for a mass audience.</b><br>' +
            '<br>' +
            '<b>- Section \'Remote IP\'.</b><br>' +
            '— Added the \'Remote IP\' section.<br>' +
            '— The section displays information about the interlocutor\'s IP: country, city, region, time zone, network information: mobile/vps/vpn.<br>' +
            '— In order for the geolocation service to work, you need to allow unsafe content in the site settings.<br>' +
            '— At startup, an API check is triggered and information is given on how to fix the API if it does not work.<br>' +
            '<br>' +
            '<b>- Section \'Map\'.</b><br>' +
            '— Added the \'Map\' section.<br>' +
            '— The section shows the location of the interlocutor on the 2gis map.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added the \'Remote IP\' section.<br>' +
            '— Added the ability to hide the watermark.<br>' +
            '— Added the ability to hide the banner \'Video Chat RU\'.<br>' +
            '— Added the ability to reflect the image from the interlocutor\'s camera (mirror).<br>' +
            '<br>' +
            '<b>- Hotkeys.</b><br>' +
            '— Added chrome hotkeys: extension activation, skip, stop, a screenshot of the interlocutor/a screenshot of your camera.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added buttons (in the header) to save screenshots (^) from the user\'s camera and the interlocutor\'s camera.<br>' +
            '— Clicking on the extension icon will open the version of roulette without garbage (embed).',

            // v0.2 (2021-10-01)
            '<b>Skipping interlocutors by gender, changing the map provider.</b><br>' +
            '<br>' +
            '<b>- Section \'Remote IP\'.</b><br>' +
            '— Now the section is displayed in English.<br>' +
            '— More detailed information about the problem which blocks http requests.<br>' +
            '— Information about the city and region of mobile IP is now hidden.<br>' +
            '— Information about mobile/VPN/VPS is no longer displayed.<br>' +
            '— Show time in the interlocutor\'s time zone.<br>' +
            '<br>' +
            '<b>- Section \'Map\'.</b><br>' +
            '— 2gis changed to carto.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added the ability to skip men/women (detection by faceapi on the client side).<br>' +
            '— Added the ability to play a sound when the interlocutor is skipped on the floor.<br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Added the \'Info\' section.<br>' +
            '— Information about the extension, various links.<br>' +
            '<br>' +
            '<b>- Hotkeys.</b><br>' +
            '— Added local hotkeys binded to the arrows: skip, stop, report.<br>' +
            '— Added chrome hotkey to quickly switch between the current tab and the chat tab.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— A link to instructions on how to bypass the ban has been added to the window with the ban.<br>' +
            '— \'chatruletka++\' renamed to \'Chat Roulette Extension\' / \'Чат Рулетное Расширение\'.<br>' +
            '— Minor fixes and improvements.',

            // v0.3 (2021-10-13)
            '<b>Blacklist, statistics.</b><br>' +
            '<br>' +
            '<b>- Section \'Bans\'.</b><br>' +
            '— Added the \'Bans\' section.<br>' +
            '— Displays statistics on bans: IP in the blacklist, number of passed and blocked sessions.<br>' +
            '<br>' +
            '<b>- Section \'Stats\'.</b><br>' +
            '— Added the \'Stats\' section.<br>' +
            '— Displays statistics: number of conversations, time spent, number of manual and faceapi skips, number of male and female encounters.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— An alternative mirror has been added.<br>' +
            '— Added the ability to activate faceapi when gender skips are disabled.<br>' +
            '— Added the ability to add to the blacklist by skipping due to faceapi setting.<br>' +
            '— Added the ability to skip interlocutors who take more than 4 seconds to load.<br>' +
            '— Added the ability to automatically close the dialog \'Are you there?\' when the timer goes out.<br>' +
            '<br>' +
            '<b>- Hotkeys.</b><br>' +
            '— Added the ability to ban the interlocutor by pressing the local/chrome hotkey.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added buttons (in the header) to open the user\'s camera or the interlocutor\'s camera in PiP.<br>' +
            '— Minor fixes and improvements.',

            // v0.4 (2021-11-01)
            '<b>Extension name changed in English localization.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Added badges from shields.io .<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— \'Chat Roulette Extension\' renamed to \'Chatruletka Extension\'.<br>' +
            '— Minor fixes and improvements.',

            // v0.5 (2021-12-27)
            '<b>Sections in settings, ws hacks, experiments with nsfw blocking.</b><br>' +
            '<br>' +
            '<b>- Section \'Bans\'.</b><br>' +
            '— The section has been translated into Russian.<br>' +
            '<br>' +
            '<b>- Section \'Stats\'.</b><br>' +
            '— The section has been translated into Russian.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added an alternative \'mirror\' from the local video.<br>' +
            '— Experiments with ws hacks.<br>' +
            '— Experiments with nsfw detection.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Minor fixes and improvements.',

            // v0.6 (2021-12-31)
            '<b>Streamer mode, search by city/region.</b><br>' +
            '<br>' +
            '<b>- Streamer mode.</b><br>' +
            '— Streamer mode has been added: the ability to blur the interlocutor\'s camera on a hotkey, while looking at the original picture in Picture-in-Picture mode.<br>' +
            '— The ability to automatically activate the blur / image after changing the interlocutor.<br>' +
            '— The ability to customize the image.<br>' +
            '— The ability to mute the interlocutor by hotkey.<br>' +
            '— An attempt at automatic blur, if it recognizes nsfw (it is better not to use it in production, use hands).<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added the ability to search for an interlocutor by city/region.<br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Discord badge added.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— A lot of fixes and cosmetic improvements.<br>' +
            '— A lot of internal architectural changes.',

            // v0.7 (2022-01-03)
            '<b>Dark mode.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added dark mode.<br>' +
            '— Disabled nsfwjs blurring by default.<br>' +
            '— Typo fixed: nsfjw -> faceapi in skip faceapi tooltips.<br>' +

            '<br>' +
            '<b>- Hotkeys.</b><br>' +
            '— Fixed the hotkey report+left arrow.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Switching from ko-fi to buymeacoffee.<br>',

            // v0.7.1 (2022-01-07)
            '<b>Polling when deleting an extension.</b><br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added a Google form asking the user why he deleted the extension, the response is sent to the public channel in Discord.',

            // v1.0 (2022-05-24)
            '<b>Manifest v3 (will work in 2023+).</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Added an alternative IP geolocation API.<br>' +
            '— It works via https, but is much inferior to its http counterpart (1k requests per day, cannot detect mobile Internet).<br>' +
            '— A detailed analysis of how to activate the normal api has been added to the wiki on github.<br>' +
            '— If the http api is unavailable, the link to the article will be in the IP tab.<br>' +
            '— The donation button has been replaced with a button with a call to leave a review in the Chrome Web Store.<br>' +
            '— When you click on the \'Stop\' button, the IP section is now reset.<br>' +
            '<br>' +
            '<b>- Section \'Map\'.</b><br>' +
            '— By default, Europe is displayed on the map (in the English version).<br>' +
            '<br>' +
            '<b>- Section \'Stats\'.</b><br>' +
            '— Fixed a decrease in the number of manual skips during auto-start due to too long connection.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— The \'Settings\' section now expands to half the screen, you can disable it.<br>' +
            '— If you change an important setting, the extension will remind you to reboot only after clicking the \' buttonStart\'.<br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Telegram extension groups/chats have been cut/deleted.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Extension adapted to manifest v3 (Will work in Chrome in 2023+)<br>' +
            '— The extension in the English version is now named \'Chatruletka (ome.tv) extension\'.<br>' +
            '— The extension version is now displayed in the control panel header.<br>' +
            '— A warning now appears on the login screen that Chat Roulette and ome.tv is the same thing.<br>' +
            '— Many people have deleted the extension, not understanding why they can\'t use it on their Chatruletka instance.<br>',

            // v1.1 (2022-05-27)
            '<b>Error monitoring system.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added the ability to hide the title (on by default).<br>' +
            '— Fixed crash when trying to hide a non-existent logo.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added an error monitoring system to report errors in the extension code.<br>' +
            '— Added a scroll bar to the login window.<br>' +
            '— Increased the width of the control menu.<br>',

            // v1.1.1 (2022-08-04)
            '<b>Unsuccessful hotfix of the tab hanging issue.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Attempt to fix tab hanging with ws hacks enabled.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Limit the version string in the control panel to 3 characters',

            // v1.1.2 (2022-08-04)
            '<b>A successful hotfix of the tab hanging issue.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— The sending of "face data" is disabled, which was the reason for the tab to hang when ws hacks is enabled.',

            // v1.1.3 (2022-08-04)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Increased the delay before resizing after resizing the window.',

            // v1.1.4 (2022-08-05)
            '<b>Failed attempt to fix http error 429.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Failed attempt to replace the backup ip geolocation provider.',

            // v1.2.0 (2022-08-05)
            '<b>IP geolocation without any browser settings.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— IP geolocation should now work without the need to allow insecure content (but with a slightly longer delay).<br>' +
            '— The backup geolocation service was cut out because its limits policy applied to all users of the extension, and not just to a specific one, as I thought before.<br>' +
            '— The option to display additional IP information (tor vpn mobile) is now enabled by default.',

            // v1.3.0 (2022-08-07)
            '<b>Checking torrents and a welcome window.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Added the iknowwhatyoudownload button to open a link with possible torrent downloads of the interlocutor.<br>' +
            '— Added the ability to show the provider (disabled by default).<br>' +
            '— Seconds are shown >=0 in TM.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Changed the way to hide parts of the interface.<br>' +
            '— Added the ability to disable error collection.<br>' +
            '— Added a call not to use the removal of images in ws hacks, because perceived as empty.<br>' +
            '— The dangerous "prikol" function is now only available if the extension is unpacked.<br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Added a modal queue that welcomes new users with a bunch of useless information.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Sanitization of innerHTML assignments.<br>' +
            '— Hid the instructions for bypassing the ban for a paywall due to reaching the threshold of 5000 users.',


            // v1.3.1 (2022-08-07)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Dark theme adapted for the welcome window.',

            // v1.3.2 (2022-08-09)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Fixed: \'buttonCheck torrents\' for UI locales other than en/ru.',

            // v1.3.3 (2022-08-12)
            '<b>Information about multiple IP addresses.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— The case is taken into account when the interlocutor revealed several IP addresses: information on all will be displayed.',

            // 1.4.0 (2022-09-01)
            '<b>Minimalism, ome.tv support, version history.</b><br>' +
            '<br>' +
            '<b>- Minimalism mode.</b><br>' +
            '— Added the "minimalism" mode: the extension will only show IP geolocation in the chat area.<br>' +
            '— When installing the extension, you will be prompted to choose how you want to use it.<br>' +
            '— You can switch between modes using the button that should appear in the chat area.<br>' +
            '<br>' +
            '<b>- The "Map" section.</b><br>' +
            '— The map will be updated only if the "map" tab is selected.<br>' +
            '<br>' +
            '<b>- The "Settings" section.</b><br>' +
            '— Ws hacks: The option to delete a report that was dangerous for the user has been removed.<br>' +
            '— Added the ability to search by multiple cities/regions.<br>' +
            '— Added a warning if the "Danger Zone" is enabled.<br>' +
            '<br>' +
            '<b>- The "Info" section.</b><br>' +
            '— Added version history.<br>' +
            '— The version history will open if you open the Chatruletka site (or ome.tv) with a newer version of the extension that you used earlier.<br>' +
            '— Version history does not open in the "minimalism" mode.<br>' +
            '— Added the "close" button to the "welcome window".<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added support for ome.tv .<br>' +
            '— Some users reported that it didn\'t work for them videochatru.com .<br>' +
            '— ome.tv is the same Chatruletka, just another instance positioned as an alternative to Omegle.<br>',

            // 1.4.1 (2022-09-02)
            '<b>Minor fixes.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— The maximum height of the changelog container is limited.<br>' +
            '— Disabled closing by external click (changelog).<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Improved the method of resizing the control panel.',

            // 1.4.2 (2022-09-02)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Now the version history displays the new version after update, not the one you used before.',

            // 1.5.0 (2022-09-05)
            '<b>Cosmetic improvements, a new option to prohibit camera cropping for mobile interlocutors.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— 0S will now be displayed in TM, example: \'1M, 0S\'.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added a new interface setting: "do not crop the interlocutor\'s camera".<br>' +
            '— By default, if the interlocutor\'s camera does not shoot at 4:3, the image is simply cropped.<br>' +
            '— A new option can fix it and you will be able to see the interlocutor completely at the price of black bars.<br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Cosmetic improvements to changelog and welcome window: smooth transition between alerts, keyboard arrows/click switching, fixed sizes and many minor improvements.<br>' +
            '— The contents of the version history were rewritten from scratch.<br>' +
            '— Clickable version numbers in changelog.<br>' +
            '<br>' +
            '<b>- Hotkeys.</b><br>' +
            '— Fix the incompatibility of chrome hotkey \'switch between the active tab and the chat tab\' for ome.tv.<br>' +
            '— Local hotkeys are disabled while the warning / version history / welcome window are active.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Now if your browser updates the extension while you are in Chatruletka, you will receive a message that you need to reload the page.<br>' +
            '— It is no longer possible to select text in the upper and lower parts of the control panel.',

            // 1.5.1 (2022-09-08)
            '<b>A few changes to the \'streamer mode\'.<br><br>Ignore this update if you haven\'t used \'streamer mode\' before, this information is useless to you.</b><br><br>Streamer mode allows you to cover your interlocutor with your custom image/blur his picture by watching him through the picture-in-picture mode (which is in a separate window and not captured by OBS) to make sure that he does not have NSFW and remove the cover. Previously, the neural network was responsible for evaluating the interlocutor, but this functionality broke down and in order to fix it for good, I would need to rewrite the entire extension from scratch (which would take 20+ hours of work and a lot of energy, I don’t have all this), so you have to evaluate it manually each time, by toggling the cover with the \'right arrow\' key on the keyboard. The cover is activated by default every time the chat state changes (stop, search, found, play), if \'auto apply blur/cover\' is activated in the settings.<br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— If the interlocutor has an incorrect time zone, it will still be shown.<br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Improved the cover logic: search noise no longer flickers black.<br>' +
            '— Now the cover closes everything, the \'cover over X\' setting is only responsible for activating the cover at a specific stage, if \'auto apply blur/cover\' is enabled.<br>' +
            '— The use of a cover is enabled by default for new users who have enabled streamer mode.<br>' +
            '— Disable banner/watermark display when streamer mode is enabled, as it conflicts with the cover.<br>' +
            '— Added the ability to apply a cover when the chat is stopped.<br>' +
            '— Temporarily disabled broken nsfwjs integration and removed its settings.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Removed poll when uninstalling an extension.<br>',

            // 1.5.2 (2022-09-11)
            '<b>Removed link to instructions for bypassing the ban.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Target city/region search now works as expected if the interlocutor has multiple networks.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Replaced the boosty link with a window with information on how not to get banned by accident. Instructions for bypassing the ban are no longer available to the general public, even for money.<br>' +
            '— Improved the notification that is shown when the browser has updated the extension while you are at Chatruletka: it is now less intrusive.<br>',

            // 1.5.3 (2022-10-06)
            '<b>Change the default location display.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Instead of hiding the location of the cell ISP, it is now displayed as a cell tower.<br>— These locations of users of mobile/cellular operators <b>may not be accurate</b>.<br>— This was done because, according to my observations, most people are not familiar with the concept of a time zone and get confused.',

            // 1.5.4 (2022-10-19)
            '<b>Minor update.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Added a little explanation of what MOBILE/PROXY/HOSTING means.',

            // 1.5.5 (2022-10-19)
            '<b>Minor update.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— PROXY and HOSTING merged into one to save some space.',

            // 1.6.0 (2022-11-17)
            '<b>Removal of the "danger zone", fixes for the minimalism mode.<br><br>Ignore this update if you did not use the "danger zone" in the settings.</b><br><br>In the "dangerous zone" of the extension were experimental features (written long before the publication of the extension), the main purpose of which was to provide the ability to communicate in video chat without a webcam (mirror mode), while not getting banned for an incorrect image. The "danger zone" also included the functionality of playing a sound when your interlocutor skip you, and a quick auto-skip in case you were looking for country X, and the Chatruletka gave you country Y.<br><br>This functionality was hidden behind a red "danger zone" checkbox in the settings and a dialog with a warning that using this functionality can lead to a ban, so you could hardly turn it on by accident. All other functions were not hidden in this way, because they interact with the Chatruletka naturally and cannot lead to a ban.<br><br>But apparently, due to the strong influx of users of the extension, some children began to abuse this functionality, thinking that if the automatic system for processing reports will not ban them, they can do anything (which is not true, because there is also manual moderation in chatruletka). As a result, some "danger zone" users of the extension began to complain about shadowbans due to the "danger zone" functionality, so I decided to remove this functionality from the extension to protect you from this. The ruletka script is periodically updated, new systems are introduced to deal with violators of its rules, which is very difficult to follow and, in principle, not really necessary, because the extension tries to develop in such a way as not to harm the platform itself. For some time, the "danger zone" will still be available if you installed the extension in developer mode, but in the future the section and all functionality will be removed. I strongly recommend not to go down this path and just forget about the existence of these functions, because using them in the current situation will almost certainly lead to your ban in ruletka.<br>' +
            '<br>' +
            '<b>- "Danger zone" in settings.</b><br>' +
            '— "Danger Zone" is now only available if the extension is installed manually via developer mode.<br>' +
            '— There were no "fixes" for the "danger zone", its use is still highly likely to lead to your ban.<br>' +
            '— The "danger zone" reminder in the settings can no longer be turned off, only hidden for 24 hours.<br>' +
            '<br>' +
            '<b>- Mode "minimalism".</b><br>' +
            '— Fixed a situation where the "switch mode" button did not appear, which indirectly affected the work of geolocation.<br>' +
            '— Fixed a couple of minor bugs.',

            // 1.6.1 (2022-11-25)
            '<b>New automation setting: \'autoskip wrong country\', hide cellular (mobile) internet geolocation data by default.</b><br><br>\'Auto-skip wrong country\' auto-skips the interlocutor if is not from the country you need. Video chat connects you with interlocutors from other countries if it cannot find the one you need in a short time. By enabling this feature in the settings, \'wrong\' countries will be skipped (ip geolocation data is not used).<br><br><b>Now for interlocutors with mobile Internet, geolocation (CT) and time zone (TZ) are hidden by default.</b> <br><br>A significant part of video chat users use mobile Internet, but the IP geolocation accuracy of such networks is very low (10-20%).<br><br>Previously, only the time zone (TZ) was displayed for such networks, but this confused users.<br><br>A month and a half ago, the extension began to show by default the previously hidden data of the location of the mobile Internet in a separate section "CT" with a warning that the accuracy of such data is very low. In practice, it turned out that \'CT\' confuses new users even more, so the difficult decision was made to hide both CT and TZ.<br><br>In the geolocation settings, you can return everything as it was, but now it seems to me that only the most accurate data should be shown. There are a couple of ideas on how to compensate for the lack of geolocation accuracy in the future, so stay tuned.<br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Hide mobile internet location data by default.<br><br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Ability to show "CT" for mobile internet as it was before.<br>' +
            '— New automation setting to auto-skip the wrong country.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Removed dialogue from the ban popup.',

            // 1.6.2 (2023-01-15)
            '<b>Minor release with 2 small fixes.</b><br>' +
            '<br>' +
            '<b>- Section \'Map\'.</b><br>' +
            '— Hotkeys are no longer activated if a map is selected, so that you can move around the map with arrows.<br><br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Fixed \'autoskip wrong country\' function.',

            // 1.6.3 (2023-01-15)
            '<b>Fixed \'check torrents\' function.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            "— Fixed an incorrect locale detection that caused torrent checking to work incorrectly for some users."
        ],
        "ru": [
            // v0.1 (2021-09-27)
            '<b>Первая известная версия для массовой аудитории.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Remote IP\'.</b><br>' +
            '— Добавлен раздел \'Remote IP\'.<br>' +
            '— Определение информации об IP собеседника: страна, город, регион, временная зона, информация о сети: mobile/vps/vpn.<br>' +
            '— Чтобы сервис геолокации работал, нужно разрешить небезопасный контент в настройках сайта.<br>' +
            '— При старте срабатывает проверка и даётся информация о том, как починить API, если он не работает.<br>' +
            '<br>' +
            '<b>- Раздел \'Карта\'.</b><br>' +
            '— Добавлен раздел \'Карта\'.<br>' +
            '— Раздел показывает местоположение собеседника на карте 2gis.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлен раздел \'Настройки\'.<br>' +
            '— Добавлена возможность скрыть вотермарк.<br>' +
            '— Добавлена возможность скрыть баннер \'Видеочат RU\'.<br>' +
            '— Добавлена возможность отражать изображение с камеры собеседника (mirror).<br>' +
            '<br>' +
            '<b>- Хоткеи.</b><br>' +
            '— Добавлены chrome хоткеи: активация расширения, скип, стоп, скриншот собеседника/скриншот вашей камеры.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлены кнопки (в заголовке) для сохранения скриншотов (^) с камеры пользователя и камеры собеседника.<br>' +
            '— При клике на иконку расширения откроется версия рулетки без мусора (embed).',

            // v0.2 (2021-10-01)
            '<b>Пропуск собеседников по полу, смена провайдера карт.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Remote IP\'.</b><br>' +
            '— Теперь раздел отображается на английском.<br>' +
            '— Более подробная информация о проблеме с блокировкой http запросов.<br>' +
            '— Информация о городе и регионе мобильных IP теперь скрыта.<br>' +
            '— Информация о mobile/VPN/VPS больше не отображается.<br>' +
            '— Добавлено отображение времени в часовом поясе собеседника.<br>' +
            '<br>' +
            '<b>- Раздел \'Карта\'.</b><br>' +
            '— 2gis сменен на carto.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлена возможность пропускать мужчин/женщин (определение по faceapi на стороне клиента).<br>' +
            '— Добавлена возможность проиграть звук, когда собеседник пропущен по полу.<br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Добавлен раздел \'Инфо\'.<br>' +
            '— Информация о расширении, разные ссылки.<br>' +
            '<br>' +
            '<b>- Хоткеи.</b><br>' +
            '— Добавлены локальные хоткеи на стрелочки: скип, стоп, репорт.<br>' +
            '— Добавлен chrome хоткей для быстрого переключения между текущей вкладкой и вкладкой чата.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— В окошко с баном добавлена ссылка на инструкцию о том, как обойти бан.<br>' +
            '— \'chatruletka++\' переименовано в \'Чат Рулетное Расширение\' / \'Chat Roulette Extension\'.<br>' +
            '— Мелкие фиксы и улучшения.',

            // v0.3 (2021-10-13)
            '<b>Чёрный список, статистика.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Баны\'.</b><br>' +
            '— Добавлен раздел \'Баны\'.<br>' +
            '— Отображает статистику по банам: IP в чёрном списке, кол-во пропущенных и заблокированных разговоров.<br>' +
            '<br>' +
            '<b>- Раздел \'Стата\'.</b><br>' +
            '— Добавлен раздел \'Стата\'.<br>' +
            '— Отображает статистику: количество разговоров, потраченное время, количество ручных и faceapi скипов, количество встреченных male и female.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлено альтернативное зеркало.<br>' +
            '— Добавлена возможность активировать faceapi при отключенных скипах по полу.<br>' +
            '— Добавлена возможность добавлять в чёрный список по пропуску из-за faceapi.<br>' +
            '— Добавлена возможность скипать собеседников, которые загружаются больше 4х секунд.<br>' +
            '— Добавлена возможность автоматически закрывать диалог \'Вы здесь?\', когда таймер выходит.<br>' +
            '<br>' +
            '<b>- Хоткеи.</b><br>' +
            '— Добавлена возможность забанить собеседника по нажатию локального/chrome хоткея.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлены кнопки (в заголовке) для открытия в PiP камеры пользователя или камеры собеседника.<br>' +
            '— Мелкие фиксы и улучшения.',

            // v0.4 (2021-11-01)
            '<b>Смена названия в английской локализации.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Добавлены бейджи с shields.io.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— \'Chat Roulette Extension\' переименовано в \'Chatruletka Extension\'.<br>' +
            '— Мелкие фиксы и улучшения.',

            // v0.5 (2021-12-27)
            '<b>Разделы в настройках, ws hacks, эксперименты с блокировкой nsfw.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Баны\'.</b><br>' +
            '— Раздел переведён на русский.<br>' +
            '<br>' +
            '<b>- Раздел \'Стата\'.</b><br>' +
            '— Раздел переведён на русский.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлено альтернативное \'зеркало\' из локального видео.<br>' +
            '— Эксперименты с ws hacks.<br>' +
            '— Эксперименты с обнаружением nsfw.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Мелкие фиксы и улучшения.',

            // v0.6 (2021-12-31)
            '<b>Режим стримера, поиск по городу/региону.</b><br>' +
            '<br>' +
            '<b>- Режим стримера.</b><br>' +
            '— Добавлен режим стримера: возможность блюрить камеру собеседника по хоткею, смотря при этом на оригинальную картинку в режиме Картинка-в-Картинке.<br>' +
            '— Возможность автоматически активировать блюр/заглушку после смены собеседника.<br>' +
            '— Возможность кастомизировать заглушку.<br>' +
            '— Возможность мутить собеседника по хоткею.<br>' +
            '— Попытка в автоматический блюр, если распознает nsfw (лучше не использовать на практике, только ручками).<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлена возможность поиска собеседника по городу/региону.<br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Добавлен Discord.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Много фиксов и косметических улучшений.<br>' +
            '— Много внутренние архитектурных изменений.',

            // v0.7 (2022-01-03)
            '<b>Тёмный режим.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлен темный режим.<br>' +
            '— Отключено размывание nsfwjs по умолчанию.<br>' +
            '— Исправлена опечатка: nsfjw -> faceapi во всплывающих подсказках скипа faceapi.<br>' +

            '<br>' +
            '<b>- Хоткеи.</b><br>' +
            '— Исправлена горячая клавиша репорт+стрелка влево.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Переход с ko-fi на buymeacoffee.<br>',

            // v0.7.1 (2022-01-07)
            '<b>Опрос при удалении расширения.</b><br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлена форма Google, спрашивающая пользователя, почему он удалил расширение, ответ отправляется в публичный канал в Discord.',

            // v1.0 (2022-05-24)
            '<b>Manifest v3 (будет работать в 2023+).</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Добавлен альтернативный API пробива IP.<br>' +
            '— Он работает через https, но сильно уступает его http аналогу (1к запросов в день, не может определить мобильный интернет).<br>' +
            '— В вики на гитхабе добавлен подробный разбор как активировать нормальный api.<br>' +
            '— Если http апи недоступен, ссылка на статью будет в вкладке IP.<br>' +
            '— Кнопка доната заменена кнопкой с призывом оставить отзыв в Chrome Web Store.<br>' +
            '— При нажатии на кнопку \'Стоп\' теперь раздел IP сбрасывается.<br>' +
            '<br>' +
            '<b>- Раздел \'Карта\'.</b><br>' +
            '— По умолчанию на карте отображается Европа (в английской версии).<br>' +
            '<br>' +
            '<b>- Раздел \'Стата\'.</b><br>' +
            '— Пофикшено уменьшение числа ручных скипов при автопропуске из-за слишком долгого подключения.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Раздел \'Настройки\' теперь расширяется до половины экрана, можно отключить.<br>' +
            '— Если вы меняете важную настройку, расширение напомнит перезагрузиться только после нажатия на кнопку \'Старт\'.<br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Вырезаны/удалены группы/чаты расширения в Telegram.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Расширение адаптировано под manifest v3 (Будет работать в Chrome в 2023+)<br>' +
            '— Расширение в английской версии теперь называется \'Chatruletka (ome.tv) extension\'.<br>' +
            '— Теперь в заголовке контрольной панели отображается версия расширения.<br>' +
            '— На экране с логином теперь появляется предупреждение о том, что Чат Рулетка и оме.тв это одно и то же.<br>' +
            '— Многие люди удаляли расширение, не понимая, почему они не могут использовать его на своём инстансе Чат Рулетки.<br>',

            // v1.1 (2022-05-27)
            '<b>Система мониторинга ошибок.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлена возможность скрыть заголовок (по умолчанию вкл).<br>' +
            '— Исправлен вылет при попытке скрыть несуществующий логотип.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлена система мониторинга ошибок для сообщения об ошибках в коде расширения.<br>' +
            '— Добавлена полоса прокрутки в окно входа.<br>' +
            '— Увеличена ширина меню управления.<br>',


            // v1.1.1 (2022-08-04)
            '<b>Неудачный хотфикс фризов.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Попытка исправить зависание вкладок с включенными ws hacks.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Ограничение строки версии в панели управления до 3 символов',

            // v1.1.2 (2022-08-04)
            '<b>Удачный хотфикс фризов.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Отключена отправка "данных лица", которая была причиной зависания вкладки при включенном ws hacks.',

            // v1.1.3 (2022-08-04)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Увеличена задержка перед изменением размера после изменения размера окна.',

            // v1.1.4 (2022-08-05)
            '<b>Неудачная попытка пофиксить http error 429.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Неудачная попытка заменить резервного провайдера ip геолокации.',

            // v1.2.0 (2022-08-05)
            '<b>Геолокация IP без настройки браузера.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— IP-геолокация теперь должна работать без необходимости разрешать небезопасный контент (но с немного большей задержкой).<br>' +
            '— Служба резервной геолокации вырезана, потому что ее политика лимитов распространялась на всех пользователей расширения, а не только на конкретного, как я думал раньше.<br>' +
            '— Опция отображения дополнительной информации об IP (tor vpn mobile) теперь включена по умолчанию.',

            // v1.3.0 (2022-08-07)
            '<b>Проверка торрентов и приветственное окно.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Добавлена кнопка iknowwhatyoudownload для открытия ссылки с возможными торрент-загрузками собеседника.<br>' +
            '— Добавлена возможность показывать провайдера (по умолчанию отключена).<br>' +
            '— Показываются секунды >=0 в TM.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Изменён способ скрытия частей интерфейса.<br>' +
            '— Добавлена возможность отключения сбора ошибок.<br>' +
            '— Добавлен призыв не использовать удаление картинок в ws hacks, тк воспринимается как пустая.<br>' +
            '— Опасная функция "прикол" доступна только в том случае, если расширение распаковано.<br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Добавлена модальная очередь, которая приветствует новых пользователей кучей бесполезной информации.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Sanitization присвоений innerHTML.<br>' +
            '— Спрятал инструкцию по обходу бана за пейвол из-за достижения порога в 5000 пользователей.',


            // v1.3.1 (2022-08-07)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Тёмная тема адаптирована для приветственного окна.',

            // v1.3.2 (2022-08-09)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Исправлено: кнопка \'Проверить торренты\' для локалей пользовательского интерфейса, отличных от en/ru.',

            // v1.3.3 (2022-08-12)
            '<b>Информация о нескольких IP адресах.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Учтён случай, когда собеседник раскрыл несколько IP адресов: будет отображаться информация по всем.',

            // 1.4.0 (2022-09-01)
            '<b>Минимализм, поддержка ome.tv, история версий.</b><br>' +
            '<br>' +
            '<b>- Режим "минимализм".</b><br>' +
            '— Добавлен режим "минимализм": расширение будет показывать только IP-геолокацию в области чата.<br>' +
            '— При установке расширения вам будет предложено выбрать способ его использования.<br>' +
            '— Вы можете переключаться между режимами с помощью кнопки, которая должна появиться в области чата.<br>' +

            '<br>' +
            '<b>- Раздел "Карта".</b><br>' +
            '— Карта будет обновляться, только если выбрана вкладка "карта".<br>' +

            '<br>' +
            '<b>- Раздел "Настройки".</b><br>' +
            '— Ws hacks: Удалена опасная для пользователя опция удаления репорта.<br>' +
            '— Добавлена возможность поиска по нескольким городам/регионам.<br>' +
            '— Добавлено предупреждение, если "Опасная зона" включена.<br>' +

            '<br>' +
            '<b>- Раздел "Инфо".</b><br>' +
            '— Добавлена история версий.<br>' +
            '— История версий откроется, если вы откроете сайт Чатрулетки (или ome.tv) с более новой версией расширения, которое вы использовали ранее.<br>' +
            '— История версий не открывается в режиме "минимализм".<br>' +
            '— Добавлена кнопка "закрыть" в "окно приветствия".<br>' +

            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлена поддержка ome.tv.<br>' +
            '— Некоторые пользователи сообщали, что у них не работал videochatru.com.<br>' +
            '— ome.tv - это та же чатрулетка, просто другой инстанс, позиционируемый как альтернатива Omegle.<br>',


            // 1.4.1 (2022-09-02)
            '<b>Мелкие фиксы.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Ограничена максимальная высота контейнера changelog.<br>' +
            '— Отключено закрытие по внешнему клику (changelog).<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Улучшен метод изменения размера панели управления.',

            // 1.4.2 (2022-09-02)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Теперь история версий отображает новую версию при обновлении, а не ту, которую вы использовали раньше.',

            // 1.5.0 (2022-09-05)
            '<b>Косметические улучшения, новая опция для запрета обрезания камеры у мобильных собеседников.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— 0S теперь будет отображаться в TM, пример: 1M, 0S.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлена новая настройка интерфейса: \'не обрезать камеру собеседника\'.<br>' +
            '— По умолчанию если у собеседника камера не снимает в 4:3, изображение просто обрезается.<br>' +
            '— Новая опция может исправить это недоразумение и вы сможете увидеть собеседника полностью.<br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Косметические улучшения changelog и приветственного окна: плавный переход между элементами, переключение стрелками клавиатуры/по клику, фиксированные размеры и много мелких доработок.<br>' +
            '— Содержимое истории версий переписано с нуля.<br>' +
            '— Кликабельные номера версий в changelog.<br>' +
            '<br>' +
            '<b>- Хоткеи.</b><br>' +
            '— Фикс несовместимости chrome хоткея переключения между активной вкладкой и вкладкой чата для ome.tv.<br>' +
            '— Локальные хоткеи отключены пока активно окно с предупреждением / историей версий / приветственным окном.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Теперь если ваш браузер обновит расширение пока вы в рулетке, вы получите сообщение о том, что нужно перезагрузить страницу.<br>' +
            '— Больше нельзя выделять текст в верхней и нижней частях контрольной панели.',

            // 1.5.1 (2022-09-08)
            '<b>Несколько изменений для \'режима стримера\'.<br><br>Проигнорируйте это обновление, если вы не пользовались \'режимом стримера\' ранее, эта информация бесполезна для вас.</b><br><br>Режим стримера позволяет закрыть собеседника своей заглушкой/размыть его картинку, наблюдая за ним через режим "картинка в картинке" (который в отдельном окне и не захватывается OBS), чтобы убедиться, что у него нет NSFW и снять заглушку. Раньше за оценку собеседника отвечала нейросеть, но этот функционал сломался и чтобы его починить по хорошему нужно переписать всё расширение с нуля (на что нужно 20+ часов работы и много энергии, у меня всего этого нет), так что оценивать придётся каждый раз вручную, переключая заглушку с помощью клавиши правой стрелки на клавиатуре. При этом заглушка по умолчанию активируется каждый раз при смене состояния чата (поиск, превьюшка, разговор), если активировано \'авто активация блюра\' в настройках.<br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Если у собеседника определилась некорректная временная зона, она всё равно будет показана.<br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Улучшена логика заглушки: больше не мерцает чёрным поисковый шум.<br>' +
            '— Теперь заглушка закрывает всё, настройка \'закрывать X\' отвечает лишь за активацию заглушки на конкретном этапе, если включена \'авто активация блюра\'.<br>' +
            '— Использование заглушки включается по умолчанию у новых юзеров, включившим режим стримера.<br>' +
            '— Отключение отображения баннера/ватермарки при включенном режиме стримера, так как конфликтует с заглушкой.<br>' +
            '— Добавлена возможность применять заглушку при остановке чата.<br>' +
            '— Временно отключена сломанная интеграция nsfwjs и удалены ее настройки.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Удален опрос при удалении расширения.<br>',

            // 1.5.2 (2022-09-11)
            '<b>Удалена ссылка на инструкцию по обходу бана.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Поиск целевого города/региона теперь работает корректно, если у собеседника несколько сетей.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Ссылка на boosty заменена на окно с информацией о том, как не получить бан по ошибке. Инструкции по обходу бана больше не доступны широкой публике, даже за деньги.<br>' +
            '— Улучшено уведомление, которое показывается когда браузер обновил расширение пока вы в рулетке: оно стало менее навязчивым.<br>',

            // 1.5.3 (2022-10-06)
            '<b>Изменения в отображении геолокации.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Вместо того, чтобы скрывать местоположение сотового интернет-провайдера, теперь оно отображается в виде вышки сотовой связи.<br>— Эти позиции пользователей мобильных операторов <b>могут быть неточными</b>.<br>— Большинство людей не знакомы с понятием часового пояса и путаются, поэтому вот такое изменение.',

            // 1.5.4 (2022-10-19)
            '<b>Незначительное обновление.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Добавлено небольшое пояснение того, что означает MOBILE/PROXY/HOSTING.',

            // 1.5.5 (2022-10-19)
            '<b>Незначительное обновление.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— PROXY и HOSTING объеденены в одно, чтобы сократить место.',

            // 1.6.0 (2022-11-17)
            '<b>Отказ от "опасной зоны", исправления для режима минимализма.<br><br>Проигнорируйте это обновление, если вы не пользовались "опасной зоной" в настройках.</b><br><br>В "опасной зоне" расширения были экспериментальные штуки (написанные задолго до публикации расширения), основной задачей которых было обеспечить возможность общаться в видеочате без вебкамеры (режим зеркала), при этом не получая баны за некорректное изображение. Так же в "опасную зону" входил функционал воспроизведения звука, когда ваш собеседник вас пропустил, и быстрый автопропуск в случае, если вы искали страну X, а рулетка подсунула вам страну Y.<br><br>Этот функционал был скрыт за чек-боксом "опасная зона" в настройках и диалогами с предупреждением о том, что использование этого функционала может привести к бану, так что вы вряд ли могли его включить случайно. Все остальные функции не были скрыты таким образом, потому что они взаимодействуют с рулеткой лишь поверхностно и не могут привести к бану.<br><br>Но судя по всему из-за сильного наплыва пользователей расширения школьники начали злоупотреблять данным функционалом, думая что если автоматическая система обработки репортов их не забанит, они могут делать всё что угодно (что не является правдой ведь в рулетке есть и ручная модерация). В результате некоторые пользователи "опасной зоны" расширения начали жаловаться на теневые баны из-за функционала "опасной зоны", поэтому я решил убрать этот функционал. Периодически скрипт рулетки обновляется, вводятся новые системы борьбы с нарушителями её правил, за чем очень сложно следить и в принципе не очень-то и нужно, потому что расширение пытается развиваться таким образом, чтобы не навредить самой платформе. Некоторое время "опасная зона" ещё будет доступна в случае, если вы установили расширение в режиме разработчика, но в будущем раздел и весь функционал будет удалены. Настоятельно рекомендую не идти по этому пути и просто забыть о существовании этих функций, потому что их использование в текущей ситуации почти наверняка приведёт к вашему бану в рулетке.<br>' +
            '<br>' +
            '<b>- "Опасная зона" в настройках.</b><br>' +
            '— "Опасная зона" теперь доступна только если расширение установлено вручную через режим разработчика.<br>' +
            '— Никаких фиксов "опасной зоны" не было, её использование всё ещё с высокой вероятностью приведёт к вашему бану.<br>' +
            '— Напоминание про опасность "опасной зоны" в настройках теперь нельзя отключить, только скрыть на 24 часа.<br>' +
            '<br>' +
            '<b>- Режим "минимализм".</b><br>' +
            '— Исправлена ситуация, когда кнопка "сменить режим" не появлялась, что косвенно влияло на работу геолокации.<br>' +
            '— Фикс пары мелких багов.',

            // 1.6.1 (2022-11-25)
            '<b>Новая настройка автоматизации: \'aвтопропуск неверной страны\', скрытие данных геолокации мобильного интернета по умолчанию.</b><br><br>\'Автопропуск неверной страны\' автопропускает собеседника, если он не из нужной вам страны. Видеочат соединяет вас с собеседниками из других стран, если не может найти нужную вам за короткое время. Включив этот пункт в настройках, неверные страны будут пропускаться (данные геолокации не используются).<br><br><b>Теперь для собеседников с мобильным интернетом геолокация (CT) и временная зона (TZ) скрыты по умолчанию.</b><br><br>Значительная часть пользователей видеочата использует видеочат с мобильного интернета, но точность геолокации IP таких сетей очень низкая, в районе 10-20%.<br><br>Раньше для таких сетей отображалась только временная зона (TZ), но это запутывало пользователей.<br><br>Полтора месяца назад расширение стало по умолчанию показывать ранее скрытые данные локации мобильного интернета в отдельном разделе "CT" с предупреждением, что точность таких данных очень низкая. На практике оказалось, что CT ещё больше запутывает новых пользователей, поэтому было принято непростое решение скрывать и CT, и TZ.<br><br>В настройках геолокации можно вернуть всё как было, но сейчас мне кажется что показывать только наиболее точные данные - наилучший путь. Есть пара идей как можно компенсировать недостаток точности геолокации в будущем, ждите новостей.<br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Скрытие данных геолокации мобильного интернета по умолчанию.<br><br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Возможность показывать локацию "CT" для мобильного интернета как это было раньше.<br>' +
            '— Новая настройка автоматизации для автопропуска неверной страны.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Убран диалог из окна бана.',

            // 1.6.2 (2023-01-15)
            '<b>Небольшой релиз с 2 исправлениями.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Карта\'.</b><br>' +
            '— Горячие клавиши больше не активируются, если выбрана карта, так что вы можете перемещаться по карте стрелками.<br><br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Исправлена работа функции «автопропуск неверной страны».',

            // 1.6.3 (2023-01-15)
            '<b>Фикс ошибки проверки торрентов.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Исправлено неправильное определении локали, из-за которой у некоторых пользователей неправильно работала проверка торрентов.'
        ],
    }

    let index = steps.indexOf(version)
    if (steps.indexOf(version) + 1 < steps.length) {
        index++
    }

    let currentStep = index

    const swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        denyButtonText: chrome.i18n.getMessage('denyButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps,
        progressStepsDistance: "4%",
    })

    const selectStep = function (step: number) {
        swalQueueStep.update({
            title: titles[currentStep],
            html: `<div style="text-align: left; min-height: 300px; max-height: 300px">${values[chrome.i18n.getMessage('lang')][currentStep]}</div>`,
            currentProgressStep: currentStep
        })
    }

    const arrowHotkeys = function (e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
                Swal.getCancelButton()!.click()
                break;

            case "ArrowUp":
                Swal.getDenyButton()!.click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton()!.click()
                break;
        }
        e.preventDefault()
    }

    const result = await swalQueueStep.fire(
        {
            title: titles[currentStep],
            html: `<div style="text-align: left; min-height: 300px; max-height: 300px">${values[chrome.i18n.getMessage('lang')][currentStep]}</div>`,
            currentProgressStep: currentStep,

            willOpen: (e) => {
                (e.querySelector('.swal2-cancel') as HTMLElement).onclick= (e) => {
                    if (currentStep - 1 >= 0) {
                        currentStep = currentStep - 1
                        selectStep(currentStep)
                    } else {
                        // Swal.close()
                    }
                }
                (e.querySelector('.swal2-confirm') as HTMLElement).onclick = (e) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                    } else {
                        Swal.close()
                    }
                }
            },

            didOpen: () => {
                document.removeEventListener('keyup', arrowHotkeys)
                document.addEventListener('keyup', arrowHotkeys)
            },

            didRender: () => {
                let progressSteps = $(".swal2-progress-step")
                progressSteps.css({
                    "user-select": "none",
                    'cursor': 'pointer'
                })
                progressSteps.click(function (el) {
                    currentStep = steps.indexOf(el.target.innerText)
                    selectStep(currentStep)
                })
            },

            willClose: () => {
                document.removeEventListener('keyup', arrowHotkeys)
            }
        }
    )
}

// showSwalChangelog('0.0')
// "swal-context-invalidated.js",
// ugly way to notify user that extension was updated and page needs to be reloaded

let updateNeedReloadTitle = chrome.i18n.getMessage('updateNeedReloadTitle')
let updateNeedReloadText = chrome.i18n.getMessage('updateNeedReloadText')
let updateNeedReloadInterval = setInterval(() => {
    try {
        chrome.i18n.getMessage('lang')
    } catch (e: any) {
        if (e.message === "Extension context invalidated.") {
            clearInterval(updateNeedReloadInterval)
            Swal.fire({
                icon: 'info',
                toast: true,
                width: 600,
                position: 'bottom-start',
                title: updateNeedReloadTitle,
                html: updateNeedReloadText
            })
        }
    }
}, 10000)

// "swal-danger-warning.js",

async function showDangerWarning() {
    Swal.fire({
        title: chrome.i18n.getMessage("dangerWarningTitle"),
        icon: 'warning',
        heightAuto: false,
        showCancelButton: true,
        showDenyButton: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        confirmButtonText: chrome.i18n.getMessage("dangerWarningConfirmButtonText"),
        cancelButtonText: chrome.i18n.getMessage("dangerWarningCancelButtonText"),
        denyButtonText: chrome.i18n.getMessage("dangerWarningDenyButtonText"),
        html: chrome.i18n.getMessage("dangerWarningHtmlContent"),
        reverseButtons: true,
    }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
            // nothing
        } else if (result.isDenied) {
            chrome.storage.sync.set({risky: false}, () => {
                location.reload()
            })
        } else if (result.isDismissed) {
            chrome.storage.sync.set({lastShowedDangerWarning: +new Date()})
        }
    })
}

// "hotkeys.js",

function hotkeys(e: KeyboardEvent) {
    if ((e.target instanceof HTMLElement && e.target.className === "emojionearea-editor") || (e.target instanceof HTMLElement && e.target.id === "mapid") || $(".swal2-popup").length > 0)
        return

    switch (e.key) {
        case "ArrowLeft":
            if (document.getElementById("report-popup")?.style.display === "block") {
                let cancelReportButton: HTMLElement = document.getElementsByClassName('btn')[0] as HTMLElement;
                cancelReportButton.click()
            } else {
                if (e.shiftKey && !local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
                    syncBlackList()

                let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                startButton.click()
            }
            break;

        case "ArrowUp":
            let stopButton: HTMLElement = document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement;
            stopButton.click()
            break;

        case "ArrowDown":
            if (document.getElementsByClassName("message-report-link tr").length !== 0) {
                let openReportButton: HTMLElement = document.getElementsByClassName("message-report-link tr")[0] as HTMLElement;
                openReportButton.click()
            }
            break;

        case "ArrowRight":
            if (document.getElementById("report-popup")?.style.display === "block") {
                let submitReportButton: HTMLElement = document.getElementsByClassName("btn btn-main send-report")[1] as HTMLElement;
                submitReportButton.click()
            }
            break;
    }
}


document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e: any) => { // TODO: any should be KeyboardEvent but TS doesn't like it
    if (e.shiftKey && !local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
        syncBlackList()
})

// "utils.js",
function toObject(from: any, to: any) {
    for (let key in from) {
        let value = from[key]

        if (typeof value === 'object' && value && !Array.isArray(value)) {
            toObject(value, from[key])
            continue
        }

        if (key === "data-tooltip")
            to.setAttribute(key, value)
        else
            to[key] = value
    }
}

function createElement(tagName: string = '', options: any = {}, childs: HTMLElement[] = []): HTMLElement { // TODO: Fix types (options: Partial<HTMLElement> = {} failes with style) rework everything?
    const element = document.createElement(tagName)

    toObject(options, element)

    for (let child of childs)
        element.appendChild(child)

    return element
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function downloadImage(data: string): void {
    let a = document.createElement('a');
    a.href = data;

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;

    a.download = dateTime;
    document.body.appendChild(a);
    a.click();
}

function secondsToHms(d: number): string {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var Display = h > 0 ? h + (h === 1 ? "H, " : "H, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? "H, " : "H, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? "M, " : "M, ") : "";
    var sDisplay = (m === 0 && s === 0) ? "" : (s + "S");
    return hDisplay + mDisplay + sDisplay;
}

function isDevMode(): boolean {
    return !('update_url' in chrome.runtime.getManifest());
}

// "background-listener.js"

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.command) {
            switch (request.command) {
                case "skip": {
                    let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                    startButton.click()
                    sendResponse(200)
                    break;
                }

                case "skip_ban": {
                    if (!local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
                        syncBlackList()

                    let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                    startButton.click()
                    sendResponse(200)
                    break;
                }


                case "stop": {
                    let stopButton: HTMLElement = document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement;
                    stopButton.click()
                    sendResponse(200)
                    break;
                }

                case "screen_remote": {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        downloadImage(dwncanvas.toDataURL('image/jpg'))
                        sendResponse(200)
                    }
                    break;
                }

                case "screen_local": {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        downloadImage(dwncanvas.toDataURL('image/jpg'))
                        sendResponse(200)
                    }
                    break;
                }
            }
        }
        if (request.apiTestCode) {
            if (request.apiTestCode === 200) {
                api = 2

                if (settings.minimalism) {
                    if ($('span[data-tr="rules"]').length === 1) {
                        $("<span> </span>" + chrome.i18n.getMessage("apiStatus2")).appendTo($(".message-bubble")[0])
                    }
                } else {
                    (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + chrome.i18n.getMessage("main")

                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        resizemap(false)
                    }
                }
                console.dir(`ip-api.com test passed: ${request.apiTestCode}`)
            } else {
                api = 0
                console.dir(`ip-api.com test failed: ${request.apiTestResult} ${request.apiTestCode}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + request.apiTestResult)
                if (settings.minimalism) {
                    if ($('span[data-tr="rules"]').length === 1) {
                        $("<span> </span>" + DOMPurify.sanitize('<b>ERROR: ' + request.apiTestResult + ' || </b>' + chrome.i18n.getMessage("apiStatus0"))).appendTo($(".message-bubble")[0])
                    }
                } else {
                    (document.getElementById("apiStatus") as HTMLElement).innerHTML = DOMPurify.sanitize('<b>ERROR: ' + request.apiTestResult + ' || </b>' + chrome.i18n.getMessage("apiStatus0"));
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        resizemap(false)
                    }
                }
            }
        }
        if (request.ipData) {
            console.dir(`ip-api.com returned ${request.apiCode} for ${request.apiQuery}.`)
            if (curIps.includes(request.apiQuery)) {
                if (request.apiCode === 200) {
                    processData(request.ipData, request.apiQuery)
                } else {
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + request.apiCode + "</b>")
                    if (settings.enableTargetCity || settings.enableTargetRegion) {
                        if (request.status === 429) {
                            stopAndStart(5000)
                        }
                    }
                }
            }
        }
    }
);