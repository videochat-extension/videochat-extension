import * as utils from "./utils";
import {confirmAndReload, ControlsTabSettings} from "./content-module-settings";

export function createSettingsStreamer() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsStreamerMode")),

        ControlsTabSettings.createSettingsCheckbox("p", "streamer", chrome.i18n.getMessage("streamerMode"), chrome.i18n.getMessage("tooltipStreamerMode"), () => {
            (document.getElementById("streamerList") as HTMLElement).style.display = ""
            confirmAndReload()
        }, () => {
            (document.getElementById("streamerList") as HTMLElement).style.display = "none"
            confirmAndReload()
        }),

        utils.createElement('div', {
            id: "streamerList",
            style: function f() {
                if (globalThis.settings.streamer) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('br'),

            ControlsTabSettings.createSettingsCheckbox("p", "streamerKeys", chrome.i18n.getMessage("streamerHotkeys"), chrome.i18n.getMessage("tooltipStreamerHotkeys"), () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
            }, () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = ""
            }),

            utils.createElement('span', {
                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "streamerPip", chrome.i18n.getMessage("streamerPip"), chrome.i18n.getMessage("tooltipStreamerPip"), () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
            }, () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = ""
            }),

            utils.createElement('br'),

            ControlsTabSettings.createSettingsCheckbox("p", "blurOnStart", chrome.i18n.getMessage("blurOnStart"), chrome.i18n.getMessage("tooltipBlurOnStart"), () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
            }, () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = ""
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "blurReport", chrome.i18n.getMessage("blurReport"), chrome.i18n.getMessage("tooltipBlurReport"), () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
            }, () => {
                (document.getElementById("report-screen") as HTMLElement).style.filter = ""
            }),

            ControlsTabSettings.createSettingsRange("p", "blurFilter", 0, 200, chrome.i18n.getMessage("remoteBlurStrength"), chrome.i18n.getMessage("tooltipRemoteBlurStrength"), () => {
                confirmAndReload()
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "blurPreview", chrome.i18n.getMessage("blurPreviews"), chrome.i18n.getMessage("tooltipBlurPreviews")),

            ControlsTabSettings.createSettingsRange("p", "blurPreviewFilter", 0, 200, chrome.i18n.getMessage("previewBlurStrength"), chrome.i18n.getMessage("tooltipPreviewBlurStrength"), () => {
                confirmAndReload()
            }),

            utils.createElement('br'),

            ControlsTabSettings.createSettingsCheckbox("p", "streamerMirror", chrome.i18n.getMessage("blurCoverLocal"), chrome.i18n.getMessage("tooltipBlurCoverLocal")),

            utils.createElement('br'),

            ControlsTabSettings.createSettingsCheckbox("p", "cover", chrome.i18n.getMessage("coverOverBlur"), chrome.i18n.getMessage("tooltipCoverOverBlur"), () => {
                confirmAndReload()
            }, () => {
                confirmAndReload()
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "coverPreview", chrome.i18n.getMessage("coverOverPreview"), chrome.i18n.getMessage("tooltipCoverOverPreview"), () => {
                confirmAndReload()
            }, () => {
                confirmAndReload()
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "coverNoise", chrome.i18n.getMessage("coverOverNoise"), chrome.i18n.getMessage("tooltipCoverOverNoise"), () => {
                confirmAndReload()
            }, () => {
                confirmAndReload()
            }),

            ControlsTabSettings.createSettingsCheckbox("p", "coverStop", chrome.i18n.getMessage("coverOverStop"), chrome.i18n.getMessage("tooltipCoverOverStop"), () => {
                confirmAndReload()
            }, () => {
                confirmAndReload()
            }),

            ControlsTabSettings.createSettingsButton(chrome.i18n.getMessage("coverSrc"), () => {
                const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), globalThis.settings.coverSrc)
                if (result) {
                    chrome.storage.sync.set({"coverSrc": result}, function () {
                        (document.getElementById('cover') as HTMLImageElement).src = result
                    });
                }
            })
        ])
    ])
}