function createSettingsBlacklist() {
    return createElement('div', {}, [
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
        ])
    ])
}
