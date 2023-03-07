import "./content-globals"

import "./content-sentry"
import "./content-swal-context-invalidated"
require('arrive')

import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {ChatruletkaSimpleDriver} from "./content-driver-chatruletka-simple";
import {switchMode} from "./content-swal-switchmode";
import {injectIpGrabber} from "./content-module-geolocation";
import {ContentSwalChangelog} from "./content-swal-changelog";
import {extractDomain, getPlatformByHost} from "./utils";

injectIpGrabber()

async function content() {
    let settings = await chrome.storage.sync.get()
    let domain = extractDomain(location.href)
    if (domain === 'videochatru.com') {
        if (settings["legacyPrevent"]["98ea82db-9d50-4951-935e-2405d9fe892e"]) {
            return
        }
    } else if (domain === 'ome.tv') {
        if (settings["legacyPrevent"]["7fef97eb-a5cc-4caa-8d19-75dab7407b6b"]) {
            return
        }
    }

    let platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()

    let cur = getPlatformByHost(platforms, domain)

    if (!cur) {
        alert("VIDEOCHAT EXTENSION: unknown videochat platform / host, no idea what to do, sorry :(.\n\nYou can report the bug to: https://github.com/qrlk/videochat-extension, https://discord.gg/YZKnbKGWen or qrluke@proton.me.")
        return
    }

    let recentDict = (await chrome.storage.sync.get({"recentDict": {}})).recentDict
    recentDict[cur.site.id] = Math.ceil(+new Date() / 1000)

    globalThis.settings = settings;
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === "sync")
            chrome.storage.sync.get(null, function (result) {
                globalThis.settings = result;
            });
    });

    await chrome.storage.sync.set({"recentDict": recentDict})
    await chrome.storage.sync.set({"lastIconName": cur.site.favicon})

    let platform = cur.platform
    if (["7390db38-a617-4f6e-8a8a-ee353b76cc25", "8fa234f6-1767-4d81-897e-758df844ae31", "b15b920c-6882-4023-af28-f31e296b80e3", "b0073d25-a35d-4388-8dfb-6db6c81ad6ed"].includes(platform)) {
        platform = "COMC"
    }

    switch (platform) {
        case "COMC": {
            if (globalThis.settings.askForMode) {
                switchMode()
                return false
            } else if (globalThis.settings.minimalism) {
                document.arrive(".buttons__button.start-button", {onceOnly: true, existing: true}, () => {
                    globalThis.driver = ChatruletkaSimpleDriver.getInstance()
                    globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                })
                return false
            } else {
                document.arrive(".buttons__button.start-button", {onceOnly: true, existing: true}, () => {
                    globalThis.driver = ChatruletkaDriver.getInstance(cur)
                    globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                })
            }
            break;
        }
        default: {
            return false
        }
    }

    if (!globalThis.settings.swalInfoCompleted) {
        // TODO: maybe show people only 1-step info about what features are supported?
        // ContentSwalInfo.getInstance().showFromStart()
    } else {
        if (globalThis.settings.allowShowChangelog) {
            if (globalThis.settings.lastVersion !== chrome.runtime.getManifest().version) {
                ContentSwalChangelog.getInstance().showFromVersion(globalThis.settings.lastVersion)
            }
            chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
        }
    }
}

content()
