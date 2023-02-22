import Swal from "sweetalert2";
import $ from "jquery";

export function switchMode() {
    let preselect = globalThis.settings.minimalism
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
                if (!globalThis.settings.askForMode && newMode === "minimalism" && preselect) {
                    return true
                } else if (!globalThis.settings.askForMode && newMode === "full" && !preselect) {
                    return true
                } else {
                    if (newMode === "minimalism") {
                        chrome.storage.sync.set({askForMode: false, minimalism: true}, function () {
                            location.reload()
                        });
                    } else {
                        chrome.storage.sync.set({askForMode: false, minimalism: false}, function () {
                            location.reload()
                        });
                    }
                }
            }
        },
        didRender: () => {
            if (globalThis.settings.minimalism) {
                (document.getElementById('minimalism') as HTMLInputElement).checked = true  // TODO: check if it works, was 'checked' before, but ts didnt like
            } else {
                (document.getElementById('full') as HTMLInputElement).checked = true // TODO: check if it works, was 'checked' before, but ts didnt like
            }
        }
    })
}