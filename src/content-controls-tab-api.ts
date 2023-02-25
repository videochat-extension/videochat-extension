import * as utils from "./utils";
import {ControlsModule} from "./content-module-controls";

export class ControlsTabApi {
    private static instanceRef: ControlsTabApi;
    public name = chrome.i18n.getMessage("tab1")
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabApi {
        if (ControlsTabApi.instanceRef === undefined) {
            ControlsTabApi.instanceRef = new ControlsTabApi(controls);
        }

        return ControlsTabApi.instanceRef;
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content active row",
            id: "apiInfoContent",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                id: "remoteFace",
            }),
            utils.createElement('div', {
                id: "streamerStatus",
                // style: "display: none;"
            }),
            utils.createElement('div', {
                id: "apiStatus",
                style: "margin-top: 3px"
            }),
            utils.createElement('div', {
                id: "remoteInfo",
                style: "overflow-y: auto;margin-top: 3px"
            })
        ])
    }
}