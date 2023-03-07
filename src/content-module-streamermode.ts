import $ from "jquery";
import * as utils from "./utils";
import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {confirmAndReload} from "./content-module-settings";
import ChangeEvent = JQuery.ChangeEvent;

export class StreamerModule {
    private static instanceRef: StreamerModule;
    public BLUR_FILTER = "blur(" + globalThis.settings.blurFilter + "px)"
    public BLUR_FILTER_PREVIEW = "blur(" + globalThis.settings.blurPreviewFilter + "px)"
    private interval: NodeJS.Timer | undefined;
    public started = false

    public getLocalVideo(): HTMLVideoElement {
        return <HTMLVideoElement>document.getElementById("local-video")
    }

    public getRemoteVideo(): HTMLVideoElement {
        return <HTMLVideoElement>document.getElementById("remote-video")
    }

    public manualBlur = false
    public preds = []
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
            hide: globalThis.settings.streamer,
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
                        const result = prompt(chrome.i18n.getMessage("promptCoverSrc"), globalThis.settings.coverSrc)
                        if (result) {
                            chrome.storage.sync.set({"coverSrc": result}, function () {
                                (document.getElementById('cover') as HTMLImageElement).src = result
                            });
                        }
                    }
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

        return StreamerModule.instanceRef;
    }

    public blurRemote() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.getRemoteVideo()!!.style.filter = "opacity(0%)"
            document.getElementById('cover')!.style.display = ""
        } else {
            this.getRemoteVideo()!.style.filter = this.BLUR_FILTER
        }
    }

    public unblurRemote() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.getRemoteVideo()!.style.filter = ""
            document.getElementById('cover')!.style.display = "none"
        } else {
            this.getRemoteVideo()!.style.filter = ""
        }
    }

    public blurLocal() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.getLocalVideo()!.style.filter = "opacity(0%)"
            document.getElementById('cover2')!.style.display = ""
        } else {
            this.getLocalVideo()!.style.filter = this.BLUR_FILTER
        }
    }

    public unblurLocal() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
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
        this.preds = []
        if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
            this.getLocalVideo()!.style.filter = ""
        this.getRemoteVideo()!.style.filter = ""
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked) {
            // cover.style.display = "none"
        }
        this.manualBlur = false
        this.updStatus()
        console.dir("Сброс из-за конца разговора")
    }

    public onStageSearch() {
        this.onConversationEnd()
        if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked) {
            this.blurRemote()
        }
    }

    public onStageFound() {
        if ((document.getElementById("blurPreviewCheck") as HTMLInputElement).checked) {
            (document.getElementsByClassName("remote-video__preview")[0].children[0] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW;
            (document.getElementsByClassName("remote-video__preview")[0].children[1] as HTMLElement).style.filter = this.BLUR_FILTER_PREVIEW
        }
        if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked) {
            this.blurRemote()
        }
    }

    public onStagePlay() {
        this.manualBlur = false

        if ((document.getElementById("streamerPipCheck") as HTMLInputElement).checked) {
            this.echoV.srcObject = (document.getElementById("remote-video") as HTMLVideoElement).srcObject;
        }

        if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked) {
            if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
                this.blurLocal()

            this.blurRemote()
        }
    }

    public onStageStop() {
        this.onConversationEnd()

        if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.blurRemote()
        }
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

                        if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked) {
                            if (this.getLocalVideo()!.style.filter === "")
                                this.blurLocal()
                            else
                                this.unblurLocal()
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

    public start() {
        if (globalThis.settings.streamerPip) {
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

        if (globalThis.settings.blurReport)
            (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"

        // if (globalThis.settings.cover || globalThis.settings.coverPreview || globalThis.settings.coverNoise || globalThis.settings.coverStop) {
        $(utils.createElement('img', {
            src: globalThis.settings.coverSrc,
            id: "cover",
            style: "height:100%; position: absolute; display:none"
        })).insertBefore("#remote-video")

        $(utils.createElement('img', {
            src: globalThis.settings.coverSrc,
            id: "cover2",
            style: "height:100%; position: absolute; transform: scaleX(-1)"
        })).insertBefore("#local-video")

        $(".remote-video__preview").insertBefore("#cover")

        $(".remote-video__noise").insertBefore("#cover")
        // }


        if ((document.getElementById("streamerKeysCheck") as HTMLInputElement).checked) {
            document.addEventListener('keyup', this.hotkeys)
        }

        this.interval = setInterval(this.updStatus.bind(this), 500)

        // if ((document.getElementById("streamerPipCheck") as HTMLInputElement).checked) {
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
        // }
        this.started = true
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
}
