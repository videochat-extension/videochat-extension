import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";

export class ControlsTabMap {
    private static instanceRef: ControlsTabMap;
    public name = chrome.i18n.getMessage("tab2")
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabMap {
        if (ControlsTabMap.instanceRef === undefined) {
            ControlsTabMap.instanceRef = new ControlsTabMap(controls);
        }

        return ControlsTabMap.instanceRef;
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name,
            id: "mapTabButton",
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "faceapiContent",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                id: "mapid",
                style: "width: 100%; margin-top: 1px;"
            })
        ])
    }
}