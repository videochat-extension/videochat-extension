import $ from "jquery";
import OBSWebSocket from 'obs-websocket-js';
import * as utils from "../../utils/utils";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import ChangeEvent = JQuery.ChangeEvent;
import Swal from "sweetalert2";

class StreamerModuleOBS {
    private obs: OBSWebSocket;
    public connected = false;

    public constructor() {
        this.obs = new OBSWebSocket()
        this.obs.on('Identified', () => {
            this.connected = true

            if (globalThis.platformSettings.get("obsShowErrorsStatus")) {
                // need to let dark mode styles to load
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        toast: true,
                        width: 300,
                        timer: 3000,
                        position: 'bottom-start',
                        title: "OBS INTEGRATION",
                        html: "connected",
                        confirmButtonText: "OK"
                    })
                }, 1000)
            }
            this.setStatus('connected')
        });
        this.obs.on('ConnectionClosed', (e) => {
            this.connected = false

            enum WebSocketCloseCode {
                /** For internal use only to tell the request handler not to perform any close action. */
                DontClose = 0,

                /** Cant connect the server.  */
                CantConnect = 1006,

                /** Unknown reason, should never be used. **/
                UnknownReason = 4000,

                /** The server was unable to decode the incoming websocket message. */
                MessageDecodeError = 4002,

                /** A data field is required but missing from the payload. */
                MissingDataField = 4003,

                /** A data field's value type is invalid. */
                InvalidDataFieldType = 4004,

                /** A data field's value is invalid. */
                InvalidDataFieldValue = 4005,

                /** The specified `op` was invalid or missing. */
                UnknownOpCode = 4006,

                /** The client sent a websocket message without first sending `Identify` message. */
                NotIdentified = 4007,

                /** The client sent an `Identify` message while already identified.\n\nNote: Once a client has identified, only `Reidentify` may be used to change session parameters. */
                AlreadyIdentified = 4008,

                /** The authentication attempt (via `Identify`) failed. */
                AuthenticationFailed = 4009,

                /** The server detected the usage of an old version of the obs-websocket RPC protocol. */
                UnsupportedRpcVersion = 4010,

                /** The websocket session has been invalidated by the obs-websocket server.\n\nNote: This is the code used by the `Kick` button in the UI Session List. If you receive this code, you must not automatically reconnect. */
                SessionInvalidated = 4011,

                /** A requested feature is not supported due to hardware/software limitations. */
                UnsupportedFeature = 4012,
            }

            this.reportError(WebSocketCloseCode[e.code])

            this.setStatus(`error ${WebSocketCloseCode[e.code]}`)
        });
    }
    public reportError(er:any){
        console.dir(er)
        if (!globalThis.platformSettings.get("obsShowErrorsStatus")) {
            return
        }
        if (typeof er !== "string" && typeof er.message !== "undefined") {
            er = er.message
        }
        if (er === "not connected") {
            return
        }
        Swal.fire({
            icon: 'error',
            toast: true,
            width: 300,
            position: 'bottom-start',
            title: `${chrome.i18n.getMessage("extension_name_header")} ${chrome.i18n.getMessage("obsIntegrationSection")}`,
            html: `error: ${er}`,
            confirmButtonText: "OK"
        })
    }
    private setStatus(text: string) {
        document.getElementById('obsIntegrationStatus')!.innerText = `status: ${text}`
    }

    private async setItemVisibility(itemName: string, enabled: boolean) {
        return this.obs.callBatch([
            {
                "requestType": "GetCurrentProgramScene",
                // @ts-ignore
                "outputVariables": {
                    "activeScene": "currentProgramSceneName"
                }
            },
            {
                "requestType": "GetSceneItemId",
                // @ts-ignore
                "requestData": {
                    "sourceName": itemName
                },
                "inputVariables": {
                    "sceneName": "activeScene"
                },
                "outputVariables": {
                    "sceneItemIdVariable": "sceneItemId"
                }
            },
            {
                "requestType": "SetSceneItemEnabled",
                // @ts-ignore
                "requestData": {
                    "sceneItemEnabled": enabled
                },
                "inputVariables": {
                    "sceneName": "activeScene",
                    "sceneItemId": "sceneItemIdVariable"
                }
            }
        ])
    }

    private async getItemVisibility(itemName: string) {
        return this.obs.callBatch([
            {
                "requestType": "GetCurrentProgramScene",
                // @ts-ignore
                "outputVariables": {
                    "activeScene": "currentProgramSceneName"
                }
            },
            {
                "requestType": "GetSceneItemId",
                // @ts-ignore
                "requestData": {
                    "sourceName": itemName
                },
                "inputVariables": {
                    "sceneName": "activeScene"
                },
                "outputVariables": {
                    "sceneItemIdVariable": "sceneItemId"
                }
            },
            {
                "requestType": "GetSceneItemEnabled",
                // @ts-ignore
                "inputVariables": {
                    "sceneName": "activeScene",
                    "sceneItemId": "sceneItemIdVariable"
                }
            }
        ])
    }

    private async setItemText(itemName: string, text: string) {
        return this.obs.call("SetInputSettings", {
            inputName: itemName,
            inputSettings: {
                text: text,
            },
        });
    }

    public setGeolocationString(str: string) {
        if (!this.connected) {
            return Promise.reject("not connected")
        }
        return this.setItemText("VE_TEXT", str)
    }

    public setCoverVisibility(enable: boolean) {
        if (!this.connected) {
            return Promise.reject("not connected")
        }
        return this.setItemVisibility("VE_COVER", enable)
    }

    public async getCoverVisibility() {
        if (!this.connected) {
            return Promise.reject("not connected")
        }
        let res = await this.getItemVisibility("VE_COVER")
        // @ts-ignore
        return res[2].responseData.sceneItemEnabled
    }

    public async start() {
        if (!this.connected) {
            let creds = await chrome.storage.local.get({"obsUrl": "ws://127.0.0.1:4455", "obsPassword": ""})
            try{
                await this.obs.connect(creds.obsUrl, creds.obsPassword);
            } catch (e) {
                console.dir(e)
            }
        }
    }

    public async stop() {
        if (this.connected) {
            await this.obs.disconnect()
        }
    }
}

