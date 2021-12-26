const PREDICATIONS_ARRAY_SIZE = 4
const PANIC_PROPABILITY = 0.8
const BLUR_FILTER = "blur(55px)"
const WEIGHT_PORN = 2
const WEIGHT_SEXY = 1
const BLUR_DURATION = 5
const BLUR_PANIC = 6
const TIMEOUT = 150

nsfwjs.load().then(function (model) {
    const vid = document.getElementById("local-video")
    const rmt = document.getElementById("remote-video")

    let last_blur = 0
    nsfwInfo.style.display = ""

    // document.getElementById("logo-link").style.marginLeft="50px"
    // document.getElementsByClassName("btn btn-red")[0].style.display = "none"
    // document.getElementsByClassName("btn btn-main")[0].style.display = "none"

    let preds = []

    let nsfwTimeout = setTimeout(async function tick() {
        if (localStage.innerText === "3") {
            try {
                const predictions = await model.classify(vid)
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
                    vid.style.filter = BLUR_FILTER
                    rmt.style.filter = BLUR_FILTER

                    last_blur = +new Date()
                } else {
                    if (preds.length < PREDICATIONS_ARRAY_SIZE) {
                        // vid.style.filter = BLUR_FILTER
                    } else if (last_blur === 0) {
                        vid.style.filter = ""
                        rmt.style.filter = ""
                        console.dir('РАЗБЛЮР ПЕРВЫЙ')
                    } else if (last_blur !== 0 && +new Date() - last_blur > BLUR_DURATION * 1000) {
                        vid.style.filter = ""
                        rmt.style.filter = ""
                        console.dir('РАЗБЛЮР')
                    }
                }

                nsfwInfo.style.display = ""
                nsfwInfo.innerHTML = text
            } catch (err) {
                console.dir(err)
            }
        } else {
            last_blur = 0
            preds = []
            vid.style.filter = ""
            rmt.style.filter = ""
            nsfwInfo.style.display = "none"
        }

        nsfwTimeout = setTimeout(tick, TIMEOUT); // (*)
    }, 400);
})
