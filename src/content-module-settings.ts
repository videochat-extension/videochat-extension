import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";
import {switchMode} from "./content-swal-switchmode";
import ChangeEvent = JQuery.ChangeEvent;

let needReload = false

export function confirmAndReload() {
    if (!needReload) {
        needReload = true
        let connectionStatus: HTMLElement = document.getElementById("connectionStatus") as HTMLElement
        connectionStatus.setAttribute("data-tooltip", chrome.i18n.getMessage("reloadRequired"))
        connectionStatus.className = "tooltip-multiline tooltip-bottom";
        (connectionStatus.parentElement as HTMLAnchorElement).href = ".";
        (connectionStatus.parentElement as HTMLAnchorElement).target = ""
        connectionStatus.style.color = "red"

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener('click', () => {
            if (confirm(chrome.i18n.getMessage("reloadRequired"))) {
                location.reload()
            }
        })
    }
}

export class ControlsTabSettings {
    private static instanceRef: ControlsTabSettings;
    public name = chrome.i18n.getMessage("tab3")
    public miscSettings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsMisc")
        },
        {
            type: "checkbox",
            important: false,
            key: "sentry",
            text: chrome.i18n.getMessage("sentry"),
            tooltip: chrome.i18n.getMessage("tooltipSentry")
        },
        {
            type: "button",
            text: chrome.i18n.getMessage("switchModeButtonText"),
            onclick: (e: MouseEvent) => {
                switchMode()
            }
        },
    ]
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabSettings {
        if (ControlsTabSettings.instanceRef === undefined) {
            ControlsTabSettings.instanceRef = new ControlsTabSettings(controls);
        }

        return ControlsTabSettings.instanceRef;
    }

    static createSettingsHeader(innerHTML: string) {
        return utils.createElement('dt', {
            innerHTML: innerHTML
        })
    }

    static createSettingsButton(innerText: string, onclick: (e: MouseEvent) => void) {
        return utils.createElement('dd', {}, [
            utils.createElement('button', {
                style: "margin-top: 2px",
                onclick: onclick,
            }, [
                utils.createElement('b', {
                    innerText: innerText
                })
            ])
        ])
    }

    static createSettingsCheckbox(tagName: string, key: string, settingText: string, settingTooltip: string, enable?: () => void | undefined, disable?: () => void | undefined, controls?: string | undefined) {
        return utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("small", {
                    // utils.createElement(tagName, {
                    innerText: settingText,
                    className: "tooltip",
                    title: settingTooltip
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings[key],
                    id: `${key}Check`,
                    onchange: (event: ChangeEvent) => {
                        let checked = event.currentTarget.checked

                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = event.currentTarget.checked
                        chrome.storage.sync.set(syncDict, function () {
                            if (checked) {
                                if (enable) {
                                    enable()
                                }
                                if (controls) {
                                    document.getElementById(controls)!.style.display = ""
                                }
                            } else {
                                if (disable) {
                                    disable()
                                }
                                if (controls) {
                                    document.getElementById(controls)!.style.display = "none"
                                }
                            }
                        });
                    },
                })
            ]),
        ])
    }

    static createSettingsRange(tagName: string, key: string, min: number, max: number, settingText: string, settingTooltip: string, onchange?: () => void) {
        return utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                // utils.createElement(tagName, {
                utils.createElement("small", {
                    innerText: settingText,
                    className: "tooltip",
                    title: settingTooltip
                }),
                utils.createElement('input', {
                    type: "range",
                    id: `${key}Range`,
                    style: "vertical-align: middle!important;",
                    min: min,
                    max: max,
                    value: globalThis.settings[key],
                    onchange: (event: ChangeEvent) => {
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = event.currentTarget.value
                        chrome.storage.sync.set(syncDict, function () {
                            if (onchange) {
                                onchange()
                            }
                        });
                    },
                })
            ]),
        ])
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "settingsPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "settingsInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('dl', {},
                        [
                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.interface.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.automation.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.geolocation.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.faceapi.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.blacklist.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.hotkeys.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.streamer.settings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.miscSettings)),
                            utils.createElement('br'),

                            utils.createElement('div', {}, this.processSettings(this.controls.driver.modules.stats.settings))
                        ]
                    ),
                ])
        ])
    }


    private processSettings(array: { type: string, [key: string]: any }[]) {
        let settingsElements: HTMLElement[] = []

        array.forEach((el) => {
            let newElement: HTMLElement | undefined
            switch (el.type) {
                case "header": {
                    newElement = ControlsTabSettings.createSettingsHeader(el.text)
                    break;
                }

                case "checkbox": {
                    let tagName = el.important ? "b" : "p"
                    newElement = ControlsTabSettings.createSettingsCheckbox(tagName, el.key, el.text, el.tooltip, el.enable, el.disable, el.controlsSection)
                    break;
                }

                case "button": {
                    newElement = ControlsTabSettings.createSettingsButton(el.text, el.onclick)
                    break;
                }

                case "range": {
                    let tagName = el.important ? "b" : "p"
                    newElement = ControlsTabSettings.createSettingsRange(tagName, el.key, el.min, el.max, el.text, el.tooltip, el.onchange)
                    break;
                }

                case "section": {
                    newElement = utils.createElement('div', {
                        id: el.sectionId,
                        style: function f() {
                            if (el.hide) {
                                return ""
                            } else {
                                return "display:none"
                            }
                        }(),
                    }, this.processSettings(el.children))
                    break;
                }

                case "HTMLElement" : {
                    console.dir(arguments)
                    newElement = el.element
                    break;
                }

                case "br": {
                    newElement = utils.createElement('br')
                }
            }

            if (newElement) {
                settingsElements.push(newElement)
            }
        })
        console.dir(settingsElements)
        return settingsElements
    }
}