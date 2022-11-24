function createSettingsGeolocation() {
    return createElement('div', {}, [
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

        createElement('br'),

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
                    innerText: chrome.i18n.getMessage("showCT"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowCT")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showCT,
                    id: "tooltipShowCTCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showCT": tooltipShowCTCheck.checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('br'),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("showMoreInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowMoreInfo")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showMoreEnabledByDefault,
                    id: "showMoreCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showMoreEnabledByDefault": showMoreCheck.checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("showISP"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowISP")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.showISP,
                    id: "showISPCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showISP": showISPCheck.checked}, function () {

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
                                    targetCityButton.children[0].innerText = chrome.i18n.getMessage("prefixTargetCity") + result
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
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSound")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.targetSound,
                    id: "targetSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"targetSound": targetSoundCheck.checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        createElement('br'),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsEnable"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsEnable")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.torrentsEnable,
                    id: "torrentsEnableCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsEnable": torrentsEnableCheck.checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('span', {}, [
                createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsInfo")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.torrentsInfo,
                    id: "torrentsInfoCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsInfo": torrentsInfoCheck.checked}, function () {

                        });
                    }
                })
            ]),
        ]),

    ])
}
