import $ from "jquery";
import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";

export class HotkeysModule {
    private static instanceRef: HotkeysModule;
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsHotkeys")
        },
        {
            type: "checkbox",
            important: true,
            key: "hotkeys",
            text: chrome.i18n.getMessage("enablehotkeys"),
            tooltip: chrome.i18n.getMessage("tooltipEnableHotkeys"),
            enable: () => {
                this.unregister()
                this.register()
            },
            disable: () => {
                this.unregister()
            }
        },
        {
            type: "br"
        },
        {
            type: "HTMLElement",
            element: utils.createElement('span', {
                innerHTML: chrome.i18n.getMessage("hotkeys")
            })
        },
    ]
    private driver: ChatruletkaDriver;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.remoteHotkeysListener()
    }

    static initInstance(driver: ChatruletkaDriver): HotkeysModule {
        if (HotkeysModule.instanceRef === undefined) {
            HotkeysModule.instanceRef = new HotkeysModule(driver);
        }

        return HotkeysModule.instanceRef;
    }

    public unregister() {
        document.removeEventListener('keyup', this.localHotkeys)
    }

    public register() {
        document.addEventListener('keyup', this.localHotkeys)
    }

    private localHotkeys(e: KeyboardEvent) {
        if ((e.target instanceof HTMLElement && e.target.className === "emojionearea-editor") || (e.target instanceof HTMLElement && e.target.id === "mapid") || $(".swal2-popup").length > 0)
            return

        switch (e.key) {
            case "ArrowLeft":
                if (document.getElementById("report-popup")?.style.display === "block") {
                    let cancelReportButton: HTMLElement = document.getElementsByClassName('btn')[0] as HTMLElement;
                    cancelReportButton.click()
                } else {
                    if (e.shiftKey) {
                        this.driver.modules.blacklist.addIpsToList(this.driver.modules.geolocation.curIps)
                    }

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

    private remoteHotkeysListener() {
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                if (request.command) {
                    switch (request.command) {
                        case "skip": {
                            let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                            startButton.click();
                            sendResponse(200);
                            break;
                        }

                        case "skip_ban": {
                            this.driver.modules.blacklist.addIpsToList(this.driver.modules.geolocation.curIps)

                            let startButton: HTMLElement = document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement;
                            startButton.click();
                            sendResponse(200);
                            break;
                        }


                        case "stop": {
                            let stopButton: HTMLElement = document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement;
                            stopButton.click();
                            sendResponse(200);
                            break;
                        }

                        case "screen_remote": {
                            let dwncanvas = document.createElement('canvas');
                            dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth;
                            dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight;

                            let ctx = dwncanvas.getContext('2d');
                            if (ctx instanceof CanvasRenderingContext2D) {
                                ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                                utils.downloadImage(dwncanvas.toDataURL('image/jpg'));
                            }
                            sendResponse(200);
                            break;
                        }

                        case "screen_local": {
                            let dwncanvas = document.createElement('canvas');
                            dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth;
                            dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight;

                            let ctx = dwncanvas.getContext('2d');
                            if (ctx instanceof CanvasRenderingContext2D) {
                                ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                                utils.downloadImage(dwncanvas.toDataURL('image/jpg'));
                            }
                            sendResponse(200);
                            break;
                        }
                    }
                }
            }
        );
    }
}