import "./content-globals"


require('arrive')

import {ChatruletkaDriver} from "./drivers/content-driver-chatruletka";
import {ChatruletkaSimpleDriver} from "./drivers/content-driver-chatruletka-simple";
import {switchMode} from "./drivers/chatruletka/content-swal-switchmode";
import {switchModeOmegle} from "./drivers/omegle/content-swal-switchmode";
import {injectScript} from "./drivers/chatruletka/content-module-geolocation";
import {injectContextInvalidatedCheck} from "./swal/content-swal-context-invalidated"
import {ContentSwalInfo, ContentSwalInfoSimplified} from "./drivers/chatruletka/content-swal-info";
import {ContentSwalChangelog} from "./swal/content-swal-changelog";
import {extractHost, getPlatformByHost, getUserBrowser} from "./utils/utils";
import * as Sentry from "@sentry/browser";
import {PlatformSettings} from "./content-platform";
import {OmegleSimpleDriver} from "./drivers/content-driver-omegle-simple";
import {ContentSwalInfoOmegle, ContentSwalInfoOmegleSimplified} from "./drivers/omegle/content-swal-info";
import {CooMeetFreeSimpleDriver} from "./drivers/content-driver-coomeetfree-simple";
import {
    ContentSwalInfoCoomeetFree,
    ContentSwalInfoCoomeetFreeSimplified
} from "./drivers/coomeetfree/content-swal-info";
import {OmegleDriver} from "./drivers/content-driver-omegle";

injectScript('injection/ip-api.js')

