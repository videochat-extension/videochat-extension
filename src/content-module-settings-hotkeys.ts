import * as utils from "./utils";

export function createSettingsHotkeys() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            innerHTML: chrome.i18n.getMessage("settingsHotkeys")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('span', {}, [
                utils.createElement("b", {
                    innerText: chrome.i18n.getMessage("enablehotkeys"),
                    className: "tooltip",
                    title: chrome.i18n.getMessage("tooltipEnableHotkeys")
                }),
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.settings.hotkeys,
                    id: "hotkeysCheck",
                    onclick: () => {
                        chrome.storage.sync.set({"hotkeys": (document.getElementById("hotkeysCheck") as HTMLInputElement).checked}, function () {
                            if ((document.getElementById("hotkeysCheck") as HTMLInputElement).checked) {
                                globalThis.driver.modules.hotkeys.unregister()
                                globalThis.driver.modules.hotkeys.register()
                            } else {
                                globalThis.driver.modules.hotkeys.unregister()
                            }
                        });
                    }
                })
            ]),
        ]),
        utils.createElement('br'),
        utils.createElement('span', {
            innerHTML: chrome.i18n.getMessage("hotkeys")
        }),
    ])
}