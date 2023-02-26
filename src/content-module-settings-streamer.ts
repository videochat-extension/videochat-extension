import * as utils from "./utils";
import {confirmAndReload, ControlsTabSettings} from "./content-module-settings";

export function createSettingsStreamer() {
    return utils.createElement('div', {}, [
        ControlsTabSettings.createSettingsHeader(chrome.i18n.getMessage("settingsStreamerMode")),
        
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("b", {
                    innerText: chrome.i18n.getMessage("streamerMode"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipStreamerMode")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.streamer,
                    id: "streamerCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"streamer": (document.getElementById("streamerCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("streamerCheck") as HTMLInputElement).checked)
                                (document.getElementById("streamerList") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("streamerList") as HTMLElement).style.display = "none"

                            confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
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
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerHotkeys"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerHotkeys")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.streamerKeys,
                        id: "streamerKeysCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerKeys": (document.getElementById("streamerKeysCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            utils.createElement('span', {
                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
            }),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerPip"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerPip")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.streamerPip,
                        id: "streamerPipCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerPip": (document.getElementById("streamerPipCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            utils.createElement('br'),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurOnStart"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurOnStart")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.blurOnStart,
                        id: "blurOnStartCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurOnStart": (document.getElementById("blurOnStartCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurReport"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurReport")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.blurReport,
                        id: "blurReportCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurReport": (document.getElementById("blurReportCheck") as HTMLInputElement).checked}, function () {
                                if ((document.getElementById("blurReportCheck") as HTMLInputElement).checked) {
                                    (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
                                } else {
                                    (document.getElementById("report-screen") as HTMLElement).style.filter = ""
                                }
                            });
                        }
                    })
                ]),
            ]),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("remoteBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipRemoteBlurStrength")
                    }),
                    utils.createElement('input', {
                        type: "range",
                        id: "blurFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: globalThis.settings.blurFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurFilter": (document.getElementById("blurFilter") as HTMLInputElement).value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurPreviews"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurPreviews")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.blurPreview,
                        id: "blurPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurPreview": (document.getElementById("blurPreviewCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("previewBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPreviewBlurStrength")
                    }),
                    utils.createElement('input', {
                        type: "range",
                        id: "blurPreviewFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: globalThis.settings.blurPreviewFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurPreviewFilter": (document.getElementById("blurPreviewFilter") as HTMLInputElement).value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),

            utils.createElement('br'),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("blurCoverLocal"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurCoverLocal")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.streamerMirror,
                        id: "streamerMirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerMirror": (document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked}, function () {
                            });
                        }
                    })
                ]),
            ]),

            utils.createElement('br'),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverBlur"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverBlur")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.cover,
                        id: "coverCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"cover": (document.getElementById("coverCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverPreview"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverPreview")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.coverPreview,
                        id: "coverPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverPreview": (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverNoise"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverNoise")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.coverNoise,
                        id: "coverNoiseCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverNoise": (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            utils.createElement('dd', {}, [
                utils.createElement('span', {}, [
                    utils.createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverStop"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverStop")
                    }),
                    utils.createElement('input', {
                        type: "checkbox",
                        checked: globalThis.settings.coverStop,
                        id: "coverStopCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverStop": (document.getElementById("coverStopCheck") as HTMLInputElement).checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            utils.createElement('dd', {}, [
                utils.createElement('button', {
                    style: "margin-top: 2px",
                    onclick: () => {
                        const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), globalThis.settings.coverSrc)
                        if (result) {
                            chrome.storage.sync.set({"coverSrc": result}, function () {
                                (document.getElementById('cover') as HTMLImageElement).src = result
                            });
                        }
                    },
                }, [
                    utils.createElement('b', {
                        innerText: chrome.i18n.getMessage("coverSrc")
                    })
                ]),
            ]),
        ])
    ])
}