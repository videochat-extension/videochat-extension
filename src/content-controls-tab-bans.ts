import * as utils from "./utils";

export function createTabBans() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "bansPanel",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
                id: "bansInfo",
                style: "overflow-y: auto; margin-top: 3px"
            },
            [
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("bannedips")
                }),
                utils.createElement('span', {
                    id: 'stBnCt'
                }),
                utils.createElement('br'),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("goodips")
                }),
                utils.createElement('span', {
                    id: 'stNwIp'
                }),
                utils.createElement('br'),
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("badips")
                }),
                utils.createElement('span', {
                    id: 'stBnIp'
                }),
            ]
        )
    ])
}