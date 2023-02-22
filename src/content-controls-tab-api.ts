import * as utils from "./utils";

export function createTabApi() {
    return utils.createElement('div', {
        className: "tabs__content active row",
        id: "apiInfoContent",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
            id: "remoteFace",
        }),
        utils.createElement('div', {
            id: "streamerStatus",
            // style: "display: none;"
        }),
        utils.createElement('div', {
            id: "apiStatus",
            style: "margin-top: 3px"
        }),
        utils.createElement('div', {
            id: "remoteInfo",
            style: "overflow-y: auto;margin-top: 3px"
        })
    ])
}