async function content() {
    let settings = await chrome.storage.sync.get()

    // TODO: firefox just crashes when sentry tries to initialise
    // ¯\_(ツ)_/¯
    if (settings.sentry && ["chrome", "edge"].includes(getUserBrowser())) {
        try {
            Sentry.init({
                dsn: "https://09512316dbc3422f931ad37d4fb12ed2@o1272228.ingest.sentry.io/6533563",
                release: "videochat-extension@" + chrome.runtime.getManifest().version,
                environment: chrome.runtime.getManifest().update_url ? getUserBrowser() : "development",
                autoSessionTracking: false, // disable session tracking
                ignoreErrors: [
                    "Extension context invalidated."
                ]
            });
        } catch (e) {
            console.dir(e)
        }
    }
    let domain = extractHost(location.href)

    let platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()

    let website = getPlatformByHost(platforms, domain)

    if (!website) {
        alert("VIDEOCHAT EXTENSION: unknown videochat platform / host, no idea what to do, sorry :(.\n\nYou can report the bug to: https://github.com/qrlk/videochat-extension, https://discord.gg/7DYWu5RF7Y or qrluke@proton.me.")
        return
    } else {
        let contentScripts = chrome.runtime.getManifest().content_scripts
        if (contentScripts) {
            for (const script of contentScripts) {
                if (script.matches) {
                    for (const match of script.matches) {
                        let matchDomain = extractHost(match)
                        if (domain === matchDomain) {
                            if (typeof settings["legacyPrevent"][website.site.id] !== "undefined") {
                                if (settings["legacyPrevent"][website.site.id]) {
                                    return
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let recentDict = (await chrome.storage.sync.get({"recentDict": {}})).recentDict
    recentDict[website.site.id] = Math.ceil(Date.now() / 1000)

    globalThis.platformSettings = PlatformSettings.initInstance(website.platform.id)

    await globalThis.platformSettings.setup()

    await chrome.storage.sync.set({"recentDict": recentDict})
    await chrome.storage.sync.set({"lastIconName": website.site.favicon})
    await chrome.storage.sync.set({"lastDomain": domain})

    let platform = website.platform.id
    if (["7390db38-a617-4f6e-8a8a-ee353b76cc25", "8fa234f6-1767-4d81-897e-758df844ae31", "b15b920c-6882-4023-af28-f31e296b80e3", "b0073d25-a35d-4388-8dfb-6db6c81ad6ed"].includes(platform)) {
        platform = "COMC"
    }
    if (platform === "b101a84a-8549-4676-9bd9-ec2582c72c54") {
        platform = "Omegle"
    }
    if (platform === "83b6a71d-d878-4563-bee2-ff4c276c2de4") {
        platform = "Coomeet Free"
    }

    async function processSwals(website: { site?: any; platform: any; }) {
        if (!globalThis.platformSettings.get("swalInfoCompleted")) {
            if (settings.curious) {
                new ContentSwalInfo(website.platform.name).showFromStart()
            } else {
                new ContentSwalInfoSimplified(website.platform.name).showFromStart()
            }
        } else {
            if (settings.allowShowChangelog) {
                if (settings.lastVersion !== chrome.runtime.getManifest().version) {
                    // I forgot to enable processSwals for omegle :(
                    if (settings.lastVersion.substring(0, 1) == "1" && website.platform.name == "Omegle") {
                        ContentSwalChangelog.getInstance().showFromVersion('1.9.0')
                    } else {
                        ContentSwalChangelog.getInstance().showFromVersion(settings.lastVersion)
                    }
                }
                chrome.storage.sync.set({lastVersion: chrome.runtime.getManifest().version})
            }
        }
    }

    let patreon = (await chrome.storage.sync.get({
        "patreonIsPatron": false,
        "patreonLoggedIn": false,
        "patreonAccessToken": "",
        "patreonRefreshToken": "",
        "patreonTokenExpires": -1,
        "patreonSettingWired": false,
        "patreonSettingCellural": false
    }))

    if (patreon.patreonAccessToken !== "") {
        try {
            let response = await fetch('https://ve-api.starbase.wiki/whoami', {
                signal: AbortSignal.timeout(5000),
                headers: {
                    "Authorization": `Bearer ${patreon.patreonAccessToken}`
                }
            });
            if (response.ok) {
                let user = await response.json()

                if (user.active) {
                    let patreonProvider = {
                        'name': 've-api-patron',
                        'options': {
                            headers: {
                                "Authorization": `Bearer ${patreon.patreonAccessToken}`
                            }
                        },
                        'config': {
                            'wired': false,
                            'cellural': false,
                        }
                    }
                    if (user.allow_wired) {
                        if (patreon.patreonSettingWired) {
                            patreonProvider.config.wired = true
                        }
                    }
                    if (user.allow_mobile) {
                        if (patreon.patreonSettingCellural) {
                            patreonProvider.config.cellural = true
                        }
                    }
                    globalThis.patreon = patreonProvider
                } else {
                    globalThis.patreon = false
                }
            } else {
                globalThis.patreon = false
                // TODO: refresh expired tokens
                if (response.status === 401) {
                    globalThis.platformSettings.set({
                        "patreonIsPatron": false,
                        "patreonLoggedIn": false,
                        "patreonAccessToken": "",
                        "patreonRefreshToken": "",
                        "patreonTokenExpires": -1,
                        "patreonSettingWired": false,
                        "patreonSettingCellural": false
                    })
                }
            }
        } catch (e: any) {
            if (e.name === "TimeoutError" || e.name === "AbortError") {
                console.dir('5000 ms timeout, could not verify');
            } else {
                console.dir('unknown error')
            }
            globalThis.patreon = false
        }
    }

    switch (platform) {
        case "COMC": {
            if (globalThis.platformSettings.get("askForMode")) {
                document.arrive(".buttons__button.start-button", {onceOnly: true, existing: true}, () => {
                    switchMode()
                })
                return false
            } else if (globalThis.platformSettings.get("minimalism")) {
                document.arrive(".buttons__button.start-button", {onceOnly: true, existing: true}, () => {
                    injectContextInvalidatedCheck()
                    globalThis.driver = ChatruletkaSimpleDriver.getInstance()
                    globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                })
                return false
            } else {
                await globalThis.platformSettings.setDriverDefaults(ChatruletkaDriver.defaults)
                document.arrive(".buttons__button.start-button", {onceOnly: true, existing: true}, () => {
                    if (website) {
                        injectContextInvalidatedCheck()
                        processSwals(website)
                        globalThis.driver = ChatruletkaDriver.getInstance(website)
                        globalThis.driver.start(document.getElementById('remote-video-wrapper') as HTMLElement)
                    }
                })
            }
            break;
        }
        case "Omegle": {
            if (location.pathname === "/" && window === window.top) {
                if (globalThis.platformSettings.get("askForMode")) {
                    document.arrive("body", {onceOnly: true, existing: true}, async () => {
                        switchModeOmegle()
                    })
                    return false
                } else if (globalThis.platformSettings.get("minimalism")) {
                    document.arrive("body", {onceOnly: true, existing: true}, async () => {
                        injectContextInvalidatedCheck()
                        await globalThis.platformSettings.setDriverDefaults({
                            darkMode: false,
                            c1Checked: false,
                            c2Checked: false
                        })
                        globalThis.driver = OmegleSimpleDriver.getInstance()
                        globalThis.driver.start(document.body)
                        if (!globalThis.platformSettings.get("swalInfoCompleted")) {
                            if (settings.curious) {
                                new ContentSwalInfoOmegle().showFromStart()
                            } else {
                                new ContentSwalInfoOmegleSimplified().showFromStart()
                            }
                        }
                    })
                    return false
                } else {
                    await globalThis.platformSettings.setDriverDefaults(OmegleDriver.defaults)
                    document.arrive("body", {onceOnly: true, existing: true}, async () => {
                        if (website) {
                            injectContextInvalidatedCheck()
                            processSwals(website)
                            globalThis.driver = OmegleDriver.getInstance(website)
                            globalThis.driver.start(document.body)
                            if (!globalThis.platformSettings.get("swalInfoCompleted")) {
                                if (settings.curious) {
                                    new ContentSwalInfoOmegle().showFromStart()
                                } else {
                                    new ContentSwalInfoOmegleSimplified().showFromStart()
                                }
                            }
                        }
                    })
                }
            }
            break;
        }
        case "Coomeet Free": {
            document.arrive(".free-cm-app-video-stream", {onceOnly: true, existing: true}, async () => {
                injectContextInvalidatedCheck()
                injectScript('injection/coomeetfree.js')
                await globalThis.platformSettings.setDriverDefaults({
                    hideBots: false,
                    muteBots: false,
                    emoji: false
                })
                globalThis.driver = CooMeetFreeSimpleDriver.getInstance()
                globalThis.driver.start(document.body)
                if (!globalThis.platformSettings.get("swalInfoCompleted")) {
                    if (settings.curious) {
                        new ContentSwalInfoCoomeetFree().showFromStart()
                    } else {
                        new ContentSwalInfoCoomeetFreeSimplified().showFromStart()
                    }
                }
            })
            break;
        }
        default: {
            return false
        }
    }
}

// TODO: firefox for some reason injects the content script in about:blank ???
// this happens only in dynamic scripts, possible allFrames issue ???
if (location.href.includes('http')) {
    // avoid injecting into oauth2 pages
    if (!location.href.includes('/auth/')) {
        content()
    }
}
