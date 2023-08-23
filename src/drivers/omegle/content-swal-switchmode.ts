import {switchModeBase} from "../chatruletka/content-swal-switchmode";

export function switchModeOmegle() {
    let html = `${chrome.i18n.getMessage("switchModeText")}<br><br>
 <form id="modeSelector">
 <input type="radio" id="minimalism" name="mode" value="minimalism">
 <label for="minimalism">${chrome.i18n.getMessage("switchModeOmegleLabelMod1")}
<!-- TODO: add image for simple here-->
<!-- <br><img src="${chrome.runtime.getURL('resources/img/' + '')}" style="border:1px solid; margin-top: 5px;">-->
 </label><br>
 <br>
 <input type="radio" id="full" name="mode" value="full">
 <label for="full">${chrome.i18n.getMessage("switchModeOmegleLabelMod2")}</label></form>`
    switchModeBase(html)
}