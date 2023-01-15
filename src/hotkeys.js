function hotkeys(e) {
    if (e.srcElement.className === "emojionearea-editor" || e.srcElement.id === "mapid" || $(".swal2-popup").length > 0)
        return

    switch (e.key) {
        case "ArrowLeft":
            if (document.getElementById("report-popup").style.display === "block")
                document.getElementsByClassName("btn btn-gray")[2].click()
            else {
                if (e.shiftKey && !local.ips.includes(remoteIP.innerText))
                    syncBlackList()

                document.getElementsByClassName('buttons__button start-button')[0].click()
            }
            break;

        case "ArrowUp":
            document.getElementsByClassName('buttons__button stop-button')[0].click()
            break;

        case "ArrowDown":
            if (document.getElementsByClassName("message-report-link tr").length !== 0) 
                document.getElementsByClassName("message-report-link tr")[0].click()
            break;

        case "ArrowRight":
            if (document.getElementById("report-popup").style.display === "block")
                document.getElementsByClassName("btn btn-main send-report")[1].click()
            break;
    }
}


document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
    if (e.shiftKey && !local.ips.includes(remoteIP.innerText)) {
        syncBlackList()
    }
})