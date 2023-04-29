import * as utils from "../../utils/utils";
import {switchMode} from "./content-swal-switchmode";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import ChangeEvent = JQuery.ChangeEvent;

let needReload = false

export function confirmAndReload() {
    if (!needReload) {
        needReload = true
        let VE_extension_name_header: HTMLElement = document.getElementById("VE_extension_name_header") as HTMLElement
        VE_extension_name_header.setAttribute("data-tooltip", chrome.i18n.getMessage("reloadRequired"))
        VE_extension_name_header.className = "tooltip-multiline tooltip-bottom";
        (VE_extension_name_header.parentElement as HTMLAnchorElement).href = ".";
        (VE_extension_name_header.parentElement as HTMLAnchorElement).target = ""
        VE_extension_name_header.style.color = "red"

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
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 5
    public settings: any[] | undefined;
    private driver: ChatruletkaDriver;
    private module: any;

    private constructor(driver: ChatruletkaDriver, module?: any, settings?: any[]) {
        this.driver = driver
        this.module = module
        this.settings = settings
        this.tab = this.getTabHTML()
        this.content = this.getContentHTML()
    }

    static initInstance(driver: ChatruletkaDriver, module?: any, settings?: any[]): ControlsTabSettings {
        if (ControlsTabSettings.instanceRef === undefined) {
            ControlsTabSettings.instanceRef = new ControlsTabSettings(driver, module, settings);
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

    static createSettingsCheckbox(global: boolean, tagName: string, key: string, settingText: string, settingTooltip: string, enable?: () => void | undefined, disable?: () => void | undefined, controls?: string | undefined) {
        return utils.createElement(global ? 'div' : 'dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement(tagName, {
                    innerText: settingText,
                    className: "tooltip",
                    style: "cursor: pointer",
                    title: settingTooltip,
                    onclick: () => {
                        document.getElementById(`${key}Check`)!.click()
                    }
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: global ? false : globalThis.platformSettings.get(key),
                    id: `${key}Check`,
                    onchange: (event: ChangeEvent) => {
                        let checked = event.currentTarget.checked

                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = event.currentTarget.checked
                        if (global) {
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
                        } else {
                            globalThis.platformSettings.setBack(syncDict, function () {
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
                        }
                    },
                })
            ]),
        ])
    }

    static createSettingsRange(tagName: string, key: string, min: number, max: number, settingText: string, settingTooltip: string, onchange?: (event: ChangeEvent) => void) {
        return utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement(tagName, {
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
                    value: globalThis.platformSettings.get(key),
                    onchange: (event: ChangeEvent) => {
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = event.currentTarget.value
                        let ev = event
                        // TODO: TEST THIS
                        globalThis.platformSettings.setBack(syncDict, function () {
                            if (onchange) {
                                onchange(ev)
                            }
                        });

                        // chrome.storage.sync.set(syncDict, function () {
                        //     if (onchange) {
                        //         onchange(ev)
                        //     }
                        // });
                    },
                })
            ]),
        ])
    }

    static createSettingsSelect(tagName: string, key: string, selected: string, optionsInput: any, settingText: string, settingTooltip: string, onchange?: (event: ChangeEvent) => void) {
        let options = []
        for (const option of optionsInput) {
            let newOption = utils.createElement('option', {
                value: option.value,
                innerText: option.text
            })
            if (option.value === selected) {
                // @ts-ignore
                newOption.selected = true
            }
            options.push(newOption)
        }

        return utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement(tagName, {
                    innerText: settingText,
                    className: "tooltip",
                    title: settingTooltip
                }),
                utils.createElement('select', {
                    name: `${key}Select`,
                    id: `${key}Select`,
                    onchange: (event: ChangeEvent) => {
                        let syncDict: { [key: string]: any } = {}
                        syncDict[key] = event.currentTarget.value
                        let ev = event
                        // TODO: TEST THIS
                        globalThis.platformSettings.setBack(syncDict, function () {
                            if (onchange) {
                                onchange(ev)
                            }
                        });
                    },
                }, options)
            ]),
        ])
    }

    public handleResize() {

    }

    public handleTabClick() {

    }

    public getSettingsHTML(settings: any): HTMLElement[] {
        let array: HTMLElement[] = []
        settings.splice(-1, 0, this.miscSettings)
        settings.forEach((setting: any) => {
            array.push(utils.createElement('div', {}, this.processSettings(setting)))
            array.push(utils.createElement('br'))
        })
        array.pop()
        return array
    }

    protected getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    protected getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "settingsPanel",
            style: "height:100%; padding-top: 1px"
        }, [
            utils.createElement('div', {
                    id: "settingsInfo",
                    style: "overflow-y: auto; height:100%; user-select: none;"
                },
                [
                    utils.createElement('dl', {}, this.getSettingsHTML(this.settings)),
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
                    newElement = ControlsTabSettings.createSettingsCheckbox(false, tagName, el.key, el.text, el.tooltip, el.enable, el.disable, el.controlsSection)
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

                case "select": {
                    let tagName = el.important ? "b" : "p"
                    el.selected = globalThis.platformSettings.get(el.key)
                    newElement = ControlsTabSettings.createSettingsSelect(tagName, el.key, el.selected, el.options, el.text, el.tooltip, el.onchange)
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
        return settingsElements
    }
}