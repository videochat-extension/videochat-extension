import {OmegleDriver} from "../content-driver-omegle";
import $ from "jquery";

export class InterfaceModuleOmegle {
    private driver: OmegleDriver;
    private dark: HTMLLinkElement;
    public tweaks = {
        darkMode: {
            enable: () => {
                this.processDarkMode()
            },
            disable: () => {
                this.processDarkMode()
            }
        }
    }
    public static defaults = {
        darkMode: false,
    }
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsInterface")
        },
        {
            type: "checkbox",
            important: false,
            key: "darkMode",
            text: chrome.i18n.getMessage("darkMode"),
            tooltip: chrome.i18n.getMessage("tooltipDarkMode"),
            enable: () => {
                this.tweaks.darkMode.enable()
            },
            disable: () => {
                this.tweaks.darkMode.disable()
            }
        }
    ]

    public constructor(driver: OmegleDriver) {
        this.driver = driver
        this.dark = this.createDarkMode()
    }

    private processDarkMode() {
        document.arrive(`div[style*="background-color: rgb(255, 255, 255)"]`, {
            existing: true
        }, (el) => {
            if (globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.backgroundColor = "black"
            }
        })
        document.arrive(`label[style*="color: black"]`, {
            existing: true
        }, (el) => {
            if (globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.color = "#e8e6e3"
            }
        })

        document.arrive(`div[style*="black"]`, {
            existing: true
        }, (el) => {
            if (!globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.backgroundColor = "background-color: rgb(255, 255, 255)"
            }
        })
        document.arrive(`label[style*="color: rgb(232, 230, 227)"]`, {
            existing: true
        }, (el) => {
            if (!globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.color = "black"
            }
        })

        if (globalThis.platformSettings.get('darkMode')) {
            if (!document.getElementById("darkMode")) {
                (document.body || document.documentElement).appendChild(this.dark);
                let lc = $("#logo > canvas")
                if (lc[0]) {
                    lc[0].style.filter = "invert(100%)";
                }
                $('[src=\"/static/tagline.png\"]').hide()
            }
        } else {
            if (document.getElementById("darkMode") as HTMLElement) {
                (document.getElementById("darkMode") as HTMLElement).remove();
                let lc = $("#logo > canvas")
                if (lc[0]) {
                    lc[0].style.filter = "";
                }
                $('[src=\"/static/tagline.png\"]').show()
            }
        }

        if (globalThis.platformSettings.get('darkMode')) {
            if (document.getElementById("VE_extension_name_header")) {
                (document.getElementById("VE_extension_name_header") as HTMLElement).style.color = "#E8E6E3";
            }
            if (document.getElementById("videochat-extension-controls-container")) {
                document.getElementById('videochat-extension-controls-container')!.style.background = "rgb(0 0 0)"
                document.getElementById('videochat-extension-controls-container')!.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 0px 5px 0px inset"
                document.getElementById('videochat-extension-controls-container')!.style.border = "1px solid #3c4143"
            }
        } else {
            if (document.getElementById("VE_extension_name_header")) {
                (document.getElementById("VE_extension_name_header") as HTMLElement).style.color = "#000000";
            }
            if (document.getElementById("videochat-extension-controls-container")) {
                document.getElementById('videochat-extension-controls-container')!.style.background = "#fff"
                document.getElementById('videochat-extension-controls-container')!.style.boxShadow = ""
                document.getElementById('videochat-extension-controls-container')!.style.border = "1px solid rgb(213, 213, 213)"
            }
        }
    }

    public applyTweaks() {
        if (globalThis.platformSettings.get("darkMode")) {
            document.arrive("#logo > canvas", {onceOnly: true, existing: true}, this.tweaks.darkMode.enable.bind(this))
        }
    }

    private createDarkMode() {
        // TODO: remember to remove background-color in .leaflet-container
        // TODO: https://gist.github.com/BrendonKoz/b1df234fe3ee388b402cd8e98f7eedbd ?
        let dark = document.createElement('link');
        dark.rel = "stylesheet";
        dark.id = "darkMode"
        dark.href = chrome.runtime.getURL(`resources/dark/omegle.css`)
        return dark
    }
}