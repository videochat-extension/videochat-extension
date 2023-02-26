import * as utils from "./utils";
import {createSettingsButton, createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsBlacklist() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsBlacklist")),

        createSettingsCheckbox("p", "autoBan", chrome.i18n.getMessage("autoskip"), chrome.i18n.getMessage("tooltipAutoskip")),
        createSettingsCheckbox("p", "dontBanMobile", chrome.i18n.getMessage("donotbanmobile"), chrome.i18n.getMessage("tooltipDonotbanmobile")),
        createSettingsCheckbox("p", "skipSound", chrome.i18n.getMessage("ban_sound"), chrome.i18n.getMessage("tooltipSkipSound")),

        createSettingsButton(chrome.i18n.getMessage("clearblacklist"), () => {
            const result = confirm("Clear?");
            if (result) {
                globalThis.driver.modules.blacklist.clear()
            }
        })
    ])
}