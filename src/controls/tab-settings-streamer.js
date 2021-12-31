function createSettingsStreamer() {
    return createElement('div', {}, [

        createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsExperiments")
        }),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("b", {
                    innerText: chrome.i18n.getMessage("streamerMode"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipStreamerMode")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.streamer,
                    id: "streamerCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"streamer": streamerCheck.checked}, function () {
                            if (streamerCheck.checked)
                                streamerList.style.display = ""
                            else
                                streamerList.style.display = "none"

                            confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        createElement('div', {
            id: "streamerList",
            style: function f() {
                if (settings.streamer) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('br'),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerHotkeys"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerHotkeys")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerKeys,
                        id: "streamerKeysCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerKeys": streamerKeysCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('span', {
                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
            }),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("streamerPip"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipStreamerPip")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerPip,
                        id: "streamerPipCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerPip": streamerPipCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('br'),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurOnStart"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurOnStart")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurOnStart,
                        id: "blurOnStartCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurOnStart": blurOnStartCheck.checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurReport"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurReport")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurReport,
                        id: "blurReportCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurReport": blurReportCheck.checked}, function () {
                                if (blurReportCheck.checked) {
                                    document.getElementById("report-screen").style.filter = "blur(10px)"
                                } else {
                                    document.getElementById("report-screen").style.filter = ""
                                }
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("remoteBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipRemoteBlurStrength")
                    }),
                    createElement('input', {
                        type: "range",
                        id: "blurFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: settings.blurFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurFilter": blurFilter.value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurPreviews"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurPreviews")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.blurPreview,
                        id: "blurPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"blurPreview": blurPreviewCheck.checked}, function () {
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("previewBlurStrength"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPreviewBlurStrength")
                    }),
                    createElement('input', {
                        type: "range",
                        id: "blurPreviewFilter",
                        style: "vertical-align: middle!important;",
                        min: 0,
                        max: 200,
                        value: settings.blurPreviewFilter,
                        onchange: () => {
                            chrome.storage.sync.set({"blurPreviewFilter": blurPreviewFilter.value}, function () {
                                confirmAndReload()
                            })
                        }
                    })
                ]),
            ]),

            createElement('br'),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("blurCoverLocal"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipBlurCoverLocal")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.streamerMirror,
                        id: "streamerMirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"streamerMirror": streamerMirrorCheck.checked}, function () {
                            });
                        }
                    })
                ]),
            ]),

            createElement('br'),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverBlur"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverBlur")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.cover,
                        id: "coverCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"cover": coverCheck.checked}, function () {
                                confirmAndReload()

                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverPreview"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverPreview")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.coverPreview,
                        id: "coverPreviewCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverPreview": coverPreviewCheck.checked}, function () {
                                confirmAndReload()

                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("coverOverNoise"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipCoverOverNoise")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.coverNoise,
                        id: "coverNoiseCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"coverNoise": coverNoiseCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {}, [
                createElement('button', {
                    style: "margin-top: 2px",
                    onclick: () => {
                        const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), settings.coverSrc)
                        if (result) {
                            chrome.storage.sync.set({"coverSrc": result}, function () {
                                cover.src = result
                            });
                        }
                    },
                }, [
                    createElement('b', {
                        innerText: chrome.i18n.getMessage("coverSrc")
                    })
                ]),
            ]),
            createElement('br'),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("b", {
                        innerText: chrome.i18n.getMessage("nsfwjsAlfa"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipNsfwjsAlfa")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.nsfw,
                        id: "nsfwCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"nsfw": nsfwCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("letUnblurInitial"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipLetUnblurInitial")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.nsfwjsUnblur,
                        id: "nsfwjsUnblurCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"nsfwjsUnblur": nsfwjsUnblurCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("letUnblurAuto"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipLetUnblurAuto")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.letUnblur,
                        id: "letUnblurCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"letUnblur": letUnblurCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),


            createElement('br'),
            createElement('dd', {}, [
                createElement('details', {}, [
                    createElement("summary", {
                        innerText: chrome.i18n.getMessage("nsfwjsConfig")
                    }),
                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("blurDuration"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipBlurDuration")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.BLUR_DURATION,
                                min: 1,
                                max: 20,
                                step: 1,
                                id: "sBlurDuration",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),

                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("delay"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipDelay")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.TIMEOUT,
                                min: 50,
                                max: 10000,
                                step: 10,
                                id: "sTimeout",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),
                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("predicationsArraySize"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipPredicationsArraySize")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.PREDICATIONS_ARRAY_SIZE,
                                min: 1,
                                max: 10,
                                step: 1,
                                id: "sPredicationsArraySize",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),


                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("scoreToBlur"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipScoreToBlur")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.BLUR_PANIC,
                                min: 1,
                                max: 100,
                                step: 1,
                                id: "sBlurPanic",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),

                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("propabilityToCount"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipPropabilityToCount")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.PANIC_PROPABILITY,
                                min: 0.1,
                                max: 1.0,
                                step: 0.05,
                                id: "sPanicPropability",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),

                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("pornWeight"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipPornWeight")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.WEIGHT_PORN,
                                min: 0,
                                max: 10,
                                step: 1,
                                id: "sWeightPorn",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),

                    createElement('dd', {}, [
                        createElement('span', {}, [
                            createElement("p", {
                                innerText: chrome.i18n.getMessage("sexyWeight"),
                                className: "tooltip",
                                title: chrome.i18n.getMessage("tooltipSexyWeight")
                            }),

                            createElement('input', {
                                type: "number",
                                value: settings.nsfwjs.WEIGHT_SEXY,
                                min: 0,
                                max: 10,
                                step: 1,
                                id: "sWeightSexy",
                                onkeydown: (e) => {
                                    e.preventDefault()
                                }
                            }),
                        ]),
                    ]),
                    createElement('br'),
                    createElement('dd', {}, [
                        createElement('button', {
                            onclick: () => {
                                const result = confirm(chrome.i18n.getMessage("saveConfirm"))
                                if (result) {
                                    let nsfwjs = {
                                        nsfwjs: {
                                            PREDICATIONS_ARRAY_SIZE: sPredicationsArraySize.value,
                                            PANIC_PROPABILITY: sPanicPropability.value,
                                            WEIGHT_PORN: sWeightPorn.value,
                                            WEIGHT_SEXY: sWeightSexy.value,
                                            BLUR_DURATION: sBlurDuration.value,
                                            BLUR_PANIC: sBlurPanic.value,
                                            TIMEOUT: sTimeout.value
                                        }
                                    }
                                    settings.nsfwjs = nsfwjs.nsfwjs
                                    chrome.storage.sync.set(settings, function () {
                                        confirmAndReload()
                                    });
                                }
                            },
                        }, [
                            createElement('b', {
                                innerText: chrome.i18n.getMessage("save")
                            })
                        ]),

                        createElement('button', {
                            onclick: () => {
                                const result = confirm(chrome.i18n.getMessage("resetConfirm"))
                                if (result) {
                                    let nsfwjs = {
                                        nsfwjs: {
                                            PREDICATIONS_ARRAY_SIZE: 4,
                                            PANIC_PROPABILITY: 0.8,
                                            WEIGHT_PORN: 2,
                                            WEIGHT_SEXY: 1,
                                            BLUR_DURATION: 5,
                                            BLUR_PANIC: 6,
                                            TIMEOUT: 100
                                        }
                                    }
                                    settings.nsfwjs = nsfwjs.nsfwjs
                                    chrome.storage.sync.set(settings, function () {
                                        confirmAndReload()
                                    });
                                }
                            },
                        }, [
                            createElement('b', {
                                innerText: chrome.i18n.getMessage("reset")
                            })
                        ]),
                    ]),
                ]),
            ]),
        ])
    ])
}
