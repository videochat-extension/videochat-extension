import $ from "jquery";
import * as utils from "./utils";
import {onUpdateIP} from "./content-module-geolocation";
import {injectSwitchModeButton} from "./content-swal-switchmode";

export function startMinimalism() {
    $(utils.createElement('p', {
        id: "remoteIP", style: "display: none;"
    })).appendTo($("body"))

    const onChangeStageMinimalism = function (mutations: MutationRecord[]) {
        mutations.forEach(function (mutation: MutationRecord) {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-search")) {
                    if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                        (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                    globalThis.curIps = []
                } else if (attributeValue.includes("s-stop")) {
                    if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                        (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                    globalThis.curIps = []
                }
            }
        });
    }

    let observerForStage = new MutationObserver(onChangeStageMinimalism)
    observerForStage.observe(document.getElementById('remote-video-wrapper') as HTMLElement, {attributes: true});

    const observer = new MutationObserver(onUpdateIP)
    observer.observe(document.getElementById('remoteIP') as HTMLElement, {
        attributes: true,
        childList: true,
        characterData: true
    });

    injectSwitchModeButton(false)

}
