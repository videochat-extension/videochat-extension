import * as utils from "./utils";
import {switchMode} from "./content-swal-switchmode";

export function createSettingsMisc() {
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