import * as utils from "./utils";
import {confirmAndReload, createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsControls() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsControls")),
        createSettingsCheckbox("p", "expand", chrome.i18n.getMessage("expand"), chrome.i18n.getMessage("tooltipExpand"), ()=>{
            setTimeout(() => {
                globalThis.driver.modules.controls.resizemap(true)
            }, 100)
        }, ()=>{
            globalThis.driver.modules.controls.resizemap(false)
        })
    ])
}