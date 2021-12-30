let needReload = false
function confirmAndReload() {
    if (!needReload) {
        const result = confirm(chrome.i18n.getMessage("reload"));
        if (result) {
            location.reload()
        } else {
            needReload = true
            connectionStatus.setAttribute("data-tooltip", chrome.i18n.getMessage("reloadRequired"))
            connectionStatus.className = "tooltip-multiline tooltip-bottom"
            connectionStatus.parentElement.href = "."
            connectionStatus.parentElement.target = ""
            connectionStatus.style.color = "red"

            document.getElementsByClassName('buttons__button start-button')[0].addEventListener('click', () => {
                if (confirm(chrome.i18n.getMessage("reloadRequired"))) {
                    location.reload()
                }
            })
        }
    }
}

function createTabSettings() {
    return createElement('div', {
        className: "tabs__content",
        id: "settingsPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "settingsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('dl', {},
                    [
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("settingsInterface")
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("watermark"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipWatermark"),
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.hideWatermark,
                                    id: "hideWatermarkCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"hideWatermark": hideWatermarkCheck.checked}, function () {
                                            if (hideWatermarkCheck.checked) {
                                                document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 0.0
                                            } else {
                                                document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 1.0
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("banner"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage('tooltipBanner')
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.hideBanner,
                                    id: "hideBannerCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"hideBanner": hideBannerCheck.checked}, function () {
                                            if (hideBannerCheck.checked) {
                                                document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 0.0
                                            } else {
                                                document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 1.0
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage('doNotReflect'),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage('tooltipDoNotReflect')
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.doNotReflect,
                                    id: "doNotReflectCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"doNotReflect": doNotReflectCheck.checked}, function () {
                                            if (doNotReflectCheck.checked) {
                                                $("#local-video").removeClass("video-container-local-video")
                                            } else {
                                                $("#local-video").addClass("video-container-local-video")
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),


                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage('hideCamera'),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage('tooltiphideCamera')
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.hideCamera,
                                    id: "hideCameraCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"hideCamera": hideCameraCheck.checked}, function () {
                                            if (hideCameraCheck.checked) {
                                                $("#local-video-wrapper")[0].style.display = "none"
                                            } else {
                                                $("#local-video-wrapper")[0].style.display = ""
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),


                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage('settingsAutomation')
                        }),

                        createElement('dd', {}, [
                            createElement('span', {}, [

                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("autoskipfour"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipFour")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.skipFourSec,
                                    style: "margin",
                                    id: "skipFourSecCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"skipFourSec": skipFourSecCheck.checked});
                                    }
                                })
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [

                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("autoresume"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipAutoresume")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.autoResume,
                                    id: "autoResumeCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({
                                            "autoResume": autoResumeCheck.checked
                                        }, () => {
                                            confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("settingsGeolocation"),
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("apiLocalisation"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipApiLocalisation")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.ipApiLocalisation,
                                    id: "ipApiLocalisationCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"ipApiLocalisation": ipApiLocalisationCheck.checked}, function () {
                                            if (ipApiLocalisationCheck.checked) {
                                                language = window.navigator.language.slice(0, 2)

                                                if (language === "pt")
                                                    language = "pt-BR"
                                                else if (language === "zh")
                                                    language = "zh-CN"
                                            } else {
                                                language = "en"
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("hideMobile"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipHideMobile")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.hideMobileLocation,
                                    id: "hideMobileLocationCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"hideMobileLocation": hideMobileLocationCheck.checked}, function () {

                                        });
                                    }
                                })
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("showMoreInfo"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipShowMoreInfo")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.showMore,
                                    id: "showMoreCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"showMore": showMoreCheck.checked}, function () {

                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("targetCity"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipTargetCity")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.enableTargetCity,
                                    id: "targetCityCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"enableTargetCity": targetCityCheck.checked}, function () {
                                            if (targetCityCheck.checked)
                                                targetCityDiv.style.display = ""
                                            else
                                                targetCityDiv.style.display = "none"
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('div', {
                            id: "targetCityDiv",
                            style: function f() {
                                if (settings.enableTargetCity) {
                                    return ""
                                } else {
                                    return "display:none"
                                }
                            }(),
                        }, [
                            createElement('dd', {}, [
                                createElement('button', {
                                        id: "targetCityButton",
                                        style: "margin-top: 2px",
                                        onclick: () => {
                                            const result = prompt(chrome.i18n.getMessage("promptTargetCity"), settings.targetCity)
                                            if (result) {
                                                chrome.storage.sync.set({"targetCity": result}, function () {
                                                    targetCityButton.children[0].innerText = 'target: ' + result
                                                });
                                            }
                                        },
                                    },
                                    [
                                        createElement('b', {
                                            innerText: chrome.i18n.getMessage("prefixTargetCity") + settings.targetCity
                                        })
                                    ]),
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("targetRegion"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipTargetRegion")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.enableTargetRegion,
                                    id: "targetRegionCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"enableTargetRegion": targetRegionCheck.checked}, function () {
                                            if (targetRegionCheck.checked)
                                                targetRegionDiv.style.display = ""
                                            else
                                                targetRegionDiv.style.display = "none"
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('div', {
                            id: "targetRegionDiv",
                            style: function f() {
                                if (settings.enableTargetRegion) {
                                    return ""
                                } else {
                                    return "display:none"
                                }
                            }(),
                        }, [
                            createElement('dd', {}, [
                                createElement('button', {
                                        id: "targetRegionButton",
                                        style: "margin-top: 2px",
                                        onclick: () => {
                                            const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), settings.targetRegion)
                                            if (result) {
                                                chrome.storage.sync.set({"targetRegion": result}, function () {
                                                    targetRegionButton.children[0].innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                                                });
                                            }
                                        },
                                    },
                                    [
                                        createElement('b', {
                                            innerText: chrome.i18n.getMessage("prefixTargetRegion") + settings.targetRegion
                                        })
                                    ]),
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("targetSkipMobile"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipTargetSkipMobile")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.skipMobileTarget,
                                    id: "skipMobileTargetCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"skipMobileTarget": skipMobileTargetCheck.checked}, function () {

                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("genderRecognition")
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("forcedApi"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipForcedRecognition")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.enableFaceApi,
                                    id: "enableFaceApiCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"enableFaceApi": enableFaceApiCheck.checked}, function () {
                                            if (!faceApiLoaded)
                                                confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('dd', {}, [
                            createElement('span', {}, [

                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("skip_males"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipSkipMales")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.skipMale,
                                    id: "skipMaleCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"skipMale": skipMaleCheck.checked}, function () {
                                            if (!faceApiLoaded)
                                                confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("skip_females"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipSkipFemales")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.skipFemale,
                                    id: "skipFemaleCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"skipFemale": skipFemaleCheck.checked}, function () {
                                            if (!faceApiLoaded)
                                                confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("settingsBlacklist")
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("autoskip"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipAutoskip")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.autoBan,
                                    id: "autoBanCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"autoBan": autoBanCheck.checked}, function () {
                                            //confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("donotbanmobile"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipDonotbanmobile")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.dontBanMobile,
                                    id: "dontBanMobileCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"dontBanMobile": dontBanMobileCheck.checked}, function () {
                                            //confirmAndReload()
                                        });
                                    }
                                })
                            ]),
                        ]),


                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("ban_sound"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipSkipSound")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.skipSound,
                                    id: "skipSoundCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"skipSound": skipSoundCheck.checked}, function () {
                                        });
                                    }
                                })
                            ]),
                        ]),

                        createElement('dd', {}, [
                            createElement('button', {
                                style: "margin-top: 2px",
                                onclick: () => {
                                    const result = confirm("Clear?");
                                    if (result) {
                                        local.ips = []
                                        chrome.storage.local.set({"ips": []}, function () {
                                            updStats(true)
                                        });
                                    }
                                },
                            }, [
                                createElement('b', {
                                    innerText: chrome.i18n.getMessage("clearblacklist")
                                })
                            ])
                        ]),

                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("settingsHotkeys")
                        }),
                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("b", {
                                    innerText: chrome.i18n.getMessage("enablehotkeys"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipEnableHotkeys")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.hotkeys,
                                    id: "hotkeysCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({"hotkeys": hotkeysCheck.checked}, function () {
                                            if (hotkeysCheck.checked) {
                                                document.removeEventListener('keyup', hotkeys)
                                                document.addEventListener('keyup', hotkeys)
                                            } else {
                                                document.removeEventListener('keyup', hotkeys)
                                            }
                                        });
                                    }
                                })
                            ]),
                        ]),
                        createElement('br'),

                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("hotkeys")
                        }),

                        createElement('br'),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("risky"),
                            style: "display: inline-block",
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipEnableRisky")
                        }),

                        createElement('br'),

                        createElement('dd', {}, [
                            createElement('span', {}, [
                                createElement("p", {
                                    innerText: chrome.i18n.getMessage("enableRisky"),
                                    className: "tooltip",
                                    title: chrome.i18n.getMessage("tooltipEnableRisky")
                                }),
                                createElement('input', {
                                    type: "checkbox",
                                    checked: settings.risky,
                                    id: "riskyCheck",
                                    onclick: () => {
                                        chrome.storage.sync.set({
                                            "risky": riskyCheck.checked,
                                        }, function () {
                                            if (riskyCheck.checked)
                                                riskyList.style.display = ""
                                            else
                                                riskyList.style.display = "none"

                                            if (settings.ws || settings.mirror || settings.mirrorAlt || settings.prikol)
                                                confirmAndReload()
                                        })
                                    }
                                })
                            ]),
                        ]),


                        createSettingsRisky(),
                        createElement('br'),
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
                        createSettingsStreamer(),

                        createElement('br'),
                        createElement('dt', {
                            style: "margin-top: 2px",
                            innerHTML: chrome.i18n.getMessage("settingsStats")
                        }),
                        createElement('dd', {}, [
                            createElement('button', {
                                onclick: () => {
                                    const result = confirm("Clear?");
                                    if (result) {
                                        let stats = {
                                            stats: {
                                                countAll: 0,
                                                countNew: 0,
                                                countDup: 0,
                                                countMales: 0,
                                                countFemales: 0,
                                                countManSkip: 0,
                                                countMaleSkip: 0,
                                                countFemaleSkip: 0,
                                                time: 0
                                            }
                                        }
                                        settings.stats = stats.stats
                                        chrome.storage.sync.set(settings, function () {
                                            updStats(true)
                                        });
                                    }
                                },
                            }, [
                                createElement('b', {
                                    innerText: chrome.i18n.getMessage("clearStats")
                                })
                            ]),
                        ]),
                    ]),

            ])
    ])
}
