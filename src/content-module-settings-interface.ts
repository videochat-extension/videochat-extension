import * as utils from "./utils";
import {createSettingsCheckbox, createSettingsHeader} from "./content-module-settings";

export function createSettingsInterface() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsInterface")),

        createSettingsCheckbox("p", "hideLogo", chrome.i18n.getMessage("hideLogo"), chrome.i18n.getMessage("tooltipHideLogo"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideLogo.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideLogo.disable()
        }),

        createSettingsCheckbox("p", "hideHeader", chrome.i18n.getMessage("hideHeader"), chrome.i18n.getMessage("tooltipHideHeader"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideHeader.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideHeader.disable()
        }),

        createSettingsCheckbox("p", "hideWatermark", chrome.i18n.getMessage("watermark"), chrome.i18n.getMessage("tooltipWatermark"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideWatermark.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideWatermark.disable()
        }),

        createSettingsCheckbox("p", "hideBanner", chrome.i18n.getMessage("banner"), chrome.i18n.getMessage("tooltipBanner"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideBanner.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideBanner.disable()
        }),

        createSettingsCheckbox("p", "hideBanner", chrome.i18n.getMessage("banner"), chrome.i18n.getMessage("tooltipBanner"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideBanner.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideBanner.disable()
        }),

        createSettingsCheckbox("p", "doNotReflect", chrome.i18n.getMessage("doNotReflect"), chrome.i18n.getMessage("tooltipDoNotReflect"), ()=>{
            globalThis.driver.modules.interface.tweaks.doNotReflect.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.doNotReflect.disable()
        }),

        createSettingsCheckbox("p", "doNotCover", chrome.i18n.getMessage("doNotCover"), chrome.i18n.getMessage("tooltipDoNotCover"), ()=>{
            globalThis.driver.modules.interface.tweaks.doNotCover.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.doNotCover.disable()
        }),

        createSettingsCheckbox("p", "hideCamera", chrome.i18n.getMessage("hideCamera"), chrome.i18n.getMessage("tooltiphideCamera"), ()=>{
            globalThis.driver.modules.interface.tweaks.hideCamera.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.hideCamera.disable()
        }),

        createSettingsCheckbox("p", "darkMode", chrome.i18n.getMessage("darkMode"), chrome.i18n.getMessage("tooltipDarkMode"), ()=>{
            globalThis.driver.modules.interface.tweaks.darkMode.enable()
        }, ()=>{
            globalThis.driver.modules.interface.tweaks.darkMode.disable()
        })
    ])
}