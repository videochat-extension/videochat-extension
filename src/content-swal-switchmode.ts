import Swal from "sweetalert2";
import $ from "jquery";
import * as utils from "./utils";

require('arrive')

export function createSwitchModeButton() {
    return utils.createElement('button', {
        onclick: () => {
            switchMode()
        },
    }, [
        utils.createElement('b', {
            innerText: chrome.i18n.getMessage("switchModeButtonText")
        })
    ])
}

export function createSwitchModeButtonContainer() {
    return utils.createElement('div', {
        id: "switchModeButtonContainer"
    }, [
        utils.createElement('br'),
        createSwitchModeButton(),
        utils.createElement('span', {
            innerText: " "
        }),
        utils.createElement('span', {
            id: "apiStatusContainer"
        })
    ])
}

export function switchMode() {
    let preselect = globalThis.platformSettings.get("minimalism")
    Swal.fire({
        title: chrome.i18n.getMessage("switchModeTitle"),
        allowOutsideClick: false,
        heightAuto: false,
        html: `${chrome.i18n.getMessage("switchModeText")}<br><br>
 <form id="modeSelector">
 <input type="radio" id="minimalism" name="mode" value="minimalism">
 <label for="minimalism">${chrome.i18n.getMessage("switchModeLabelMod1")}<br><img src="${chrome.runtime.getURL('resources/img/' + chrome.i18n.getMessage("minimalismImg"))}" style="border:1px solid" width="300px"></label><br>
 <br>
 <input type="radio" id="full" name="mode" value="full">
 <label for="full">${chrome.i18n.getMessage("switchModeLabelMod2")}</label></form>`,
        preConfirm: () => {
            let newMode = $("#modeSelector").serializeArray()[0]['value']
            if (typeof newMode === "undefined") {
                return false
            } else {
                if (!globalThis.platformSettings.get("askForMode") && newMode === "minimalism" && preselect) {
                    return true
                } else if (!globalThis.platformSettings.get("askForMode") && newMode === "full" && !preselect) {
                    return true
                } else {
                    if (newMode === "minimalism") {
                        globalThis.platformSettings.setBack({askForMode: false, minimalism: true}, function () {
                            location.reload()
                        });
                    } else {
                        globalThis.platformSettings.setBack({askForMode: false, minimalism: false}, function () {
                            location.reload()
                        });
                    }
                }
            }
        },
        didRender: () => {
            if (globalThis.platformSettings.get("minimalism")) {
                (document.getElementById('minimalism') as HTMLInputElement).checked = true
            } else {
                (document.getElementById('full') as HTMLInputElement).checked = true
            }
        }
    })
}