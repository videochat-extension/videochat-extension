import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {confirmAndReload} from "./content-module-settings";

export class FaceapiModule {
    private static instanceRef: FaceapiModule;
    private faceApiLoaded = false;
    public timeout: NodeJS.Timeout | undefined;
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("genderRecognition")
        },
        {
            type: "checkbox",
            important: false,
            key: "enableFaceApi",
            text: chrome.i18n.getMessage("forcedApi"),
            tooltip: chrome.i18n.getMessage("tooltipForcedRecognition"),
            enable: () => {
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            },
            disable: () => {
                this.setText('')
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "skipMale",
            text: chrome.i18n.getMessage("skip_males"),
            tooltip: chrome.i18n.getMessage("tooltipSkipMales"),
            enable: () => {
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            },
            disable: () => {
                this.setText('')
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "skipFemale",
            text: chrome.i18n.getMessage("skip_females"),
            tooltip: chrome.i18n.getMessage("tooltipSkipFemales"),
            enable: () => {
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            },
            disable: () => {
                this.setText('')
                if (!this.faceApiLoaded)
                    this.injectFaceApi()
            }
        },
    ]
    private driver: ChatruletkaDriver;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
    }

    static initInstance(driver: ChatruletkaDriver): FaceapiModule {
        if (FaceapiModule.instanceRef === undefined) {
            FaceapiModule.instanceRef = new FaceapiModule(driver);
        }

        return FaceapiModule.instanceRef;
    }

    public start(delay: number) {
        if (this.faceApiLoaded) {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(this.detectGender.bind(this), delay)
        }
    }

    public stop() {
        if (this.faceApiLoaded) {
            clearInterval(this.timeout)
        }
    }

    public setText(text: string) {
        (document.getElementById("remoteFace") as HTMLElement).innerHTML = text
    }

    public injectFaceApi() {
        setTimeout(async () => {
            console.time("faceapi: loading models")
            // @ts-ignore
            await faceapi.tf?.setWasmPaths(chrome.runtime.getURL('resources/models') + "/")
            // @ts-ignore
            await faceapi.tf.setBackend('wasm');
            // @ts-ignore
            if (faceapi.tf?.env().flagRegistry.CANVAS2D_WILL_READ_FREQUENTLY) faceapi.tf.env().set('CANVAS2D_WILL_READ_FREQUENTLY', true);
            // @ts-ignore
            if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);
            // @ts-ignore
            if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);
            // @ts-ignore
            await faceapi.tf.enableProdMode();
            // @ts-ignore
            await faceapi.tf.ready();
            await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL('resources/models'))
            await faceapi.nets.ageGenderNet.loadFromUri(chrome.runtime.getURL('resources/models'))
            console.timeEnd("faceapi: loading models")

            console.time("faceapi: initial facedetect");
            this.setText(chrome.i18n.getMessage("initialFaceDetect"));
            let tempImage = document.createElement('img')
            tempImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
            await faceapi.detectAllFaces(tempImage, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
            console.timeEnd("faceapi: initial facedetect");
            this.setText("");

            this.faceApiLoaded = true

            this.start(200)
        }, 0)
    }

    public async detectGender() {
        if (!this.faceApiLoaded) {
            return
        }
        if (!globalThis.settings.skipMale && !globalThis.settings.skipFemale && !globalThis.settings.enableFaceApi)
            return
        let stop = false
        let skip_m = false
        let skip_f = false
        let text = ''
        if (this.driver.stage === 4) {
            this.stop()
            console.time("faceapi: detectAllFaces()")

            let array = await faceapi.detectAllFaces(document.getElementById('remote-video') as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

            for (let i = 0; i < array.length; i++) {
                text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
                if (array[i].gender === "male" && Math.ceil(array[i].genderProbability * 100) > 90) {
                    skip_m = true
                    stop = true
                    if (this.driver.modules.stats) {
                        this.driver.modules.stats.increaseCountMales()
                    }
                }
                if (array[i].gender === "female" && Math.ceil(array[i].genderProbability * 100) > 90) {
                    skip_f = true
                    stop = true
                    if (this.driver.modules.stats) {
                        this.driver.modules.stats.increaseCountFemales()
                    }
                }
            }

            if (skip_m && globalThis.settings.skipMale) {
                text += `<b>male skipping...</b></br>`;
                (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                console.log("MALE SKIPPED")

                if (this.driver.modules.stats) {
                    this.driver.modules.stats.increaseMaleSkip()
                    this.driver.modules.stats.decreaseManSkip()
                }

                if (globalThis.settings.autoBan) {
                    this.driver.modules.blacklist.processAutoBan(this.driver.modules.geolocation.curIps)
                }
            }

            if (skip_f && globalThis.settings.skipFemale) {
                text += `<b>female skipping...</b></br>`;
                (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                console.log("FEMALE SKIPPED")
                if (this.driver.modules.stats) {
                    this.driver.modules.stats.increaseFemaleSkip()
                    this.driver.modules.stats.decreaseManSkip()
                }

                if (globalThis.settings.autoBan) {
                    this.driver.modules.blacklist.processAutoBan(this.driver.modules.geolocation.curIps)
                }
            }

            if (!globalThis.settings.skipMale && !globalThis.settings.skipFemale && !globalThis.settings.enableFaceApi)
                return

            if (text !== '')
                this.setText(text);

            console.timeEnd("faceapi: detectAllFaces()")
        }

        if (!stop) {
            this.start(500)
        }
    }
}
