import * as utils from "./utils";
import {createSettingsInterface} from "./content-module-settings-interface";
import {createSettingsAutomation} from "./content-module-settings-automation";
import {createSettingsGeolocation} from "./content-module-settings-geolocation";
import {createSettingsFaceapi} from "./content-module-settings-faceapi";
import {createSettingsBlacklist} from "./content-module-settings-blacklist";
import {createSettingsHotkeys} from "./content-module-settings-hotkeys";
import {createSettingsStreamer} from "./content-module-settings-streamer";
import {createSettingsMisc} from "./content-module-settings-misc";
import {createSettingsStats} from "./content-module-settings-stats";
import {createSettingsControls} from "./content-module-settings-controls";
import {ControlsModule} from "./content-module-controls";
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

    static createSettingsCheckbox(tagName: string, key: string, settingText: string, settingTooltip: string, enable?: () => void | undefined, disable?: () => void | undefined, controls?: string| undefined) {
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
                            createSettingsInterface(),
                            utils.createElement('br'),

                            createSettingsControls(),
                            utils.createElement('br'),

                            createSettingsAutomation(),
                            utils.createElement('br'),

                            createSettingsGeolocation(),
                            utils.createElement('br'),

                            createSettingsFaceapi(),
                            utils.createElement('br'),

                            createSettingsBlacklist(),
                            utils.createElement('br'),

                            createSettingsHotkeys(),
                            utils.createElement('br'),

                            createSettingsStreamer(),
                            utils.createElement('br'),

                            createSettingsMisc(),
                            utils.createElement('br'),

                            createSettingsStats()
                        ]
                    ),
                ])
        ])
    }
}