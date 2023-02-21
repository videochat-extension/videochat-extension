// "sentry.js",
import * as Sentry from "@sentry/browser";
import {ErrorEvent} from "@sentry/types";

require('arrive')
require('tooltipster')
import * as faceapi from 'face-api.js';
import * as L from 'leaflet'
import * as DOMPurify from 'dompurify';
import Swal from 'sweetalert2'
import $ from "jquery";

import {showSwalChangelog} from "./swal-changelog"
import {showSwalInfo} from "./swal-info"
import * as utils from "./utils"
import "./swal-context-invalidated"

utils.addStyle(` .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-tile-container, .leaflet-pane > svg, .leaflet-pane > canvas, .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer {position: absolute;left: 0;top: 0;}.leaflet-container {overflow: hidden;}.leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow {-webkit-user-select: none;-moz-user-select: none;user-select: none;-webkit-user-drag: none;}.leaflet-tile::selection {background: transparent;}.leaflet-safari .leaflet-tile {image-rendering: -webkit-optimize-contrast;}.leaflet-safari .leaflet-tile-container {width: 1600px;height: 1600px;-webkit-transform-origin: 0 0;}.leaflet-marker-icon, .leaflet-marker-shadow {display: block;}.leaflet-container .leaflet-overlay-pane svg {max-width: none !important;max-height: none !important;}.leaflet-container .leaflet-marker-pane img, .leaflet-container .leaflet-shadow-pane img, .leaflet-container .leaflet-tile-pane img, .leaflet-container img.leaflet-image-layer, .leaflet-container .leaflet-tile {max-width: none !important;max-height: none !important;width: auto;padding: 0;}.leaflet-container.leaflet-touch-zoom {-ms-touch-action: pan-x pan-y;touch-action: pan-x pan-y;}.leaflet-container.leaflet-touch-drag {-ms-touch-action: pinch-zoom;touch-action: none;touch-action: pinch-zoom;}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {-ms-touch-action: none;touch-action: none;}.leaflet-container {-webkit-tap-highlight-color: transparent;}.leaflet-container a {-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);}.leaflet-tile {filter: inherit;visibility: hidden;}.leaflet-tile-loaded {visibility: inherit;}.leaflet-zoom-box {width: 0;height: 0;-moz-box-sizing: border-box;box-sizing: border-box;z-index: 800;}.leaflet-overlay-pane svg {-moz-user-select: none;}.leaflet-pane {z-index: 400;}.leaflet-tile-pane {z-index: 200;}.leaflet-overlay-pane {z-index: 400;}.leaflet-shadow-pane {z-index: 500;}.leaflet-marker-pane {z-index: 600;}.leaflet-tooltip-pane {z-index: 650;}.leaflet-popup-pane {z-index: 700;}.leaflet-map-pane canvas {z-index: 100;}.leaflet-map-pane svg {z-index: 200;}.leaflet-vml-shape {width: 1px;height: 1px;}.lvml {behavior: url(#default#VML);display: inline-block;position: absolute;}.leaflet-control {position: relative;z-index: 800;pointer-events: visiblePainted;pointer-events: auto;}.leaflet-top, .leaflet-bottom {position: absolute;z-index: 1000;pointer-events: none;}.leaflet-top {top: 0;}.leaflet-right {right: 0;}.leaflet-bottom {bottom: 0;}.leaflet-left {left: 0;}.leaflet-control {float: left;clear: both;}.leaflet-right .leaflet-control {float: right;}.leaflet-top .leaflet-control {margin-top: 10px;}.leaflet-bottom .leaflet-control {margin-bottom: 10px;}.leaflet-left .leaflet-control {margin-left: 10px;}.leaflet-right .leaflet-control {margin-right: 10px;}.leaflet-fade-anim .leaflet-popup {opacity: 0;-webkit-transition: opacity 0.2s linear;-moz-transition: opacity 0.2s linear;transition: opacity 0.2s linear;}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {opacity: 1;}.leaflet-zoom-animated {-webkit-transform-origin: 0 0;-ms-transform-origin: 0 0;transform-origin: 0 0;}svg.leaflet-zoom-animated {will-change: transform;}.leaflet-zoom-anim .leaflet-zoom-animated {-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition: -moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition: transform 0.25s cubic-bezier(0,0,0.25,1);}.leaflet-zoom-anim .leaflet-tile, .leaflet-pan-anim .leaflet-tile {-webkit-transition: none;-moz-transition: none;transition: none;}.leaflet-zoom-anim .leaflet-zoom-hide {visibility: hidden;}.leaflet-interactive {cursor: pointer;}.leaflet-grab {cursor: -webkit-grab;cursor: -moz-grab;cursor: grab;}.leaflet-crosshair, .leaflet-crosshair .leaflet-interactive {cursor: crosshair;}.leaflet-popup-pane, .leaflet-control {cursor: auto;}.leaflet-dragging .leaflet-grab, .leaflet-dragging .leaflet-grab .leaflet-interactive, .leaflet-dragging .leaflet-marker-draggable {cursor: move;cursor: -webkit-grabbing;cursor: -moz-grabbing;cursor: grabbing;}.leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-image-layer, .leaflet-pane > svg path, .leaflet-tile-container {pointer-events: none;}.leaflet-marker-icon.leaflet-interactive, .leaflet-image-layer.leaflet-interactive, .leaflet-pane > svg path.leaflet-interactive, svg.leaflet-image-layer.leaflet-interactive path {pointer-events: visiblePainted;pointer-events: auto;}.leaflet-container {background: #ddd;outline-offset: 1px;}.leaflet-container a {color: #0078A8;}.leaflet-zoom-box {border: 2px dotted #38f;background: rgba(255,255,255,0.5);}.leaflet-container {font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;font-size: 12px;font-size: 0.75rem;line-height: 1.5;}.leaflet-bar {box-shadow: 0 1px 5px rgba(0,0,0,0.65);border-radius: 4px;}.leaflet-bar a {background-color: #fff;border-bottom: 1px solid #ccc;width: 26px;height: 26px;line-height: 26px;display: block;text-align: center;text-decoration: none;color: black;}.leaflet-bar a, .leaflet-control-layers-toggle {background-position: 50% 50%;background-repeat: no-repeat;display: block;}.leaflet-bar a:hover, .leaflet-bar a:focus {background-color: #f4f4f4;}.leaflet-bar a:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}.leaflet-bar a:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-bottom: none;}.leaflet-bar a.leaflet-disabled {cursor: default;background-color: #f4f4f4;color: #bbb;}.leaflet-touch .leaflet-bar a {width: 30px;height: 30px;line-height: 30px;}.leaflet-touch .leaflet-bar a:first-child {border-top-left-radius: 2px;border-top-right-radius: 2px;}.leaflet-touch .leaflet-bar a:last-child {border-bottom-left-radius: 2px;border-bottom-right-radius: 2px;}.leaflet-control-zoom-in, .leaflet-control-zoom-out {font: bold 18px 'Lucida Console', Monaco, monospace;text-indent: 1px;}.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out {font-size: 22px;}.leaflet-control-layers {box-shadow: 0 1px 5px rgba(0,0,0,0.4);background: #fff;border-radius: 5px;}.leaflet-control-layers-toggle {background-image: url(images/layers.png);width: 36px;height: 36px;}.leaflet-retina .leaflet-control-layers-toggle {background-image: url(images/layers-2x.png);background-size: 26px 26px;}.leaflet-touch .leaflet-control-layers-toggle {width: 44px;height: 44px;}.leaflet-control-layers .leaflet-control-layers-list, .leaflet-control-layers-expanded .leaflet-control-layers-toggle {display: none;}.leaflet-control-layers-expanded .leaflet-control-layers-list {display: block;position: relative;}.leaflet-control-layers-expanded {padding: 6px 10px 6px 6px;color: #333;background: #fff;}.leaflet-control-layers-scrollbar {overflow-y: scroll;overflow-x: hidden;padding-right: 5px;}.leaflet-control-layers-selector {margin-top: 2px;position: relative;top: 1px;}.leaflet-control-layers label {display: block;font-size: 13px;font-size: 1.08333em;}.leaflet-control-layers-separator {height: 0;border-top: 1px solid #ddd;margin: 5px -10px 5px -6px;}.leaflet-default-icon-path {background-image: url(images/marker-icon.png);}.leaflet-container .leaflet-control-attribution {background: #fff;background: rgba(255, 255, 255, 0.8);margin: 0;}.leaflet-control-attribution, .leaflet-control-scale-line {padding: 0 5px;color: #333;line-height: 1.4;}.leaflet-control-attribution a {text-decoration: none;}.leaflet-control-attribution a:hover, .leaflet-control-attribution a:focus {text-decoration: underline;}.leaflet-attribution-flag {display: inline !important;vertical-align: baseline !important;width: 1em;height: 0.6669em;}.leaflet-left .leaflet-control-scale {margin-left: 5px;}.leaflet-bottom .leaflet-control-scale {margin-bottom: 5px;}.leaflet-control-scale-line {border: 2px solid #777;border-top: none;line-height: 1.1;padding: 2px 5px 1px;white-space: nowrap;-moz-box-sizing: border-box;box-sizing: border-box;background: rgba(255, 255, 255, 0.8);text-shadow: 1px 1px #fff;}.leaflet-control-scale-line:not(:first-child) {border-top: 2px solid #777;border-bottom: none;margin-top: -2px;}.leaflet-control-scale-line:not(:first-child):not(:last-child) {border-bottom: 2px solid #777;}.leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {box-shadow: none;}.leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {border: 2px solid rgba(0,0,0,0.2);background-clip: padding-box;}.leaflet-popup {position: absolute;text-align: center;margin-bottom: 20px;}.leaflet-popup-content-wrapper {padding: 1px;text-align: left;border-radius: 12px;}.leaflet-popup-content {margin: 13px 24px 13px 20px;line-height: 1.3;font-size: 13px;font-size: 1.08333em;min-height: 1px;}.leaflet-popup-content p {margin: 17px 0;margin: 1.3em 0;}.leaflet-popup-tip-container {width: 40px;height: 20px;position: absolute;left: 50%;margin-top: -1px;margin-left: -20px;overflow: hidden;pointer-events: none;}.leaflet-popup-tip {width: 17px;height: 17px;padding: 1px;margin: -10px auto 0;pointer-events: auto;-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);transform: rotate(45deg);}.leaflet-popup-content-wrapper, .leaflet-popup-tip {background: white;color: #333;box-shadow: 0 3px 14px rgba(0,0,0,0.4);}.leaflet-container a.leaflet-popup-close-button {position: absolute;top: 0;right: 0;border: none;text-align: center;width: 24px;height: 24px;font: 16px/24px Tahoma, Verdana, sans-serif;color: #757575;text-decoration: none;background: transparent;}.leaflet-container a.leaflet-popup-close-button:hover, .leaflet-container a.leaflet-popup-close-button:focus {color: #585858;}.leaflet-popup-scrolled {overflow: auto;}.leaflet-oldie .leaflet-popup-content-wrapper {-ms-zoom: 1;}.leaflet-oldie .leaflet-popup-tip {width: 24px;margin: 0 auto;-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);}.leaflet-oldie .leaflet-control-zoom, .leaflet-oldie .leaflet-control-layers, .leaflet-oldie .leaflet-popup-content-wrapper, .leaflet-oldie .leaflet-popup-tip {border: 1px solid #999;}.leaflet-div-icon {background: #fff;border: 1px solid #666;}.leaflet-tooltip {position: absolute;padding: 6px;background-color: #fff;border: 1px solid #fff;border-radius: 3px;color: #222;white-space: nowrap;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;pointer-events: none;box-shadow: 0 1px 3px rgba(0,0,0,0.4);}.leaflet-tooltip.leaflet-interactive {cursor: pointer;pointer-events: auto;}.leaflet-tooltip-top:before, .leaflet-tooltip-bottom:before, .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {position: absolute;pointer-events: none;border: 6px solid transparent;background: transparent;content: "";}.leaflet-tooltip-bottom {margin-top: 6px;}.leaflet-tooltip-top {margin-top: -6px;}.leaflet-tooltip-bottom:before, .leaflet-tooltip-top:before {left: 50%;margin-left: -6px;}.leaflet-tooltip-top:before {bottom: 0;margin-bottom: -12px;border-top-color: #fff;}.leaflet-tooltip-bottom:before {top: 0;margin-top: -12px;margin-left: -6px;border-bottom-color: #fff;}.leaflet-tooltip-left {margin-left: -6px;}.leaflet-tooltip-right {margin-left: 6px;}.leaflet-tooltip-left:before, .leaflet-tooltip-right:before {top: 50%;margin-top: -6px;}.leaflet-tooltip-left:before {right: 0;margin-right: -12px;border-left-color: #fff;}.leaflet-tooltip-right:before {left: 0;margin-left: -12px;border-right-color: #fff;}@media print {.leaflet-control {-webkit-print-color-adjust: exact;print-color-adjust: exact;}}`)

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
    return utils.createElement('style', {
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
    return utils.createElement('ul', {
        className: "tabs__caption"
    }, [utils.createElement('li', {
        className: "active", innerText: chrome.i18n.getMessage("tab1"),
    }), utils.createElement('li', {
        id: "mapTabButton",
        innerText: chrome.i18n.getMessage("tab2")
    }), utils.createElement('li', {
        innerText: chrome.i18n.getMessage("tabBans")
    }), utils.createElement('li', {
        innerText: chrome.i18n.getMessage("tabStats")
    }), utils.createElement('li', {
        innerText: chrome.i18n.getMessage("tab3")
    }), utils.createElement('li', {
        innerText: chrome.i18n.getMessage("tab4")
    })])
}

function createControls() {
    return utils.createElement('div', {
        className: 'chat', id: 'controls', style: "width:390px; margin-right: calc(100vh / 768 * 10);"
    }, [utils.createElement('div', {
        className: "tabs chat"
    }, [createStyle(), utils.createElement('p', {
        id: "remoteIP", style: "display: none;"
    }), utils.createElement('div', {
        id: "remoteIPInfo", style: "display: none;"
    }), utils.createElement('div', {
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
    return utils.createElement('center', {
        style: "user-select:none"
    }, [
        utils.createElement('div', {
            style: "position:absolute; left:0;top:0",
        }, [
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_remote"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: "color: green; height:15px",
                title: "pip remote",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("remote-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("remote-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
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
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
        utils.createElement('a', {
            target: "_blank",
            style: (() => {
                if (settings.darkMode)
                    return "text-decoration: none!important; color: #E8E6E3;"
                else
                    return "text-decoration: none!important; color: #000000;"
            })(),
            href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
        }, [
            utils.createElement('b', {
                innerText: chrome.i18n.getMessage("extension_name").replace(" (ome.tv) ", " ") + " v" + chrome.runtime.getManifest().version.substring(0, 3),
                id: "connectionStatus",
            })
        ]),
        utils.createElement('div', {
            style: "position:absolute; right:0; top:0",
        }, [
            utils.createElement('button', {
                style: "color: green; height:15px",
                title: "pip local",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("local-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("local-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_local"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
    ])
}

// "controls/tab-about.js",
function createTabAbout() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "aboutPanel",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
                id: "aboutInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                utils.createElement('span', {
                    innerHTML: chrome.i18n.getMessage("desc"),
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {}, [
                    utils.createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-right: 3px",
                        href: "https://discord.gg/YZKnbKGWen"
                    }, [
                        utils.createElement('img', {
                            src: chrome.i18n.getMessage("discordBadge"),
                        }),
                    ]),
                    utils.createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important;",
                        href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
                    }, [
                        utils.createElement('img', {
                            src: "https://img.shields.io/chrome-web-store/users/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20users&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAW80lEQVR42u1deZAc1X3%2Bfj2zh6Rdg5B2V6t7zSlVYhuE%2FwjgQiATkhgMhBhcJlRSDuVUyoFQhjihTBUJTnAqOKbAiZ04NoQQsMuADSQOlihRgDh8CRSDkLhWq2NXQqx2de1qd7rf%2B%2BWPd3bPzB4zPbOzUr%2Farpnp7unued%2F3%2B37He91LzIysnbgtyLogI0DWMgJkLSNA1jICZC0jQNYyAmQtI0DWMgJkLSNA1jICZO14b%2Fmp7khEDXfxewYGbnrpxZfutSuKhjW8FWUuf9ojIYkvnHfe%2BX%2BxfNmS%2Bxqtb6Y6xjNrFWDPwMBNUsh7J6FtFUhPfkgAkFLcu2t3%2F02ZC2gE8GdIpGYzCYLj0%2FIrNugqSCBnJQmC4x%2F8GriBMsGBIsGemzIC1AT8vVMDvx5ugCZTgtlDgllBgD39e1OV%2FVqzYzaRIJgV4MvZAn5CCfY0PgloqvniTNUBdu3u54mc%2BPJlS2e0QNG3c1eJYoNbtXLF8hm5vuO0DkDI2gnmAijDPAsCZ0%2FjjABZywiQtYwAWcsIkLXZkVdNNV8c2LuXq8053f7lgiaaZP8pBFpU6jtT%2BB5Pb0P5n0wVfKf0uabWqxzrOXOOnpUrKFOAEzCqr7sLyG4uzmKArJ2oBFDWn0lAo7ibStQ4qDf4J6rLaNTfna%2F8h3DKjM%2BK%2Fg1NgJl6lEwlp505a5t9JA4aHcwTLS2r9y8NGuPnUY0NkDNezTQBsnrBCUyAiUu51KCk4Tp%2F7wSIAarrHK6AbJmazTgBJk4bU7R%2BOj4s8rgiwMQgUurWP7OKXQ2Zq3M31YTQ%2BfoAzykSJws00%2Fzt%2BdpeCNfH%2Bqk2ljVjMUYdiZOvv9XTcWzFs%2B%2Fi8%2BkBXr3VV%2BQ6qAriZPHhdMYCqulNmkXWWMn3ZiIAbAgXwBV3zGy0%2FsZyT5yKaeVr02NUZcfyDFn%2FzJ%2BzIi7zjClA9TJfMfhUC6vkuv3uWRgEpv9DawM%2B1wRnnvUuo3SbsUmh6cv%2BbEz%2FeDYpQK2An2ZH1Mz6Z17%2BeZp70mxTgBkHP%2FWax8zLf7Xnyc%2FsRXJ9jS1xOu7tBQignp4TUv5rTgBOS25p%2BirCWzYD72wHDx1A8P6AkjsenxKnImoGQOCuxeD5HaDTzwJ99GMNJf%2Bp5W5Tne27p3%2BAqwO9tuDzjj7ITRsR7N4BGj%2BCIKAJny8zEXwsGcwCJABmqWZES0C2nQJe2QP6xMWg5T2o%2FCbQ4n6oxP9PdJ6p3hxaNQGm7oMqYO4k4HNfH%2BSGp0C9b4Eg1ZPMAgIFAUABKEBZEtCE4EuQfoX3CslgCUAKyFwz%2BIzfQHDp74GWr6zaCBqeALv3DHCtxW2q4Iv1TwObNgIjwwhyBKYAAREQBArwgEBEYCKQfu8TgcowmSUAA7qUmhBCb1MqYEkhGMRSEWb%2BQtDaSxB88tIaW%2F%2BsIUCVfqoM%2BNGPfwhsehYojINyDuggAJgCrQCB%2Br52AQQCBwRCoK6LyDs8A0xgSBBDAQtt6cyAlAA88CWDpHEJmiSGHCyBlrngiy9F7oqray7%2FaDwCpBCcUGn3Ej3zU%2BC%2FHwcKYwrAIFDWnSMQARQE2uIBMr6fNBGgPweApkPshApwfTJmtZWN9StisLZ8EuzAt0qhv2fcBDO4tQ3BVdcgWHfJjMh%2FjQjQX9u8pYTVyzdeh3joAWBwL4gCZdXGsgMt%2FYEiARupD0hjThp8z%2FKTD%2B%2FQnxXs5CyeWe0n1S1xyuq1AmjZd5bvqQUbpdDvFy9F7vobQKtX11X%2BZxcByln9v38b%2FOJzaruWdguwRwLj30lbuXIFsIrgyFAmINQnZKk7l40YaLC1a3BAJ8F3lu%2FHCNaNCAatuxT5G76QmvXjuCBAGSzk7l2I7r4LGBrUkTx5JHBWThQ4aTdBXiwAVCdxmOv35D96mGIdqfqCtexbJniAe9ZtCMETgO%2BrQWc38rfdhmDx0ppbf2MToLwRInryCYjHfgBEhZi1K%2Fl3%2Ftx%2B1ioAxInAIKX80AFfQOokBLCfDRipB3n%2B36zzLR6etWuXYYH3APeUIQa%2B0AA2NSO47jrkL%2Ft0xcWftAlQn8EgmrxoFN77DYhNzzsLDgCSxlAliPU6mEhdh3QcAMRqO7FWAoBZbyfty60auJNKNpcmXSpoNvgkMIAirgomRoDNBmBJYRRAHVpHkmNjkN%2F9LsIdfWi68aaKujHtMYZ8PQEvl9cX%2Fv7vIH%2F1CxXFK2VWrwEAAVDAynLZBILab0P7WAo0%2BM7PU6CUIBZcUrFhxW9cYucK2LN8oMgdEHv7SS87sL7MZBNs%2BWW%2Byxs2oHB0BE233TaLxgJSKH0ngedDhzH%2B5VvAe%2FeCjJxLBgIGCwJYq4Gx3kCCBQBpqnyaBgE71ug8nw3aNhVMqGnyM%2BtMgKVLDw3AHnhk3YEv%2FYgpgNlGXoqp3IFHgk2bUOjrQ9PdXwd9qH3KwV%2FarW53BxeBf%2FgIxv7yFsj%2BfttpbNMt%2Fbt9y5IMFibIEmAhVKea9SwBIQEp1XHMItyCSCkGBAMRu21S6P3dK4RQxxISiCQ4YkCoY8J8z782EwsIBul0EbpAZK4zlj1IhuzbifDWW8GHj1RkQHUdDBo%2BeJArtfRSbfT66yF377JBHJn0zgRwscgeLtUjz9I9yUegfL4KAlnvq4lE5ccErNSbmgCzOg67qqC%2FX8ziE%2FGAcxHacg0xvGqie882EKGelWh96MHJK4bTIEBXZ0ftnxTKXHqZrI3dcQdkX1%2B8kmas1NTXPSs2VmssGnoxqsCSlZUKpQzwrJ6lsXhZehFOXcyx7XGi%2BDnc9sR1Cf96tdXb3%2BMBrtfbIFOvl%2B%2F2ovC3X03R%2Bjn9GCAt%2BRm%2F%2B%2BsIn9mordIL%2BowFCngKwACpAJCIrJ9ncnV80gUeNhavzZlMvk9ed1CZqhMnV3nrjaWb7MAG9drHJwNGmVAI3%2Bq9%2FVxxSX2OfrIeaGtH8y03p1dab5g0UP%2BgwpNPofDYj2zBxkTYRCbKV%2BAr2SSvru%2F2Q6Br%2FhpZ9os7JgMgKgadynQqF5OBEZd9lQ7CRf6AHi423%2FOAt4NJKCoiFYHvB4kMhN%2F%2FIYIzTkf%2B8k%2FVxfqnFQMMDR%2BsZGacy7n7BzBy3R8BIyOOAMY3U6KoYwd1XARvC0Nw5V02Eb%2B%2FTzJkpsSbood5x2MAN0KoUz24lI%2FYU4hYHOCBnXyfIEZ8HyTIA1BbG%2BY88h%2Bgxd1VEaCrs5PqTICJNw9eeQ1o50405YJ4ABcL7EoQIRnoee8dG9havdnO2reY3Xmy4opC2%2BOBIwCY4umgB54NDG3BxwNYemQpZfW%2BW%2FEDszNOw5xHHqzQ9U6PAMH0DjzRUr49vvV%2B7BvagTERQQhp0zsbHJk0ScKmdSp1MsGXlw6aICwyAZWboKECMqneRy5dhJAgs0i96M8sBCCFDixdoGfH%2BwXblNNdlwlI9XkleymnDjqNzxfq9%2FlTy9gfWCrR5NvvovCd76FSxZ0OaWpeB9g1uhNPHnsGj%2F3pqWDJGI0iSClVfVyPq5clgl2kB74hjkx0vJ%2F3qxw%2Blj3YWgLbY9j8XHhA%2BQSLvBzeHt%2BvR7hzwiv0WOCF9H4fEhnBxP0Wfud%2BiLfeqXlkVnMC%2FNeuB0EAdpwG9Pa0gpkxEoYQeuy9mAjSI4Ijhg%2ByUwZVoDFpGIQ3GicSxaBIlFhk0X4xsCXr45t0UsZSQmP9lrR%2BmuhZvK3%2BCZ6WeRb%2B6d6K4q2GIcDm4V9h%2B5FtOt8gPH5jj73U0SiEiKSTQxG3eiPJClQkXISXmxvCxIDRlholLb7EYvaLVQY5UVUsBThbslj18CqCEIido5I8Wr76GsRzL1RVbp9RAjy868FYRH7wFIGXLl7gSCC0OzAxQWJ41aqC18nxzvcKMYJjZd%2BSpWDplsn2tf7d9%2BlJ0A3pOE4OTk4UqaIVvnFvzay%2FpnWATYPPY7AwGK%2B9EGHj1R1Y8%2FIQWsfYkmBuLq%2BYaPJ69sZvTCHHjPbZYV29IyVz%2FcQ2b%2FCHAeRPOxVB2zzkuheBuruQ6wohh%2FZCDu2DHBqAPLDPqx%2FbMccEkBx%2FZVaDT0UDHiWy0eRhaLJ1vZDrH0Fw6edqUqybRho4PK3Df%2Bn%2FbowTwCPCOT%2BXuPpb78Q6Z24ur6Z2F12hlw6yN6pH3khf%2FG0s56e2NjRfeAHmXHUFms44Dcg3FdULSM0e0ZnJMUSHtiDc%2F2OEg8%2BAxSFHBDZFK9ajl1Jfm55JZEcj2V6z2qYqk64vOJYBu3oV64kscU7TnC4cXvrapNbvQ7moq7O%2BE0L8k28e%2FiUGxwfjYPmxwccY5y1uQvdAGHMH8%2FJNxcOeZhDGqIAmAQFunJ3cxB7TKbnFizHv5i%2Bi5aK1FvDkq6VLENhzETWjufNCNHddCGag8P4TOPbeXeDxPQg04AGxBVb9sTcJWeoqJnt1LOkRYgLA9bHM7wtyjFwOoGAALWNPY7z1d1Mv1U9ZAQ4MTV0BvrbtTmw%2Fus0r5BTv0%2FNeDjfc%2BWZsXQ6EOfn89Me%2B%2FYphezvab70ZLVdcbieHuk5Xb8YFsP9IZAFhAJ1tLWjJ%2BapDKibRyl7ofwCFHXcC4qAmDWKW7rssIo7NSHcAx9dbEpjalgY8yLEikHc3dNh0HoYXPDEl658RBbAVv%2FEPsP3Im67UW6btWBlh29nzseq1YbtOgHEsiqZPAl2Vazp3DU76138GtbZo4BX4x0LGq%2F1j6BsOsWu4gFAycgTkgsC6W8lH0BQQls9vxlmdrVjV1YLWfGBP0LL082jquAzjW38fPPp6kdXa9yUAj29z%2BwY5Ri4oBrxUayq8jJzYDZFblupAXeoE2PTB81PbMUf4nz9chJ5tB9E6xlWToPWzn0Hb7X%2FtAU8YGhVY%2F%2FYoNvePIR8AOSLk9CsCM6Ln6jcFwdi6bxy%2F3juOSALnLGnF75zVjvlzAjAzgpZOtJ69CeF7N0MOPhCbbETECRUoJkeQYwQBkJsC4KVa89jTODbvCxVX%2FeriAr605c9xIBx09X5gQiW4%2BEeHse7JvcX8mIY7aL32M5h3%2B1%2FFwP%2FJ9lE8%2FdaoAj6AtnhCTt89FpCbaOyX6022KZghJNCcI1x46jx8alWbHQlkZoi%2Bm8GD9%2BtZx14y4sl8tYAnLTyiZRjq2jyh9M%2BoCxgc%2FwCD44M2sJlKe%2Bm3T8LZz%2B%2FHKQdFbP1UlSAJ%2FoFRiX955TAGDkfIBaRm%2Fko9x0AymBS5pDcQmRyplRp8wcDRAuOprUfx5vvj%2BOL58zEnr64mWHGPYtDQ92I%2BPA3Ay4qm2KPdwNJUrD%2FlwSDG5qFfTm7yiTbextj4Bysg%2FYkXCRKU%2B535c9dg7le%2BbD%2FvPBjh9g3D2DkcFQEZSVe%2FiQQjkmoJJdR7b13kJh3Z2s%2B2%2FQV8beMQdh2MLNmw7B7kT74ALa0SrXMFWlolmpql8um1mMVJQPOx%2F23csYBth9%2Bs6HuvfTzAO8uby5NARMV90d6O9m%2B5KtkHIwJf3XgIRwtsi3fCk3JhZoEJNxssFIoMoYhvs%2FNH7awxdYwdwyG%2B%2FcohjBSkPW%2B09GFQ04dqA3ipYHD85dSsP3UCbD9UGQGoNYfnrl2pOpq5iAiCGWMi7iLm%2Fc1XgJZmAMBIgfGPLxzB0YKEN3hnSWCs2gKvl8h7jWQxCRTwHDtW71CIOzYMORXIzUe44B%2Fqgz6rbCDN2cGpEWDnyE6MitHKh41XEzavOUmTQBaRIGRpSZA783Tk111kt%2F3g16PoHYriFu9bsCUBFwHtq4Ejg%2BcK2LkDFSAyeodCfH%2BLm8odtl8PmV9ec%2FBVnekw8uHWxiPArpG%2BKiMcwvpruzDSAqsESTUwJGi54fP2a71DAk9uG4uB7st%2BnAQ%2BuIxQuMVfnySHiwnccR9%2B9SjeP%2BpUqbDgLtSr5QtvNB4BPhj7wE9OKjpGuDiPn52%2FMEaApBrI7i7k1621n%2F%2FtFyNu7kcMcC45CzwssnbPFYji95FHHD82EAw8tPmoiwXmXgEOTqoLAQKxu%2FEIUGkAmGwvXH0yDrQHFvykGrRetNbuu%2B%2BIwJa9Ycwyfen3pTxMSr9wsUCY%2BOy7CSHZKkqUOMdP3x7FviNOBcK26%2BqjADoQrCsByt0EUvKGEK5cB3InNeOZK5cWgW8IMffKy%2B2%2Bj20d86ySJ7j%2Fg4tiAGvlwoHvCJJwByLpRpybebFvzKnAh%2F64Zr7fpNbMSPWWgdQUwGYAKVzcexfOQ293UxH4ghn500%2Bzk0de7Y8S0s9WqkUCMBfoOZ8fekusFiAmuJFIsnUvQgLP9bqHT4r8WTWNAdmmgq80Zh0gZvlVMJXm5PDsdT1F4Defu8buc7TAePuAKJL%2BkhF%2FKZ8u4u4g6RLCskoSdwWb9xTcbCYAovk3ayMAQE1uFgpqc6XVtwMfacbPPtoWcwVoa7Od%2Ffag0JY4FemPAx8DOun7E0Wh0HMHpZRFMPD2YGTHCGoSCPrGlHisTUMqQBEZKpmq1BTg559dgtEmlxY2nXmG3X54XFoAojIRv5N%2BJ%2FHhBBJvXEQUcwnlXAEsAQ%2BPe5XBlgvqUQ5IzRrzqcs%2Fw3sUC8Vm1023iZ5WvHBBBy7ZuB8MhjRTraGszjyfMdCzdHIESCL%2FQWKI3WluB4B4YmPz7gVN3M5nxxj8OaLsT2qtiUtNBICT3aM1jcvIp3qtXGbyYxV18tevWoBzXtmP%2BaPxDmZ7oyZBmLu39GwcRQCKE8B7RZm5KrHb%2FhC%2F8Vfq8yVnhRvpr7W1x55mNvGjrmvlAiYZDUz0Xlpdku9sxfqrliqrg7utalGbepwLq8d4QnKJip8oTv38nL9UIagoFpB%2BpdDtL%2B1dw9L5%2F1qpQML%2FT%2FQY%2FumePp%2F6hfoLJbZXqAT7181H79MDmL%2Bn33Zwd5t%2BLp%2B7qxSknhlun8vkpJ9jKlBOlPw7xX0%2B%2B67AdbSZHCJj4OcKr9dE%2FosfaFWd9KfvAtjdpm%2Bx1gEBV%2BcFELTl8cKfnIrVz%2B6xHb%2BojSCl0I%2BCCWJEMBqv5uprwP0Z5SVIUOIxAUX%2FCNvdGs72IVLMjDVLmpy340M1kX93akr1X%2BZMJwu4b7Ir5tgzdErUA6pQx5GPzMHG6D37ubs9h0XzGFIKSCnAUkCyvotXP5jJ3p%2BngYrd2FMyqvcCO%2B975njwj6vPe8YCiilA0%2FhL6WZTJeS%2F1H9cS6y7rxYE%2BOZEG1edtKrMXeOcSpmAWnJ446pujPT22s4%2BuzsHlhFYRpYEzOZVus8xQvgLe0tim93fkUrq4znSRThnSZM9Rj7annI2TbFg1PSpaD1vMr%2F%2FzdQJ0LFw4bvMeHTS8QBOZCpTTF2mlBaunotXtmywHX7Zma2QIipepFmEtVRpiCFFHFxOkEQ6AllS6eOxdMc36z69aq6z%2FqP%2FmX7wp%2B94UUQoDgJLgP%2Fo4u5F79aqEPQ5ACXHIledvNq6AfhugFNxVbZt6NhqO%2FycJS3omscQIoSUoQY9BGsixAATwpJCAShKLJG1bh9kKRPEEiGkCHHO4iac2dFss4Dmsern63GJ3J%2FZd7GEaM555dLP3Rqj2lQCOzsWRgA%2BDODRIoVo7Ug8DMkD3z5jr3rDOLRgBH27HQlu%2BcTJCpAotMAI6d478MK49ZrtIorva7eVUBXhnUOE%2BLPfOtleR%2FP4c8hVO06f8P1sH2TtWb8EZH5pKUt6FMCHF3cvimpaCu7sWBh1diy8BsDpfrCxon2FfSYyyxLBYIoq8PjIU7bj1546D2d35yFEASIqQESODMIDzAdaxABOvg8T%2B8VfhShAihBre%2Bbg48uU%2FEsp0Xr0npr5frb%2FtUSRQLas9o3pPgCnL%2B5edM10wVdZC8%2Fm%2F9mbtcYaDMpaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWoO0%2Fwchgys9ixzDyQAAAABJRU5ErkJggg%3D%3D&amp;style=plastic"
                        }),
                    ]),
                ]),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerHTML: chrome.i18n.getMessage("github"),
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('dl', {},
                    [
                        utils.createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("author")
                        }),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/qrlk",
                                innerText: "qrlk",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("inspired"),
                        }),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/fippo/rtcstats",
                                innerText: "rtcstats",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("libs")
                        }),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://jquery.com/",
                                innerText: "jquery",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/justadudewhohacks/face-api.js",
                                innerText: "face-api.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/uzairfarooq/arrive",
                                innerText: "arrive.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/Leaflet/Leaflet",
                                innerText: "leaflet",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/calebjacob/tooltipster",
                                innerText: "tooltipster",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/sweetalert2/sweetalert2",
                                innerText: "sweetalert2",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/cure53/DOMPurify",
                                innerText: "DOMPurify",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dt', {
                            innerHTML: "<b>Css:</b>"
                        }),

                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://darkreader.org/",
                                innerText: "dark reader",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),

                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://github.com/alterebro/css-tooltip",
                                innerText: "css-tooltip",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("3rdparty")
                        }),

                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://ip-api.com/",
                                innerText: "ip-api",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        utils.createElement('dd', {}, [
                            utils.createElement('a', {
                                href: "https://carto.com",
                                innerText: "carto",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ])
                    ]),
                utils.createElement('br'),
                utils.createElement('button', {
                    onclick: () => {
                        showSwalChangelog(settings.lastVersion)
                    },
                }, [
                    utils.createElement('b', {
                        innerText: chrome.i18n.getMessage("changelogButtonText")
                    })
                ]),
                utils.createElement('br'),
                utils.createElement('button', {
                    onclick: () => {
                        showSwalInfo()
                    },
                }, [
                    utils.createElement('b', {
                        innerText: chrome.i18n.getMessage("welcomeButtonText")
                    })
                ]),
            ]
        )
    ])
}

