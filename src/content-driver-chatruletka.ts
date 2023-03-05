import $ from "jquery";
import {GeolocationModule} from "./content-module-geolocation";
import {StreamerModule} from "./content-module-streamermode";
import {HotkeysModule} from "./content-module-hotkeys";
import {AutomationModule} from "./content-module-automation";
import {InterfaceModule} from "./content-module-interface";
import {ControlsModule, ControlsTabAbout} from "./content-module-controls";
import {BlacklistModule} from "./content-module-blacklist";
import {FaceapiModule} from "./content-module-faceapi";
import {createSwitchModeButtonContainer} from "./content-swal-switchmode";
import {StatsModule} from "./content-module-stats";
import {ControlsTabSettings} from "./content-module-settings";

export class ChatruletkaDriver {
    private static instanceRef: ChatruletkaDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    public stage: 0 | 1 | 2 | 3 | 4 = 0
    public platform: string
    public site: any
    public modules
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;
    public buttons = $(".buttons")[0]
    public chat = $(".chat")[0]
    public needToCheckTarget: boolean = false;
    public needToClear: boolean = false;
    public tim: NodeJS.Timeout | undefined;
    public timeout: NodeJS.Timeout | undefined;
    private stageObserver: MutationObserver;
    private requestToStartTiming: number = 0;

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

        let rules = $("[data-tr=\"rules\"]")
        if (rules.length === 1) {
            addButtonTo(rules[0])
        } else {
            document.arrive("[data-tr=\"rules\"]", function (el) {
                addButtonTo(<HTMLElement>el)
                document.unbindArrive("[data-tr=\"rules\"]")
            })
        }
    }

    public getSettingsTab() {
        return ControlsTabSettings.initInstance(this, null, [
            this.modules.interface.settings,
            this.modules.automation.settings,
            this.modules.geolocation.settings,
            this.modules.faceapi.settings,
            this.modules.blacklist.settings,
            this.modules.hotkeys.settings,
            this.modules.streamer.settings,
            this.modules.stats.settings
        ])
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
        this.modules.controls.injectControls(this.getTabs())

        this.modules.interface.applyTweaks()

        this.modules.geolocation.injectIpEventListener()

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
            this.modules.faceapi.injectFaceApi()
        }

        if (globalThis.settings.streamer) {
            this.modules.streamer.start()
        }

        this.stageObserver.observe(element, {attributes: true});

        return true
    }


    private onChangeStage = (mutations: any[]) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                if (this.stage === 4) {
                    this.modules.stats.increaseStatsTime((Date.now() - this.play) / 1000)
                }

                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-stop")) {
                    this.stage = 0;

                    clearInterval(this.tim)
                    this.modules.geolocation.curIps = []
                    this.modules.geolocation.curInfo = {}
                    // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                    this.needToClear = true;
                    (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                    if (this.requestToStartTiming !== 0 && +new Date() - this.requestToStartTiming < 1000) {
                        this.requestToStartTiming = 0;
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                    }

                    if (globalThis.settings.streamer) {
                        this.modules.streamer.onStageStop()
                    }
                }
                if (attributeValue.includes("s-search")) {
                    this.stage = 1

                    this.modules.geolocation.curIps = []
                    this.modules.geolocation.curInfo = {}
                    this.needToClear = true
                    this.needToCheckTarget = true

                    clearInterval(this.tim);
                    // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                    if (this.play < this.search) {
                        // console.log("Dialog ended before even started")
                    }

                    this.search = Date.now()

                    if (globalThis.settings.streamer) {
                        this.modules.streamer.onStageSearch()
                    }
                } else if (attributeValue.includes("s-found")) {
                    this.stage = 2;

                    this.needToCheckTarget = true

                    this.found = Date.now()

                    if (globalThis.settings.streamer) {
                        this.modules.streamer.onStageFound()
                    }
                } else if (attributeValue.includes("s-connected")) {
                    this.stage = 3;
                } else if (attributeValue.includes("s-play")) {
                    this.stage = 4;

                    clearInterval(this.tim)
                    this.tim = setTimeout(this.modules.faceapi.detectGender, 0)

                    this.play = Date.now()
                    console.log("Loading took: ", ((this.play - this.found) / 1000).toFixed(2), "sec")

                    if (this.modules.stats) {
                        this.modules.stats.increaseCountAll()
                    }

                    if (globalThis.settings.streamer) {
                        this.modules.streamer.onStagePlay()
                    }
                }
                this.modules.stats.updStats(false)
                this.modules.blacklist.updBlacklistStats()
            }
        });
    }
}