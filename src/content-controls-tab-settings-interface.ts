import * as utils from "./utils";
import $ from "jquery";
import {confirmAndReload} from "./content-controls-tab-settings";
import {resizemap} from "./content-controls";

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
                                (document.getElementById("logo-link") as HTMLElement).style.display = "none"
                            } else {
                                (document.getElementById("logo-link") as HTMLElement).style.display = ""
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
                            confirmAndReload()
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
                                try {
                                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
                                } catch (e) {
                                    console.dir(e)
                                }
                            } else {
                                try {
                                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = ""
                                } catch (e) {
                                    console.dir(e)
                                }
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
                                try {
                                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
                                } catch (e) {
                                    console.dir(e)
                                }
                            } else {
                                try {
                                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = ""
                                } catch (e) {
                                    console.dir(e)
                                }
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
                                $("#local-video").removeClass("video-container-local-video")
                            } else {
                                $("#local-video").addClass("video-container-local-video")
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
                                $("#remote-video").css({"object-fit": "contain"})
                                // $(".preview").css({"background-size": "contain"})
                            } else {
                                $("#remote-video").css({"object-fit": ""})
                                // $(".preview").css({"background-size": ""})
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
                                $("#local-video-wrapper")[0].style.display = "none"
                            } else {
                                $("#local-video-wrapper")[0].style.display = ""
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
                                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#E8E6E3";
                                (document.body || document.documentElement).appendChild(globalThis.dark);
                            } else {
                                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#000000"
                                if (typeof (document.getElementById("darkMode") as HTMLElement) != "undefined")
                                    (document.getElementById("darkMode") as HTMLElement).remove()
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
                                    resizemap(true)
                                }, 100)
                            } else {
                                resizemap(false)
                            }
                        });
                    }
                })
            ]),
        ]),
    ])
}