import * as utils from "./utils";
import {createSettingsHeader} from "./content-module-settings";

export function createSettingsControls() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsControls")),

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
                        chrome.storage.sync.set({"expand": (document.getElementById("expandCheck") as HTMLInputElement).checked}, () => {
                            if ((document.getElementById("expandCheck") as HTMLInputElement).checked) {
                                setTimeout(() => {
                                    globalThis.driver.modules.controls.resizemap(true)
                                }, 100)
                            } else {
                                globalThis.driver.modules.controls.resizemap(false)
                            }
                        });
                    }
                })
            ]),
        ]),
    ])
}