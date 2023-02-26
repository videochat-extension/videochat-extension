import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";

export class ControlsTabStats {
    private static instanceRef: ControlsTabStats;
    public name = chrome.i18n.getMessage("tabStats")
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabStats {
        if (ControlsTabStats.instanceRef === undefined) {
            ControlsTabStats.instanceRef = new ControlsTabStats(controls);
        }

        return ControlsTabStats.instanceRef;
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "statsPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "statsInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsWhole")
                    }),
                    utils.createElement('span', {
                        id: 'stWhole'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsTimeSpent")
                    }),
                    utils.createElement('span', {
                        id: 'stTime'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsMaleSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stMlSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsFemaleSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stFmlSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsManualSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stMnSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsMlCount")
                    }),
                    utils.createElement('span', {
                        id: 'stMlCnt'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsFmlCount")
                    }),
                    utils.createElement('span', {
                        id: 'stFmlCnt'
                    }),
                ]
            )
        ])
    }
}