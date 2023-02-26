import * as utils from "./utils";
import {createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsHotkeys() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsHotkeys")),

        createSettingsCheckbox("hotkeys", chrome.i18n.getMessage("enablehotkeys"), chrome.i18n.getMessage("tooltipEnableHotkeys"),
            () => {
                globalThis.driver.modules.hotkeys.unregister()
                globalThis.driver.modules.hotkeys.register()
            }, () => {
                globalThis.driver.modules.hotkeys.unregister()
            }
        ),

        utils.createElement('br'),
        utils.createElement('span', {
            innerHTML: chrome.i18n.getMessage("hotkeys")
        }),
    ])
}