// "controls/tab-api.js",
function createTabApi() {
    return utils.createElement('div', {
        className: "tabs__content active row",
        id: "apiInfoContent",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
            id: "remoteFace",
        }),
        utils.createElement('div', {
            id: "streamerStatus",
            // style: "display: none;"
        }),
        utils.createElement('div', {
            id: "apiStatus",
            style: "margin-top: 3px"
        }),
        utils.createElement('div', {
            id: "remoteInfo",
            style: "overflow-y: auto;margin-top: 3px"
        })
    ])
}

// "controls/tab-bans.js",
function createTabBans() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "bansPanel",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
                id: "bansInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("bannedips")
                }),
                utils.createElement('span', {
                    id: 'stBnCt'
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("goodips")
                }),
                utils.createElement('span', {
                    id: 'stNwIp'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("badips")
                }),
                utils.createElement('span', {
                    id: 'stBnIp'
                }),
            ]
        )
    ])
}

// "controls/tab-map.js",
function createTabMap() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "faceapiContent",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
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
    return utils.createElement('div', {
        className: "tabs__content",
        id: "settingsPanel",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
                id: "settingsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                utils.createElement('dl', {},
                    [
                        createSettingsInterface(),
                        utils.createElement('br'),

                        createSettingsAutomation(),
                        utils.createElement('br'),

                        createSettingsGeolocation(),
                        utils.createElement('br'),

                        createSettingsFaceapi(),
                        utils.createElement('br'),

                        createSettingsBlacklist(),
                        utils.createElement('br'),

                        createSettingsHotkeys(),
                        utils.createElement('br'),

                        createSettingsStreamer(),
                        utils.createElement('br'),

                        createSettingsMisc(),
                        utils.createElement('br'),

                        createSettingsStats()
                    ]
                ),
            ])
    ])
}

