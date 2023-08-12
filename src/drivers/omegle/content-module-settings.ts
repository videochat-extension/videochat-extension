import {switchModeOmegle} from "./content-swal-switchmode";
import {ControlsTabSettings} from "../chatruletka/content-module-settings";

export class ControlsTabSettingsOmegle extends ControlsTabSettings {
    public static miscSettings = [
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
                switchModeOmegle()
            }
        },
    ]
}