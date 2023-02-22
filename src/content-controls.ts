import * as utils from "./utils";
import $ from "jquery";
import * as L from "leaflet";
import {createHeader} from "./content-controls-header";
import {createTabMap} from "./content-controls-tab-map";
import {createTabApi} from "./content-controls-tab-api";
import {createTabBans} from "./content-controls-tab-bans";
import {createTabStats} from "./content-controls-tab-stats";
import {createTabSettings} from "./content-controls-tab-settings";
import {createTabAbout} from "./content-controls-tab-about";
import {updateMap} from "./content";

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

export function injectInterface() {
    globalThis.controls = createControls();
    ($(".gender-selector")[0] as HTMLElement).parentElement!.remove()

    $(globalThis.controls).insertBefore(".chat");

    $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

        updateMap(globalThis.curInfo)

        if (this.innerText === chrome.i18n.getMessage("tab3")) {
            resizemap(true)
        } else {
            resizemap(false)
        }
    });

    $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

    L.Icon.Default.imagePath = chrome.runtime.getURL('libs/js/leaflet/');

    if (globalThis.language === "ru") {
        globalThis.map = L.map('mapid', {attributionControl: false, zoomControl: false}).setView([54.39554, 39.266102], 17);
    } else {
        globalThis.map = L.map('mapid', {attributionControl: false, zoomControl: false}).setView([47.75409, 12.832031], 3);
    }

    globalThis.map.locate({setView: true});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        minZoom: 3, maxZoom: 18
    }).addTo(globalThis.map);


    var male = new Audio(chrome.runtime.getURL('resources/audio/male.mp3'))
    var ban = new Audio(chrome.runtime.getURL('resources/audio/ban.mp3'))
    var targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))

    male.volume = 0.3
    ban.volume = 0.45
    targetSound.volume = 0.5
}

let videoContainerHeight = 0, chatContainerHeight = 0

// TODO: FIX IT ON OME.TV: GO SETTINGS -> resize window -> GO OTHER TAB -> size wont change
export function resizemap(extend: boolean) {
    if (extend && globalThis.settings.expand) {
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
    globalThis.map.invalidateSize()
}

export function outputsize() {
    videoContainerHeight = 0
    chatContainerHeight = 0

    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
        resizemap(true)
    } else {
        resizemap(false)
    }

    clearTimeout(globalThis.resize)
    globalThis.resize = setTimeout(() => {
        // let controls = (document.getElementById("controls") as HTMLElement)
        // let buttons = (document.getElementById("buttons") as HTMLElement)
        // let chat = (document.getElementById("chat") as HTMLElement)

        let mar = parseInt(window.getComputedStyle(globalThis.controls).marginRight)
        globalThis.buttons.style.width = (parseInt(globalThis.buttons.style.width) - (parseInt(globalThis.controls.style.width) + mar) / 2) + "px"
        globalThis.chat.style.width = (parseInt(globalThis.chat.style.width) - (parseInt(globalThis.controls.style.width) + mar) / 2) + "px"
        // resize = false // TODO: I COMMENTED IT OUT
        if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
            resizemap(true)
        } else {
            resizemap(false)
        }
    }, 500)
}