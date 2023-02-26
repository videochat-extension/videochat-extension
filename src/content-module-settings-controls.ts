import * as utils from "./utils";
import {ControlsTabSettings} from "./content-module-settings";

export function createSettingsControls() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsControls")),
        ControlsTabSettings.createSettingsCheckbox("p", "expand", chrome.i18n.getMessage("expand"), chrome.i18n.getMessage("tooltipExpand"), ()=>{
            setTimeout(() => {
                globalThis.driver.modules.controls.resizemap(true)
            }, 100)
        }, ()=>{
            globalThis.driver.modules.controls.resizemap(false)
        })
    ])
}