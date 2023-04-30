import $ from "jquery";
import * as utils from "../../utils/utils";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import ChangeEvent = JQuery.ChangeEvent;

export class StreamerModule {
    public static defaults = {
        streamer: false,
        streamerKeys: true,
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
    public manualBlur = false
    public blur = false
    public echoV: HTMLVideoElement = document.createElement('video')
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
                        },
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
                                if (this.blur || this.manualBlur) {
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
                                if (this.blur || this.manualBlur) {
                                    this.unblurRemote()
                                    this.blurRemote()
                                }
                            },
                            disable: () => {
                                if (this.blur || this.manualBlur) {
                                    this.unblurRemote()
                                    this.blurRemote()
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
                                        let result = covers[utils.getRandomInt(0, covers.length-1)]
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
                }
            ]
        }
    ]
    private driver: ChatruletkaDriver;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
    }

    static initInstance(driver: ChatruletkaDriver): StreamerModule {
        if (StreamerModule.instanceRef === undefined) {
            StreamerModule.instanceRef = new StreamerModule(driver);
        }

        // change legacy streamer mode default gif
        if (!globalThis.platformSettings.get("coverSrcChangedDefault")) {
            if (globalThis.platformSettings.get("coverSrc") === "https://i.imgur.com/Ud2uLYQ.gif") {
                globalThis.platformSettings.set({"coverSrc": "https://media3.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif", "coverSrcChangedDefault": true})
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

    public blurRemote() {
        if (globalThis.platformSettings.get("cover")) {
            // TODO: that does not make sense
            // if (globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
                document.getElementById('cover')!.style.display = ""
                this.getRemoteVideo().style.filter = "opacity(0%)"
            // }
        } else {
            this.getRemoteVideo()!.style.filter = this.BLUR_FILTER
        }

        if (globalThis.platformSettings.get("streamerMirror"))
            this.blurLocal()

        this.blur = true
        this.updStatus()
    }

    public unblurRemote() {
        this.getRemoteVideo()!.style.filter = ""
        document.getElementById('cover')!.style.display = "none"

        if (globalThis.platformSettings.get("streamerMirror"))
            this.unblurLocal()

        this.blur = false
        this.manualBlur = false
        this.updStatus()
    }

    public blurLocal() {
        if (globalThis.platformSettings.get("cover")) {
            if (globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
                this.getLocalVideo().style.filter = "opacity(0%)"
                document.getElementById('cover2')!.style.display = ""
            }
        } else {
            this.getLocalVideo().style.filter = this.BLUR_FILTER
        }
    }

    public unblurLocal() {
        if (globalThis.platformSettings.get("cover")) {
            if (globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
                this.getLocalVideo().style.filter = ""
                document.getElementById('cover2')!.style.display = "none"
            }
        } else {
            this.getLocalVideo().style.filter = ""
        }

    }

    public updStatus() {
        if (this.manualBlur || this.blur) {
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
        // TODO: what is it for? why unblur?

        // if (globalThis.platformSettings.get("streamerMirror"))
        //     this.getLocalVideo()!.style.filter = ""
        // this.getRemoteVideo()!.style.filter = ""
        // if (globalThis.platformSettings.get("cover")) {
        // cover.style.display = "none"
        // }
        // this.manualBlur = false
        // this.updStatus()
        console.dir('ended')
    }

    public onStageSearch() {
        this.onConversationEnd()

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverNoise")) {
                this.blurRemote()
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
                this.blurRemote()
            }
        }
    }

    public onStagePlay() {
        this.manualBlur = false

        this.echoV.srcObject = this.getRemoteVideo().srcObject;

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("uncoverOnPlay")) {
                this.unblurRemote()
            } else {
                if (globalThis.platformSettings.get("blurOnStart")) {
                    this.blurRemote()
                }
            }
        }
    }

    public onStageStop() {
        this.onConversationEnd()

        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverStop")) {
                this.blurRemote()
            }
        }
    }

    public start() {
        this.startBase();

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


        this.echoV.id = "echo-video"
        this.echoV.autoplay = true
        this.echoV.muted = true
        this.echoV.playsInline = true
        this.echoV.width = 0

        document.getElementById('video-container')!.appendChild(this.echoV);
        let self = this

        const echoStart = () => {
            self.echoV.srcObject = this.getLocalVideo().srcObject
            this.getLocalVideo().removeEventListener("play", echoStart)
        }

        this.getLocalVideo().addEventListener("play", echoStart)

        this.started = true

        if (globalThis.platformSettings.get("blurOnStart")) {
            this.blurRemote()
        }

        this.updStatus();
    }

    public stopBase() {
        this.driver.modules.controls.header.leftBlur.style.display = "none";
        this.driver.modules.controls.header.leftMute.style.display = "none";

        document.removeEventListener('keyup', this.hotkeys);

        this.driver.modules.controls.header.restoreButtons();
    }

    public stopBlurCover() {
        this.unblurLocal();
        this.unblurRemote();
        (document.getElementById("report-screen") as HTMLElement).style.filter = "";
        $("#cover").remove()
        $("#cover2").remove()

        if (document.pictureInPictureElement === document.getElementById("echo-video"))
            document.exitPictureInPicture()



        this.started = false
    }

    public handleBlurButtonClick(e: MouseEvent) {
        if (globalThis.platformSettings.get("streamerBlurCoverSection")) {
            if (!this.manualBlur && !this.blur) {
                this.blurRemote()
                this.manualBlur = true
            } else {
                this.unblurRemote()
                this.manualBlur = false
            }
        }
        this.updStatus()
    }

    public handleMuteButtonClick(e: MouseEvent) {
        this.getRemoteVideo()!.muted = !this.getRemoteVideo()!.muted
        this.updStatus()
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

            case "m":
                this.driver.modules.controls.header.leftMute.click()
                break;
        }
    }
}