export class StreamerModule {
    public static defaults = {
        streamer: false,
        streamerKeys: true,
        obsIntegrationSection: false,
        obsShowErrorsStatus: true,
        obsControlCover: false,
        obsControlCoverGrayscale: false,
        obsControlGeolocation: false,
        obsControlGeolocationClearSearch: false,
        obsControlGeolocationClearStop: false,
        obsControlGeolocationTextFormUsual: "$city, $regionName ($country [$countryCode])",
        obsControlGeolocationTextFormProxyVPNTor: "$country [$countryCode] (mobile)",
        obsControlGeolocationTextFormMobile: "$country [$countryCode] (fake)",
        streamerBlurCoverSection: true,
        streamerMirror: false,
        blurOnStart: true,
        blurPreview: false,
        blurFilter: 55,
        blurPreviewFilter: 20,
        blurReport: true,
        cover: true,
        coverPreview: true,
        coverNoise: true,
        coverStop: true,
        uncoverOnPlay: false,
        coverSrc: "https://media3.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif",
        coverSrcChangedDefault: false,
        randomGiphyTag: "loop"
    }
    private static instanceRef: StreamerModule;
    public BLUR_FILTER = "blur(" + globalThis.platformSettings.get("blurFilter") + "px)"
    public BLUR_FILTER_PREVIEW = "blur(" + globalThis.platformSettings.get("blurPreviewFilter") + "px)"
    public started = false
    public blur = false
    public echoV: HTMLVideoElement = document.createElement('video')
    private exampleGeoData = JSON.parse(chrome.i18n.getMessage("exampleGeoData"))
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsStreamerMode")
        },
        {
            type: "checkbox",
            important: true,
            key: "streamer",
            text: chrome.i18n.getMessage("streamerMode"),
            tooltip: chrome.i18n.getMessage("tooltipStreamerMode"),
            controlsSection: "streamerList",
            enable: () => {
                this.start()
            },
            disable: () => {
                this.stopBase()
                if (this.started) {
                    this.stopBlurCover()
                }
            }
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("streamer"),
            sectionId: "streamerList",
            children: [
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: true,
                    key: "streamerKeys",
                    controlsSection: "streamerHotkeysSection",
                    text: chrome.i18n.getMessage("streamerHotkeys"),
                    tooltip: chrome.i18n.getMessage("tooltipStreamerHotkeys"),
                    enable: () => {
                        document.addEventListener('keyup', this.hotkeys)
                    },
                    disable: () => {
                        document.removeEventListener('keyup', this.hotkeys);
                    }
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("streamerKeys"),
                    sectionId: "streamerHotkeysSection",
                    children: [
                        {
                            type: "HTMLElement",
                            element: utils.createElement('span', {
                                innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
                            })
                        }
                    ]
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: true,
                    key: "obsIntegrationSection",
                    controlsSection: "obsIntegrationSection",
                    text: chrome.i18n.getMessage("obsIntegrationSection"),
                    tooltip: chrome.i18n.getMessage("tooltipObsIntegrationSection"),
                    enable: () => {
                        if (!this.obs.connected) {
                            this.obs.start()
                        }
                    },
                    disable: () => {
                        if (this.obs.connected) {
                            this.obs.stop()
                        }
                    }
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("obsIntegrationSection"),
                    sectionId: "obsIntegrationSection",
                    children: [
                        {
                            type: "HTMLElement",
                            element: utils.createElement('span', {}, [
                                utils.createElement('dd', {
                                    id: "obsIntegrationStatus",
                                    style: "margin-inline-start: 20px!important;",
                                    innerHTML: "status: "
                                })
                            ])
                        },
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("obsChangeConnectInfo"),
                            onclick: (e: MouseEvent) => {
                                chrome.runtime.sendMessage({openSetup: true})
                            }
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "obsShowErrorsStatus",
                            text: chrome.i18n.getMessage("obsShowErrorsStatus"),
                            tooltip: chrome.i18n.getMessage("tooltipObsShowErrorsStatus"),
                        },
                        {
                            type: "br",
                        },
                        {
                            type: "checkbox",
                            important: true,
                            key: "obsControlCover",
                            text: chrome.i18n.getMessage("obsControlCover"),
                            controlsSection: "obsControlCoverSection",
                            tooltip: chrome.i18n.getMessage("tooltipObsControlCover"),
                            enable: () => {
                                this.obs.setCoverVisibility(true).catch(this.obs.reportError)
                            },
                            disable: () => {
                                this.obs.setCoverVisibility(false).catch(this.obs.reportError)
                            }
                        },
                        {
                            type: "section",
                            hide: globalThis.platformSettings.get("obsControlCover"),
                            sectionId: "obsControlCoverSection",
                            children: [
                                {
                                    type: "checkbox",
                                    important: false,
                                    key: "obsControlCoverGrayscale",
                                    text: chrome.i18n.getMessage("obsControlCoverGrayscale"),
                                    tooltip: chrome.i18n.getMessage("tooltipObsControlCoverGrayscale"),
                                    enable: () => {
                                        if (this.blur && this.obs.connected) {
                                            this.getRemoteVideo().style.filter = "grayscale(100%)";
                                            (document.getElementsByClassName("remote-video__preview")[0] as HTMLElement).style.filter = "grayscale(100%)";
                                        }
                                    },
                                    disable: () => {
                                        if (this.getRemoteVideo().style.filter === "grayscale(100%)") {
                                            this.getRemoteVideo().style.filter = "";
                                            (document.getElementsByClassName("remote-video__preview")[0] as HTMLElement).style.filter = "";
                                        }
                                    }
                                },
                            ]
                        },
                        {
                            type: "br",
                        },
                        {
                            type: "checkbox",
                            important: true,
                            key: "obsControlGeolocation",
                            controlsSection: "obsControlGeolocationSection",
                            text: chrome.i18n.getMessage("obsControlGeolocation"),
                            tooltip: chrome.i18n.getMessage("tooltipObsControlGeolocation"),
                            enable: () => {
                                this.obs.setGeolocationString('HELLO WORLD').catch(this.obs.reportError)
                            },
                            disable: () => {
                                this.obs.setGeolocationString('').catch(this.obs.reportError)
                            }
                        },
                        {
                            type: "section",
                            hide: globalThis.platformSettings.get("obsControlGeolocation"),
                            sectionId: "obsControlGeolocationSection",
                            children: [
                                {
                                    type: "checkbox",
                                    important: false,
                                    key: "obsControlGeolocationClearSearch",
                                    text: chrome.i18n.getMessage("obsControlGeolocationClearSearch"),
                                    tooltip: chrome.i18n.getMessage("tooltipObsControlGeolocationClearSearch")
                                },
                                {
                                    type: "checkbox",
                                    important: false,
                                    key: "obsControlGeolocationClearStop",
                                    text: chrome.i18n.getMessage("obsControlGeolocationClearStop"),
                                    tooltip: chrome.i18n.getMessage("tooltipObsControlGeolocationClearStop")
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("obsControlGeolocationTextFormUsual"),
                                    onclick: (e: MouseEvent) => {
                                        const result = prompt(chrome.i18n.getMessage("promptObsControlGeolocationTextFormUsual", [this.formatGeoString(globalThis.platformSettings.get("obsControlGeolocationTextFormUsual"), this.exampleGeoData), chrome.i18n.getMessage("promptFormatSrc")]), globalThis.platformSettings.get("obsControlGeolocationTextFormUsual"))
                                        if (result) {
                                            globalThis.platformSettings.set({"obsControlGeolocationTextFormUsual": result});
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("obsControlGeolocationTextFormMobile"),
                                    onclick: (e: MouseEvent) => {
                                        const result = prompt(chrome.i18n.getMessage("promptObsControlGeolocationTextFormMobile", [this.formatGeoString(globalThis.platformSettings.get("obsControlGeolocationTextFormMobile"), this.exampleGeoData), chrome.i18n.getMessage("promptFormatSrc")]), globalThis.platformSettings.get("obsControlGeolocationTextFormMobile"))
                                        if (result) {
                                            globalThis.platformSettings.set({"obsControlGeolocationTextFormMobile": result});
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("obsControlGeolocationTextFormProxyVPNTor"),
                                    onclick: (e: MouseEvent) => {
                                        const result = prompt(chrome.i18n.getMessage("promptObsControlGeolocationTextFormProxyVPNTor", [this.formatGeoString(globalThis.platformSettings.get("obsControlGeolocationTextFormProxyVPNTor"), this.exampleGeoData), chrome.i18n.getMessage("promptFormatSrc")]), globalThis.platformSettings.get("obsControlGeolocationTextFormProxyVPNTor"))
                                        if (result) {
                                            globalThis.platformSettings.set({"obsControlGeolocationTextFormProxyVPNTor": result});
                                        }
                                    }
                                },
                            ]
                        },
                    ]
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: true,
                    key: "streamerBlurCoverSection",
                    controlsSection: "streamerBlurCoverSectionSection",
                    text: chrome.i18n.getMessage("streamerBlurCoverSection"),
                    tooltip: chrome.i18n.getMessage("tooltipStreamerBlurCoverSection"),
                    enable: () => {
                        this.startBlurCover()
                    },
                    disable: () => {
                        if (this.started) {
                            this.stopBlurCover()
                        }
                    }
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("streamerBlurCoverSection"),
                    sectionId: "streamerBlurCoverSectionSection",
                    children: [
                        {
                            type: "br",
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "streamerMirror",
                            text: chrome.i18n.getMessage("blurCoverLocal"),
                            tooltip: chrome.i18n.getMessage("tooltipBlurCoverLocal"),
                            enable: () => {
                                if (this.blur) {
                                    this.blurLocal()
                                }
                            },
                            disable: () => {
                                this.unblurLocal()
                            }
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "blurReport",
                            text: chrome.i18n.getMessage("blurReport"),
                            tooltip: chrome.i18n.getMessage("tooltipBlurReport"),
                            enable: () => {
                                (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
                            },
                            disable: () => {
                                (document.getElementById("report-screen") as HTMLElement).style.filter = ""
                            }
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "blurPreview",
                            controlsSection: "blurPreviewSection",
                            text: chrome.i18n.getMessage("blurPreviews"),
                            tooltip: chrome.i18n.getMessage("tooltipBlurPreviews")
                        },
                        {
                            type: "section",
                            hide: globalThis.platformSettings.get("blurPreview"),
                            sectionId: "blurPreviewSection",
                            children: [
                                {
                                    type: "range",
                                    important: false,
                                    text: chrome.i18n.getMessage("previewBlurStrength"),
                                    tooltip: chrome.i18n.getMessage("tooltipPreviewBlurStrength"),
                                    key: "blurPreviewFilter",
                                    min: 0,
                                    max: 200,
                                    onchange: (event: ChangeEvent) => {
                                        this.BLUR_FILTER_PREVIEW = "blur(" + event.target.value + "px)"
                                    }
                                }
                            ]
                        },
                        {
                            type: "br",
                        },
                        {
                            type: "range",
                            important: false,
                            text: chrome.i18n.getMessage("remoteBlurStrength"),
                            tooltip: chrome.i18n.getMessage("tooltipRemoteBlurStrength"),
                            key: "blurFilter",
                            min: 0,
                            max: 200,
                            onchange: (event: ChangeEvent) => {
                                this.BLUR_FILTER = "blur(" + event.target.value + "px)"
                                if (this.getRemoteVideo()!.style.filter !== "") {
                                    this.getRemoteVideo()!.style.filter = this.BLUR_FILTER
                                }
                            }
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "cover",
                            controlsSection: "coverStreamerSection",
                            text: chrome.i18n.getMessage("coverOverBlur"),
                            tooltip: chrome.i18n.getMessage("tooltipCoverOverBlur"),
                            enable: () => {
                                if (this.blur) {
                                    this.unblurAll()
                                    this.blurAll()
                                }
                            },
                            disable: () => {
                                if (this.blur) {
                                    this.unblurAll()
                                    this.blurAll()
                                }
                            }
                        },
                        {
                            type: "section",
                            hide: globalThis.platformSettings.get("cover"),
                            sectionId: "coverStreamerSection",
                            children: [
                                {
                                    type: "checkbox",
                                    important: false,
                                    key: "uncoverOnPlay",
                                    text: chrome.i18n.getMessage("uncoverOnPlay"),
                                    tooltip: chrome.i18n.getMessage("tooltipUncoverOnPlay"),
                                    enable: () => {
                                        // confirmAndReload()
                                    },
                                    disable: () => {
                                        // confirmAndReload()
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("coverSrc"),
                                    onclick: (e: MouseEvent) => {
                                        const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), globalThis.platformSettings.get("coverSrc"))
                                        if (result) {
                                            // TODO: test this
                                            globalThis.platformSettings.setBack({"coverSrc": result}, function () {
                                                (document.getElementById('cover') as HTMLImageElement).src = result
                                            });
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("randomFromList"),
                                    onclick: (e: MouseEvent) => {
                                        const covers = [
                                            "https://media3.giphy.com/media/TFSxpAIYz5inJGuY8f/giphy.gif",
                                            "https://media0.giphy.com/media/u2wg2uXJbHzkXkPphr/giphy.gif",
                                            "https://media0.giphy.com/media/l0He4fJxPCbfqv7Xi/giphy.gif",
                                            "https://media3.giphy.com/media/TvLuZ00OIADoQ/giphy.gif",
                                            "https://media3.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif",
                                            "https://media3.giphy.com/media/r8GMmlV8qGrfZ3txfX/giphy.gif",
                                            "https://media3.giphy.com/media/JmNubSOrG4E63Nv0Op/giphy.gif",
                                            "https://media3.giphy.com/media/3o7qEbukQhgu3v1Ci4/giphy.gif",
                                            "https://media3.giphy.com/media/YrIq06kG5yrtxQEhj3/giphy.gif",
                                            "https://media3.giphy.com/media/GGqwHutw9TpT9xOIfW/giphy.gif",
                                            "https://media3.giphy.com/media/HdkzWcDvoRmLmkrWOt/giphy.gif",
                                            "https://media3.giphy.com/media/78E3Cv7kKD5XW/giphy.gif",
                                            "https://media3.giphy.com/media/TfP7y73UkILlvC0EFa/giphy.gif",
                                            "https://media3.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif",
                                            "https://media3.giphy.com/media/2GBfKwJ7bypANDoqRt/giphy.gif",
                                            "https://media3.giphy.com/media/9B7XwCQZRQfQs/giphy.gif",
                                            "https://media3.giphy.com/media/NKEt9elQ5cR68/giphy.gif",
                                            "https://media3.giphy.com/media/ieaUdBJJC19uw/giphy.gif",
                                            "https://media3.giphy.com/media/l2SqaK2Kec3IzRYhG/giphy.gif"
                                        ]
                                        let result = covers[utils.getRandomInt(0, covers.length - 1)]
                                        globalThis.platformSettings.setBack({"coverSrc": result}, function () {
                                            (document.getElementById('cover') as HTMLImageElement).src = result
                                        });
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("fetchRandomGiphy"),
                                    onclick: async (e: MouseEvent) => {
                                        let r = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes&tag=${globalThis.platformSettings.get("randomGiphyTag")}&rating=pg-13`)
                                        let result = (await r.json()).data.images.original.url
                                        globalThis.platformSettings.setBack({"coverSrc": result}, function () {
                                            (document.getElementById('cover') as HTMLImageElement).src = result
                                        });
                                    }
                                },
                                {
                                    type: "button",
                                    text: chrome.i18n.getMessage("randomGiphyTag") + globalThis.platformSettings.get("randomGiphyTag"),
                                    onclick: (e: MouseEvent) => {
                                        const result = prompt(chrome.i18n.getMessage("promptRandomGiphyTag"))
                                        if (result) {
                                            globalThis.platformSettings.setBack({"randomGiphyTag": result}, function () {
                                                (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("randomGiphyTag") + result
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: true,
                    key: "blurOnStart",
                    controlsSection: "blurOnStartSection",
                    text: chrome.i18n.getMessage("blurOnStart"),
                    tooltip: chrome.i18n.getMessage("tooltipBlurOnStart")
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("blurOnStart"),
                    sectionId: "blurOnStartSection",
                    children: [
                        {
                            type: "checkbox",
                            important: false,
                            key: "coverPreview",
                            text: chrome.i18n.getMessage("coverOverPreview"),
                            tooltip: chrome.i18n.getMessage("tooltipCoverOverPreview")
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "coverNoise",
                            text: chrome.i18n.getMessage("coverOverNoise"),
                            tooltip: chrome.i18n.getMessage("tooltipCoverOverNoise")
                        },
                        {
                            type: "checkbox",
                            important: false,
                            key: "coverStop",
                            text: chrome.i18n.getMessage("coverOverStop"),
                            tooltip: chrome.i18n.getMessage("tooltipCoverOverStop")
                        }
                    ]
                }
            ]
        }
    ]
    private driver: ChatruletkaDriver;
    private obs: StreamerModuleOBS;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.obs = new StreamerModuleOBS()
    }

    static initInstance(driver: ChatruletkaDriver): StreamerModule {
        if (StreamerModule.instanceRef === undefined) {
            StreamerModule.instanceRef = new StreamerModule(driver);
        }

        // change legacy streamer mode default gif
        if (!globalThis.platformSettings.get("coverSrcChangedDefault")) {
            if (globalThis.platformSettings.get("coverSrc") === "https://i.imgur.com/Ud2uLYQ.gif") {
                globalThis.platformSettings.set({
                    "coverSrc": "https://media3.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif",
                    "coverSrcChangedDefault": true
                })
            } else {
                globalThis.platformSettings.set({"coverSrcChangedDefault": true})
            }
        }

        return StreamerModule.instanceRef;
    }

    public getLocalVideo(): HTMLVideoElement {
        return <HTMLVideoElement>document.getElementById("local-video")
    }

    public getRemoteVideo(): HTMLVideoElement {
        return <HTMLVideoElement>document.getElementById("remote-video")
    }

    public toggle() {
        if (this.blur) {
            this.unblurAll()
        } else {
            this.blurAll()
        }
        this.updStatus()
    }

    public blurAll() {
        this.blurRemote()
        this.coverObs()
        this.blur = true
        this.updStatus()
    }

    public unblurAll() {
        this.unblurRemote()
        this.uncoverObs()
        this.blur = false
        this.updStatus()
    }

    private async syncObsCover(){
        this.obs.getCoverVisibility().then(this.syncGrey.bind(this)).catch(this.obs.reportError)
    }

    private syncGrey(res:boolean) {
        if (globalThis.platformSettings.get("obsControlCoverGrayscale")) {
            if (res) {
                this.getRemoteVideo().style.filter = "grayscale(100%)";
                (document.getElementsByClassName("remote-video__preview")[0] as HTMLElement).style.filter = "grayscale(100%)";
            } else {
                this.getRemoteVideo().style.filter = "";
                (document.getElementsByClassName("remote-video__preview")[0] as HTMLElement).style.filter = ""
            }
        }
    }

    public coverObs() {
        if (globalThis.platformSettings.get("obsControlCover")) {
            this.obs.setCoverVisibility(true).then(this.syncObsCover.bind(this)).catch(this.obs.reportError)
        }
    }

    public uncoverObs() {
        if (globalThis.platformSettings.get("obsControlCover")) {
            this.obs.setCoverVisibility(false).then(this.syncObsCover.bind(this)).catch(this.obs.reportError)
        }
    }

    public blurRemote() {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("cover")) {
                document.getElementById('cover')!.style.display = ""
                this.getRemoteVideo().style.filter = "opacity(0%)"
            } else {
                this.getRemoteVideo()!.style.filter = this.BLUR_FILTER
            }

            if (globalThis.platformSettings.get("streamerMirror"))
                this.blurLocal()
        }
    }

    public blurLocal() {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("cover")) {
                if (globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
                    this.getLocalVideo().style.filter = "opacity(0%)"
                    document.getElementById('cover2')!.style.display = ""
                }
            } else {
                this.getLocalVideo().style.filter = this.BLUR_FILTER
            }
        }
    }

    public unblurRemote() {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            this.getRemoteVideo()!.style.filter = ""
            document.getElementById('cover')!.style.display = "none"

            if (globalThis.platformSettings.get("streamerMirror"))
                this.unblurLocal()
        }
    }

    public unblurLocal() {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("cover")) {
                if (globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
                    this.getLocalVideo().style.filter = ""
                    document.getElementById('cover2')!.style.display = "none"
                }
            } else {
                this.getLocalVideo().style.filter = ""
            }
        }
    }

    public updStatus() {
        if (this.blur) {
            (this.driver.modules.controls.header.leftBlur.children[0] as HTMLElement).innerText = "H";
            (this.driver.modules.controls.header.leftBlur.children[0] as HTMLElement).style.fontSize = "";
        } else {
            (this.driver.modules.controls.header.leftBlur.children[0] as HTMLElement).innerText = "h";
            (this.driver.modules.controls.header.leftBlur.children[0] as HTMLElement).style.fontSize = "xx-small";
        }

        if (this.getRemoteVideo()!.muted) {
            (this.driver.modules.controls.header.leftMute.children[0] as HTMLElement).innerText = "M";
            (this.driver.modules.controls.header.leftMute.children[0] as HTMLElement).style.fontSize = "";
        } else {
            (this.driver.modules.controls.header.leftMute.children[0] as HTMLElement).innerText = "m";
            (this.driver.modules.controls.header.leftMute.children[0] as HTMLElement).style.fontSize = "xx-small";
        }
    }

    public onConversationEnd() {
    }

    public onStageSearch() {
        this.onConversationEnd()

        if (globalThis.platformSettings.get("obsControlGeolocationClearSearch")) {
            this.resetGeoData()
        }

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverNoise")) {
                this.blurAll()
                return
            }
        }
    }

    public onStageFound() {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("blurPreview")) {
                (document.getElementsByClassName("remote-video__preview")[0].children[0] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW;
                (document.getElementsByClassName("remote-video__preview")[0].children[1] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW
            }
            if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverPreview")) {
                this.blurAll()
                return
            }
        }
    }

    public onStagePlay() {
        this.echoV.srcObject = this.getRemoteVideo().srcObject;

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("uncoverOnPlay")) {
                this.unblurAll()
                return
            } else {
                if (globalThis.platformSettings.get("blurOnStart")) {
                    this.blurAll()
                    return
                }
            }
        }
    }

    public onStageStop() {
        this.onConversationEnd()

        if (globalThis.platformSettings.get("obsControlGeolocationClearStop")) {
            this.resetGeoData()
        }

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverStop")) {
                this.blurAll()
                return
            }
        }
    }

    public start() {
        this.startBase();

        if (globalThis.platformSettings.get("obsIntegrationSection")) {
            this.obs.start().then(() => {
                this.startObsCover()
            });
        }

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            this.startBlurCover();
        }
    }

    public startBase() {
        this.driver.modules.controls.header.leftBlur.style.display = ""
        this.driver.modules.controls.header.leftMute.style.display = ""

        if (globalThis.platformSettings.get("streamerKeys")) {
            document.addEventListener('keyup', this.hotkeys)
        }

        this.driver.modules.controls.header.minifyButtons();

        this.echoV.id = "echo-video"
        this.echoV.autoplay = true
        this.echoV.muted = true
        this.echoV.playsInline = true
        this.echoV.style.maxWidth = "0px"
        this.echoV.style.position = "absolute"
        this.echoV.style.bottom = "0"

        document.getElementById('local-video-wrapper')!.prepend(this.echoV);
        let self = this

        const echoStart = () => {
            self.echoV.srcObject = this.getLocalVideo().srcObject
            this.getLocalVideo().removeEventListener("play", echoStart)
        }

        this.getLocalVideo().addEventListener("play", echoStart)
    }

    public stopBase() {
        this.driver.modules.controls.header.leftBlur.style.display = "none";
        this.driver.modules.controls.header.leftMute.style.display = "none";

        document.removeEventListener('keyup', this.hotkeys);

        this.driver.modules.controls.header.restoreButtons();

        if (document.pictureInPictureElement === document.getElementById("echo-video"))
            document.exitPictureInPicture()
    }

    public startObsCover() {
        if (globalThis.platformSettings.get("blurOnStart")) {
            this.blurAll()
        }
    }

    public startBlurCover() {
        try {
            (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
        } catch (e) {
            console.dir(e)
        }

        try {
            (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
        } catch (e) {
            console.dir(e)
        }

        if (globalThis.platformSettings.get("blurReport"))
            (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"

        $(utils.createElement('img', {
            src: globalThis.platformSettings.get("coverSrc"),
            id: "cover",
            style: "height: 100%; width: 100%; position: relative; object-fit: cover; display:none"
        })).insertBefore("#remote-video")

        $(utils.createElement('img', {
            src: globalThis.platformSettings.get("coverSrc"),
            id: "cover2",
            style: "height: 100%; width: 100%; position: relative; object-fit: cover; display:none; transform: scaleX(-1)"
        })).insertBefore("#local-video")

        $(".remote-video__preview").insertBefore("#cover")

        $(".remote-video__noise").insertBefore("#cover")


        this.started = true

        if (globalThis.platformSettings.get("blurOnStart")) {
            this.blurAll()
        }

        this.updStatus();
    }

    public stopBlurCover() {
        this.unblurLocal();
        this.unblurRemote();
        (document.getElementById("report-screen") as HTMLElement).style.filter = "";
        $("#cover").remove()
        $("#cover2").remove()

        this.started = false
    }

    public handleBlurButtonClick(e: MouseEvent) {
        if (globalThis.platformSettings.get("streamerBlurCoverSection") || (globalThis.platformSettings.get("obsIntegrationSection") && this.obs.connected)) {
            this.toggle()
            this.updStatus()
        }
    }

    public handleMuteButtonClick(e: MouseEvent) {
        this.getRemoteVideo()!.muted = !this.getRemoteVideo()!.muted
        this.updStatus()
    }

    public formatGeoString(form: string, json: any) {
        return form
            .replace(/\$status/g, `${json.status}`)
            .replace(/\$countryCode/g, `${json.countryCode}`)
            .replace(/\$country/g, `${json.country}`)
            .replace(/\$regionName/g, `${json.regionName}`)
            .replace(/\$region/g, `${json.region}`)
            .replace(/\$city/g, `${json.city}`)
            .replace(/\$timezone/g, `${json.timezone}`)
            .replace(/\$mobile/g, `${json.mobile}`)
            .replace(/\$proxy/g, `${json.proxy}`)
            .replace(/\$hosting/g, `${json.hosting}`)
            .replace(/\$lat/g, `${json.lat}`)
            .replace(/\$lon/g, `${json.lon}`)
            .replace(/\$isp/g, `${json.isp}`)
            .replace(/\\n/g,"\n")
    }

    public async setGeoData(json: any) {
        if (this.obs.connected) {
            let key = "obsControlGeolocationTextFormUsual"

            if (json.proxy || json.hosting) {
                key = "obsControlGeolocationTextFormProxyVPNTor"
            } else if (json.mobile) {
                key = "obsControlGeolocationTextFormMobile"
            }

            let formattedString = this.formatGeoString(globalThis.platformSettings.get(key), json)

            this.obs.setGeolocationString(formattedString).catch(this.obs.reportError)
        }
    }

    public async resetGeoData() {
        if (this.obs.connected) {
            this.obs.setGeolocationString('').catch(this.obs.reportError)
        }
    }

    protected hotkeys = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLElement && e.target.className === "emojionearea-editor" || document.getElementsByClassName("swal2-popup").length > 0)
            return
        switch (e.key) {
            case "ArrowRight":
                if (!(document.getElementById("report-popup")!.style.display === "block")) {
                    this.driver.modules.controls.header.leftBlur.click()
                }
                break;

            case "h":
                this.driver.modules.controls.header.leftBlur.click()
                break;

            case "m":
                this.driver.modules.controls.header.leftMute.click()
                break;
        }
    }
}
