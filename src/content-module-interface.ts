import $ from "jquery";
import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";

export class InterfaceModule {
    private static instanceRef: InterfaceModule;
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsInterface")
        },
        {
            type: "checkbox",
            important: false,
            key: "hideLogo",
            text: chrome.i18n.getMessage("hideLogo"),
            tooltip: chrome.i18n.getMessage("tooltipHideLogo"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.hideLogo.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.hideLogo.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideHeader",
            text: chrome.i18n.getMessage("hideHeader"),
            tooltip: chrome.i18n.getMessage("tooltipHideHeader"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.hideHeader.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.hideHeader.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideWatermark",
            text: chrome.i18n.getMessage("watermark"),
            tooltip: chrome.i18n.getMessage("tooltipWatermark"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.hideWatermark.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.hideWatermark.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideBanner",
            text: chrome.i18n.getMessage("banner"),
            tooltip: chrome.i18n.getMessage("tooltipBanner"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.hideBanner.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.hideBanner.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "doNotReflect",
            text: chrome.i18n.getMessage("doNotReflect"),
            tooltip: chrome.i18n.getMessage("tooltipDoNotReflect"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.doNotReflect.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.doNotReflect.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "doNotCover",
            text: chrome.i18n.getMessage("doNotCover"),
            tooltip: chrome.i18n.getMessage("tooltipDoNotCover"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.doNotCover.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.doNotCover.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideCamera",
            text: chrome.i18n.getMessage("hideCamera"),
            tooltip: chrome.i18n.getMessage("tooltiphideCamera"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.hideCamera.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.hideCamera.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "darkMode",
            text: chrome.i18n.getMessage("darkMode"),
            tooltip: chrome.i18n.getMessage("tooltipDarkMode"),
            enable: () => {
                globalThis.driver.modules.interface.tweaks.darkMode.enable()
            },
            disable: () => {
                globalThis.driver.modules.interface.tweaks.darkMode.disable()
            }
        }
    ]
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