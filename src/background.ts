// dict with default settings that should be applied when installing/updating the extension
import {extractDomain} from "./utils/utils";

const defaults = {
    // no way to prevent videochatru.com and ome.tv from loading content script,
    // so I decided to add a way to prevent them from loading drivers if necessary
    "legacyPrevent": {
        "7fef97eb-a5cc-4caa-8d19-75dab7407b6b": false,
        "98ea82db-9d50-4951-935e-2405d9fe892e": false
    },
    // dict contains states if content scripts should be registered: UUID: boolean
    "scripts": {},
    // favorites sites list, videochatru.com and ome.tv are defaults for legacy UX reasons
    // if other chats were found in open tabs on first install,
    // then default favorites are replaced with found chats
    "favorites": ["7fef97eb-a5cc-4caa-8d19-75dab7407b6b", "98ea82db-9d50-4951-935e-2405d9fe892e"],
    // dict containing site uuid and last opened unix timestamp
    "recentDict": {},
    // if extension should display legacy 'Chatruletka (ome.tv) Extension' icon
    // if enabled, allowSetBadgeText and allowSetLastIcon dont work
    "legacyIcon": false,
    // if extension should add 'ext' badge text
    "allowSetBadgeText": true,
    // if extension should change its icon to a last chat
    "allowSetLastIcon": true,
    // allows open changelog on any supported website if there was an update
    // minimalism mode should not contain changelog
    "allowShowChangelog": true,
    // lastIconName in format "favicon.png"
    "lastIconName": "",
    // lastDomain for switch command
    "lastDomain": "",
    // sentry.io error tracking
    'sentry': true,
    // if firstInstall, should add chats from active tabs to favorites
    'firstInstall': true,
    // displays whether the migration of the old settings from v1.6.3 has occurred
    'completedOldSettingsMigration': false,
    "lastVersion": "",
    "missingPermissionCheck": true,

    // settings managed by PlatformSettings
    // "98ea82db-9d50-4951-935e-2405d9fe892e": {},
};

// actual content script list, ensureContentScriptsAreRegistered() should reregister on change
// const content = ["content.js"]
const content = ["vendor.js", "content_script.js"]

async function ensureSettingsAreUpToDate() {
    let result = await chrome.storage.sync.get(defaults)
    if (!result.completedOldSettingsMigration) {
        let allSettings = await chrome.storage.sync.get()

        // need to filter UUIDs because they are not listed in defaults
        let keysAllSettings = Object.keys(allSettings).filter(filterUUID)

        let keysDefault = Object.keys(defaults)

        let chatruletka = await getValue("98ea82db-9d50-4951-935e-2405d9fe892e", {})
        let ometv = await getValue("7fef97eb-a5cc-4caa-8d19-75dab7407b6b", {})

        let keysToRemove = []

        for (const key of keysAllSettings) {
            if (keysDefault.includes(key)) {
                console.dir(`exists: ${key}`)
            } else {
                chatruletka[key] = allSettings[key]
                ometv[key] = allSettings[key]
                keysToRemove.push(key)
                console.dir(`legacy: ${key}`)
            }
        }

        if (keysToRemove.length > 0) {
            // the stats of both sites were counted together, but they belong to different platforms,
            // which would break the calculation of the overall statistics due to duplication
            // so we believe that the user used mostly the last platform and reset the other one

            if (allSettings.lastInstanceOpened) {
                if (allSettings.lastInstanceOpened.includes("ome.tv")) {
                    chatruletka.stats = JSON.parse(JSON.stringify(chatruletka.stats))
                    if (chatruletka.stats) {
                        Object.keys(chatruletka.stats).forEach(key => chatruletka.stats[key] = 0);
                    }
                } else if (allSettings.lastInstanceOpened.includes("videochatru.com")) {
                    ometv.stats = JSON.parse(JSON.stringify(ometv.stats))
                    if (ometv.stats) {
                        Object.keys(ometv.stats).forEach(key => ometv.stats[key] = 0);
                    }
                }
            }

            await chrome.storage.sync.set({"7390db38-a617-4f6e-8a8a-ee353b76cc25": chatruletka})
            await chrome.storage.sync.set({"8fa234f6-1767-4d81-897e-758df844ae31": ometv})

            await chrome.storage.sync.remove(keysToRemove)

            result.legacyIcon = true
        }
    }
    result.completedOldSettingsMigration = true

    await chrome.storage.sync.set(result);
}