// "controls/tab-settings-automation.js",
function createSettingsAutomation() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage('settingsAutomation')
        }),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipfour"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipFour")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoresume"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoresume")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipwrongcountry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskipWrongCountry")
                }),
                utils.createElement('input', {
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
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsBlacklist")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskip"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskip")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("donotbanmobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipDonotbanmobile")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("ban_sound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipSound")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('button', {
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
                utils.createElement('b', {
                    innerText: chrome.i18n.getMessage("clearblacklist")
                })
            ])
        ])
    ])
}

// "controls/tab-settings-faceapi.js",
function createSettingsFaceapi() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("genderRecognition")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("forcedApi"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipForcedRecognition")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_males"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipMales")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_females"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipFemales")
                }),
                utils.createElement('input', {
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
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsGeolocation"),
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("apiLocalisation"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipApiLocalisation")
                }),
                utils.createElement('input', {
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

        utils.createElement('br'),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideMobile")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showCT"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowCT")
                }),
                utils.createElement('input', {
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

        utils.createElement('br'),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showMoreInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowMoreInfo")
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showISP"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowISP")
                }),
                utils.createElement('input', {
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
        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetCity"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetCity")
                }),
                utils.createElement('input', {
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
        utils.createElement('div', {
            id: "targetCityDiv",
            style: function f() {
                if (settings.enableTargetCity) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('dd', {}, [
                utils.createElement('button', {
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
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetCity") + settings.targetCity
                        })
                    ]),
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetRegion"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetRegion")
                }),
                utils.createElement('input', {
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
        utils.createElement('div', {
            id: "targetRegionDiv",
            style: function f() {
                if (settings.enableTargetRegion) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('dd', {}, [
                utils.createElement('button', {
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
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetRegion") + settings.targetRegion
                        })
                    ]),
            ]),
        ]),
        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSkipMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSkipMobile")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSound")
                }),
                utils.createElement('input', {
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

        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsEnable"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsEnable")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsInfo")
                }),
                utils.createElement('input', {
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
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsHotkeys")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("b", {
                    innerText: chrome.i18n.getMessage("enablehotkeys"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipEnableHotkeys")
                }),
                utils.createElement('input', {
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
        utils.createElement('br'),
        utils.createElement('span', {
            innerHTML: chrome.i18n.getMessage("hotkeys")
        }),
    ])
}


