import * as faceapi from "face-api.js";
import {syncBlackList} from "./content-module-blacklist";

export function injectFaceApi() {
    setTimeout(async () => {
        console.time("faceapi: loading models")
        await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL('resources/models'))
        await faceapi.nets.ageGenderNet.loadFromUri(chrome.runtime.getURL('resources/models'))
        console.timeEnd("faceapi: loading models")

        console.time("faceapi: initial facedetect");
        (document.getElementById("remoteFace") as HTMLElement).innerHTML = chrome.i18n.getMessage("initialFaceDetect")
        let tempImage = document.createElement('img')
        tempImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
        await faceapi.detectAllFaces(tempImage, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
        console.timeEnd("faceapi: initial facedetect");
        (document.getElementById("remoteFace") as HTMLElement).innerHTML = ""

        globalThis.faceApiLoaded = true

        globalThis.tim = setTimeout(detectGender, 200)
    }, 0)
}

export async function detectGender() {
    if (!globalThis.settings.skipMale && !globalThis.settings.skipFemale && !globalThis.settings.enableFaceApi)
        return
    let stop = false
    let skip_m = false
    let skip_f = false
    let text = ''
    if (globalThis.stage === 3) {
        console.time("faceapi: detectAllFaces()")

        clearInterval(globalThis.tim)

        let array = await faceapi.detectAllFaces(document.getElementById('remote-video') as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

        for (let i = 0; i < array.length; i++) {
            text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
            if (array[i].gender === "male" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_m = true
                stop = true
                globalThis.settings.stats.countMales++
            }
            if (array[i].gender === "female" && Math.ceil(array[i].genderProbability * 100) > 90) {
                skip_f = true
                stop = true
                globalThis.settings.stats.countFemales++
            }
        }

        if (skip_m && globalThis.settings.skipMale) {
            text += `<b>male skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("MALE SKIPPED")
            globalThis.settings.stats.countMaleSkip++
            globalThis.settings.stats.countManSkip--

            if (globalThis.settings.autoBan) {
                syncBlackList()
            }
        }

        if (skip_f && globalThis.settings.skipFemale) {
            text += `<b>female skipping...</b></br>`;
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            console.log("FEMALE SKIPPED")
            globalThis.settings.stats.countFemaleSkip++
            globalThis.settings.stats.countManSkip--

            if (globalThis.settings.autoBan) {
                syncBlackList()
            }
        }

        if (text !== '')
            (document.getElementById("remoteFace") as HTMLElement).innerHTML = text

        console.timeEnd("faceapi: detectAllFaces()")
    }
    if (!stop)
        globalThis.tim = setTimeout(detectGender, 500)
}