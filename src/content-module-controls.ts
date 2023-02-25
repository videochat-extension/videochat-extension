import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";
import $ from "jquery";
import {createHeader} from "./content-controls-header";
import {ControlsTabMap} from "./content-controls-tab-map";
import {ControlsTabApi} from "./content-controls-tab-api";
import {ControlsTabBans} from "./content-controls-tab-bans";
import {ControlsTabStats} from "./content-controls-tab-stats";
import {ControlsTabSettings} from "./content-controls-tab-settings";
import {ControlsTabAbout} from "./content-controls-tab-about";
import {mapModule} from "./content-module-map";

require('tooltipster')

export class ControlsModule {
    private static instanceRef: ControlsModule;
    private driver: ChatruletkaDriver;

    public videoContainerHeight = 0
    public chatContainerHeight = 0

    private tabs: any = []

    protected constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.tabs.push(ControlsTabApi.initInstance(this))
        this.tabs.push(ControlsTabMap.initInstance(this))
        this.tabs.push(ControlsTabBans.initInstance(this))
        this.tabs.push(ControlsTabStats.initInstance(this))
        this.tabs.push(ControlsTabSettings.initInstance(this))
        this.tabs.push(ControlsTabAbout.initInstance(this))

        new ResizeObserver(this.resizeControls).observe(document.getElementById("overlay") as HTMLElement)
    }

    protected createStyle() {
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
              
              small {font-size: xx-small!important;}
              `
        })
    }

    protected createTabs() {
        let tabs: any = []
        this.tabs.forEach((tab: ControlsTabApi) => {
            tabs.push(tab.getTabHTML())
        })
        if (tabs.length > 0) {
            tabs[0].className = "active"
        }
        return utils.createElement('ul', {
            className: "tabs__caption"
        }, tabs)
    }

    protected  createControls() {
        let content = [this.createStyle(), utils.createElement('div', {
            id: "remoteIPInfo", style: "display: none;"
        }), createHeader(), this.createTabs()]

        this.tabs.forEach((tab: ControlsTabApi) => {
            content.push(tab.getContentHTML())
        })

        return utils.createElement('div', {
            className: 'chat', id: 'controls', style: "width:390px; margin-right: calc(100vh / 768 * 10);"
        }, [utils.createElement('div', {
            className: "tabs chat"
        }, content)])
    }

    protected addTabClickHandler() {
        let self = this
        $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
            $(this)
                .addClass('active').siblings().removeClass('active')
                .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

            globalThis.mapModule.updateMap(self.driver.modules.geolocation.curInfo)

            if (this.innerText === chrome.i18n.getMessage("tab3")) {
                self.resizemap(true)
            } else {
                self.resizemap(false)
            }
        });
    }

    public resizeControls = () => {
        this.videoContainerHeight = 0
        this.chatContainerHeight = 0

        if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
            this.resizemap(true)
        } else {
            this.resizemap(false)
        }

        clearTimeout(globalThis.resize)
        globalThis.resize = setTimeout(() => {
            // let controls = (document.getElementById("controls") as HTMLElement)
            // let buttons = (document.getElementById("buttons") as HTMLElement)
            // let chat = (document.getElementById("chat") as HTMLElement)

            let mar = parseInt(window.getComputedStyle(globalThis.controls).marginRight)

            // TODO: AVOID USING globalThis
            globalThis.driver.buttons.style.width = (parseInt(globalThis.driver.buttons.style.width) - (parseInt(globalThis.controls.style.width) + mar) / 2) + "px"
            globalThis.driver.chat.style.width = (parseInt(globalThis.driver.chat.style.width) - (parseInt(globalThis.controls.style.width) + mar) / 2) + "px"

            // resize = false // TODO: I COMMENTED IT OUT
            if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
                this.resizemap(true)
            } else {
                this.resizemap(false)
            }
        }, 500)
    }

    // TODO: FIX IT ON OME.TV: GO SETTINGS -> resize window -> GO OTHER TAB -> size wont change
    public resizemap = (extend: boolean): void => {
        if (extend && globalThis.settings.expand) {
            let newVideoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height)
            let newChatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height)

            if (newVideoContainerHeight !== (newVideoContainerHeight + newChatContainerHeight) / 2) {
                this.videoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height);
                this.chatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height);

                (document.getElementById("video-container") as HTMLElement).style.height = (this.videoContainerHeight + this.chatContainerHeight) / 2 + "px";
                (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = (this.videoContainerHeight + this.chatContainerHeight) / 2 + "px"
            }
        } else {
            if (this.videoContainerHeight !== 0 && this.chatContainerHeight !== 0) {
                (document.getElementById("video-container") as HTMLElement).style.height = this.videoContainerHeight + "px";
                (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = this.chatContainerHeight + "px"
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

    injectControls() {
        globalThis.controls = this.createControls();

        // TODO: do I need both tooltipster and css-tooltip?
        const c = document.createElement('link');
        c.rel = "stylesheet";
        c.href = chrome.runtime.getURL('libs/css/css-tooltip.min.css');

        const cs = document.createElement('link');
        cs.rel = "stylesheet";
        cs.href = chrome.runtime.getURL("libs/css/tooltipster.bundle.min.css");

        (document.head || document.documentElement).appendChild(c);
        (document.head || document.documentElement).appendChild(cs);

        ($(".gender-selector")[0] as HTMLElement).parentElement!.remove()

        $(globalThis.controls).insertBefore(".chat");

        this.addTabClickHandler()

        $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

        globalThis.mapModule = mapModule.getInstance()
    }


    static initInstance(driver: ChatruletkaDriver): ControlsModule {
        if (ControlsModule.instanceRef === undefined) {
            ControlsModule.instanceRef = new ControlsModule(driver);
        }

        return ControlsModule.instanceRef;
    }
}