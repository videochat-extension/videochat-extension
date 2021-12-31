function createSettingsHotkeys() {
    return createElement('div', {}, [
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
    ])
}