// "controls/tab-settings-interface.js",
function createSettingsInterface() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsInterface")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideLogo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideLogo"),
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideHeader"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideHeader"),
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("watermark"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipWatermark"),
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("banner"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipBanner')
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotReflect'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotReflect')
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotCover'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotCover')
                }),
                utils.createElement('input', {
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


        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('hideCamera'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltiphideCamera')
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('darkMode'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDarkMode')
                }),
                utils.createElement('input', {
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

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('expand'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipExpand')
                }),
                utils.createElement('input', {
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
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage('settingsMisc')
        }),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("sentry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSentry")
                }),
                utils.createElement('input', {
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
        utils.createElement('dd', {}, [
            utils.createElement('button', {
                onclick: () => {
                    switchMode()
                },
            }, [
                utils.createElement('b', {
                    innerText: chrome.i18n.getMessage("switchModeButtonText")
                })
            ])
        ])
    ])
}

// "controls/tab-settings-risky.js",

// "controls/tab-settings-stats.js",
function createSettingsStats() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            style: "margin-top: 2px",
            innerHTML: chrome.i18n.getMessage("settingsStats")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('button', {
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
                utils.createElement('b', {
                    innerText: chrome.i18n.getMessage("clearStats")
                })
            ]),
        ])
    ])
}

