chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.command) {
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
        if (request.apiTestCode) {
            if (request.apiTestCode === 200) {
                api = 2

                if (settings.minimalism) {
                    $("<br><br>"+chrome.i18n.getMessage("apiStatus2")).appendTo($(".message-bubble")[0])
                } else {
                    apiStatus.innerHTML = ''
                    remoteInfo.innerHTML = chrome.i18n.getMessage("apiStatus2") + chrome.i18n.getMessage("main")

                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        resizemap()
                    }
                }
                console.dir(`ip-api.com test passed: ${request.apiTestCode}`)
            } else {
                api = 0
                apiStatus.innerHTML = DOMPurify.sanitize('<b>ERROR: ' + request.apiTestResult + ' || </b>' + chrome.i18n.getMessage("apiStatus0"))
                remoteInfo.innerHTML = chrome.i18n.getMessage("main")
                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    resizemap()
                }
                console.dir(`ip-api.com test failed: ${request.apiTestResult} ${request.apiTestCode}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + request.apiTestResult)
            }
        }
        if (request.ipData) {
            console.dir(`ip-api.com returned ${request.apiCode} for ${request.apiQuery}.`)
            if (curIps.includes(request.apiQuery)) {
                if (request.apiCode === 200) {
                    processData(request.ipData, request.apiQuery)
                } else {
                    remoteInfo.innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + request.apiCode + "</b>")
                    if (settings.enableTargetCity || settings.enableTargetRegion) {
                        if (request.status === 429) {
                            stopAndStart(5000)
                        }
                    }
                }
            }
        }
    }
);