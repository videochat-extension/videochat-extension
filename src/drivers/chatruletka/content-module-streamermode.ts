import $ from "jquery";
import * as utils from "../../utils/utils";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {confirmAndReload} from "./content-module-settings";
import ChangeEvent = JQuery.ChangeEvent;

export class StreamerModule {
    public static defaults = {
        streamer: false,
        streamerKeys: true,
        streamerMirror: false,
        blurOnStart: true,
        streamerPip: true,
        blurPreview: false,
        blurFilter: 55,
        blurPreviewFilter: 20,
        blurReport: true,
        cover: true,
        coverPreview: true,
        coverNoise: true,
        coverStop: true,
        coverSrc: "https://i.imgur.com/Ud2uLYQ.gif",
    }
    private static instanceRef: StreamerModule;
    public BLUR_FILTER = "blur(" + globalThis.platformSettings.get("blurFilter") + "px)"
    public BLUR_FILTER_PREVIEW = "blur(" + globalThis.platformSettings.get("blurPreviewFilter") + "px)"
    public started = false
    public manualBlur = false
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
                if (!this.started) {
                    this.start()
                }
            },
            disable: () => {
                if (this.started) {
                    this.stop()
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
                    important: false,
                    key: "streamerKeys",
                    text: chrome.i18n.getMessage("streamerHotkeys"),
                    tooltip: chrome.i18n.getMessage("tooltipStreamerHotkeys"),
                    enable: () => {
                        (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"
                    },
                    disable: () => {
                        (document.getElementById("report-screen") as HTMLElement).style.filter = ""
                    }
                },
                {
                    type: "HTMLElement",
                    element: utils.createElement('span', {
                        innerHTML: chrome.i18n.getMessage("streamerHotkeysText")
                    })
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "streamerPip",
                    text: chrome.i18n.getMessage("streamerPip"),
                    tooltip: chrome.i18n.getMessage("tooltipStreamerPip"),
                    enable: () => {
                        confirmAndReload()
                    },
                    disable: () => {
                        confirmAndReload()
                    }
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "blurOnStart",
                    text: chrome.i18n.getMessage("blurOnStart"),
                    tooltip: chrome.i18n.getMessage("tooltipBlurOnStart")
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
                    key: "blurPreview",
                    text: chrome.i18n.getMessage("blurPreviews"),
                    tooltip: chrome.i18n.getMessage("tooltipBlurPreviews")
                },
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
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "streamerMirror",
                    text: chrome.i18n.getMessage("blurCoverLocal"),
                    tooltip: chrome.i18n.getMessage("tooltipBlurCoverLocal")
                },
                {
                    type: "br",
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "cover",
                    text: chrome.i18n.getMessage("coverOverBlur"),
                    tooltip: chrome.i18n.getMessage("tooltipCoverOverBlur"),
                    enable: () => {
                        // confirmAndReload()
                    },
                    disable: () => {
                        // confirmAndReload()
                    }
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "coverPreview",
                    text: chrome.i18n.getMessage("coverOverPreview"),
                    tooltip: chrome.i18n.getMessage("tooltipCoverOverPreview"),
                    enable: () => {
                        // confirmAndReload()
                    },
                    disable: () => {
                        // confirmAndReload()
                    }
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "coverNoise",
                    text: chrome.i18n.getMessage("coverOverNoise"),
                    tooltip: chrome.i18n.getMessage("tooltipCoverOverNoise"),
                    enable: () => {
                        // confirmAndReload()
                    },
                    disable: () => {
                        // confirmAndReload()
                    }
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "coverStop",
                    text: chrome.i18n.getMessage("coverOverStop"),
                    tooltip: chrome.i18n.getMessage("tooltipCoverOverStop"),
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
                            // chrome.storage.sync.set({"coverSrc": result}, function () {
                            //     (document.getElementById('cover') as HTMLImageElement).src = result
                            // });
                        }
                    }
                }
            ]
        }
    ]
    private interval: NodeJS.Timer | undefined;
    private driver: ChatruletkaDriver;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
    }

    static initInstance(driver: ChatruletkaDriver): StreamerModule {
        if (StreamerModule.instanceRef === undefined) {
            StreamerModule.instanceRef = new StreamerModule(driver);
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
        if (globalThis.platformSettings.get("cover") || globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
            this.getRemoteVideo()!!.style.filter = "opacity(0%)"
            document.getElementById('cover')!.style.display = ""

            if (globalThis.platformSettings.get("streamerMirror"))
                this.blurLocal()
        } else {
            this.getRemoteVideo()!.style.filter = this.BLUR_FILTER
        }
    }

    public unblurRemote() {
        if (globalThis.platformSettings.get("cover") || globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
            this.getRemoteVideo()!.style.filter = ""
            document.getElementById('cover')!.style.display = "none"

            if (globalThis.platformSettings.get("streamerMirror"))
                this.unblurLocal()
        } else {
            this.getRemoteVideo()!.style.filter = ""
        }
    }

    public blurLocal() {
        if (globalThis.platformSettings.get("cover") || globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
            this.getLocalVideo()!.style.filter = "opacity(0%)"
            document.getElementById('cover2')!.style.display = ""
        } else {
            this.getLocalVideo()!.style.filter = this.BLUR_FILTER
        }
    }

    public unblurLocal() {
        if (globalThis.platformSettings.get("cover") || globalThis.platformSettings.get("coverNoise") || globalThis.platformSettings.get("coverPreview") || globalThis.platformSettings.get("coverStop")) {
            this.getLocalVideo()!.style.filter = ""
            document.getElementById('cover2')!.style.display = "none"
        } else {
            this.getLocalVideo()!.style.filter = ""
        }
    }

    public updStatus() {
        let strings = []
        if (this.getRemoteVideo()!.muted)
            strings.push("muted")
        if (this.manualBlur)
            strings.push("manual blur")

        document.getElementById('streamerStatus')!.innerText = strings.join(' || ')
    }

    public onConversationEnd() {
        if (globalThis.platformSettings.get("streamerMirror"))
            this.getLocalVideo()!.style.filter = ""
        this.getRemoteVideo()!.style.filter = ""
        if (globalThis.platformSettings.get("cover")) {
            // cover.style.display = "none"
        }
        this.manualBlur = false
        this.updStatus()
        console.dir("Сброс из-за конца разговора")
    }

    public onStageSearch() {
        this.onConversationEnd()
        if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverNoise")) {
            this.blurRemote()
        }
    }

    public onStageFound() {
        if (globalThis.platformSettings.get("blurPreview")) {
            (document.getElementsByClassName("remote-video__preview")[0].children[0] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW;
            (document.getElementsByClassName("remote-video__preview")[0].children[1] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW
        }
        if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverPreview")) {
            this.blurRemote()
        }
    }

    public onStagePlay() {
        this.manualBlur = false

        if (globalThis.platformSettings.get("streamerPip")) {
            this.echoV.srcObject = (document.getElementById("remote-video") as HTMLVideoElement).srcObject;
        }

        if (globalThis.platformSettings.get("blurOnStart")) {
            this.blurRemote()
        }
    }

    public onStageStop() {
        this.onConversationEnd()

        if (globalThis.platformSettings.get("blurOnStart") && globalThis.platformSettings.get("coverStop")) {
            this.blurRemote()
        }
    }

    public start() {
        if (globalThis.platformSettings.get("streamerPip")) {
            document.getElementById("streamerPipButton")!.style.display = ""
        }

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
            style: "height:100%; position: absolute; display:none"
        })).insertBefore("#remote-video")

        $(utils.createElement('img', {
            src: globalThis.platformSettings.get("coverSrc"),
            id: "cover2",
            style: "height:100%; position: absolute; transform: scaleX(-1)"
        })).insertBefore("#local-video")

        $(".remote-video__preview").insertBefore("#cover")

        $(".remote-video__noise").insertBefore("#cover")


        if (globalThis.platformSettings.get("streamerKeys")) {
            document.addEventListener('keyup', this.hotkeys)
        }

        this.interval = setInterval(this.updStatus.bind(this), 500)

        this.echoV.id = "echo-video"
        this.echoV.autoplay = true
        this.echoV.muted = true
        this.echoV.playsInline = true
        this.echoV.width = 0

        document.getElementById('video-container')!.appendChild(this.echoV);
        let self = this

        function echoStart() {
            self.echoV.srcObject = (document.getElementById("local-video") as HTMLVideoElement).srcObject
            document.getElementById('local-video')!.removeEventListener("play", echoStart)
        }

        document.getElementById('local-video')!.addEventListener("play", echoStart)

        this.started = true

        if (globalThis.platformSettings.get("blurOnStart")) {
            this.blurRemote()
        }
    }

    public stop() {
        clearInterval(this.interval)
        this.unblurLocal()
        this.unblurRemote()
        document.getElementById("streamerPipButton")!.style.display = "none";
        (document.getElementById("report-screen") as HTMLElement).style.filter = "";
        $("#cover").remove()
        $("#cover2").remove()

        if (document.pictureInPictureElement === document.getElementById("echo-video"))
            document.exitPictureInPicture()

        document.removeEventListener('keyup', this.hotkeys);

        this.started = false
    }

    protected hotkeys = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLElement && e.target.className === "emojionearea-editor" || document.getElementsByClassName("swal2-popup").length > 0)
            return
        switch (e.key) {
            case "ArrowRight":
                if (!(document.getElementById("report-popup")!.style.display === "block")) {
                    {
                        if (this.getRemoteVideo()!.style.filter === "") {
                            this.blurRemote()
                            this.manualBlur = true
                        } else {
                            this.unblurRemote()
                            this.manualBlur = false
                        }
                    }
                    this.updStatus()
                }
                break;

            case "m":
                this.getRemoteVideo()!.muted = !this.getRemoteVideo()!.muted
                this.updStatus()
                break;
        }
    }
}
