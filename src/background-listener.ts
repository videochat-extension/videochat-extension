import * as utils from "./utils";
import $ from "jquery";
import * as DOMPurify from "dompurify";
import {stopAndStart} from "./content"
import {syncBlackList} from "./content-module-blacklist"
import {processData} from "./content-module-geolocation";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.command) {
            switch (request.command) {
                case "skip": {
                    let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                    startButton.click()
                    sendResponse(200)
                    break;
                }

                case "skip_ban": {
                    // TODO: Blacklist MUST use curIps
                    // if (!globalThis.local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
                    //     syncBlackList()

                    let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                    startButton.click()
                    sendResponse(200)
                    break;
                }


                case "stop": {
                    let stopButton: HTMLElement = document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement;
                    stopButton.click()
                    sendResponse(200)
                    break;
                }

                case "screen_remote": {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                        sendResponse(200)
                    }
                    break;
                }

                case "screen_local": {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                        sendResponse(200)
                    }
                    break;
                }
            }
        }
        if (request.apiTestCode) {
            if (request.apiTestCode === 200) {
                globalThis.api = 2

                if (globalThis.settings.minimalism) {
                    if ($('span[data-tr="rules"]').length === 1) {
                        $("<span> </span>" + chrome.i18n.getMessage("apiStatus2")).appendTo($(".message-bubble")[0])
                    }
                } else {
                    (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + chrome.i18n.getMessage("main")

                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        globalThis.mapModule.resizemap(false)
                    }
                }
                console.dir(`ip-api.com test passed: ${request.apiTestCode}`)
            } else {
                api = 0
                console.dir(`ip-api.com test failed: ${request.apiTestResult} ${request.apiTestCode}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + request.apiTestResult)
                if (globalThis.settings.minimalism) {
                    if ($('span[data-tr="rules"]').length === 1) {
                        $("<span> </span>" + DOMPurify.sanitize('<b>ERROR: ' + request.apiTestResult + ' || </b>' + chrome.i18n.getMessage("apiStatus0"))).appendTo($(".message-bubble")[0])
                    }
                } else {
                    (document.getElementById("apiStatus") as HTMLElement).innerHTML = DOMPurify.sanitize('<b>ERROR: ' + request.apiTestResult + ' || </b>' + chrome.i18n.getMessage("apiStatus0"));
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        globalThis.mapModule.resizemap(false)
                    }
                }
            }
        }
        if (request.ipData) {
            console.dir(`ip-api.com returned ${request.apiCode} for ${request.apiQuery}.`)
            if (globalThis.curIps.includes(request.apiQuery)) {
                if (request.apiCode === 200) {
                    processData(request.ipData, request.apiQuery)
                } else {
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + request.apiCode + "</b>")
                    if (globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) {
                        if (request.status === 429) {
                            stopAndStart(5000)
                        }
                    }
                }
            }
        }
    }
);