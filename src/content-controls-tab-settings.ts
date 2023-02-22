import * as utils from "./utils";
import {createSettingsInterface} from "./content-controls-tab-settings-interface";
import {createSettingsAutomation} from "./content-controls-tab-settings-automation";
import {createSettingsGeolocation} from "./content-controls-tab-settings-geolocation";
import {createSettingsFaceapi} from "./content-controls-tab-settings-faceapi";
import {createSettingsBlacklist} from "./content-controls-tab-settings-blacklist";
import {createSettingsHotkeys} from "./content-controls-tab-settings-hotkeys";
import {createSettingsStreamer} from "./content-controls-tab-settings-streamer";
import {createSettingsMisc} from "./content-controls-tab-settings-misc";
import {createSettingsStats} from "./content-controls-tab-settings-stats";

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

export function createTabSettings() {
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