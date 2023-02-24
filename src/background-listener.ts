import * as utils from "./utils";
import $ from "jquery";
import * as DOMPurify from "dompurify";
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
        if (request.ipData) {
            console.dir(`ip-api.com returned ${request.apiCode} for ${request.apiQuery}.`)
            if (globalThis.curIps.includes(request.apiQuery)) {
                if (request.apiCode === 200) {
                    processData(request.ipData, request.apiQuery)
                } else {
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + request.apiCode + "</b>")
                    if (globalThis.settings.enableTargetCity || globalThis.settings.enableTargetRegion) {
                        if (request.status === 429) {
                            globalThis.driver.stopAndStart(5000)
                        }
                    }
                }
            }
        }
    }
);