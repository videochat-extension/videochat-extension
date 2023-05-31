import $ from "jquery";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import * as utils from "../../utils/utils";

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
                    (document.getElementById("VE_extension_name_header") as HTMLElement).style.color = "#E8E6E3";
                    if (!document.getElementById("darkMode")) {
                        (document.body || document.documentElement).appendChild(this.dark);
                    }

                    // temp fix
                    if (document.getElementById("ReportPopup")) {
                        document.getElementById("ReportPopup")!.style.backgroundColor = "#000"
                    }

                    if (this.driver.modules.controls.vertical) {
                        document.getElementById('videochat-extension-controls-container')!.style.background = "#181a1b"
                        document.getElementById('videochat-extension-controls-container')!.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 0px 5px 0px inset"
                        document.getElementById('videochat-extension-controls-container')!.style.border = "1px solid #3c4143"
                    }
                })
            },
            disable: () => {
                utils.tryCatch(() => {
                    (document.getElementById("VE_extension_name_header") as HTMLElement).style.color = "#000000";
                    if (document.getElementById("darkMode") as HTMLElement)
                        (document.getElementById("darkMode") as HTMLElement).remove();

                    // temp fix
                    if (document.getElementById("ReportPopup")) {
                        (document.getElementById("ReportPopup")!.style.backgroundColor = "")
                    }

                    if (this.driver.modules.controls.vertical) {
                        document.getElementById('videochat-extension-controls-container')!.style.background = "#fff"
                        document.getElementById('videochat-extension-controls-container')!.style.boxShadow = ""
                        document.getElementById('videochat-extension-controls-container')!.style.border = "1px solid rgb(213, 213, 213)"
                    }
                })
            }
        }
    }
    public static defaults = {
        hideWatermark: false,
        hideBanner: false,
        doNotReflect: false,
        doNotCover: false,
        hideCamera: false,
        darkMode: false,
        hideLogo: false,
        hideHeader: true,
    }
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
                this.tweaks.hideLogo.enable()
            },
            disable: () => {
                this.tweaks.hideLogo.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideHeader",
            text: chrome.i18n.getMessage("hideHeader"),
            tooltip: chrome.i18n.getMessage("tooltipHideHeader"),
            enable: () => {
                this.tweaks.hideHeader.enable()
            },
            disable: () => {
                this.tweaks.hideHeader.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideWatermark",
            text: chrome.i18n.getMessage("watermark"),
            tooltip: chrome.i18n.getMessage("tooltipWatermark"),
            enable: () => {
                this.tweaks.hideWatermark.enable()
            },
            disable: () => {
                this.tweaks.hideWatermark.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideBanner",
            text: chrome.i18n.getMessage("banner"),
            tooltip: chrome.i18n.getMessage("tooltipBanner"),
            enable: () => {
                this.tweaks.hideBanner.enable()
            },
            disable: () => {
                this.tweaks.hideBanner.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "doNotReflect",
            text: chrome.i18n.getMessage("doNotReflect"),
            tooltip: chrome.i18n.getMessage("tooltipDoNotReflect"),
            enable: () => {
                this.tweaks.doNotReflect.enable()
            },
            disable: () => {
                this.tweaks.doNotReflect.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "doNotCover",
            text: chrome.i18n.getMessage("doNotCover"),
            tooltip: chrome.i18n.getMessage("tooltipDoNotCover"),
            enable: () => {
                this.tweaks.doNotCover.enable()
            },
            disable: () => {
                this.tweaks.doNotCover.disable()
            }
        },
        {
            type: "checkbox",
            important: false,
            key: "hideCamera",
            text: chrome.i18n.getMessage("hideCamera"),
            tooltip: chrome.i18n.getMessage("tooltiphideCamera"),
            enable: () => {
                this.tweaks.hideCamera.enable()
            },
            disable: () => {
                this.tweaks.hideCamera.disable()
            }
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

    public applyTweaks() {
        if (globalThis.platformSettings.get("hideLogo")) {
            this.tweaks.hideLogo.enable()
        }

        if (globalThis.platformSettings.get("hideHeader")) {
            this.tweaks.hideHeader.enable()
        }

        if (globalThis.platformSettings.get("hideWatermark")) {
            this.tweaks.hideWatermark.enable()
        }

        if (globalThis.platformSettings.get("hideBanner")) {
            this.tweaks.hideBanner.enable()
        }

        if (globalThis.platformSettings.get("doNotReflect")) {
            this.tweaks.doNotReflect.enable()
        }

        if (globalThis.platformSettings.get("doNotCover")) {
            this.tweaks.doNotCover.enable()
        }

        if (globalThis.platformSettings.get("hideCamera")) {
            this.tweaks.hideCamera.enable()
        }

        if (globalThis.platformSettings.get("darkMode")) {
            this.tweaks.darkMode.enable()
        }
    }

    private createDarkMode() {
        // TODO: remember to remove background-color in .leaflet-container
        // TODO: https://gist.github.com/BrendonKoz/b1df234fe3ee388b402cd8e98f7eedbd ?
        let dark = document.createElement('link');
        dark.rel = "stylesheet";
        dark.id = "darkMode"
        switch (this.driver.platform) {
            default:
                // TODO: find a way to reduce size of darkreader css files
                dark.href = chrome.runtime.getURL(`resources/dark/${this.driver.site.id}.css`)
                break;
        }
        // dark.href = chrome.runtime.getURL(`resources/dark/DarkReader-camki-com.css`)
        return dark
    }
}