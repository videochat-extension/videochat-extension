import * as utils from "./utils";
import $ from "jquery";

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

export function injectCounter() {
    setInterval(() => {
        if (document.getElementsByClassName("remoteTM").length > 0) {
            if ((document.getElementById("localStage") as HTMLElement).innerText === "3") {
                for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                    el.innerText = utils.secondsToHms(+new Date() / 1000 - globalThis.startDate)
                }
            }
        }
        if (document.getElementsByClassName("remoteTZ").length > 0 && document.getElementsByClassName("remoteTime").length > 0) {
            for (let el of document.getElementsByClassName("remoteTime") as HTMLCollectionOf<HTMLElement>) {
                try {
                    el.innerText = new Date().toLocaleTimeString("ru", {timeZone: $(el).parent().find('.remoteTZ')[0].innerText}).slice(0, -3)
                } catch {
                    el.innerText = "???"
                }
            }
        }
    }, 1000)
}