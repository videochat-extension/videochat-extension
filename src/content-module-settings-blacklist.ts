import * as utils from "./utils";
import {ControlsTabSettings} from "./content-module-settings";

export function createSettingsBlacklist() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsBlacklist")),

        ControlsTabSettings.createSettingsCheckbox("p", "autoBan", chrome.i18n.getMessage("autoskip"), chrome.i18n.getMessage("tooltipAutoskip")),
        ControlsTabSettings.createSettingsCheckbox("p", "dontBanMobile", chrome.i18n.getMessage("donotbanmobile"), chrome.i18n.getMessage("tooltipDonotbanmobile")),
        ControlsTabSettings.createSettingsCheckbox("p", "skipSound", chrome.i18n.getMessage("ban_sound"), chrome.i18n.getMessage("tooltipSkipSound")),

        ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("clearblacklist"), () => {
            const result = confirm("Clear?");
            if (result) {
                globalThis.driver.modules.blacklist.clear()
            }
        })
    ])
}