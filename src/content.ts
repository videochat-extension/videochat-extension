import "./content-globals"

import * as Sentry from "@sentry/browser";

import "./content-sentry"
import "./background-listener"
import "./content-swal-context-invalidated"
import "./content-module-interface"
import "./content-module-geolocation"

import {ChatruletkaDriver} from "./content-driver-chatruletka";


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

        if (location.href.includes('videochatru')) {
            chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
        } else if (location.href.includes('ome.tv')) {
            chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
        }

        let platform = "COM";

        switch (platform) {
            case "COM": {
                globalThis.driver = ChatruletkaDriver.getInstance()
                globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
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
