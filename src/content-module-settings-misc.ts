import * as utils from "./utils";
import {switchMode} from "./content-swal-switchmode";
import {ControlsTabSettings} from "./content-module-settings";

export function createSettingsMisc() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsMisc")),

        ControlsTabSettings.createSettingsCheckbox("p", "sentry", chrome.i18n.getMessage("sentry"), chrome.i18n.getMessage("tooltipSentry")),

        ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("switchModeButtonText"), () => {
            switchMode()
        })
    ])
}