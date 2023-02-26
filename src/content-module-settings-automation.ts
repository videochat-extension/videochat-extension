import * as utils from "./utils";
import {confirmAndReload, createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsAutomation() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsAutomation")),

        createSettingsCheckbox("skipFourSec", chrome.i18n.getMessage("autoskipfour"), chrome.i18n.getMessage("tooltipFour")),
        createSettingsCheckbox("autoResume", chrome.i18n.getMessage("autoresume"), chrome.i18n.getMessage("tooltipAutoresume"), ()=>{
            confirmAndReload()
        }, ()=>{
            confirmAndReload()
        }),
        createSettingsCheckbox("skipwrongcountry", chrome.i18n.getMessage("autoskipwrongcountry"), chrome.i18n.getMessage("tooltipAutoskipWrongCountry")),
    ])
}