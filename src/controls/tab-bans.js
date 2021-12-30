function createTabBans() {
    return createElement('div', {
        className: "tabs__content",
        id: "bansPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "bansInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('span', {
                    innerText: chrome.i18n.getMessage("bannedips")
                }),
                createElement('span', {
                    id: 'stBnCt'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("goodips")
                }),
                createElement('span', {
                    id: 'stNwIp'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("badips")
                }),
                createElement('span', {
                    id: 'stBnIp'
                }),
            ]
        )
    ])
}
