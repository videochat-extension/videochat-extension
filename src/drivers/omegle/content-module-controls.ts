import $ from "jquery";
import {OmegleDriver} from "../content-driver-omegle";
import {ControlsHeader, ControlsModule, ControlsTabAbout} from "../chatruletka/content-module-controls";
import {ContentSwalInfoOmegle} from "./content-swal-info";
import * as utils from "../../utils/utils";

export class ControlsModuleOmegle extends ControlsModule {
    public static defaults = {
        ...super.defaults, ...{
            logToChat: true,
            logIpToChat: false,
        }
    }

    public constructor(driver: OmegleDriver) {
        super(driver)

        this.header = new ControlsHeaderOmegle(this.driver, this)
    }

    public injectControls(tabs: any[]) {
        this.start(tabs)

        // TODO: do I really need both tooltipster and css-tooltip?
        const c = document.createElement('link');
        c.rel = "stylesheet";
        c.href = chrome.runtime.getURL('libs/css/css-tooltip.min.css');

        const cs = document.createElement('link');
        cs.rel = "stylesheet";
        cs.href = chrome.runtime.getURL("libs/css/tooltipster.bundle.min.css");

        (document.head || document.documentElement).appendChild(c);
        (document.head || document.documentElement).appendChild(cs);
    }

    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsControls")
        },
        {
            type: "checkbox",
            important: false,
            key: "showHints",
            controlsSection: 'showHintsEnabled',
            text: chrome.i18n.getMessage("showHints"),
            tooltip: chrome.i18n.getMessage("tooltipShowHints"),
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("showHints"),
            sectionId: "showHintsEnabled",
            children: [
                {
                    type: "checkbox",
                    important: false,
                    key: "showHintsMoreOften",
                    text: chrome.i18n.getMessage("showHintsMoreOften"),
                    tooltip: chrome.i18n.getMessage("tooltipshowHintsMoreOften")
                }
            ]
        },
        {
            type: "checkbox",
            important: false,
            key: "logToChat",
            controlsSection: 'logToChatEnabled',
            text: chrome.i18n.getMessage("logToChat"),
            tooltip: chrome.i18n.getMessage("tooltipLogToChat"),
            enable: () => {
            },
            disable: () => {
            },
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("logToChat"),
            sectionId: "logToChatEnabled",
            children: [
                {
                    type: "checkbox",
                    important: false,
                    key: "logIpToChat",
                    text: chrome.i18n.getMessage("logIpToChat"),
                    tooltip: chrome.i18n.getMessage("tooltipLogIpToChat"),
                    enable: () => {
                    },
                    disable: () => {
                    },
                }
            ]
        }
    ]

    protected createStyle() {
        return utils.createElement('style', {
            textContent: `
            // TODO: what is this?
            .tabs :is(a, abbr, acronym, address, applet, big, blockquote, body, caption, cite, code, dd, del, dfn, dl, dt, em, fieldset, font, form, h1, h2, h3, h4, h5, h6, html, iframe, img, input, ins, kbd, label, legend, li, object, ol, p, pre, q, s, samp, small, span, strike, strong, sub, sup, table, tbody, td, textarea, tfoot, th, thead, tr, tt, ul, var) {
                margin: 0;
                padding: 0;
                border: 0;
                outline: 0;
                font-weight: inherit;
                font-style: inherit;
                font-size: 100%;
                vertical-align: baseline;
            }
            
            .remoteTM {
                font-weight: inherit;
                font-style: inherit;
                font-size: 100%;
                vertical-align: baseline!important;
            }
            
            .tabs__content {
                display: none!important;
                padding-left: 5px!important;
                padding-right: 5px!important;
              }
              
              .tabs__content.active {
                display: block!important;
              }
              
              .tabs {
                position: relative!important;
                height: 100%!important;
                word-break: break-word!important;
                user-select: text!important;
              }
              
              .tabs__caption {
                border: 0!important;
                display: flex!important;
                flex-wrap: wrap!important;
                list-style-type: none!important;
                bottom: 0px!important;
                background: #f8f8f8;
                margin: 0!important;
                padding: 0!important;
                position: absolute!important;
                width: 100%!important;
                border-bottom: 1px solid lightgray;
                user-select: none!important;
              }
              
              .tabs__caption li {
                padding: 0.2rem 0.5rem!important;
                text-decoration: none!important;
                color: black;
                text-align: center!important;
                flex-shrink: 0!important;
                flex-grow: 1!important;
              }
      
              .tabs__caption li:not(.active) {
                cursor: pointer!important;
              }
              
              .tabs__caption .active {
                font-weight: bold!important;
              }
              
              .controls__row:after {
                content: ""!important;
                display: table!important;
                box-sizing: border-box!important;
                clear: both!important;
              }
              
              dd {
                margin-inline-start: 20px!important;
              }
              
              input {
                margin-left: 5px!important;
              }
              
              select {
                margin-left: 5px!important;
              }
              
              sup {
                top: initial!important
              } 
              
              p {
                display: inline-block!important;
              }
              
              .ve__header__button {
                    width: 22.67px!important;
                    padding-right: 0!important;
                    padding-left: 0!important;
                    height: 15px!important;
              }
              
              small {font-size: xx-small!important;}
              `
        })
    }

    public resizemap = (extend: boolean): void => {
        let tabs = $(".tabs__caption")[0]

        let newHeight = document.getElementById("controls")!.offsetHeight - document.getElementById("VE_header")!.offsetHeight - document.getElementById("VE_tab_selector")!.offsetHeight

        newHeight += -1
        document.getElementById("VE_tab_content")!.style.height = newHeight + "px"

        this.tabs.forEach((tab: any) => {
            tab.handleResize()
        })
    }

}

export class ControlsTabAboutOmegle extends ControlsTabAbout {
    protected showSwalWelcome() {
        new ContentSwalInfoOmegle().showFromStart()
    }
}

class ControlsHeaderOmegle extends ControlsHeader {
    public remote = "othervideo"
    public echo = "echo-video"
    public local = "selfvideo"
}