import {switchModeBase} from "../chatruletka/content-swal-switchmode";

export function switchModeOmegle() {
    let html = `<b>Please choose the mode that suits you best.</b><br><br>
 <form id="modeSelector">
 <input type="radio" id="minimalism" name="mode" value="minimalism">
 <label for="minimalism">simple (IP Locator & Dark Mode)<br><img src="${chrome.runtime.getURL('resources/img/' + '')}" style="border:1px solid; margin-top: 5px;"></label><br>
 <br>
 <input type="radio" id="full" name="mode" value="full">
 <label for="full">advanced (full power, work-in-progress)</label></form>`
    switchModeBase(html)
}