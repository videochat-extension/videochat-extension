import * as utils from "./utils";
import {switchMode} from "./content-swal-switchmode";
import {createSettingsButton, createSettingsHeader} from "./content-module-settings";

export function createSettingsMisc() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsMisc")),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("sentry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSentry")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.sentry,
                    style: "margin",
                    id: "sentryCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"sentry": (document.getElementById("sentryCheck") as HTMLInputElement).checked});
                    }
                })
            ]),
        ]),
        // TODO: DRY

        createSettingsButton(chrome.i18n.getMessage("switchModeButtonText"), () => {
            switchMode()
        })
    ])
}