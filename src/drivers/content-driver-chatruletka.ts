import $ from "jquery";
import {GeolocationModule} from "./chatruletka/content-module-geolocation";
import {StreamerModule} from "./chatruletka/content-module-streamermode";
import {HotkeysModule} from "./chatruletka/content-module-hotkeys";
import {AutomationModule} from "./chatruletka/content-module-automation";
import {InterfaceModule} from "./chatruletka/content-module-interface";
import {ControlsModule, ControlsTabAbout} from "./chatruletka/content-module-controls";
import {BlacklistModule} from "./chatruletka/content-module-blacklist";
import {FaceapiModule} from "./chatruletka/content-module-faceapi";
import {createSwitchModeButtonContainer} from "./chatruletka/content-swal-switchmode";
import {StatsModule} from "./chatruletka/content-module-stats";
import {ControlsTabSettings} from "./chatruletka/content-module-settings";
import {getUserBrowser} from "../utils/utils";

export class ChatruletkaDriver {
    private static instanceRef: ChatruletkaDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    public stage: 0 | 1 | 2 | 3 | 4 = 0
    public platform: any
    public site: any
    public modules
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;
    public buttons = $(".buttons")[0]
    public chat = $(".chat")[0]
    public needToCheckTarget: boolean = false;
    public needToClear: boolean = false;
    public timeout: NodeJS.Timeout | undefined;
    private stageObserver: MutationObserver;
    private requestToStartTiming: number = 0;

    public static defaults = {
        ...HotkeysModule.defaults,
        ...AutomationModule.defaults,
        ...InterfaceModule.defaults,
        ...GeolocationModule.defaults,
        ...BlacklistModule.defaults,
        ...FaceapiModule.defaults,
        ...StatsModule.defaults,
        ...StreamerModule.defaults,
        ...ControlsModule.defaults
    }

    private constructor(cur: any) {
        this.stageObserver = new MutationObserver(this.onChangeStage)
        this.platform = cur.platform
        this.site = cur.site

        this.modules = {
            hotkeys: HotkeysModule.initInstance(this),
            automation: AutomationModule.initInstance(this),
            interface: InterfaceModule.initInstance(this),
            geolocation: GeolocationModule.initInstance(this),
            blacklist: BlacklistModule.initInstance(this),
            faceapi: FaceapiModule.initInstance(this),
            stats: StatsModule.initInstance(this),
            streamer: StreamerModule.initInstance(this),
            controls: ControlsModule.initInstance(this)
        }
    }

    static getInstance(cur: any): ChatruletkaDriver {
        if (ChatruletkaDriver.instanceRef === undefined) {
            ChatruletkaDriver.instanceRef = new ChatruletkaDriver(cur);
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

    public injectSwitchModeButton() {
        let switchModeButtonContainer = createSwitchModeButtonContainer()

        function addButtonTo(el: HTMLElement) {
            let switchModeButtonEnjoyer: HTMLElement = el.parentElement!
            $(switchModeButtonContainer).appendTo(switchModeButtonEnjoyer)
            let switchModeSelector = $('#switchModeButtonContainer')
            switchModeSelector.show()

            const obs = new MutationObserver((mutationList, observer) => {
                let switchModeSelector = $('#switchModeButtonContainer')

                if (arguments[0].dataset.tr === "searching") {
                    if (switchModeSelector.length == 1) {
                        switchModeSelector.hide()
                    }
                }
                if (arguments[0].dataset.tr === "rules") {
                    if (switchModeSelector.length == 1) {
                        switchModeSelector.show()
                    }
                }
            })
            obs.observe(el, {attributes: true})
        }

        document.arrive("[data-tr=\"rules\"]", {existing: true, onceOnly: true}, function (el) {
            addButtonTo(<HTMLElement>el)
        })
    }

    public getSettingsTab() {
        let settings = [
            this.modules.interface.settings,
            this.modules.controls.settings,
            this.modules.automation.settings,
            this.modules.geolocation.settings,
            this.modules.faceapi.settings,
            this.modules.blacklist.settings,
            this.modules.hotkeys.settings,
            this.modules.stats.settings
        ]
        if (["chrome", "edge"].includes(getUserBrowser())) {
            settings.splice(-1, 0, this.modules.streamer.settings)
        }
        return ControlsTabSettings.initInstance(this, null, settings)
    }

    public getTabs() {
        return [
            ...this.modules.geolocation.tabs,
            ...this.modules.blacklist.tabs,
            ...this.modules.stats.tabs,
            this.getSettingsTab(),
            ControlsTabAbout.initInstance(this)
        ]
    }

    public start(element: HTMLElement): boolean {
        if (this.modules.controls) {
            this.modules.controls.injectControls(this.getTabs())
        }

        if (this.modules.interface) {
            this.modules.interface.applyTweaks()
        }

        if (this.modules.geolocation) {
            this.modules.geolocation.injectIpEventListener()
        }

        this.injectSwitchModeButton()

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
            if (this.stage === 4) {
                if (this.modules.stats) {
                    this.modules.stats.increaseManSkip()
                }
            }

            clearTimeout(this.timeout)
        })

        document.getElementsByClassName('buttons__button stop-button')[0].addEventListener("click", (e: any) => { // TODO: fix type
            if (this.modules.geolocation) {
                if (typeof e.pointerType !== "undefined") {
                    if (e.pointerType !== "") {
                        this.modules.geolocation.checkApi()
                    }
                } else {
                    if (e.isTrusted) {
                        this.modules.geolocation.checkApi()
                    }
                }
            }

            clearTimeout(this.timeout)
        })

        if (this.modules.geolocation) {
            this.modules.geolocation.checkApi()
            this.modules.geolocation.startTimer()
        }

        if (this.modules.automation) {
            this.modules.automation.injectAutomationSkipFourSec()
            this.modules.automation.injectAutomationSkipWrongCountry()
            if (globalThis.platformSettings.get("autoResume")) {
                this.modules.automation.autoResume.enable()
            }
        }


        if (this.modules.hotkeys && globalThis.platformSettings.get("hotkeys")) {
            this.modules.hotkeys.unregister()
            this.modules.hotkeys.register()
        }

        if (this.modules.faceapi && globalThis.platformSettings.get("skipMale") || globalThis.platformSettings.get("skipFemale") || globalThis.platformSettings.get("enableFaceApi")) {
            this.modules.faceapi.injectFaceApi()
        }

        if (this.modules.streamer && globalThis.platformSettings.get("streamer")) {
            this.modules.streamer.start()
        }

        this.stageObserver.observe(element, {attributes: true});

        if (this.modules.stats) {
            this.modules.stats.updStats(false)
        }

        return true
    }

