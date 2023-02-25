import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";

export class ControlsTabStats {
    private static instanceRef: ControlsTabStats;
    public name = chrome.i18n.getMessage("tabStats")
    public countBeforeSaveStats = 0;
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

    public updStats(force: boolean) {
        (document.getElementById("stWhole") as HTMLElement).innerText = globalThis.settings.stats.countAll;
        (document.getElementById("stMlSk") as HTMLElement).innerText = globalThis.settings.stats.countMaleSkip;
        (document.getElementById("stFmlSk") as HTMLElement).innerText = globalThis.settings.stats.countFemaleSkip;
        (document.getElementById("stMlCnt") as HTMLElement).innerText = globalThis.settings.stats.countMales;
        (document.getElementById("stFmlCnt") as HTMLElement).innerText = globalThis.settings.stats.countFemales;
        (document.getElementById("stMnSk") as HTMLElement).innerText = globalThis.settings.stats.countManSkip;
        (document.getElementById("stBnCt") as HTMLElement).innerText = globalThis.local.ips.length;
        (document.getElementById("stNwIp") as HTMLElement).innerText = globalThis.settings.stats.countNew;
        (document.getElementById("stBnIp") as HTMLElement).innerText = globalThis.settings.stats.countDup;

        (document.getElementById("stTime") as HTMLElement).innerText = utils.secondsToHms(globalThis.settings.stats.time)
        this.countBeforeSaveStats += 1
        if (force || this.countBeforeSaveStats >= 10) {
            this.countBeforeSaveStats = 0
            chrome.storage.sync.set({"stats": globalThis.settings.stats});
        }
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