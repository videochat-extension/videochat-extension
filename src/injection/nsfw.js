nsfwjs.load().then(function (model) {
    const vid = document.getElementById("local-video")
    let last_blur = 0

    nsfwInfo.style.display = ""


    let nsfwTimeout = setTimeout(async function tick() {
        if (localStage.innerText === "3") {
            const predictions = await model.classify(vid)
            let text = ''
            let blur = false

            predictions.forEach(item => {
                if (item.className === "Porn" || item.className === "Sexy") {
                    if (item.probability > 0.8) {
                        blur = true
                        console.dir("ОСНОВАНИЕ ДЛЯ БЛЮРА "+`<b>${item.className.charAt(0)}</b>: ${(item.probability * 100).toFixed(0) + '% '}`)
                    }
                }
                text += `<b>${item.className.charAt(0)}</b>: ${(item.probability * 100).toFixed(0) + '% '}`
            })

            if (blur) {
                vid.style.filter = "blur(20px)"
                last_blur = +new Date()
            } else {
                if (last_blur === 0) {
                    vid.style.filter = ""
                    console.dir('РАЗБЛЮР')
                } else if (last_blur !== 0 && +new Date() - last_blur > 10*1000) {
                    vid.style.filter = ""
                    console.dir('РАЗБЛЮР')
                }
            }

            nsfwInfo.style.display = ""
            nsfwInfo.innerHTML = text
        } else {
            last_blur = 0
            vid.style.filter = ""
            nsfwInfo.style.display = "none"
        }

        nsfwTimeout = setTimeout(tick, 300); // (*)
    }, 400);
})
