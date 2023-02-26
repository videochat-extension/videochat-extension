import * as utils from "./utils";
import {confirmAndReload, ControlsTabSettings} from "./content-module-settings";

export function createSettingsAutomation() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsAutomation")),

        ControlsTabSettings.createSettingsCheckbox("p", "skipFourSec", chrome.i18n.getMessage("autoskipfour"), chrome.i18n.getMessage("tooltipFour")),
        ControlsTabSettings.createSettingsCheckbox("p", "autoResume", chrome.i18n.getMessage("autoresume"), chrome.i18n.getMessage("tooltipAutoresume"), ()=>{
            confirmAndReload()
        }, ()=>{
            confirmAndReload()
        }),
        ControlsTabSettings.createSettingsCheckbox("p", "skipwrongcountry", chrome.i18n.getMessage("autoskipwrongcountry"), chrome.i18n.getMessage("tooltipAutoskipWrongCountry")),
    ])
}