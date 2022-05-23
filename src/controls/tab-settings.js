let needReload = false

function confirmAndReload() {
    if (!needReload) {
        needReload = true
        connectionStatus.setAttribute("data-tooltip", chrome.i18n.getMessage("reloadRequired"))
        connectionStatus.className = "tooltip-multiline tooltip-bottom"
        connectionStatus.parentElement.href = "."
        connectionStatus.parentElement.target = ""
        connectionStatus.style.color = "red"

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener('click', () => {
            if (confirm(chrome.i18n.getMessage("reloadRequired"))) {
                location.reload()
            }
        })
    }
}

function createTabSettings() {
    return createElement('div', {
        className: "tabs__content",
        id: "settingsPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "settingsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('dl', {},
                    [
                        createSettingsInterface(),
                        createElement('br'),

                        createSettingsAutomation(),
                        createElement('br'),

                        createSettingsGeolocation(),
                        createElement('br'),

                        createSettingsFaceapi(),
                        createElement('br'),

                        createSettingsBlacklist(),
                        createElement('br'),

                        createSettingsHotkeys(),
                        createElement('br'),

                        createSettingsRisky(),
                        createElement('br'),

                        createSettingsStreamer(),
                        createElement('br'),

                        createSettingsStats()
                    ]
                ),
            ])
    ])
}
