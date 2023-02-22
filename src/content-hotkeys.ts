import $ from "jquery";
import {syncBlackList} from "./content";

export function hotkeys(e: KeyboardEvent) {
    if ((e.target instanceof HTMLElement && e.target.className === "emojionearea-editor") || (e.target instanceof HTMLElement && e.target.id === "mapid") || $(".swal2-popup").length > 0)
        return

    switch (e.key) {
        case "ArrowLeft":
            if (document.getElementById("report-popup")?.style.display === "block") {
                let cancelReportButton: HTMLElement = document.getElementsByClassName('btn')[0] as HTMLElement;
                cancelReportButton.click()
            } else {
                if (e.shiftKey && !globalThis.local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
                    syncBlackList()

                let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                startButton.click()
            }
            break;

        case "ArrowUp":
            let stopButton: HTMLElement = document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement;
            stopButton.click()
            break;

        case "ArrowDown":
            if (document.getElementsByClassName("message-report-link tr").length !== 0) {
                let openReportButton: HTMLElement = document.getElementsByClassName("message-report-link tr")[0] as HTMLElement;
                openReportButton.click()
            }
            break;

        case "ArrowRight":
            if (document.getElementById("report-popup")?.style.display === "block") {
                let submitReportButton: HTMLElement = document.getElementsByClassName("btn btn-main send-report")[1] as HTMLElement;
                submitReportButton.click()
            }
            break;
    }
}


document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e: any) => { // TODO: any should be KeyboardEvent but TS doesn't like it
    if (e.shiftKey && !globalThis.local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
        syncBlackList()
})