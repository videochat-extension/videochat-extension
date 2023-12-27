import $ from "jquery";
import * as utils from "../utils/utils";
import {ContentSwalInfoCoomeetFreeSimplified} from "./coomeetfree/content-swal-info";

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
    private emoji = utils.createElement('p', {
        style: "position: absolute; visibility: hidden; top:50%; left:50%; color:white; transform: translate(-50%, -50%); margin:0; padding:0; user-select: none; font-size: 150%; line-height: 150%",
        innerText: "🤖",
    })

    private volume = 0;
    private predVolume = 0;
    private volumeControl = utils.createElement('div', {
        className: "free-cm-video-in__panel-item"
    }, [
        utils.createElement('span', {
            innerText: `v: ${this.volume}%`,
            title: chrome.i18n.getMessage('freecmVolumeTitle'),
            style: "white-space: nowrap; overflow: hidden; user-select: none; cursor: ns-resize"
        })
    ])

    private updVolume(volume: number) {
        this.volume = volume;
        if (this.video) {
            this.predVolume = this.video.volume
            this.video.volume = +volume.toFixed(2);
        }
        (this.volumeControl.children[0] as HTMLElement).innerText = `v: ${Math.ceil(this.volume * 100)}%`
    }

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
        this.cmtNext = this.getNextButton()
        this.cmtStop = this.getStopButton()

        if (!this.video) {
            throw new Error("remote video not found")
        } else {
            this.updVolume(this.video.volume)
        }
        if (!this.cmtNext) {
            throw new Error("cmtNext not found")
        }
        if (!this.cmtStop) {
            throw new Error("cmtStop not found")
        }

        if (this.video) {
            this.video.parentElement!.appendChild(this.emoji)
        }
        let self = this
        this.cmtStop.addEventListener('click', () => {
            this.setNextButtonText(chrome.i18n.getMessage('freecmBotButtonReset'))
            this.cmtNext!.style.background = ''
            if (globalThis.platformSettings.get('emoji')) {
                this.emoji.style.visibility = "hidden"
            }
        })

        document.arrive(".free-cm-video-in-stream", {
            existing: true
        }, function (el) {
            self.video = el as HTMLVideoElement;

            self.video.volume = +self.volume.toFixed(2);
            self.video.addEventListener('play', () => {


                self.stage = 1
                if (self.bot) {
                    self.setNextButtonText(chrome.i18n.getMessage('freecmBotButton', [self.country]))
                    self.cmtNext!.style.background = 'black'
                } else {
                    self.setNextButtonText(chrome.i18n.getMessage('freecmBotNextButton', [self.country]))
                    self.cmtNext!.style.background = 'green'
                }
                if (self.bot) {
                    self.hideVideo()
                } else {
                    self.showVideo()
                }
            })
        })

        document.leave(".free-cm-video-in-stream", function (el) {
            self.stage = 0
            self.video = undefined
        })

        return true
    }

    private hideVideo() {
        if (globalThis.platformSettings.get('hideBots')) {
            if (this.video) {
                this.video!.style.visibility = "hidden"
                this.botHidden = true

                if (globalThis.platformSettings.get('emoji')) {
                    this.emoji.style.visibility = "visible"
                }

                this.muteAudio()
            }
        }
    }

    private showVideo() {
        if (this.botHidden) {
            if (this.video) {
                this.video!.style.visibility = "visible"
                this.botHidden = false

                if (globalThis.platformSettings.get('emoji')) {
                    this.emoji.style.visibility = "hidden"
                }

                this.unmuteAudio()
            }
        }
    }

    private muteAudio() {
        if (globalThis.platformSettings.get('hideBots')) {
            if (globalThis.platformSettings.get('muteBots')) {
                if (this.video) {
                    this.video!.muted = true
                    this.botMuted = true
                }
            }
        }
    }

    private unmuteAudio() {
        if (this.botMuted) {
            if (this.video) {
                this.video!.muted = false
                this.botMuted = false
            }
        }
    }

    // TODO: fix dry
    public injectInterface() {
        let self = this

        document.arrive(".free-cm-video-in__panel", {
            existing: true,
            onceOnly: true
        }, function (el) {
            $(self.volumeControl).on('wheel', function (event: any) {
                event.preventDefault()
                if (self.video) {
                    const delta = 0.02

                    if (event.originalEvent.deltaY > 0 && self.video.volume - delta >= 0) {
                        self.video.volume -= delta;
                    } else if (event.originalEvent.deltaY < 0 && self.video.volume + delta <= 1) {
                        self.video.volume += delta;
                    }

                    self.updVolume(self.video.volume)
                }
            })
            $(self.volumeControl).on('click', function (event: any) {
                event.preventDefault()
                if (self.video) {
                    if (self.video.volume == 0) {
                        self.updVolume(self.predVolume)
                    } else {
                        self.updVolume(0)
                    }
                }
            })

            self.volumeControl.style.display = "none"
            $(el).on("mouseenter", () => {
                self.volumeControl.style.display = ""
            })
            $(el).on("mouseleave", () => {
                self.volumeControl.style.display = "none"
            })

            el.appendChild(self.volumeControl)
        })

        document.arrive('.free-cm-video-out-refresh', {existing: true}, function (el) {
            if (el instanceof HTMLElement) {
                el.style.minWidth = '12px'
            }
        })

        document.arrive(".free-cm-video-out__panel", {existing: true, onceOnly: true}, function (el) {
            if (el instanceof HTMLElement) {
                el.style.overflow = 'auto'
                el.style.overflowY = 'hidden'
            }
            let extensionHeader = utils.createElement('div', {
                className: 'free-cm-video-out__panel-item'
            }, [
                utils.createElement('span', {
                    innerText: "Videochat Extension v" + chrome.runtime.getManifest().version,
                    title: chrome.i18n.getMessage('freecmExtensionHeaderTitle'),
                    style: "white-space: nowrap; overflow: hidden; cursor: pointer;user-select:none;",
                    onclick: () => {
                        new ContentSwalInfoCoomeetFreeSimplified().showFromStart()
                    }
                })
            ])
            el.appendChild(extensionHeader)

            let setting1 = utils.createElement('div', {
                className: 'free-cm-video-out__panel-item'
            }, [
                utils.createElement("span", {
                    innerText: chrome.i18n.getMessage('freecmSettingHideBots'),
                    style: "cursor:pointer; white-space: nowrap; overflow: hidden;  user-select:none;",
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
                            setting2.style.display = ""
                            setting3.style.display = "";
                        } else {
                            self.showVideo()
                            setting2.style.display = "none"
                            setting3.style.display = "none"
                        }
                    }
                }),
            ])

            el.appendChild(setting1)

            let setting2 = utils.createElement('div', {
                className: 'free-cm-video-out__panel-item'
            }, [
                utils.createElement("span", {
                    innerText: chrome.i18n.getMessage('freecmSettingEmoji'),
                    style: "cursor:pointer; white-space: nowrap; overflow: hidden;  user-select:none;",
                    title: chrome.i18n.getMessage('freecmSettingEmojiTooltip'),
                    onclick: () => {
                        document.getElementById('emojiCheck')!.click()
                    }
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.platformSettings.get('emoji'),
                    style: "margin:0!important",
                    id: "emojiCheck",
                    onchange: (event: JQuery.ChangeEvent) => {
                        let key = "emoji"
                        let bool = event.currentTarget.checked
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = bool
                        globalThis.platformSettings.set(syncDict)
                        if (bool) {
                            if (self.botHidden) {
                                self.emoji.style.visibility = "visible"
                            }
                        } else {
                            self.emoji.style.visibility = "hidden"
                        }
                    }
                }),
            ])

            el.appendChild(setting2)

            let setting3 = utils.createElement('div', {
                className: 'free-cm-video-out__panel-item'
            }, [
                utils.createElement("span", {
                    innerText: chrome.i18n.getMessage('freecmSettingMuteBots'),
                    style: "cursor:pointer; white-space: nowrap; overflow: hidden;  user-select:none;",
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
            el.appendChild(setting3)
            setting1.style.display = "none"
            setting2.style.display = "none"
            setting3.style.display = "none"
            $(el).on("mouseenter", () => {
                setting1.style.display = ""
                if (globalThis.platformSettings.get('hideBots')) {
                    setting2.style.display = ""
                    setting3.style.display = "";
                }
                (extensionHeader.firstChild as HTMLElement).innerText = "v" + chrome.runtime.getManifest().version + " (?)"
            })
            $(el).on("mouseleave", () => {
                setting1.style.display = "none"
                setting2.style.display = "none"
                setting3.style.display = "none";
                (extensionHeader.firstChild as HTMLElement).innerText = "Videochat Extension v" + chrome.runtime.getManifest().version
            })
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
                        this.country = data.data.country
                    }
                }
                if (data && data.data && data.data.code && data.data.countries) {
                    let title = chrome.i18n.getMessage('freecmCountriesListTitle', [chrome.i18n.getMessage("extension_name_header"), data.data.code, data.data.countries.join(', ')])
                    let countriesSelected = $('.free-cm-video-in__panel-item')
                    if (countriesSelected.length > 0) {
                        countriesSelected[0].title = title
                        // countriesSelected[0].innerText += " (?)"
                    }
                }
            } catch (e) {
                // console.dir(e)
            }
        }, false);
    }

    private getRemoteVideo() {
        let vid = $(".free-cm-video-in-stream")
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
}