async function syncBadgeIcon() {
    let result = await chrome.storage.sync.get(["legacyIcon", "lastIconName", "allowSetBadgeText", "allowSetLastIcon"]);
    if (result.legacyIcon) {
        await chrome.action.setIcon({path: "resources/img/legacy_icon.png"});
        await hideBadge()
    } else {
        if (result.allowSetBadgeText) {
            await showBadge()
        } else {
            await hideBadge()
        }
        if (result.allowSetLastIcon && result.lastIconName !== "") {
            await chrome.action.setIcon({path: `popup/icons/${result.lastIconName}`});
        } else {
            await resetIcon()
        }
    }
}

async function onPermissionsAdded(permissions: chrome.permissions.Permissions) {
    if (permissions.origins && permissions.origins.length > 0) {
        await ensureSettingsAreUpToDate()

        let sites: any[] = []
        let platforms = await fetchPlatforms()
        platforms.forEach((platform: { id: string, sites: any[]; }) => {
            platform.sites.forEach((site) => {
                if (permissions.origins!.includes(site.origin)) {
                    sites.push(site)
                }
            })
        })

        for (const site of sites) {
            enableReg(site.id, site.origin, content)
        }
    }
}

async function onRuntimeInstalled(_reason: chrome.runtime.InstalledDetails) {
    await ensureSettingsAreUpToDate()

    if (_reason.reason === "install") {
        let firstInstall = await getValue('firstInstall', true)
        if (firstInstall) {
            await chrome.windows.getAll({populate: true}, async function (windows) {
                let platforms = await fetchPlatforms()
                let toFind: any[] = []
                for (const platform of platforms) {
                    for (const site of platform.sites) {
                        toFind.push(site)
                    }
                }
                let found: any[] = []
                await windows.forEach(function (window) {
                    if (window.tabs) {
                        window.tabs.forEach(function (tab) {
                            toFind.forEach(site => {
                                if (tab.url && tab.url.includes(site.text)) {
                                    if (!found.includes(site)) {
                                        found.push(site)
                                    }
                                }
                            })
                        });
                    }
                });
                // If found any chat, then dont add videochatru.com and ome.tv
                if (found.length > 0) {
                    let favorites: string[] = []
                    found.forEach(site => {
                        if (!favorites.includes(site.id)) {
                            favorites.push(site.id)
                        }
                    })
                    await setValue("favorites", favorites)
                }
            });

            await setValue("lastVersion", chrome.runtime.getManifest().version)
        }

        await chrome.tabs.create({
            url: 'welcome/welcome.html'
        });
    }

    await setValue('firstInstall', false)
}

async function ensureContentScriptsAreRegistered() {
    if (chrome.scripting) {
        await ensureSettingsAreUpToDate()

        let platforms = await fetchPlatforms()
        let scripts = (await chrome.storage.sync.get({scripts: {}})).scripts
        let actualScripts = (await chrome.scripting.getRegisteredContentScripts())

        let supposedScripts = []
        for (const [key, value] of Object.entries(scripts)) {
            if (value) {
                supposedScripts.push(key)
            }
        }

        for (const script of actualScripts) {
            if (supposedScripts.includes(script.id)) {
                if (script.js) {
                    const a2 = script.js!.slice().sort();
                    if (!(content.length === script.js!.length && content.slice().sort().every(function (value, index) {
                        return value === a2[index];
                    }))) {
                        let site = getSiteById(script.id, platforms)
                        if (site) {
                            disableReg(script.id)
                        }
                    }
                } else {
                    let site = getSiteById(script.id, platforms)
                    if (site) {
                        disableReg(script.id)
                    }
                }
            } else {
                let site = getSiteById(script.id, platforms)
                if (site) {
                    disableReg(script.id)
                }
            }
        }

        let actualScriptsArray = (await chrome.scripting.getRegisteredContentScripts()).map(s => s.id)
        for (const id of supposedScripts) {
            if (!actualScriptsArray.includes(id)) {
                let site = getSiteById(id, platforms)
                if (site) {
                    enableReg(id, site.site.origin, content)
                }
            }
        }
    }
}

