import "./content-globals"

import * as Sentry from "@sentry/browser";

import "./content-sentry"
import "./background-listener"
import "./content-swal-context-invalidated"
import "./content-module-interface"
import "./content-module-geolocation"

import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {ChatruletkaSimpleDriver} from "./content-driver-chatruletka-simple";
import {switchMode} from "./content-swal-switchmode";

chrome.storage.local.get(null, function (result) {
    globalThis.local = result;
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync")
        chrome.storage.sync.get(null, function (result) {
            globalThis.settings = result;
        });
});


// TODO: make sure DOM has loaded
chrome.storage.sync.get(null, function (result) {
    Sentry.wrap(function () {
        globalThis.settings = result;
        let platform = "";

        if (location.href.includes('videochatru')) {
            platform = "COM"
            chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
        } else if (location.href.includes('ome.tv')) {
            platform = "COM"
            chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
        }

        switch (platform) {
            case "COM": {
                if (globalThis.settings.askForMode) {
                    switchMode()
                    return false
                } else if (globalThis.settings.minimalism) {
                    globalThis.driver = ChatruletkaSimpleDriver.getInstance()
                    globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                    return false
                } else {
                    globalThis.driver = ChatruletkaDriver.getInstance()
                    globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                }
                break;
            }
            default: {
                alert("VIDEOCHAT EXTENSION: unknown videochat platform, no idea what to do, sorry :(.\n\nYou can report the bug to: https://github.com/qrlk/videochat-extension, https://discord.gg/YZKnbKGWen or qrluke@proton.me.")
                return
            }
        }

        if (!globalThis.settings.swalInfoCompleted) {
            globalThis.info.showFromStart()
        } else {
            if (globalThis.settings.lastVersion !== chrome.runtime.getManifest().version) {
                globalThis.changelog.showFromVersion(globalThis.settings.lastVersion)
            }
        }

        chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
    })
});
