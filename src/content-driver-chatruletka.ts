import $ from "jquery";
import {detectGender, injectFaceApi} from "./content-module-faceapi";
import {GeolocationModule} from "./content-module-geolocation";
import {injectSwitchModeButton} from "./content-swal-switchmode";
// import {injectCounter} from "./content-controls-tab-api";
import {injectStreamerMode} from "./content-module-streamermode";
import {HotkeysModule} from "./content-module-hotkeys";
import {AutomationModule} from "./content-module-automation";
import {InterfaceModule} from "./content-module-interface";
import {ControlsModule} from "./content-module-controls";

export class ChatruletkaDriver {
    private static instanceRef: ChatruletkaDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    public stage: 0 | 1 | 2 | 3 | 4 = 0
    // TODO: figure out types for modules
    public modules: any = {}
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;
    public buttons = $(".buttons")[0]
    public chat = $(".chat")[0]
    private stageObserver: MutationObserver;
    private requestToStartTiming: number = 0;
    public needToCheckTarget: boolean = false;
    public needToClear: boolean = false;
    public tim: NodeJS.Timeout | undefined;
    public timeout: NodeJS.Timeout | undefined;

    private constructor() {
        this.stageObserver = new MutationObserver(this.onChangeStage)
    }

    static getInstance(): ChatruletkaDriver {
        if (ChatruletkaDriver.instanceRef === undefined) {
            ChatruletkaDriver.instanceRef = new ChatruletkaDriver();
        }

        return ChatruletkaDriver.instanceRef;
    }

    public stopAndStart(delay?: number | undefined): void {
        if (typeof delay !== "undefined") {
            (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
            }, delay)
        } else {
            this.requestToStartTiming = +new Date();
            (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
        }
    }

    public start(element: HTMLElement): boolean {
        this.initModules()

        this.modules.controls.injectControls()

        this.modules.interface.tweakLoginWindow()
        this.modules.interface.applyTweaks()

        this.modules.geolocation.injectIpEventListener()

        injectSwitchModeButton()

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
            if (globalThis.driver.stage === 4)
                globalThis.settings.stats.countManSkip++

            clearTimeout(this.timeout)
        })

        document.getElementsByClassName('buttons__button stop-button')[0].addEventListener("click", (e: any) => { // TODO: fix type
            if (e.pointerType !== "") {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                this.modules.geolocation.checkApi()
            }
            clearTimeout(this.timeout)
        })

        this.modules.geolocation.checkApi()
        this.modules.geolocation.startTimer()

        this.modules.automation.injectAutomationSkipFourSec()
        this.modules.automation.injectAutomationSkipWrongCountry()
        if (globalThis.settings.autoResume) {
            this.modules.automation.injectAutomationAutoResume()
        }

        if (globalThis.settings.hotkeys) {
            this.modules.hotkeys.unregister()
            this.modules.hotkeys.register()
        }

        if (globalThis.settings.skipMale || globalThis.settings.skipFemale || globalThis.settings.enableFaceApi) {
            injectFaceApi()
        }

        if (globalThis.settings.streamer) {
            injectStreamerMode()
        }


        new ResizeObserver(globalThis.mapModule.outputsize).observe(document.getElementById("overlay") as HTMLElement)

        this.stageObserver.observe(element, {attributes: true});

        return true
    }

    protected initModules() {
        this.modules.controls = ControlsModule.initInstance(this)
        this.modules.hotkeys = HotkeysModule.initInstance(this)
        this.modules.automation = AutomationModule.initInstance(this)
        this.modules.interface = InterfaceModule.initInstance(this)
        this.modules.geolocation = GeolocationModule.initInstance(this)
    }

    private onChangeStage = (mutations: any[]) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                if (this.stage === 4) {
                    globalThis.settings.stats.time += Math.ceil((Date.now() - this.play) / 1000)
                }

                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-stop")) {
                    this.stage = 0;

                    clearInterval(this.tim)
                    this.modules.geolocation.curIps = []
                    // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                    this.needToClear = true;
                    (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                    if (this.requestToStartTiming !== 0 && +new Date() - this.requestToStartTiming < 1000) {
                        this.requestToStartTiming = 0;
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                    }
                }
                if (attributeValue.includes("s-search")) {
                    this.stage = 1

                    this.modules.geolocation.curIps = []
                    this.needToClear = true
                    this.needToCheckTarget = true

                    clearInterval(this.tim);
                    // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                    if (this.play < this.search) {
                        // console.log("Dialog ended before even started")
                    }

                    this.search = Date.now()
                } else if (attributeValue.includes("s-found")) {
                    this.stage = 2;

                    this.needToCheckTarget = true

                    this.found = Date.now()
                } else if (attributeValue.includes("s-connected")) {
                    this.stage = 3;
                } else if (attributeValue.includes("s-play")) {
                    this.stage = 4;

                    clearInterval(this.tim)
                    this.tim = setTimeout(detectGender, 0)

                    this.play = Date.now()
                    console.dir("SET PLAY")

                    console.log("Loading took: ", ((this.play - this.found) / 1000).toFixed(2), "sec")

                    globalThis.settings.stats.countAll++
                }
                //TODO: FIX updStats
                // updStats(false)
            }
        });
    }
}