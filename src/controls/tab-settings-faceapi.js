function createSettingsFaceapi() {
    return createElement('div', {}, [
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
    ])
}
