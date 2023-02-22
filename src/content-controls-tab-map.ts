import * as utils from "./utils";

export function createTabMap() {
    return utils.createElement('div', {
        className: "tabs__content",
        id: "faceapiContent",
        style: "height:100%;"
    }, [
        utils.createElement('div', {
            id: "mapid",
            style: "width: 100%; margin-top: 1px;"
        })
    ])
}