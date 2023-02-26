import * as utils from "./utils";
import {ControlsTabSettings} from "./content-module-settings";

let settings = [
    {
        type: "header",
        text: chrome.i18n.getMessage("settingsInterface")
    },
    {
        type: "checkbox",
        important: false,
        key: "hideLogo",
        text: chrome.i18n.getMessage("hideLogo"),
        tooltip: chrome.i18n.getMessage("tooltipHideLogo"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.hideLogo.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.hideLogo.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "hideHeader",
        text: chrome.i18n.getMessage("hideHeader"),
        tooltip: chrome.i18n.getMessage("tooltipHideHeader"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.hideHeader.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.hideHeader.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "hideWatermark",
        text: chrome.i18n.getMessage("watermark"),
        tooltip: chrome.i18n.getMessage("tooltipWatermark"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.hideWatermark.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.hideWatermark.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "hideBanner",
        text: chrome.i18n.getMessage("banner"),
        tooltip: chrome.i18n.getMessage("tooltipBanner"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.hideBanner.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.hideBanner.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "doNotReflect",
        text: chrome.i18n.getMessage("doNotReflect"),
        tooltip: chrome.i18n.getMessage("tooltipDoNotReflect"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.doNotReflect.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.doNotReflect.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "doNotCover",
        text: chrome.i18n.getMessage("doNotCover"),
        tooltip: chrome.i18n.getMessage("tooltipDoNotCover"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.doNotCover.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.doNotCover.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "hideCamera",
        text: chrome.i18n.getMessage("hideCamera"),
        tooltip: chrome.i18n.getMessage("tooltiphideCamera"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.hideCamera.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.hideCamera.disable()
        }
    },
    {
        type: "checkbox",
        important: false,
        key: "darkMode",
        text: chrome.i18n.getMessage("darkMode"),
        tooltip: chrome.i18n.getMessage("tooltipDarkMode"),
        enable: () => {
            globalThis.driver.modules.interface.tweaks.darkMode.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.darkMode.disable()
        }
    }

]

function processSettings(array: { type: string, [key: string]: any }[]) {
    let settingsElements: HTMLElement[] = []
    array.forEach((el) => {
        let newElement: HTMLElement | undefined
        switch (el.type) {
            case "header": {
                console.dir(ControlsTabSettings.createSettingsHeader)
                console.dir(el.text)
                newElement = ControlsTabSettings.createSettingsHeader(el.text)
                break;
            }

            case "checkbox": {
                let tagName = el.important ? "b" : "p"
                if (el.enable && el.disable) {
                    newElement = ControlsTabSettings.createSettingsCheckbox(tagName, el.key, el.text, el.tooltip, el.enable, el.disable)
                } else if (el.enable) {
                    newElement = ControlsTabSettings.createSettingsCheckbox(tagName, el.key, el.text, el.tooltip, el.enable)
                } else {
                    newElement = ControlsTabSettings.createSettingsCheckbox(tagName, el.key, el.text, el.tooltip)
                }
                break;
            }
        }
        if (newElement) {
            settingsElements.push(newElement)
        }
    })
    return settingsElements
}

export function createSettingsInterface() {
    return utils.createElement('div', {}, processSettings(settings))
}