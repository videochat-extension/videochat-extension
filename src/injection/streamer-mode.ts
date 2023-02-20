const BLUR_FILTER = "blur(" + (document.getElementById("blurFilter") as HTMLInputElement).value + "px)"
const BLUR_FILTER_PREVIEW = "blur(" + (document.getElementById("blurPreviewFilter") as HTMLInputElement).value + "px)"

const PREDICATIONS_ARRAY_SIZE = +(document.getElementById("sPredicationsArraySize") as HTMLInputElement).value
const PANIC_PROPABILITY = +(document.getElementById("sPanicPropability") as HTMLInputElement).value
const WEIGHT_PORN = +(document.getElementById("sWeightPorn") as HTMLInputElement).value
const WEIGHT_SEXY = +(document.getElementById("sWeightSexy") as HTMLInputElement).value
const BLUR_DURATION = +(document.getElementById("sBlurDuration") as HTMLInputElement).value
const BLUR_PANIC = +(document.getElementById("sBlurPanic") as HTMLInputElement).value
const TIMEOUT = +(document.getElementById("sTimeout") as HTMLInputElement).value

const vid: HTMLVideoElement = document.getElementById("local-video") as HTMLVideoElement
const rmt: HTMLVideoElement = document.getElementById("remote-video") as HTMLVideoElement

let manualBlur = false
let tempOff = false
let currentStage = 0
let preds = []

let echoV: HTMLVideoElement

let lastBlurred = 0

if ((document.getElementById("streamerKeysCheck") as HTMLInputElement).checked) {
    document.addEventListener('keyup', (e) => {
        if (e.target instanceof HTMLElement && e.target.className === "emojionearea-editor" || document.getElementsByClassName("swal2-popup").length > 0)
            return
        switch (e.key) {
            case "ArrowRight":
                if (!(document.getElementById("report-popup")!.style.display === "block")) {
                    if (e.shiftKey) {
                        tempOff = !tempOff
                        if (!tempOff) {
                            if (!manualBlur) {
                                unblurRemote()
                                if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked) {
                                    unblurLocal()
                                }
                            }
                        } else
                            document.getElementById("nsfwInfo")!.style.display = "none"
                    } else {
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

// if (nsfwCheck.checked) {
//     nsfwjs.load().then(function (model) {
//         nsfwInfo.style.display = ""
//
//         let nsfwTimeout = setTimeout(async function tick() {
//             if (currentStage === 3 && !tempOff) {
//                 try {
//                     const predictions = await model.classify(rmt)
//                     if (preds.length >= PREDICATIONS_ARRAY_SIZE)
//                         preds.shift()
//
//                     preds.push(predictions)
//
//                     let blur = 0
//
//                     preds.forEach(itemPred => {
//                         itemPred.forEach(item => {
//                             if (item.className === "Porn" || item.className === "Sexy") {
//                                 if (item.probability > PANIC_PROPABILITY) {
//                                     switch (item.className) {
//                                         case "Porn":
//                                             blur += WEIGHT_PORN
//                                             break;
//
//                                         case "Sexy":
//                                             blur += WEIGHT_SEXY
//                                             break;
//                                     }
//                                 }
//                             }
//                         })
//                     })
//                     let text = `<b>SCORE: ${blur}</b> || `
//                     predictions.forEach(item => {
//                         text += `<b>${item.className.charAt(0)}</b>: ${(item.probability * 100).toFixed(0) + '% '}`
//                     })
//
//                     if (blur >= BLUR_PANIC) {
//                         if (streamerMirrorCheck.checked) {
//                             blurLocal()
//                         }
//                         blurRemote()
//
//                         lastBlurred = +new Date()
//                     } else {
//                         if (preds.length < PREDICATIONS_ARRAY_SIZE) {
//                             // vid.style.filter = BLUR_FILTER
//                         } else if (lastBlurred === 0) {
//                             if (!manualBlur) {
//                                 if (streamerMirrorCheck.checked)
//                                     vid.style.filter = ""
//                                 rmt.style.filter = ""
//                                 if (coverCheck.checked)
//                                     // cover.style.display = "none"
//                                     console.dir('РАЗБЛЮР ПЕРВЫЙ')
//                                 lastBlurred = -1
//                             }
//                         } else if (lastBlurred !== 0 && lastBlurred !== -1 && +new Date() - lastBlurred > BLUR_DURATION * 1000) {
//                             if (!manualBlur && letUnblurCheck.checked) {
//                                 if (streamerMirrorCheck.checked)
//                                     vid.style.filter = ""
//                                 rmt.style.filter = ""
//                                 if (coverCheck.checked)
//                                     // cover.style.display = "none"
//                                     console.dir('РАЗБЛЮР')
//                             }
//                         }
//                     }
//                     if (currentStage === 3) {
//                         nsfwInfo.style.display = ""
//                         nsfwInfo.innerHTML = text
//                     }
//                 } catch (err) {
//                     console.dir(err)
//                 }
//             }
//
//             nsfwTimeout = setTimeout(tick, TIMEOUT); // (*)
//         }, 400);
//     })
// }

function updStatus() {
    let strings = []
    if (rmt.muted)
        strings.push("muted")
    if (manualBlur)
        strings.push("manual blur")
    if (tempOff)
        strings.push("NSFWJS OFF")
    else {
        if (lastBlurred !== -1 && lastBlurred !== 0 && (BLUR_DURATION - (+new Date() - lastBlurred) / 1000) > 0) {
            if ((BLUR_DURATION - (+new Date() - lastBlurred) / 1000) > BLUR_DURATION - 1) {
                strings.push(`NSFW DETECTED!`)
            } else {
                if (!manualBlur && (document.getElementById("letUnblurCheck") as HTMLInputElement).checked)
                    strings.push(`unblur in ${Math.ceil(BLUR_DURATION + 1 - (+new Date() - lastBlurred) / 1000)}s`)
            }
        }
    }
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
    if ((document.getElementById("nsfwjsUnblurCheck") as HTMLInputElement).checked)
        lastBlurred = 0
    else
        lastBlurred = -1
    preds = []
    if ((document.getElementById("streamerMirrorCheck") as HTMLInputElement).checked)
        vid.style.filter = ""
    rmt.style.filter = ""
    if ((document.getElementById("coverCheck") as HTMLInputElement).checked)
        // cover.style.display = "none"
        document.getElementById('nsfwInfo')!.style.display = "none"
    manualBlur = false
    tempOff = false
    updStatus()
    console.dir("Сброс из-за конца разговора")
}

const $div = $("#remote-video-wrapper");
var observer3 = new MutationObserver(function (mutations) {
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

observer3.observe($div[0], {
    attributes: true
});
