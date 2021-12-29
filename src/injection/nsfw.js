const BLUR_FILTER = "blur(" + blurFilter.value + "px)"
const BLUR_FILTER_PREVIEW = "blur(" + blurPreviewFilter.value + "px)"

const PREDICATIONS_ARRAY_SIZE= +sPredicationsArraySize.value
const PANIC_PROPABILITY= +sPanicPropability.value
const WEIGHT_PORN= +sWeightPorn.value
const WEIGHT_SEXY= +sWeightSexy.value
const BLUR_DURATION= +sBlurDuration.value
const BLUR_PANIC= +sBlurPanic.value
const TIMEOUT= +sTimeout.value

const vid = document.getElementById("local-video")
const rmt = document.getElementById("remote-video")

let manualBlur = false
let tempOff = false
let currentStage = 0
let preds = []

let lastBlurred = 0

if (streamerKeysCheck.checked) {
    document.addEventListener('keyup', (e) => {
        if (e.srcElement.className === "emojionearea-editor")
            return
        switch (e.key) {
            case "ArrowRight":
                if (!(document.getElementById("report-popup").style.display === "block")) {
                    if (e.shiftKey) {
                        tempOff = !tempOff
                        if (!tempOff) {
                            if (!manualBlur) {
                                unblurRemote()
                                if (streamerMirrorCheck.checked) {
                                    unblurLocal()
                                }
                            }
                        }
                    } else {
                        if (rmt.style.filter === "") {
                            blurRemote()
                            manualBlur = true
                        } else {
                            unblurRemote()
                            manualBlur = false
                        }

                        if (streamerMirrorCheck.checked) {
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
    if (coverCheck.checked) {
        rmt.style.filter = "opacity(0%)"
        cover.style.display = ""
    } else {
        rmt.style.filter = BLUR_FILTER
    }
}

function unblurRemote() {
    if (coverCheck.checked) {
        rmt.style.filter = ""
        cover.style.display = "none"
    } else {
        rmt.style.filter = ""
    }
}

function blurLocal() {

    if (coverCheck.checked) {
        vid.style.filter = "opacity(0%)"
        cover2.style.display = ""
    } else {
        vid.style.filter = BLUR_FILTER
    }
}

function unblurLocal() {
    if (coverCheck.checked) {
        vid.style.filter = ""
        cover2.style.display = "none"
    } else {
        vid.style.filter = ""
    }
}

if (nsfwCheck.checked) {
    nsfwjs.load().then(function (model) {
        nsfwInfo.style.display = ""

        let nsfwTimeout = setTimeout(async function tick() {
            if (currentStage === 3) {
                try {
                    const predictions = await model.classify(rmt)
                    if (preds.length >= PREDICATIONS_ARRAY_SIZE)
                        preds.shift()

                    preds.push(predictions)

                    let blur = 0

                    preds.forEach(itemPred => {
                        itemPred.forEach(item => {
                            if (item.className === "Porn" || item.className === "Sexy") {
                                if (item.probability > PANIC_PROPABILITY) {
                                    switch (item.className) {
                                        case "Porn":
                                            blur += WEIGHT_PORN
                                            break;

                                        case "Sexy":
                                            blur += WEIGHT_SEXY
                                            break;
                                    }
                                }
                            }
                        })
                    })
                    let text = `<b>SCORE: ${blur}</b> || `
                    predictions.forEach(item => {
                        text += `<b>${item.className.charAt(0)}</b>: ${(item.probability * 100).toFixed(0) + '% '}`
                    })

                    if (blur >= BLUR_PANIC) {
                        if (streamerMirrorCheck.checked) {
                            blurLocal()
                        }
                        blurRemote()

                        lastBlurred = +new Date()
                    } else {
                        if (preds.length < PREDICATIONS_ARRAY_SIZE) {
                            // vid.style.filter = BLUR_FILTER
                        } else if (lastBlurred === 0) {
                            if (!manualBlur) {
                                if (streamerMirrorCheck.checked)
                                    vid.style.filter = ""
                                rmt.style.filter = ""
                                if (coverCheck.checked)
                                    // cover.style.display = "none"
                                console.dir('РАЗБЛЮР ПЕРВЫЙ')
                                lastBlurred = -1
                            }
                        } else if (lastBlurred !== 0 && lastBlurred !== -1 && +new Date() - lastBlurred > BLUR_DURATION * 1000) {
                            if (!manualBlur && letUnblurCheck.checked) {
                                if (streamerMirrorCheck.checked)
                                    vid.style.filter = ""
                                rmt.style.filter = ""
                                if (coverCheck.checked)
                                    // cover.style.display = "none"
                                console.dir('РАЗБЛЮР')
                            }
                        }
                    }
                    if (currentStage === 3) {
                        nsfwInfo.style.display = ""
                        nsfwInfo.innerHTML = text
                    }
                } catch (err) {
                    console.dir(err)
                }
            }

            nsfwTimeout = setTimeout(tick, TIMEOUT); // (*)
        }, 400);
    })
}

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
                if (!manualBlur && letUnblurCheck.checked)
                    strings.push(`unblur in ${parseInt(BLUR_DURATION + 1 - (+new Date() - lastBlurred) / 1000)}s`)
            }
        }
    }
    streamerStatus.innerText = strings.join(' || ')
}

setInterval(updStatus, 500)

if (streamerPipCheck.checked) {
    echoV = document.createElement('video');

    echoV.id = "echo-video"
    echoV.autoplay = true
    echoV.muted = true
    echoV.playsInline = true
    echoV.width = 0

    header.appendChild(echoV);

    function echoStart() {
        echoV.srcObject = document.getElementById("local-video").srcObject
        document.getElementById('local-video').removeEventListener("play", echoStart)
    }

    document.getElementById('local-video').addEventListener("play", echoStart)
}

function onConversationEnd() {
    if (nsfwjsUnblurCheck.checked)
        lastBlurred = 0
    else
        lastBlurred = -1
    preds = []
    if (streamerMirrorCheck.checked)
        vid.style.filter = ""
    rmt.style.filter = ""
    if (coverCheck.checked)
        // cover.style.display = "none"
    nsfwInfo.style.display = "none"
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
            } else if (attributeValue.includes("s-found")) {
                currentStage = 2
                if (blurPreviewCheck.checked) {
                    document.getElementsByClassName("remote-video__preview")[0].children[0].style.filter = BLUR_FILTER_PREVIEW
                    document.getElementsByClassName("remote-video__preview")[0].children[1].style.filter = BLUR_FILTER_PREVIEW
                }
            } else if (attributeValue.includes("s-play")) {
                manualBlur = false
                currentStage = 3

                if (streamerPipCheck.checked) {
                    echoV.srcObject = document.getElementById("remote-video").srcObject;
                }

                if (blurOnStartCheck.checked) {
                    if (streamerMirrorCheck.checked)
                        blurLocal()

                    blurRemote()
                }
            } else if (attributeValue.includes("s-stop")) {
                currentStage = 0
                onConversationEnd()
            }
        }
    });
});
observer3.observe($div[0], {
    attributes: true
});
