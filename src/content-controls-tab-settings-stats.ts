import * as utils from "./utils";
import {updStats} from "./content-controls-tab-stats";

export function createSettingsStats() {
    return utils.createElement('div', {}, [
        utils.createElement('dt', {
            style: "margin-top: 2px",
            innerHTML: chrome.i18n.getMessage("settingsStats")
        }),
        utils.createElement('dd', {}, [
            utils.createElement('button', {
                onclick: () => {
                    const result = confirm("Clear?");
                    if (result) {
                        let stats = {
                            stats: {
                                countAll: 0,
                                countNew: 0,
                                countDup: 0,
                                countMales: 0,
                                countFemales: 0,
                                countManSkip: 0,
                                countMaleSkip: 0,
                                countFemaleSkip: 0,
                                time: 0
                            }
                        }
                        globalThis.settings.stats = stats.stats
                        chrome.storage.sync.set(globalThis.settings, function () {
                            updStats(true)
                        });
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: chrome.i18n.getMessage("clearStats")
                })
            ]),
        ])
    ])
}