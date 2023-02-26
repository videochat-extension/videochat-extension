import * as utils from "./utils";
import {confirmAndReload, ControlsTabSettings} from "./content-module-settings";

export function createSettingsFaceapi() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("genderRecognition")),

        ControlsTabSettings.createSettingsCheckbox("p", "enableFaceApi", chrome.i18n.getMessage("forcedApi"), chrome.i18n.getMessage("tooltipForcedRecognition"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),

        ControlsTabSettings.createSettingsCheckbox("p", "skipMale", chrome.i18n.getMessage("skip_males"), chrome.i18n.getMessage("tooltipSkipMales"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),

        ControlsTabSettings.createSettingsCheckbox("p", "skipFemale", chrome.i18n.getMessage("skip_females"), chrome.i18n.getMessage("tooltipSkipFemales"), ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }, ()=>{
            if (!globalThis.driver.modules.faceapi.faceApiLoaded)
                confirmAndReload()
        }),
    ])
}