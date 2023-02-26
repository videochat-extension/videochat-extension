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
        type: "br"
    },
    {
        type: "HTMLElement",
        element: utils.createElement('br')
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
    },
    {
        type: "button",
        text: "text",
        onclick: (e: MouseEvent) => {
            console.dir(e)
        }
    },
    {
        type: "range",
        important: false,
        text: "range",
        tooltip: "TOOLTIP",
        key: "blurPreviewFilter",
        min: 0,
        max: 200,
    },
    {
        type: "checkbox",
        important: false,
        key: "darkMode",
        text: chrome.i18n.getMessage("darkMode"),
        tooltip: chrome.i18n.getMessage("tooltipDarkMode"),
        controlsSection: "targetCityDiv",
        enable: () => {
            globalThis.driver.modules.interface.tweaks.darkMode.enable()
        },
        disable: () => {
            globalThis.driver.modules.interface.tweaks.darkMode.disable()
        }
    },
    {
        type: "section",
        hide: globalThis.settings.enableTargetCity,
        sectionId: "targetCityDiv",
        children: [
            {
                type: "button",
                text: "text",
                onclick: (e: MouseEvent) => {
                    console.dir(e)
                }
            }
        ]
    }
]

//TODO: create full custom type
function processSettings(array: { type: string, [key: string]: any }[]) {
    let settingsElements: HTMLElement[] = []

    array.forEach((el) => {
        let newElement: HTMLElement | undefined
        switch (el.type) {
            case "header": {
                newElement = ControlsTabSettings.createSettingsHeader(el.text)
                break;
            }

            case "checkbox": {
                let tagName = el.important ? "b" : "p"
                newElement = ControlsTabSettings.createSettingsCheckbox(tagName, el.key, el.text, el.tooltip, el.enable, el.disable, el.controlsSection)
                break;
            }

            case "button": {
                newElement = ControlsTabSettings.createSettingsButton(el.text, el.onclick)
                break;
            }

            case "range": {
                let tagName = el.important ? "b" : "p"
                if (el.onchange) {
                    newElement = ControlsTabSettings.createSettingsRange(tagName, el.key, el.min, el.max, el.settingText, el.settingTooltip, el.onchange)
                } else {
                    newElement = ControlsTabSettings.createSettingsRange(tagName, el.key, el.min, el.max, el.text, el.tooltip)
                }
                break;
            }
                //
                // utils.createElement('div', {
                //     id: "targetRegionDiv",
                //     style: function f() {
                //         if (globalThis.settings.enableTargetRegion) {
                //             return ""
                //         } else {
                //             return "display:none"
                //         }
                //     }(),
                // }, [
                //     ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("prefixTargetRegion") + globalThis.settings.targetRegion, (e) => {
                //         const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), globalThis.settings.targetRegion)
                //         if (result) {
                //             chrome.storage.sync.set({"targetRegion": result}, function () {
                //                 (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                //             });
                //         }
                //     }),
                // ])

            case "section": {
                newElement = utils.createElement('div', {
                    id: el.sectionId,
                    style: function f() {
                        if (el.hide) {
                            return ""
                        } else {
                            return "display:none"
                        }
                    }(),
                }, processSettings(el.children))
                break;
            }

            case "HTMLElement" : {
                newElement = el.element
                break;
            }

            case "br": {
                newElement = utils.createElement('br')
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