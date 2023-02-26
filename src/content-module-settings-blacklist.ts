import * as utils from "./utils";
import {createSettingsButton, createSettingsHeader} from "./content-module-settings";

export function createSettingsBlacklist() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsBlacklist")),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskip"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskip")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.autoBan,
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
                    checked: globalThis.settings.dontBanMobile,
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
                    checked: globalThis.settings.skipSound,
                    id: "skipSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipSound": (document.getElementById("skipSoundCheck") as HTMLInputElement).checked}, function () {
                        });
                    }
                })
            ]),
        ]),

        createSettingsButton(chrome.i18n.getMessage("clearblacklist"), () => {
            const result = confirm("Clear?");
            if (result) {
                globalThis.driver.modules.blacklist.clear()
            }
        })
    ])
}