function createSettingsMisc() {
    return createElement('div', {}, [
        createElement('dt', {
            innerHTML: chrome.i18n.getMessage('settingsMisc')
        }),

        createElement('dd', {}, [
            createElement('span', {}, [

                createElement("p", {
                    innerText: chrome.i18n.getMessage("sentry"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipSentry")
                }),
                createElement('input', {
                    type: "checkbox",
                    checked: settings.sentry,
                    style: "margin",
                    id: "sentryCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"sentry": sentryCheck.checked});
                    }
                })
            ]),
        ]),
        createElement('dd', {}, [
            createElement('button', {
                onclick: () => {
                    switchMode()
                },
            }, [
                createElement('b', {
                    innerText: chrome.i18n.getMessage("switchModeButtonText")
                })
            ])
        ])
    ])
}
