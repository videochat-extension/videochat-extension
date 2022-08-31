async function showDangerWarning() {
    Swal.fire({
        title: chrome.i18n.getMessage("dangerWarningTitle"),
        icon: 'warning',
        heightAuto: false,
        showCancelButton: true,
        showDenyButton: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        confirmButtonText: chrome.i18n.getMessage("dangerWarningConfirmButtonText"),
        cancelButtonText: chrome.i18n.getMessage("dangerWarningCancelButtonText"),
        denyButtonText: chrome.i18n.getMessage("dangerWarningDenyButtonText"),
        html: chrome.i18n.getMessage("dangerWarningHtmlContent"),
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // nothing
        } else if (result.isDenied) {
            chrome.storage.sync.set({risky: false}, () => {
                location.reload()
            })
        } else if (result.isDismissed) {
            chrome.storage.sync.set({showDangerWarning: false})
        }
    })
}
