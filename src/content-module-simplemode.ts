import $ from "jquery";
import {injectSwitchModeButton} from "./content-swal-switchmode";

export function startMinimalism() {
    const onChangeStageMinimalism = function (mutations: MutationRecord[]) {
        mutations.forEach(function (mutation: MutationRecord) {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-search")) {
                    globalThis.curIps = []
                } else if (attributeValue.includes("s-stop")) {
                    globalThis.curIps = []
                }
            }
        });
    }

    let observerForStage = new MutationObserver(onChangeStageMinimalism)
    observerForStage.observe(document.getElementById('remote-video-wrapper') as HTMLElement, {attributes: true});

    // make

    injectSwitchModeButton(true)
}