// "controls/tab-settings-streamer.js",
function createSettingsStreamer() {
    return utils.createElement('div', {}, [

        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsExperiments")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("b", {
                    innerText: chrome.i18n.getMessage("streamerMode"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipStreamerMode")
                }),
                utils.createElement('input', {
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
        utils.createElement('div', {
            id: "streamerList",
            style: function f() {
                if (settings.streamer) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('br'),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerHotkeys"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerHotkeys")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('span', {
                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
            }),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerPip"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerPip")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('br'),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurOnStart"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurOnStart")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurReport"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurReport")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("remoteBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipRemoteBlurStrength")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurPreviews"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurPreviews")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("previewBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPreviewBlurStrength")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('br'),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurCoverLocal"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurCoverLocal")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('br'),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverBlur"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverBlur")
                    }),
                    utils.createElement('input', {
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
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverPreview"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverPreview")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverNoise"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverNoise")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverStop"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverStop")
                    }),
                    utils.createElement('input', {
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

            utils.createElement('dd', {}, [
                utils.createElement('button', {
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
                    utils.createElement('b', {
                        innerText: chrome.i18n.getMessage("coverSrc")
                    })
                ]),
            ]),
        ])
    ])
}

// "controls/tab-stats.js",
function createTabStats() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "statsPanel",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
                id: "statsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsWhole")
                }),
                utils.createElement('span', {
                    id: 'stWhole'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsTimeSpent")
                }),
                utils.createElement('span', {
                    id: 'stTime'
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMaleSkip")
                }),
                utils.createElement('span', {
                    id: 'stMlSk'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFemaleSkip")
                }),
                utils.createElement('span', {
                    id: 'stFmlSk'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsManualSkip")
                }),
                utils.createElement('span', {
                    id: 'stMnSk'
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMlCount")
                }),
                utils.createElement('span', {
                    id: 'stMlCnt'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFmlCount")
                }),
                utils.createElement('span', {
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

    (document.getElementById("stTime") as HTMLElement).innerText = utils.secondsToHms(settings.stats.time)
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
    let newIpDiv = utils.createElement('div')
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
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(+new Date() / 1000 - startDate) + "</sup>"

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
        newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(+new Date() / 1000 - startDate) + "</sup>"
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
        $(utils.createElement('button', {
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

        let switchModeButton = utils.createElement('button', {
            onclick: () => {
                switchMode()
            },
        }, [
            utils.createElement('b', {
                innerText: chrome.i18n.getMessage("switchModeButtonText")
            })
        ])

        if (settings.askForMode) {
            switchMode()
            return
        } else {
            if (settings.minimalism) {
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
                        el.innerText = utils.secondsToHms(+new Date() / 1000 - startDate)
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
                $(utils.createElement('img', {
                    src: settings.coverSrc,
                    id: "cover",
                    style: "height:100%; position: absolute; display:none"
                })).insertBefore("#remote-video")

                $(utils.createElement('img', {
                    src: settings.coverSrc,
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
            }
        }

        chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
    })
});
// "swal-info.js",


// "swal-changelog.js",



// showSwalChangelog('0.0')
// "swal-context-invalidated.js",
// ugly way to notify user that extension was updated and page needs to be reloaded
// "swal-danger-warning.js",

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
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
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
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
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