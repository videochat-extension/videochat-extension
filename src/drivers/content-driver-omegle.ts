import $ from "jquery";
import * as utils from "../utils/utils";
import {ControlsModuleOmegle, ControlsTabAboutOmegle} from "./omegle/content-module-controls";
import {ControlsTabSettingsOmegle} from "./omegle/content-module-settings";
import {GeolocationModuleOmegle} from "./omegle/content-module-geolocation";
import {InterfaceModuleOmegle} from "./omegle/content-module-interface";
import {switchModeOmegle} from "./omegle/content-swal-switchmode";

require('tooltipster')

export class OmegleDriver {
    public static defaults = {
        darkMode: false,
        c1Checked: false,
        c2Checked: false,
        ...GeolocationModuleOmegle.defaults,
        ...ControlsModuleOmegle.defaults
    }
    private static instanceRef: OmegleDriver;
    public stage: 0 | 1 | 2 | 3 | 4 = 0
    public platform: any
    public site: any
    public modules: {
        hotkeys: undefined,
        automation: undefined,
        interface: InterfaceModuleOmegle,
        geolocation: GeolocationModuleOmegle,
        blacklist: undefined,
        faceapi: undefined,
        stats: undefined,
        streamer: undefined,
        controls: ControlsModuleOmegle
    }
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;
    public buttons = $(".buttons")[0]
    public chat = $(".chat")[0]
    public needToCheckTarget: boolean = false;
    public needToClear: boolean = false;
    public timeout: NodeJS.Timeout | undefined;
    private stageObserver: MutationObserver;
    private mode: "video" | "text" | undefined

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
        this.injectSwitchModeButton()

        document.arrive("td.chatmsgcell > div > textarea", (textarea: any) => {
            this.stageObserver.observe(textarea, {attributes: true})
        })

        // document.addEventListener('keyup', (ev) => {
        //     switch (ev.key) {
        //         case "ArrowLeft":
        //             this.stopAndStart(1000)
        //             break;
        //     }
        // })

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
                style: "height:215px; width:390px; min-height:215px; min-width:390px; border: 1px solid #d5d5d5;box-shadow: 0 0 5px 0 rgba(0,0,0,.15) inset;background: #fff;margin-bottom:0.5em"
            }, [
                this.modules.controls.controls
            ])
            controls.style.overflow = 'hidden'
            controls.style.resize = 'both'

            new ResizeObserver(() => {
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

    private switchModeLabel = utils.createElement('label', null, [
        utils.createElement('input', {
            type: "checkbox",
            checked: !globalThis.platformSettings.get('minimalism'),
            onchange: async function (ev: JQuery.ChangeEvent) {
                switchModeOmegle()
                ev.currentTarget.checked = true
            }
        }),
        utils.createElement('span', {
            innerText: " Enable advanced mode"
        })
    ])

    public injectSwitchModeButton() {
        document.arrive(".logtopicsettings", {existing: true}, (el) => {
            $('<br>').insertBefore(el.children[0])
            $(this.switchModeLabel).insertBefore(el.children[0])
        })
    }

    public addStringToLog(show: boolean, string: string): void {
        console.dir(string)
        if (show && globalThis.platformSettings.get('logToChat')) {
            if (!globalThis.platformSettings.get('logIpToChat') && string.includes("IP: ")) {
                return
            }
            let logitem = utils.createElement('div', {
                className: "logitem",
            }, [
                utils.createElement('p', {
                    className: "statuslog",
                    innerText: `Videochat Extension: ${string}`
                })
            ])
            let logbox = document.querySelector("div.logwrapper > div.logbox > div")
            if (logbox) {
                logbox.appendChild(logitem)
            }
        }
    }

    // dont need to auto-start on omegle since auto-rererolling is a part of the ui
    public stopAndStart(delay?: number): void {
        if (typeof delay === "undefined") {
            delay = 1000
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            let disconnectbtns = document.getElementsByClassName("disconnectbtn");
            if (disconnectbtns.length > 0) {
                let button = (disconnectbtns[0] as HTMLButtonElement)
                if (this.stage > 0) {
                    this.addStringToLog(true, "Disconnecting...")
                    button.click();
                    button.click();
                }
            }
        }, delay)
        this.addStringToLog(true, `Skipping in ${(delay / 1000).toFixed(1)} s.`)
    }


    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "disabled") {
                if (!(mutation.target as HTMLTextAreaElement).disabled) {
                    this.play = Date.now()
                    this.stage = 4
                    // alert('found -> play')
                }
            }
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("video")) {
                    this.mode = "video"
                    if (attributeValue.includes('inconversation')) {
                        // active or in search
                        this.stage = 1
                        if (this.modules.geolocation) {
                            this.modules.geolocation.curIps = []
                            this.modules.geolocation.delayIPs = []
                            this.modules.geolocation.curInfo = {}
                        }

                        this.stage = 1
                        // alert('search')
                    } else {
                        this.stage = 0
                        clearTimeout(this.timeout)
                        if (this.modules.geolocation) {
                            this.modules.geolocation.curIps = []
                            this.modules.geolocation.delayIPs = []
                            this.modules.geolocation.curInfo = {}
                            // temporary solution to not spam with api check on every skip
                            if (this.modules.geolocation.checks < 2) {
                                this.modules.geolocation.checkApi()
                            }
                        }
                        this.needToClear = true;
                        this.needToCheckTarget = true
                        // alert('stop')
                    }
                } else {
                    this.mode = "text"
                }
            }
        });
    }
}