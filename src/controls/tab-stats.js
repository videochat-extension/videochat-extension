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

function updStats(force) {
    stWhole.innerText = settings.stats.countAll
    stMlSk.innerText = settings.stats.countMaleSkip
    stFmlSk.innerText = settings.stats.countFemaleSkip
    stMlCnt.innerText = settings.stats.countMales
    stFmlCnt.innerText = settings.stats.countFemales
    stMnSk.innerText = settings.stats.countManSkip
    stBnCt.innerText = local.ips.length
    stNwIp.innerText = settings.stats.countNew
    stBnIp.innerText = settings.stats.countDup

    stTime.innerText = secondsToTime(settings.stats.time)
    countBeforeSaveStats += 1
    if (force || countBeforeSaveStats >= 10) {
        countBeforeSaveStats = 0
        chrome.storage.sync.set({"stats": settings.stats});
    }

}