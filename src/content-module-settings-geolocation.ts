import * as utils from "./utils";
import {createSettingsHeader} from "./content-module-settings";

export function createSettingsGeolocation() {
    return utils.createElement('div', {}, [
        createSettingsHeader(chrome.i18n.getMessage("settingsGeolocation")),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("apiLocalisation"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipApiLocalisation")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.ipApiLocalisation,
                    id: "ipApiLocalisationCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"ipApiLocalisation": (document.getElementById("ipApiLocalisationCheck") as HTMLInputElement).checked});
                    }
                })
            ]),
        ]),

        utils.createElement('br'),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("hideMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipHideMobile")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hideMobileLocation,
                    id: "hideMobileLocationCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hideMobileLocation": (document.getElementById("hideMobileLocationCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showCT"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowCT")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.showCT,
                    id: "tooltipShowCTCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showCT": (document.getElementById("tooltipShowCTCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        utils.createElement('br'),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showMoreInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowMoreInfo")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.showMoreEnabledByDefault,
                    id: "showMoreCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showMoreEnabledByDefault": (document.getElementById("showMoreCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("showISP"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipShowISP")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.showISP,
                    id: "showISPCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"showISP": (document.getElementById("showISPCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetCity"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetCity")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.enableTargetCity,
                    id: "targetCityCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableTargetCity": (document.getElementById("targetCityCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("targetCityCheck") as HTMLInputElement).checked)
                                (document.getElementById("targetCityDiv") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("targetCityDiv") as HTMLElement).style.display = "none"
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('div', {
            id: "targetCityDiv",
            style: function f() {
                if (globalThis.settings.enableTargetCity) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('dd', {}, [
                utils.createElement('button', {
                        id: "targetCityButton",
                        style: "margin-top: 2px",
                        onclick: () => {
                            const result = prompt(chrome.i18n.getMessage("promptTargetCity"), globalThis.settings.targetCity)
                            if (result) {
                                chrome.storage.sync.set({"targetCity": result}, function () {
                                    ((document.getElementById("targetCityButton") as HTMLElement).children[0] as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                                });
                            }
                        },
                    },
                    [
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetCity") + globalThis.settings.targetCity
                        })
                    ]),
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetRegion"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetRegion")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.enableTargetRegion,
                    id: "targetRegionCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"enableTargetRegion": (document.getElementById("targetRegionCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("targetRegionCheck") as HTMLInputElement).checked)
                                (document.getElementById("targetRegionDiv") as HTMLElement).style.display = ""
                            else
                                (document.getElementById("targetRegionDiv") as HTMLElement).style.display = "none"
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('div', {
            id: "targetRegionDiv",
            style: function f() {
                if (globalThis.settings.enableTargetRegion) {
                    return ""
                } else {
                    return "display:none"
                }
            }(),
        }, [
            utils.createElement('dd', {}, [
                utils.createElement('button', {
                        id: "targetRegionButton",
                        style: "margin-top: 2px",
                        onclick: () => {
                            const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), globalThis.settings.targetRegion)
                            if (result) {
                                chrome.storage.sync.set({"targetRegion": result}, function () {
                                    ((document.getElementById("targetRegionButton") as HTMLElement).children[0] as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                                });
                            }
                        },
                    },
                    [
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("prefixTargetRegion") + globalThis.settings.targetRegion
                        })
                    ]),
            ]),
        ]),
        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSkipMobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSkipMobile")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.skipMobileTarget,
                    id: "skipMobileTargetCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipMobileTarget": (document.getElementById("skipMobileTargetCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("targetSound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTargetSound")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.targetSound,
                    id: "targetSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"targetSound": (document.getElementById("targetSoundCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

        utils.createElement('br'),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsEnable"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsEnable")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.torrentsEnable,
                    id: "torrentsEnableCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsEnable": (document.getElementById("torrentsEnableCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("torrentsInfo"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipTorrentsInfo")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.torrentsInfo,
                    id: "torrentsInfoCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"torrentsInfo": (document.getElementById("torrentsInfoCheck") as HTMLInputElement).checked}, function () {

                        });
                    }
                })
            ]),
        ]),

    ])
}