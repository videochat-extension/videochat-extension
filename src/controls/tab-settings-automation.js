function createSettingsAutomation() {
    return createElement('div', {}, [
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

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("autoskipwrongcountry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipAutoskipWrongCountry")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.skipwrongcountry,
                    style: "margin",
                    id: "skipWrongCountryCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"skipwrongcountry": skipWrongCountryCheck.checked});
                    }
                })
            ]),
        ]),
    ])
}
