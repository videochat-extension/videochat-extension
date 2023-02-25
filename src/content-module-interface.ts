import $ from "jquery";
import {ChatruletkaDriver} from "./content-driver-chatruletka";

export class InterfaceModule {
    private static instanceRef: InterfaceModule;
    private driver: ChatruletkaDriver;
    private dark: HTMLLinkElement;

    public tweaks = {
        hideLogo: {
            enable: () => {
                try {
                    document.getElementById("logo-link")!.style.display = "none"
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    document.getElementById("logo-link")!.style.display = ""
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        hideHeader: {
            enable: () => {
                try {
                    $("#header").hide();
                    document.getElementById("app")!.style.height = "100%"
                    window.dispatchEvent(new Event('resize'));
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    $("#header").show();
                    document.getElementById("app")!.style.height = ""
                    window.dispatchEvent(new Event('resize'));
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        hideWatermark: {
            enable: () => {
                try {
                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = ""
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        hideBanner: {
            enable: () => {
                try {
                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = ""
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        doNotReflect: {
            enable: () => {
                try {
                    $("#local-video").removeClass("video-container-local-video")
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    $("#local-video").addClass("video-container-local-video")
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        doNotCover: {
            enable: () => {
                try {
                    $("#remote-video").css({"object-fit": "contain"})
                    // $(".preview").css({"background-size": "contain"})
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    $("#remote-video").css({"object-fit": ""})
                    // $(".preview").css({"background-size": ""})}
                } catch (e) {
                    console.dir(e)
                }
            },
        },
        hideCamera: {
            enable: () => {
                try {
                    $("#local-video-wrapper")[0].style.display = "none"
                } catch (e) {
                    console.dir(e)
                }
            },
            disable: () => {
                try {
                    $("#local-video-wrapper")[0].style.display = ""
                } catch (e) {
                    console.dir(e)
                }
            }
        },
        darkMode: {
            enable: () => {
                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#E8E6E3";
                if (!document.getElementById("darkMode")) {
                    (document.body || document.documentElement).appendChild(this.dark);
                }
            },
            disable: () => {
                (document.getElementById("connectionStatus") as HTMLElement).style.color = "#000000";
                if (document.getElementById("darkMode") as HTMLElement)
                    (document.getElementById("darkMode") as HTMLElement).remove();
            }
        }
    }

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.dark = this.createDarkMode()
    }

    static initInstance(driver: ChatruletkaDriver): InterfaceModule {
        if (InterfaceModule.instanceRef === undefined) {
            InterfaceModule.instanceRef = new InterfaceModule(driver);
        }

        return InterfaceModule.instanceRef;
    }

    public tweakLoginWindow() {
        try {
            let new_el = $(document.createElement("div"))

            new_el[0].innerHTML = chrome.i18n.getMessage("loginWindow")

            new_el[0].style.marginTop = "15px"
            new_el[0].style.marginBottom = "15px"

            new_el.insertAfter(document.querySelector('[data-tr="sign_in_to"]') as HTMLElement)
            $(".login-popup__item.right")[0].style.overflowY = "auto"
        } catch (e) {
            console.dir(e)
        }
    }

    public applyTweaks() {
        this.tweakLoginWindow()

        if (globalThis.settings.hideLogo) {
            this.tweaks.hideLogo.enable()
        }

        if (globalThis.settings.hideHeader) {
            this.tweaks.hideHeader.enable()
        }

        if (globalThis.settings.hideWatermark) {
            this.tweaks.hideWatermark.enable()
        }

        if (globalThis.settings.hideBanner) {
            this.tweaks.hideBanner.enable()
        }

        if (globalThis.settings.doNotReflect) {
            this.tweaks.doNotReflect.enable()
        }

        if (globalThis.settings.doNotCover) {
            this.tweaks.doNotCover.enable()
        }

        if (globalThis.settings.hideCamera) {
            this.tweaks.hideCamera.enable()
        }

        if (globalThis.settings.darkMode) {
            this.tweaks.darkMode.enable()
        }
    }

    private createDarkMode() {
        // TODO: remove background-color in .leaflet-container
        let dark = document.createElement('link');
        dark.rel = "stylesheet";
        dark.id = "darkMode"
        if (location.href.includes('videochatru')) {
            dark.href = chrome.runtime.getURL("resources/dark-mode.css");
        } else if (location.href.includes('ome.tv')) {
            dark.href = chrome.runtime.getURL("resources/dark-mode-ometv.css");
        }
        return dark
    }
}


