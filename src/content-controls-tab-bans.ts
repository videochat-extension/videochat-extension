import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";

export class ControlsTabBans {
    private static instanceRef: ControlsTabBans;
    public name = chrome.i18n.getMessage("tabBans")
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabBans {
        if (ControlsTabBans.instanceRef === undefined) {
            ControlsTabBans.instanceRef = new ControlsTabBans(controls);
        }

        return ControlsTabBans.instanceRef;
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "bansPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "bansInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("bannedips")
                    }),
                    utils.createElement('span', {
                        id: 'stBnCt'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("goodips")
                    }),
                    utils.createElement('span', {
                        id: 'stNwIp'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("badips")
                    }),
                    utils.createElement('span', {
                        id: 'stBnIp'
                    }),
                ]
            )
        ])
    }
}