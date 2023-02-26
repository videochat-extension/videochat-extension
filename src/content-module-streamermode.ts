import $ from "jquery";
import * as utils from "./utils";
import {ChatruletkaDriver} from "./content-driver-chatruletka";

export class StreamerModule {
    private static instanceRef: StreamerModule;
    readonly BLUR_FILTER = "blur(" + globalThis.settings.blurFilter + "px)"
    readonly BLUR_FILTER_PREVIEW = "blur(" + globalThis.settings.blurPreviewFilter + "px)"
    readonly vid: HTMLVideoElement = document.getElementById("local-video") as HTMLVideoElement
    readonly rmt: HTMLVideoElement = document.getElementById("remote-video") as HTMLVideoElement
    public manualBlur = false
    public preds = []
    public echoV: HTMLVideoElement = document.createElement('video')
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
            this.rmt.style.filter = "opacity(0%)"
            document.getElementById('cover')!.style.display = ""
        } else {
            this.rmt.style.filter = this.BLUR_FILTER
        }
    }

    public unblurRemote() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.rmt.style.filter = ""
            document.getElementById('cover')!.style.display = "none"
        } else {
            this.rmt.style.filter = ""
        }
    }

    public blurLocal() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.vid.style.filter = "opacity(0%)"
            document.getElementById('cover2')!.style.display = ""
        } else {
            this.vid.style.filter = this.BLUR_FILTER
        }
    }

    public unblurLocal() {
        if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
            this.vid.style.filter = ""
            document.getElementById('cover2')!.style.display = "none"
        } else {
            this.vid.style.filter = ""
        }
    }

    public updStatus() {
        let strings = []
        if (this.rmt.muted)
            strings.push("muted")
        if (this.manualBlur)
            strings.push("manual blur")

        document.getElementById('streamerStatus')!.innerText = strings.join(' || ')
    }

    public onConversationEnd() {
        this.preds = []
        if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
            this.vid.style.filter = ""
        this.rmt.style.filter = ""
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

    public start() {
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

        if (globalThis.settings.cover || globalThis.settings.coverPreview || globalThis.settings.coverNoise || globalThis.settings.coverStop) {
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
        }


        if ((document.getElementById("streamerKeysCheck") as HTMLInputElement).checked) {
            document.addEventListener('keyup', (e) => {
                if (e.target instanceof HTMLElement && e.target.className === "emojionearea-editor" || document.getElementsByClassName("swal2-popup").length > 0)
                    return
                switch (e.key) {
                    case "ArrowRight":
                        if (!(document.getElementById("report-popup")!.style.display === "block")) {
                            {
                                if (this.rmt.style.filter === "") {
                                    this.blurRemote()
                                    this.manualBlur = true
                                } else {
                                    this.unblurRemote()
                                    this.manualBlur = false
                                }

                                if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked) {
                                    if (this.vid.style.filter === "")
                                        this.blurLocal()
                                    else
                                        this.unblurLocal()
                                }
                            }
                            this.updStatus()
                        }
                        break;

                    case "m":
                        this.rmt.muted = !this.rmt.muted
                        this.updStatus()
                        break;
                }
            })
        }

        setInterval(this.updStatus, 500)

        if ((document.getElementById("streamerPipCheck") as HTMLInputElement).checked) {
            this.echoV.id = "echo-video"
            this.echoV.autoplay = true
            this.echoV.muted = true
            this.echoV.playsInline = true
            this.echoV.width = 0

            document.getElementById('app')!.appendChild(this.echoV);
            let self = this

            function echoStart() {
                self.echoV.srcObject = (document.getElementById("local-video") as HTMLVideoElement).srcObject
                document.getElementById('local-video')!.removeEventListener("play", echoStart)
            }

            document.getElementById('local-video')!.addEventListener("play", echoStart)
        }
    }
}
