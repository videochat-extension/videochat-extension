import * as utils from "./utils";
import {createSettingsButton, createSettingsHeader} from "./content-module-settings";

export function createSettingsStats() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsStats")),

        createSettingsButton(chrome.i18n.getMessage("clearStats"), () => {
            const result = confirm("Clear?");
            if (result) {
                globalThis.driver.modules.stats.clear()
            }
        })
    ])
}