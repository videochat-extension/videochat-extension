import $ from "jquery";
import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";

export class InterfaceModule {
    private static instanceRef: InterfaceModule;
    private driver: ChatruletkaDriver;
    private dark: HTMLLinkElement;

    public tweaks = {
        hideLogo: {
            enable: () => {
                utils.tryCatch(() => {
                    document.getElementById("logo-link")!.style.display = "none"
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    document.getElementById("logo-link")!.style.display = ""
                })
            }
        },
        hideHeader: {
            enable: () => {
                utils.tryCatch(() => {
                    $("#header").hide();
                    document.getElementById("app")!.style.height = "100%"
                    window.dispatchEvent(new Event('resize'));
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    $("#header").show();
                    document.getElementById("app")!.style.height = ""
                    window.dispatchEvent(new Event('resize'));
                })
            }
        },
        hideWatermark: {
            enable: () => {
                utils.tryCatch(() => {
                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = ""
                })
            }
        },
        hideBanner: {
            enable: () => {
                utils.tryCatch(() => {
                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = ""
                })
            }
        },
        doNotReflect: {
            enable: () => {
                utils.tryCatch(() => {
                    $("#local-video").removeClass("video-container-local-video")
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    $("#local-video").addClass("video-container-local-video")
                })
            }
        },
        doNotCover: {
            enable: () => {
                utils.tryCatch(() => {
                    $("#remote-video").css({"object-fit": "contain"})
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    $("#remote-video").css({"object-fit": ""})
                    // $(".preview").css({"background-size": ""})}
                })
            },
        },
        hideCamera: {
            enable: () => {
                utils.tryCatch(() => {
                    $("#local-video-wrapper")[0].style.display = "none"
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    $("#local-video-wrapper")[0].style.display = ""
                })
            }
        },
        darkMode: {
            enable: () => {
                utils.tryCatch(() => {
                    (document.getElementById("connectionStatus") as HTMLElement).style.color = "#E8E6E3";
                    if (!document.getElementById("darkMode")) {
                        (document.body || document.documentElement).appendChild(this.dark);
                    }
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    (document.getElementById("connectionStatus") as HTMLElement).style.color = "#000000";
                    if (document.getElementById("darkMode") as HTMLElement)
                        (document.getElementById("darkMode") as HTMLElement).remove();
                })
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
        utils.tryCatch(() => {
            let new_el = $(document.createElement("div"))

            new_el[0].innerHTML = chrome.i18n.getMessage("loginWindow")

            new_el[0].style.marginTop = "15px"
            new_el[0].style.marginBottom = "15px"

            new_el.insertAfter(document.querySelector('[data-tr="sign_in_to"]') as HTMLElement)
            $(".login-popup__item.right")[0].style.overflowY = "auto"
        })
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


