import * as utils from "./utils";

export function createSettingsBlacklist() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsBlacklist")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskip"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskip")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.autoBan,
                    id: "autoBanCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"autoBan": (document.getElementById("autoBanCheck") as HTMLInputElement).checked}, function () {
                            //confirmAndReload()
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("donotbanmobile"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipDonotbanmobile")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.dontBanMobile,
                    id: "dontBanMobileCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"dontBanMobile": (document.getElementById("dontBanMobileCheck") as HTMLInputElement).checked}, function () {
                            //confirmAndReload()
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("p", {
                    innerText: chrome.i18n.getMessage("ban_sound"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSkipSound")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.skipSound,
                    id: "skipSoundCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipSound": (document.getElementById("skipSoundCheck") as HTMLInputElement).checked}, function () {
                        });
                    }
                })
            ]),
        ]),

        utils.createElement('dd', {}, [
            utils.createElement('button', {
                style: "margin-top: 2px",
                onclick: () => {
                    const result = confirm("Clear?");
                    if (result) {
                        globalThis.local.ips = []
                        chrome.storage.local.set({"ips": []}, function () {
                            // TODO: FIX updStats
                            // updStats(true)
                        });
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: chrome.i18n.getMessage("clearblacklist")
                })
            ])
        ])
    ])
}