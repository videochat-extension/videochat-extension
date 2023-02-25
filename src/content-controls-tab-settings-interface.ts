import * as utils from "./utils";
import $ from "jquery";
import {confirmAndReload} from "./content-controls-tab-settings";

export function createSettingsInterface() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsInterface")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideLogo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideLogo"),
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideLogo,
                    id: "hideLogoCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideLogo": (document.getElementById("hideLogoCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideLogoCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.hideLogo.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.hideLogo.disable()
                            }
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideHeader"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideHeader"),
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideHeader,
                    id: "hideHeaderCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideHeader": (document.getElementById("hideHeaderCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideHeaderCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.hideHeader.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.hideHeader.disable()
                            }
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("watermark"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipWatermark"),
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideWatermark,
                    id: "hideWatermarkCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideWatermark": (document.getElementById("hideWatermarkCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideWatermarkCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.hideWatermark.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.hideWatermark.disable()
                            }
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("banner"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipBanner')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideBanner,
                    id: "hideBannerCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideBanner": (document.getElementById("hideBannerCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideBannerCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.hideBanner.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.hideBanner.disable()
                            }
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotReflect'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotReflect')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.doNotReflect,
                    id: "doNotReflectCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"doNotReflect": (document.getElementById("doNotReflectCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("doNotReflectCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.doNotReflect.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.doNotReflect.disable()
                            }
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('doNotCover'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDoNotCover')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.doNotCover,
                    id: "doNotCoverCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"doNotCover": (document.getElementById("doNotCoverCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("doNotCoverCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.doNotCover.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.doNotCover.disable()
                            }
                        });
                    }
                })
            ]),
        ]),


        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('hideCamera'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltiphideCamera')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideCamera,
                    id: "hideCameraCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideCamera": (document.getElementById("hideCameraCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hideCameraCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.hideCamera.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.hideCamera.disable()
                            }
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('darkMode'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipDarkMode')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.darkMode,
                    id: "darkModeCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"darkMode": (document.getElementById("darkModeCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("darkModeCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.interface.tweaks.darkMode.enable()
                            } else {
                                globalThis.driver.modules.interface.tweaks.darkMode.disable()
                            }
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage('expand'),
                    className: "tooltip",
                    title: chrome.i18n.getMessage('tooltipExpand')
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.expand,
                    id: "expandCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"expand": (document.getElementById("expandCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("expandCheck") as HTMLInputElement).checked) {
                                setTimeout(() => {
                                    globalThis.mapModule.resizemap(true)
                                }, 100)
                            } else {
                                globalThis.mapModule.resizemap(false)
                            }
                        });
                    }
                })
            ]),
        ]),
    ])
}