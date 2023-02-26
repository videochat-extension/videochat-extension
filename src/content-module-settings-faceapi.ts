import * as utils from "./utils";
import {confirmAndReload} from "./content-module-settings";

export function createSettingsFaceapi() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("genderRecognition")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("forcedApi"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipForcedRecognition")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.enableFaceApi,
                    id: "enableFaceApiCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableFaceApi": (document.getElementById("enableFaceApiCheck") as HTMLInputElement).checked}, function () {
                            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [

                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_males"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipMales")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.skipMale,
                    id: "skipMaleCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipMale": (document.getElementById("skipMaleCheck") as HTMLInputElement).checked}, function () {
                            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("skip_females"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipFemales")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.skipFemale,
                    id: "skipFemaleCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipFemale": (document.getElementById("skipFemaleCheck") as HTMLInputElement).checked}, function () {
                            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                                confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
    ])
}