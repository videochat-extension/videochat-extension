import $ from "jquery";
import * as utils from "../utils/utils";
import {ControlsModuleOmegle} from "./omegle/content-module-controls";
import {ControlsTabAboutOmegle} from "./omegle/content-module-controls";
import {ControlsTabSettingsOmegle} from "./omegle/content-module-settings";
require('tooltipster')
import {GeolocationModuleOmegle} from "./omegle/content-module-geolocation";
import {InterfaceModuleOmegle} from "./omegle/content-module-interface";

export class OmegleDriver {
    private static instanceRef: OmegleDriver;

    private stageObserver: MutationObserver;

    private mode: "video" | "text" | undefined

    public stage: 0 | 1 | 2 | 3 | 4 = 0
    public platform: any
    public site: any
    public modules : {hotkeys: undefined, automation: undefined, interface: InterfaceModuleOmegle, geolocation: GeolocationModuleOmegle, blacklist: undefined, faceapi: undefined, stats: undefined, streamer: undefined, controls: ControlsModuleOmegle}
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;
    public buttons = $(".buttons")[0]
    public chat = $(".chat")[0]
    public needToCheckTarget: boolean = false;
    public needToClear: boolean = false;
    public timeout: NodeJS.Timeout | undefined;

    public static defaults = {
        darkMode: false,
        c1Checked: false,
        c2Checked: false,
        ...GeolocationModuleOmegle.defaults,
        ...ControlsModuleOmegle.defaults
    }


    private resultsContainer: HTMLElement = utils.createElement('div', {
        className: "logitem"
    })

    private constructor(cur: any) {
        this.stageObserver = new MutationObserver(this.onChangeStage)
        this.platform = cur.platform
        this.site = cur.site


        this.modules = {
            hotkeys: undefined,
            automation: undefined,
            interface: new InterfaceModuleOmegle(this),
            geolocation: new GeolocationModuleOmegle(this),
            blacklist: undefined,
            faceapi: undefined,
            stats: undefined,
            streamer: undefined,
            controls: new ControlsModuleOmegle(this)
        }
    }

    static getInstance(cur: any): OmegleDriver {
        if (OmegleDriver.instanceRef === undefined) {
            OmegleDriver.instanceRef = new OmegleDriver(cur);
        }

        return OmegleDriver.instanceRef;
    }

    public getSettingsTab() {
        let settings = [
            this.modules.interface.settings,
            this.modules.controls.settings,
            // this.modules.automation.settings,
            this.modules.geolocation.settings,
            // this.modules.faceapi.settings,
            // this.modules.blacklist.settings,
            // this.modules.hotkeys.settings,
            // this.modules.streamer.settings,
            ControlsTabSettingsOmegle.miscSettings,
            // this.modules.stats.settings
        ]
        return new ControlsTabSettingsOmegle(this, null, settings)
    }

    public getTabs() {
        return [
            ...this.modules.geolocation.tabs,
            this.getSettingsTab(),
            new ControlsTabAboutOmegle(this)
        ]
    }

    public start(element: HTMLElement): boolean {
        this.stageObserver.observe(element, {attributes: true});

        document.arrive("div > p:nth-child(2) > label > input[type=checkbox]", (el: any) => {
            if (globalThis.platformSettings.get('darkMode')) {
                // add inset boxshadow for checkboxes
                el.parentElement.parentElement.parentElement.style.boxShadow = "#363636 0 0 0.5em inset"
            }
            if (globalThis.platformSettings.get('c1Checked'))
                el.click()
            // remember user choice
            el.addEventListener("change", (event: JQuery.ChangeEvent) => {
                globalThis.platformSettings.set({'c1Checked': event.currentTarget.checked})
            })
        })


        document.arrive("div > p:nth-child(3) > label > input[type=checkbox]", (el: any) => {
            if (globalThis.platformSettings.get('c2Checked'))
                el.click()
            // remember user choice
            el.addEventListener("change", (event: JQuery.ChangeEvent) => {
                globalThis.platformSettings.set({'c2Checked': event.currentTarget.checked})
            })
        })

        this.needToClear = true
        this.modules.controls.injectControls(this.getTabs())

        if (this.modules.interface) {
            this.modules.interface.applyTweaks()
        }

        if (this.modules.geolocation) {
            this.modules.geolocation.injectIpEventListener()
        }

        if (this.modules.geolocation) {
            this.modules.geolocation.startTimer()
        }

        if (this.modules.controls.controls) {
            let controls = utils.createElement('div', {
                id: "videochat-extension-controls-container",
                style: "height:200px; width:390px; min-height:200px; min-width:390px; border: 1px solid #d5d5d5;box-shadow: 0 0 5px 0 rgba(0,0,0,.15) inset;background: #fff;margin-bottom:0.5em"
            }, [
                this.modules.controls.controls
            ])
            controls.style.overflow = 'hidden'
            controls.style.resize = 'both'

            new ResizeObserver(()=>{
                if (document.getElementById("videochat-extension-controls-container")) {
                    this.modules.controls.resizemap(false)
                }
            }).observe(controls)

            let self = this
            let firstInjection = true
            document.arrive(".logbox", (el) => {
                if (this.mode === "video") {
                    el.firstElementChild!.prepend(controls)
                    this.modules.controls.resizemap(false)

                    if (firstInjection && self.modules.geolocation) {
                        self.modules.geolocation.checkApi()
                        $('.tooltip').tooltipster({maxWidth: 300, distance: -1})
                        if (this.modules.interface) {
                            this.modules.interface.applyTweaks()
                        }
                        firstInjection = false
                    }
                } else {
                    firstInjection = true
                }
            })
        }

        return true
    }

    public injectSwitchModeButton() {}


    public stopAndStart(delay?: number | undefined): void {}


    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("video")) {
                    this.mode = "video"
                    if (attributeValue.includes('inconversation')) {
                        // active or in search
                        this.play = Date.now()
                        this.stage = 4
                        this.resultsContainer.innerHTML = ""
                    } else {
                        this.stage = 0
                        if (this.modules.geolocation) {
                            this.modules.geolocation.curIps = []
                            this.modules.geolocation.delayIPs = []
                            this.modules.geolocation.curInfo = {}
                        }
                        this.needToClear = true;
                    }
                } else {
                    this.mode = "text"
                }
            }
        });
    }
}