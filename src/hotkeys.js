function hotkeys(e) {
    if (e.srcElement.className === "emojionearea-editor")
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
            document.getElementsByClassName("message-report-link tr")[0].click()
            break;

        case "ArrowRight":
            if (document.getElementById("report-popup").style.display === "block")
                document.getElementsByClassName("btn btn-main send-report")[1].click()
            break;
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.command) {
            case "skip":
                document.getElementsByClassName('buttons__button start-button')[0].click()
                sendResponse(200)
                break;

            case "skip_ban":
                if (!local.ips.includes(remoteIP.innerText)) {
                    syncBlackList()
                }

                document.getElementsByClassName('buttons__button start-button')[0].click()
                sendResponse(200)
                break;


            case "stop":
                document.getElementsByClassName('buttons__button stop-button')[0].click()
                sendResponse(200)
                break;

            case "screen_remote":
                dwncanvas = document.createElement('canvas');
                dwncanvas.width = document.getElementById('remote-video').videoWidth
                dwncanvas.height = document.getElementById('remote-video').videoHeight

                var ctx = dwncanvas.getContext('2d');

                ctx.drawImage(document.getElementById("remote-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                downloadImage(dwncanvas.toDataURL('image/jpg'))
                dwncanvas = null
                sendResponse(200)
                break;

            case "screen_local":
                dwncanvas = document.createElement('canvas');
                dwncanvas.width = document.getElementById('local-video').videoWidth
                dwncanvas.height = document.getElementById('local-video').videoHeight

                var ctx = dwncanvas.getContext('2d');

                ctx.drawImage(document.getElementById("local-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                downloadImage(dwncanvas.toDataURL('image/jpg'))
                dwncanvas = null
                sendResponse(200)
                break;
        }
    }
);

document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
    if (e.shiftKey && !local.ips.includes(remoteIP.innerText)) {
        syncBlackList()
    }
})