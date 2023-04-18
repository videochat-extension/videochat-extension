import $ from "jquery";
import * as utils from "../utils/utils";
import {ContentSwalInfoCoomeetFree} from "./coomeetfree/content-swal-info";

export class CooMeetFreeSimpleDriver {
    private static instanceRef: CooMeetFreeSimpleDriver;

    // Stages: stop = 0 | play = 1
    private stage: 0 | 1 = 0
    private country: string = "?"
    private bot = false
    private botHidden = false
    private botMuted = false

    private video: HTMLVideoElement | undefined;
    private cmtNext: HTMLElement | undefined;
    private cmtStop: HTMLElement | undefined;
    private volumeButton: HTMLElement | undefined;
    private loader: HTMLElement | undefined;

    private constructor() {
    }

    static getInstance(): CooMeetFreeSimpleDriver {
        if (CooMeetFreeSimpleDriver.instanceRef === undefined) {
            CooMeetFreeSimpleDriver.instanceRef = new CooMeetFreeSimpleDriver();
        }

        return CooMeetFreeSimpleDriver.instanceRef;
    }

    public start(element: HTMLElement): boolean {
        this.injectJsonParseListener()
        this.injectInterface()

        this.video = this.getRemoteVideo()
        console.dir(this.video)
        this.cmtNext = this.getNextButton()
        this.cmtStop = this.getStopButton()
        this.volumeButton = this.getVolumeButton()

        if (!this.video) {
            throw new Error("remote video not found")
        }
        if (!this.cmtNext) {
            throw new Error("cmtNext not found")
        }
        if (!this.cmtStop) {
            throw new Error("cmtStop not found")
        }

        if (!this.volumeButton) {
            console.warn("volume button not found")
        }

        // TODO: adapt to layout on free.coomeet.com to support loader there
        let self = this
        document.arrive('.free-cm-app-loader2', {onceOnly: true, existing: true}, (el: Element) => {
            self.loader = (el as HTMLElement).cloneNode(true) as HTMLElement
            self.loader.style.visibility = "hidden"

            if (self.video) {
                self.video.parentElement!.appendChild(self.loader)
            }
        })

        this.cmtStop.addEventListener('click', () => {
            this.setNextButtonText(chrome.i18n.getMessage('freecmBotButtonReset'))
            this.cmtNext!.style.background = ''
            if (self.loader) {
                self.loader.style.visibility = "hidden"
            }
        })

        this.video.addEventListener('play', () => {
            this.stage = 1
            if (this.bot) {
                this.setNextButtonText(chrome.i18n.getMessage('freecmBotButton'))
                this.cmtNext!.style.background = 'black'
            } else {
                this.setNextButtonText(chrome.i18n.getMessage('freecmBotNextButton', [this.country]))
                this.cmtNext!.style.background = 'green'
            }
            if (this.bot) {
                this.hideVideo()
                this.muteAudio()
            } else {
                this.showVideo()
                this.unmuteAudio()
            }
        })

        this.video.addEventListener('emptied', () => {
            this.stage = 0
        })

        return true
    }

    private hideVideo() {
        if (globalThis.platformSettings.get('hideBots')) {
            this.video!.style.visibility = "hidden"
            this.botHidden = true

            if (this.loader) {
                this.loader.style.visibility = "visible"
            }
        }
    }

    private showVideo() {
        if (this.botHidden) {
            this.video!.style.visibility = "visible"
            this.botHidden = false

            if (this.loader) {
                this.loader.style.visibility = "hidden"
            }
        }
    }

    private muteAudio() {
        if (globalThis.platformSettings.get('muteBots')) {
            this.video!.muted = true
            this.botMuted = true
        }
    }

    private unmuteAudio() {
        if (this.botMuted) {
            if (this.volumeButton) {
                let userMuted = this.volumeButton!.className.includes('_off')
                if (!userMuted) {
                    this.video!.muted = false
                }
            } else {
                this.video!.muted = false
            }
            this.botMuted = false
        }
    }

