function createSettingsStats() {
    return createElement('div', {}, [
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
        ])
    ])
}
