const BLUR_FILTER = "blur(" + (document.getElementById("blurFilter") as HTMLInputElement).value + "px)"
const BLUR_FILTER_PREVIEW = "blur(" + (document.getElementById("blurPreviewFilter") as HTMLInputElement).value + "px)"

const vid: HTMLVideoElement = document.getElementById("local-video") as HTMLVideoElement
const rmt: HTMLVideoElement = document.getElementById("remote-video") as HTMLVideoElement

let manualBlur = false
let currentStage = 0
let preds = []

let echoV: HTMLVideoElement

if ((document.getElementById("streamerKeysCheck") as HTMLInputElement).checked) {
    document.addEventListener('keyup', (e) => {
        if (e.target instanceof HTMLElement && e.target.className === "emojionearea-editor" || document.getElementsByClassName("swal2-popup").length > 0)
            return
        switch (e.key) {
            case "ArrowRight":
                if (!(document.getElementById("report-popup")!.style.display === "block")) {
                    {
                        if (rmt.style.filter === "") {
                            blurRemote()
                            manualBlur = true
                        } else {
                            unblurRemote()
                            manualBlur = false
                        }

                        if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked) {
                            if (vid.style.filter === "")
                                blurLocal()
                            else
                                unblurLocal()
                        }
                    }
                    updStatus()
                }
                break;

            case "m":
                rmt.muted = !rmt.muted
                updStatus()
                break;
        }
    })
}

function blurRemote() {
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
        rmt.style.filter = "opacity(0%)"
        document.getElementById('cover')!.style.display = ""
    } else {
        rmt.style.filter = BLUR_FILTER
    }
}

function unblurRemote() {
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
        rmt.style.filter = ""
        document.getElementById('cover')!.style.display = "none"
    } else {
        rmt.style.filter = ""
    }
}

function blurLocal() {
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
        vid.style.filter = "opacity(0%)"
        document.getElementById('cover2')!.style.display = ""
    } else {
        vid.style.filter = BLUR_FILTER
    }
}

function unblurLocal() {
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked || (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked || (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked || (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
        vid.style.filter = ""
        document.getElementById('cover2')!.style.display = "none"
    } else {
        vid.style.filter = ""
    }
}

function updStatus() {
    let strings = []
    if (rmt.muted)
        strings.push("muted")
    if (manualBlur)
        strings.push("manual blur")

    document.getElementById('streamerStatus')!.innerText = strings.join(' || ')
}

setInterval(updStatus, 500)

if ((document.getElementById("streamerPipCheck") as HTMLInputElement).checked) {
    echoV = document.createElement('video');

    echoV.id = "echo-video"
    echoV.autoplay = true
    echoV.muted = true
    echoV.playsInline = true
    echoV.width = 0

    document.getElementById('app')!.appendChild(echoV);

    function echoStart() {
        echoV.srcObject = (document.getElementById("local-video") as HTMLVideoElement).srcObject
        document.getElementById('local-video')!.removeEventListener("play", echoStart)
    }

    document.getElementById('local-video')!.addEventListener("play", echoStart)
}

function onConversationEnd() {
    preds = []
    if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
        vid.style.filter = ""
    rmt.style.filter = ""
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked) {
        // cover.style.display = "none"
    }
    manualBlur = false
    updStatus()
    console.dir("Сброс из-за конца разговора")
}

const $div = $("#remote-video-wrapper");
let observerForStage = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
            const attributeValue = $(mutation.target).prop(mutation.attributeName);
            if (attributeValue.includes("s-search")) {
                currentStage = 1
                onConversationEnd()
                if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverNoiseCheck") as HTMLInputElement).checked) {
                    blurRemote()
                }
            } else if (attributeValue.includes("s-found")) {
                currentStage = 2
                if ((document.getElementById("blurPreviewCheck") as HTMLInputElement).checked) {
                    (document.getElementsByClassName("remote-video__preview")[0].children[0] as HTMLElement).style.filter = BLUR_FILTER_PREVIEW;
                    (document.getElementsByClassName("remote-video__preview")[0].children[1] as HTMLElement).style.filter = BLUR_FILTER_PREVIEW
                }
                if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverPreviewCheck") as HTMLInputElement).checked) {
                    blurRemote()
                }
            } else if (attributeValue.includes("s-play")) {
                manualBlur = false
                currentStage = 3

                if ((document.getElementById("streamerPipCheck") as HTMLInputElement).checked) {
                    echoV.srcObject = (document.getElementById("remote-video") as HTMLVideoElement).srcObject;
                }

                if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked) {
                    if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
                        blurLocal()

                    blurRemote()
                }
            } else if (attributeValue.includes("s-stop")) {
                currentStage = 0
                onConversationEnd()

                if ((document.getElementById("blurOnStartCheck") as HTMLInputElement).checked && (document.getElementById("coverStopCheck") as HTMLInputElement).checked) {
                    blurRemote()
                }
            }
        }
    });
});

observerForStage.observe($div[0], {
    attributes: true
});