async function onStorageChanged(changes: { [p: string]: chrome.storage.StorageChange }, namespace: chrome.storage.AreaName) {
    if (namespace === "sync") {
        if (changes.allowSetBadgeText || changes.legacyIcon || changes.allowSetLastIcon || changes.lastIconName) {
            await syncBadgeIcon()
        }
    }
}

// this handles commands AKA hotkeys
// the 'switch' command is processed by a background service worker, the rest are transferred to the active chat tab
async function commandsOnCommand(command: string, tab: chrome.tabs.Tab) {
    // tabId = last active tab, can not be videochat
    // curId = current active tab, can be also videochat
    // chatId = videochat tab id
    let data = await chrome.storage.local.get({tabId: -1, chatId: -1, curId: -1})
    switch (command) {
        // this does not work good on Firefox because hotkeys work only if extension has host permission (?)
        // on FF it allows only to switch from chat tab to previous non-chat tab, but not from non-chat tab to the chat
        // switch command is not listed in the firefox manifest
        case "switch": {
            // do nothing if any of tabs === -1
            if (data.curId === -1 || data.chatId === -1 || data.tabId === -1)
                return
            if (data.curId === data.chatId) {
                // selects the non-videochat tab because the videochat tab is active
                await chrome.tabs.update(data.tabId, {active: true});
                data.curId = data.tabId;
            } else {
                // selects the videochat tab because the non-videochat tab is active
                await chrome.tabs.update(data.chatId, {active: true});
                data.curId = data.chatId;
            }
            await chrome.storage.local.set(data)
            break;
        }

        default:
            // redirect the command to the active videochat's content script
            chrome.tabs.sendMessage(data.chatId, {command: command})
            break;
    }
}

// triggered when the active tab changes
// requires 'tab' permission
// it is mainly used to track the active chat tab
function tabsOnActivated(chTab: chrome.tabs.TabActiveInfo) {
    chrome.tabs.get(chTab["tabId"], async function (tab) {
        // torrentWindowId variable tracks window id where iknowwhatyoudownload.com tabs opens
        let data = await chrome.storage.local.get({tabId: -1, chatId: -1, curId: -1, torrentWindowId: -1})
        if (tab["url"] !== undefined && tab["id"] !== undefined) {
            let lastDomain = await getValue('lastDomain', "")
            if (tab["url"].includes(lastDomain)) {
                // if the chat is open in torrentWindowId then torrentWindowId can no longer be used for iknowwhatyoudownload tabs
                if (tab.windowId === data.torrentWindowId) {
                    data.torrentWindowId = -1;
                }

                // store active videochat tab id
                data.chatId = tab["id"];
            } else {
                // if the active tab is not a videochat, then store tab id in the 'tabId' variable
                data.tabId = tab["id"];
            }
            // store active tab id in the 'curId' variable
            data.curId = tab["id"];

            chrome.storage.local.set(data)

            if (await getValue('missingPermissionCheck', true)) {
                await checkIfMissingPermissions(tab.windowId, tab["url"], chTab["tabId"])
            }
        }
    });
}

function runtimeOnMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    // makes a request to the geolocation service with the requested IP address and language
    // making a request via service worker helps avoid http restrictions
    if (request.remoteIP) {
        fetch(`http://ip-api.com/json/${request.remoteIP}?fields=status%2Cmessage%2Ccountry%2CcountryCode%2Cregion%2CregionName%2Ccity%2Cdistrict%2Czip%2Clat%2Clon%2Ctimezone%2Cisp%2Corg%2Cas%2Cmobile%2Cproxy%2Chosting%2Cquery&lang=${request.language}`)
            .then((response) => {
                if (response.ok) {
                    response.json().then(
                        function (data) {
                            if (sender.tab && sender.tab.id) {
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    ipData: data,
                                    apiCode: response.status,
                                    apiQuery: request.remoteIP
                                })
                            }
                        }
                    )
                } else {
                    if (sender.tab && sender.tab.id) {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            ipData: {},
                            apiCode: response.status,
                            apiQuery: request.remoteIP
                        })
                    }
                }
            })
        sendResponse('fetch should be in progress');
    }

    if (request.aremoteIP) {
        fetch(`http://ip-api.com/json/${request.aremoteIP}?fields=status%2Cmessage%2Ccountry%2CcountryCode%2Cregion%2CregionName%2Ccity%2Cdistrict%2Czip%2Clat%2Clon%2Ctimezone%2Cisp%2Corg%2Cas%2Cmobile%2Cproxy%2Chosting%2Cquery&lang=${request.language}`)
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => (sendResponse({status: response.status, body: data})))
                } else {
                    sendResponse({status: response.status, body: {}})
                }
            }).catch((error) => (sendResponse({status: 0, body: error})))

        return true;
    }

    // this opens new iknowwhatyoudownload tab in the torrentWindowId window
    // if torrentWindowId window does not exist, proceeds with creating one
    if (request.checkTorrents) {
        chrome.windows.getAll().then(async (res) => {
            // this variable tracks window id where iknowwhatyoudownload.com tabs opens
            // these tabs open in separate window for convenience and to avoid IP address leaking
            let data = await chrome.storage.local.get({torrentWindowId: -1})
            let found = false
            for (var prop in res) {
                if (res[prop].id === data.torrentWindowId) {
                    chrome.tabs.create({
                        url: request.url,
                        windowId: data.torrentWindowId,
                        active: true
                    })
                    found = true

                    // gets all unactive iknowwhatyoudownload tabs in the torrentWindowId window and closes them
                    chrome.windows.get(data.torrentWindowId, {populate: true}).then(res => {
                        let list_to_close: (number)[] = []

                        res.tabs?.forEach((tab) => {
                            if (tab.url && tab.id) {
                                if (!tab.active && tab.url.includes("iknowwhatyoudownload")) {
                                    list_to_close.push(tab.id)
                                }
                            }
                        })

                        chrome.tabs.remove(list_to_close)
                    })

                    break;
                }
            }
            // if torrentWindowId window was not found, creates a new one
            if (!found) {
                chrome.windows.create({
                    url: request.url
                }).then(res => {
                        if (res.id) {
                            data.torrentWindowId = res.id;
                            chrome.storage.local.set(data)
                        }
                    }
                );
            }

        })

        sendResponse('k');
    }

    if (request.openWelcome) {
        chrome.tabs.create({
            url: `welcome/welcome.html`
        });
    }
}

async function checkIfMissingPermissions(windowId: number, url: string, fromTabId: number) {
    let windowType = (await chrome.windows.get(windowId)).type
    if (windowType == "normal") {
        let platforms = (await chrome.storage.local.get("domains")).domains
        if (!platforms) {
            let domains: string[] = [];
            (await fetchPlatforms()).forEach((platform: any) => {
                let ignore = ["7fef97eb-a5cc-4caa-8d19-75dab7407b6b", "98ea82db-9d50-4951-935e-2405d9fe892e"]
                platform.sites.forEach((site: any) => {
                    if (!ignore.includes(site.id)) {
                        domains.push(site.text)
                    }
                })
            })
            await chrome.storage.local.set({"domains": domains})
            platforms = (await chrome.storage.local.get("domains")).domains
        }
        let domain = extractDomain(url)
        if (domain && platforms.includes(domain)) {
            let arr = (await chrome.storage.local.get({"stopPermissionCheck": []})).stopPermissionCheck
            let site = getSiteByDomain(domain, (await fetchPlatforms()))

            if (site && site.site && site.site.id) {
                let recentDict = await getValue("recentDict", {})
                recentDict[site.site.id] = Math.ceil(+new Date() / 1000)
                await setValue("recentDict", recentDict)
            }

            if (!arr.includes(domain)) {
                arr.push(domain)
                // I was supposed to use chrome.storage.session, but firefox doesn't support...
                await chrome.storage.local.set({"stopPermissionCheck": arr})

                if (site && site.site && site.site.origin) {
                    let recentDict = await getValue("recentDict", {})
                    recentDict[site.site.id] = Math.ceil(+new Date() / 1000)
                    await setValue("recentDict", recentDict)

                    let permission = await chrome.permissions.contains({
                        origins: [site.site.origin]
                    })
                    if (!permission) {
                        let text = site.site.text
                        setTimeout(() => {
                            chrome.tabs.create({
                                url: `popup/popup.html?missingPermission=${text}&fromTabId=${fromTabId}&recent&zoom=120`
                            });
                        }, 500)
                    }
                }
            }
        }
    }
}

