// ugly way to notify user that extension was updated and page needs to be reloaded

import Swal from "sweetalert2";

let updateNeedReloadTitle = chrome.i18n.getMessage('updateNeedReloadTitle')
let updateNeedReloadText = chrome.i18n.getMessage('updateNeedReloadText')
let updateNeedReloadConfirmButtonText = chrome.i18n.getMessage("updateNeedReloadConfirmButtonText")
let updateNeedReloadInterval = setInterval(() => {
    try {
        chrome.i18n.getMessage('lang')
    } catch (e: any) {
        if (e.message === "Extension context invalidated.") {
            clearInterval(updateNeedReloadInterval)
            Swal.fire({
                icon: 'info',
                toast: true,
                width: 600,
                position: 'bottom-start',
                title: updateNeedReloadTitle,
                html: updateNeedReloadText,
                confirmButtonText: updateNeedReloadConfirmButtonText
            })
        }
    }
}, 10000)
