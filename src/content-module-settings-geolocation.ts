import * as utils from "./utils";
import {ControlsTabSettings} from "./content-module-settings";

export function createSettingsGeolocation() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsGeolocation")),

        ControlsTabSettings.createSettingsCheckbox("p", "ipApiLocalisation", chrome.i18n.getMessage("apiLocalisation"), chrome.i18n.getMessage("tooltipApiLocalisation")),

        utils.createElement('br'),

        ControlsTabSettings.createSettingsCheckbox("p", "hideMobileLocation", chrome.i18n.getMessage("hideMobile"), chrome.i18n.getMessage("tooltipHideMobile")),
        ControlsTabSettings.createSettingsCheckbox("p", "showCT", chrome.i18n.getMessage("showCT"), chrome.i18n.getMessage("tooltipShowCT")),

        utils.createElement('br'),

        ControlsTabSettings.createSettingsCheckbox("p", "showMoreEnabledByDefault", chrome.i18n.getMessage("showMoreInfo"), chrome.i18n.getMessage("tooltipShowMoreInfo")),
        ControlsTabSettings.createSettingsCheckbox("p", "showISP", chrome.i18n.getMessage("showISP"), chrome.i18n.getMessage("tooltipShowISP")),

        utils.createElement('br'),

        ControlsTabSettings.createSettingsCheckbox("p", "enableTargetCity", chrome.i18n.getMessage("targetCity"), chrome.i18n.getMessage("tooltipTargetCity"), () => {
            (document.getElementById("targetCityDiv") as HTMLElement).style.display = ""
        }, () => {
            (document.getElementById("targetCityDiv") as HTMLElement).style.display = "none"
        }),

        utils.createElement('div', {
            id: "targetCityDiv",
            style: function f() {
                if (globalThis.settings.enableTargetCity) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("prefixTargetCity") + globalThis.settings.targetCity, (e) => {
                const result = prompt(chrome.i18n.getMessage("promptTargetCity"), globalThis.settings.targetCity)
                if (result) {
                    chrome.storage.sync.set({"targetCity": result}, function () {
                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                    });
                }
            }),
        ]),

        ControlsTabSettings.createSettingsCheckbox("p", "enableTargetRegion", chrome.i18n.getMessage("targetRegion"), chrome.i18n.getMessage("tooltipTargetRegion"), () => {
            (document.getElementById("targetRegionDiv") as HTMLElement).style.display = ""
        }, () => {
            (document.getElementById("targetRegionDiv") as HTMLElement).style.display = "none"
        }),

        utils.createElement('div', {
            id: "targetRegionDiv",
            style: function f() {
                if (globalThis.settings.enableTargetRegion) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("prefixTargetRegion") + globalThis.settings.targetRegion, (e) => {
                const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), globalThis.settings.targetRegion)
                if (result) {
                    chrome.storage.sync.set({"targetRegion": result}, function () {
                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                    });
                }
            }),
        ]),

        utils.createElement('br'),

        ControlsTabSettings.createSettingsCheckbox("p", "skipMobileTarget", chrome.i18n.getMessage("targetSkipMobile"), chrome.i18n.getMessage("tooltipTargetSkipMobile")),
        ControlsTabSettings.createSettingsCheckbox("p", "targetSound", chrome.i18n.getMessage("targetSound"), chrome.i18n.getMessage("tooltipTargetSound")),

        utils.createElement('br'),

        ControlsTabSettings.createSettingsCheckbox("p", "torrentsEnable", chrome.i18n.getMessage("torrentsEnable"), chrome.i18n.getMessage("tooltipTorrentsEnable")),
        ControlsTabSettings.createSettingsCheckbox("p", "torrentsInfo", chrome.i18n.getMessage("torrentsInfo"), chrome.i18n.getMessage("tooltipTorrentsInfo")),
    ])
}