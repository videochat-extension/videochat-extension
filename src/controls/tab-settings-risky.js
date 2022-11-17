function createSettingsRisky() {
    return createElement('div', {
        style: function f() {
            if (isDevMode()) {
                return ""
            } else {
                return "display:none"
            }
        }(),
    }, [
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
                            "showDangerWarning": riskyCheck.checked,
                        }, function () {
                            if (riskyCheck.checked) {
                                riskyList.style.display = ""
                                showDangerWarning()
                            } else {
                                riskyList.style.display = "none"
                            }

                            if (settings.ws || settings.mirror || settings.mirrorAlt || settings.prikol)
                                confirmAndReload()
                        })
                    }
                })
            ]),
        ]),

        createElement('dd', {
            id: "riskyList",
            style: function f() {
                if (settings.risky && isDevMode()) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            createElement('br'),
            createElement('dt', {
                innerHTML: chrome.i18n.getMessage("settingsCameraHijack"),
                className: "tooltip",
                style: "display: inline-block",
                title: chrome.i18n.getMessage("warningCameraHijack")
            }),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("mirror"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipMirror1")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.mirror,
                        id: "mirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "mirror": mirrorCheck.checked,
                                "mirrorAlt": false,
                                "prikol": false
                            }, function () {
                                mirrorAltCheck.checked = false
                                prikolCheck.checked = false
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("mirror2"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipMirror2")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.mirrorAlt,
                        id: "mirrorAltCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "": false,
                                "mirrorAlt": mirrorAltCheck.checked,
                                "prikol": false
                            }, function () {
                                mirrorCheck.checked = false
                                prikolCheck.checked = false
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),
            createElement('dd', {
                style: function f() {
                    if (isDevMode()) {
                        return ""
                    } else {
                        return "display:none"
                    }
                }()
            }, [
                createElement('span', {}, [
                    createElement("p", {
                        innerText: chrome.i18n.getMessage("prikol"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipPrikol")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.prikol,
                        id: "prikolCheck",
                        onclick: () => {
                            chrome.storage.sync.set({
                                "mirror": false,
                                "mirrorAlt": false,
                                "prikol": prikolCheck.checked
                            }, function () {
                                mirrorCheck.checked = false
                                mirrorAltCheck.checked = false
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('br'),
            createElement('dt', {
                innerHTML: chrome.i18n.getMessage("settingsWS"),
                className: "tooltip",
                style: "display: inline-block",
                title: chrome.i18n.getMessage("warningWS")
            }),
            createElement('dd', {}, [
                createElement('span', {}, [
                    createElement("b", {
                        innerText: chrome.i18n.getMessage("enableWS"),
                        className: "tooltip",
                        title: chrome.i18n.getMessage("tooltipEnableWS")
                    }),
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.ws,
                        id: "wsCheck",
                        onclick: () => {
                            chrome.storage.sync.set({"ws": wsCheck.checked}, function () {
                                confirmAndReload()
                            });
                        }
                    })
                ]),
            ]),

            createElement('dd', {}, [
                createElement('br'),
                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("skipSoundWS"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipSkipSoundWS")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.theyskipsound,
                            id: "wsconfigtheyskipsoundCheck",
                            onclick: () => {
                                settings.wsconfig.theyskipsound = wsconfigtheyskipsoundCheck.checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("skipWrongCountry"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipSkipWrongCountry")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.skipwrongcountry,
                            id: "wsconfigskipwrongcountryCheck",
                            onclick: () => {
                                settings.wsconfig.skipwrongcountry = wsconfigskipwrongcountryCheck.checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("replacePreview"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipReplacePreview")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.replacePic,
                            id: "wsconfigreplacePicCheck",
                            onclick: () => {
                                settings.wsconfig.replacePic = wsconfigreplacePicCheck.checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("deletePreview"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipDeletePreview")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.deletePic,
                            id: "wsconfigdeletePicCheck",
                            onclick: () => {
                                settings.wsconfig.deletePic = wsconfigdeletePicCheck.checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),


                createElement('dd', {}, [
                    createElement('span', {}, [
                        createElement("p", {
                            innerText: chrome.i18n.getMessage("replaceReportPic"),
                            className: "tooltip",
                            title: chrome.i18n.getMessage("tooltipReplaceReportPic")
                        }),
                        createElement('input', {
                            type: "checkbox",
                            checked: settings.wsconfig.replaceReportPics,
                            id: "wsconfigreplaceReportPicsCheck",
                            onclick: () => {
                                settings.wsconfig.replaceReportPics = wsconfigreplaceReportPicsCheck.checked
                                chrome.storage.sync.set({"wsconfig": settings.wsconfig}, function () {

                                });
                            }
                        })
                    ]),
                ]),

            ])
        ])
    ])
}
