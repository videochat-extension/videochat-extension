import * as utils from "./utils";
import $ from "jquery";
import {confirmAndReload} from "./content-controls-tab-settings";

export function createSettingsControls() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsControls")
        }),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('expand'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipExpand')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.expand,
                    id: "expandCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"expand": (document.getElementById("expandCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("expandCheck") as HTMLInputElement).checked) {
                                setTimeout(() => {
                                    globalThis.mapModule.resizemap(true)
                                }, 100)
                            } else {
                                globalThis.mapModule.resizemap(false)
                            }
                        });
                    }
                })
            ]),
        ]),
    ])
}