    // TODO: fix dry
    public injectInterface() {
        let self = this
        document.arrive(".free-cm-app-tape-detect__container", {existing: true, onceOnly: true}, function (el) {
            let extensionHeader = utils.createElement('div', {
                className: 'free-cm-app-tape-detect__item'
            }, [
                utils.createElement('span', {
                    innerText: chrome.i18n.getMessage("extension_name_header") + " v" + chrome.runtime.getManifest().version + " (?)",
                    title: chrome.i18n.getMessage('freecmExtensionHeaderTitle'),
                    style: "white-space: nowrap; overflow: hidden; cursor: pointer;",
                    onclick: () => {
                        new ContentSwalInfoCoomeetFree().showFromStart()
                    }
                })
            ])
            el.appendChild(extensionHeader)

            let setting1 = utils.createElement('div', {
                className: 'free-cm-app-tape-detect__item'
            }, [
                utils.createElement("span", {
                    innerText: chrome.i18n.getMessage('freecmSettingHideBots'),
                    style: "cursor:pointer; white-space: nowrap; overflow: hidden;",
                    title: chrome.i18n.getMessage('freecmSettingHideBotsTooltip'),
                    onclick: () => {
                        document.getElementById('hideBotsCheck')!.click()
                    }
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.platformSettings.get('hideBots'),
                    style: "margin:0!important",
                    id: "hideBotsCheck",
                    onchange: (event: JQuery.ChangeEvent) => {
                        let key = "hideBots"
                        let bool = event.currentTarget.checked
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = bool
                        globalThis.platformSettings.set(syncDict)
                        if (bool) {
                            if (self.bot) {
                                self.hideVideo()
                            }
                        } else {
                            self.showVideo()
                        }
                    }
                }),
            ])

            el.appendChild(setting1)
            let setting2 = utils.createElement('div', {
                className: 'free-cm-app-tape-detect__item'
            }, [
                utils.createElement("span", {
                    innerText: chrome.i18n.getMessage('freecmSettingMuteBots'),
                    style: "cursor:pointer; white-space: nowrap; overflow: hidden;",
                    title: chrome.i18n.getMessage('freecmSettingMuteTooltip'),
                    onclick: () => {
                        document.getElementById('muteBotsCheck')!.click()
                    }
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.platformSettings.get('muteBots'),
                    style: "margin:0!important",
                    id: "muteBotsCheck",
                    onchange: (event: JQuery.ChangeEvent) => {
                        let key = "muteBots"
                        let bool = event.currentTarget.checked
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = bool
                        globalThis.platformSettings.set(syncDict)
                        if (bool) {
                            if (self.bot) {
                                self.muteAudio()
                            }
                        } else {
                            self.unmuteAudio()
                        }
                    }
                })
            ])
            el.appendChild(setting2)
        })
    }

    public injectJsonParseListener = () => {
        window.addEventListener("parsed json", (evt) => {
            let json: any = (<CustomEvent>evt).detail.json

            // need to filter non-valid jsons
            try {
                let data = JSON.parse(json)
                if (data && data.data && data.data.countryName && data.data.username) {
                    if (data.data.cn) {
                        this.bot = false
                        this.country = data.data.countryName
                    } else {
                        this.bot = true
                    }
                }
                if (data && data.data && data.data.code && data.data.countries) {
                    let title = chrome.i18n.getMessage('freecmCountriesListTitle', [chrome.i18n.getMessage("extension_name_header"), data.data.code, data.data.countries.join(', ')])
                    let countriesSelected = $('.free-cm-app-inline-status2_disabled')
                    if (countriesSelected.length > 0) {
                        countriesSelected[0].title = title
                        countriesSelected[0].innerText += " (?)"
                    }
                    countriesSelected = $('.free-cm-app-inline-status_disabled')
                    if (countriesSelected.length > 0) {
                        countriesSelected[0].title = title
                        countriesSelected[0].innerText += " (?)"
                    }
                }
            } catch (e) {
                // console.dir(e)
            }
        }, false);
    }

    private getRemoteVideo() {
        let vid = $(".free-cm-app-video-stream")
        if (vid.length > 0) {
            return vid[0] as HTMLVideoElement
        }
        return undefined;
    }

    private getNextButton(): HTMLElement | undefined {
        let cmtNext = $("#cmtNext")
        if (cmtNext.length > 0) {
            return cmtNext[0]
        } else {
            let button = document.querySelector('#free-cm > div > div.free-cm-app__container > div > div > section:nth-child(1) > div > div:nth-child(2) > div > div.free-cm-app-chat__sidebar > div > div:nth-child(1) > button')
            if (button) {
                return button as HTMLElement
            }
        }
        return undefined;
    }

    private setNextButtonText(str: string) {
        if (this.cmtNext!.tagName === "INPUT") {
            // @ts-ignore
            this.cmtNext!.value = str
        } else {
            this.cmtNext!.innerText = str
        }
    }

    private getStopButton(): HTMLElement | undefined {
        let cmtNext = $("#cmtStop")
        if (cmtNext.length > 0) {
            return cmtNext.last()[0]
        } else {
            let button = document.querySelector('#free-cm > div > div.free-cm-app__container > div > div > section:nth-child(1) > div > div:nth-child(2) > div > div.free-cm-app-chat__sidebar > div > div:nth-child(2) > button')
            if (button) {
                return button as HTMLElement
            }
        }
        return undefined;
    }

    private getVolumeButton() {
        let vol = $(".free-cm-app-control-volume")
        if (vol.length > 0) {
            return vol[0] as HTMLElement
        }
        let vol2 = $(".free-cm-app-control-volume2")
        if (vol2.length > 0) {
            return vol2[0] as HTMLElement
        }
        return undefined;
    }
}