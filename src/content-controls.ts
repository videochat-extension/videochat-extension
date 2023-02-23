import * as utils from "./utils";
import $ from "jquery";
import {createHeader} from "./content-controls-header";
import {createTabMap} from "./content-controls-tab-map";
import {createTabApi} from "./content-controls-tab-api";
import {createTabBans} from "./content-controls-tab-bans";
import {createTabStats} from "./content-controls-tab-stats";
import {createTabSettings} from "./content-controls-tab-settings";
import {createTabAbout} from "./content-controls-tab-about";
import {mapModule} from "./content-module-map";

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
              
              small {font-size: xx-small!important;}
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
    }, [createStyle(), utils.createElement('div', {
        id: "remoteIPInfo", style: "display: none;"
    }), createHeader(), createTabs(),
        createTabApi(), createTabMap(), createTabBans(), createTabStats(), createTabSettings(), createTabAbout(),])])
}

export function injectInterface() {
    globalThis.controls = createControls();

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

    $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

        globalThis.mapModule.updateMap(globalThis.curInfo)

        if (this.innerText === chrome.i18n.getMessage("tab3")) {
            globalThis.mapModule.resizemap(true)
        } else {
            globalThis.mapModule.resizemap(false)
        }
    });

    $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

    globalThis.mapModule = mapModule.getInstance()
}