function init() {
    chrome.storage.onChanged.addListener(onStorageChanged);
    chrome.permissions.onAdded.addListener(onPermissionsAdded)

    // Show the demo page once the extension is installed
    chrome.runtime.onInstalled.addListener(onRuntimeInstalled);
    chrome.runtime.onInstalled.addListener(syncBadgeIcon);
    chrome.runtime.onInstalled.addListener(ensureContentScriptsAreRegistered)

    chrome.runtime.onStartup.addListener(syncBadgeIcon)
    chrome.runtime.onStartup.addListener(ensureContentScriptsAreRegistered)
    // resetting certain values in chrome.storage.local because firefox doesn't support chrome.storage.session
    chrome.runtime.onStartup.addListener(async () => {
        await chrome.storage.local.set({"stopPermissionCheck": []})
    })

    chrome.commands.onCommand.addListener(commandsOnCommand);

    chrome.tabs.onActivated.addListener(tabsOnActivated);

    chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (tab && changeInfo.url) {
            if (await getValue('missingPermissionCheck', true)) {
                await checkIfMissingPermissions(tab.windowId, changeInfo.url, tabId)
            }
        }
    });

    // this thing handles all messages coming from content scripts
    chrome.runtime.onMessage.addListener(runtimeOnMessage);

    // very old post-install poll, a Google script then uses webhook to forward the response to the text channel in the extension's discord server
    // very demotivating experience for a dev, should be replaced with less intrusive
    // chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/1TIynfMSRGrFb7_Co9Rb0ZEhts3WROMRcrCNPV8XE0ls")
}

init()

// import export does not work in service workers ¯\_(ツ)_/¯
function filterUUID(str: string) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return !regexExp.test(str)
}

async function showBadge() {
    // TODO: do I need to change color?
    await chrome.action.setBadgeBackgroundColor({color: "#000000"})
    await chrome.action.setBadgeText({
        text: "ext",
    });
}

async function hideBadge() {
    await chrome.action.setBadgeText({
        text: "",
    });
}

async function fetchPlatforms() {
    return await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
}

function getSiteById(id: string, platforms: any[]) {
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (site.id == id) {
                return {site: site, platform: platform.id}
            }
        }
    }
}

function getSiteByDomain(domain: string, platforms: any[]) {
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (site.text == domain) {
                return {site: site, platform: platform.id}
            }
        }
    }
}

async function resetIcon() {
    await chrome.action.setIcon({path: "resources/img/icon.png"});
}

async function updScriptStatus(siteId: string, bool: boolean) {
    let scripts = (await chrome.storage.sync.get({
        "scripts": {}
    })).scripts;
    if (scripts[siteId] !== bool) {
        scripts[siteId] = bool
        setValue("scripts", scripts)
    }
}

async function isRegistered(siteId: string) {
    if (chrome.scripting) {
        const scripts = await chrome.scripting.getRegisteredContentScripts();
        const siteIds = scripts.map(script => script.id);
        return (siteIds.includes(siteId))
    } else {
        return false
    }
}

async function unreg(siteId: string) {
    if (await isRegistered(siteId)) {
        await chrome.scripting.unregisterContentScripts({ids: [siteId]})
    }
}

async function reg(siteId: any, origin: string, content: string[]) {
    await chrome.scripting.registerContentScripts([{
        allFrames: true,
        id: siteId,
        js: content,
        matches: [origin],
        persistAcrossSessions: true,
        runAt: "document_idle"
    }])
}

async function enableReg(siteId: string, origin: string, content: string[]) {
    await unreg(siteId)
    await reg(siteId, origin, content)
    await updScriptStatus(siteId, true)
}

async function disableReg(siteId: string) {
    await unreg(siteId)
    await updScriptStatus(siteId, false)
}

async function getValue(key: string, defValue: any) {
    return (await chrome.storage.sync.get({[key]: defValue}))[key]
}

// quota: 120 writes/minute
async function setValue(key: string, value: any) {
    return (await chrome.storage.sync.set({[key]: value}))
}