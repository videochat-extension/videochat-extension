import * as utils from "./utils";
import {ControlsTabSettings} from "./content-module-settings";

export function createSettingsStats() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsStats")),

        ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("clearStats"), () => {
            const result = confirm("Clear?");
            if (result) {
                globalThis.driver.modules.stats.clear()
            }
        })
    ])
}