    private onChangeStage = (mutations: any[]) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                if (this.stage === 4) {
                    if (this.modules.stats) {
                        this.modules.stats.increaseStatsTime((Date.now() - this.play) / 1000)
                    }
                }

                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-stop")) {
                    this.stage = 0;

                    if (this.modules.faceapi) {
                        this.modules.faceapi.stop()
                    }

                    if (this.modules.geolocation) {
                        this.modules.geolocation.curIps = []
                        this.modules.geolocation.curInfo = {}
                    }
                    // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                    this.needToClear = true;
                    (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                    if (this.requestToStartTiming !== 0 && +new Date() - this.requestToStartTiming < 1000) {
                        this.requestToStartTiming = 0;
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                    }

                    if (this.modules.streamer && globalThis.platformSettings.get("streamer")) {
                        this.modules.streamer.onStageStop()
                    }
                }
                if (attributeValue.includes("s-search")) {
                    this.stage = 1
                    if (this.modules.geolocation) {
                        this.modules.geolocation.curIps = []
                        this.modules.geolocation.curInfo = {}
                    }
                    this.needToClear = true
                    this.needToCheckTarget = true

                    if (this.modules.faceapi) {
                        this.modules.faceapi.stop()
                    }
                    // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                    if (this.play < this.search) {
                        // console.dir("Dialog ended before even started")
                    }

                    this.search = Date.now()

                    if (this.modules.streamer && globalThis.platformSettings.get("streamer")) {
                        this.modules.streamer.onStageSearch()
                    }
                } else if (attributeValue.includes("s-found")) {
                    this.stage = 2;

                    this.needToCheckTarget = true

                    this.found = Date.now()

                    if (this.modules.streamer && globalThis.platformSettings.get("streamer")) {
                        this.modules.streamer.onStageFound()
                    }
                } else if (attributeValue.includes("s-connected")) {
                    this.stage = 3;
                } else if (attributeValue.includes("s-play")) {
                    this.stage = 4;

                    if (this.modules.faceapi) {
                        this.modules.faceapi.start(0)
                    }

                    this.play = Date.now()
                    console.dir(`Loading took: ${((this.play - this.found) / 1000).toFixed(2)} sec`)

                    if (this.modules.stats) {
                        this.modules.stats.increaseCountAll()
                    }

                    if (this.modules.streamer && globalThis.platformSettings.get("streamer")) {
                        this.modules.streamer.onStagePlay()
                    }
                }
                if (this.modules.stats) {
                    this.modules.stats.updStats(false)
                }
                if (this.modules.blacklist) {
                    this.modules.blacklist.updBlacklistStats()
                }
            }
        });
    }
}