import * as utils from "./utils";
import {confirmAndReload, createSettingsHeader} from "./content-module-settings";

export function createSettingsAutomation() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsAutomation")),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipfour"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipFour")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.skipFourSec,
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
                    checked: globalThis.settings.autoResume,
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
                    checked: globalThis.settings.skipwrongcountry,
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