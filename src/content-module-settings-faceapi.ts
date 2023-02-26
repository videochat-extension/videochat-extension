import * as utils from "./utils";
import {confirmAndReload, createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsFaceapi() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("genderRecognition")),

        createSettingsCheckbox("p", "enableFaceApi", chrome.i18n.getMessage("forcedApi"), chrome.i18n.getMessage("tooltipForcedRecognition"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),

        createSettingsCheckbox("p", "skipMale", chrome.i18n.getMessage("skip_males"), chrome.i18n.getMessage("tooltipSkipMales"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),

        createSettingsCheckbox("p", "skipFemale", chrome.i18n.getMessage("skip_females"), chrome.i18n.getMessage("tooltipSkipFemales"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),
    ])
}