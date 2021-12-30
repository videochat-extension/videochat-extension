function createTabStats() {
    return createElement('div', {
        className: "tabs__content",
        id: "statsPanel",
        style: "height:100%;"
    }, [
        createElement('div', {
                id: "statsInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsWhole")
                }),
                createElement('span', {
                    id: 'stWhole'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsTimeSpent")
                }),
                createElement('span', {
                    id: 'stTime'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMaleSkip")
                }),
                createElement('span', {
                    id: 'stMlSk'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFemaleSkip")
                }),
                createElement('span', {
                    id: 'stFmlSk'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsManualSkip")
                }),
                createElement('span', {
                    id: 'stMnSk'
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsMlCount")
                }),
                createElement('span', {
                    id: 'stMlCnt'
                }),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("statsFmlCount")
                }),
                createElement('span', {
                    id: 'stFmlCnt'
                }),
            ]
        )
    ])
}
