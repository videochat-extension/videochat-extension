// dict with default settings that should be applied when installing/updating the extension
// there is no uniform style of variable names because of the long life of the codebase
var defaults = {
    expand: true,
    hideWatermark: false,
    hideBanner: false,
    autoBan: false,
    dontBanMobile: false,
    skipMale: false,
    skipFemale: false,
    possibleReview: false,
    skipSound: false,
    enableFaceApi: false,
    skipFourSec: false,
    autoResume: false,
    hotkeys: true,
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
    },
    streamer: false,
    streamerKeys: true,
    doNotReflect: false,
    doNotCover: false,
    hideCamera: false,
    streamerMirror: false,
    blurOnStart: true,
    streamerPip: true,
    blurPreview: false,
    blurFilter: 55,
    blurPreviewFilter: 20,
    blurReport: true,
    cover: true,
    coverPreview: true,
    coverNoise: true,
    coverStop: true,
    coverSrc: "https://i.imgur.com/Ud2uLYQ.gif",
    ipApiLocalisation: true,
    hideMobileLocation: true,
    showCT: false,
    showMoreEnabledByDefault: true,
    skipMobileTarget: true,
    enableTargetCity: false,
    enableTargetRegion: false,
    targetCity: "Moscow",
    targetRegion: "Moscow",
    targetSound: false,
    darkMode: false,
    hideLogo: false,
    hideHeader: true,
    sentry: true,
    swalInfoCompleted: false,
    torrentsEnable: false,
    torrentsInfo: true,
    showISP: false,
    askForMode: false,
    minimalism: false,
    lastInstanceOpened: "https://videochatru.com/embed/",
    lastVersion: "",
    skipwrongcountry: false,
};

// retrieves all current settings from the synched storage, applies new ones if necessary
chrome.storage.sync.get(defaults, function (result) {
    chrome.storage.sync.set(result);
});

// these variables are required for the command "switch", which allows you to switch between the current tab and the chat tab and back
var tabId = -1, // last active tab, can not be videochat
    curId = -1, // current active tab, can be also videochat 
    chatId = -1; // videochat tab id

// this variable tracks window id where iknowwhatyoudownload.com tabs opens
// these tabs open in separate window for convenience and to avoid IP address leaking
var torrentWindowId = -1;

// since MV3 replaced the background page with service workers, the above values must be stored somewhere
// local storage is also used to store a list of blocked ips (it can get very long)
chrome.storage.local.get({ips: [], tabId: -1, chatId: -1, curId: -1, torrentWindowId: -1}, function (result) {
    chrome.storage.local.set(result)
    tabId = result.tabId
    chatId = result.chatId
    curId = result.curId
    torrentWindowId = result.torrentWindowId
})

// this handles commands AKA hotkeys
// the 'switch' command is processed by a background service worker, the rest are transferred to the active chat tab
chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case "switch":
            // do nothing if any of tabs === -1
            if (curId === -1 || chatId === -1 || tabId === -1)
                return
            if (curId === chatId) {
                // selects the non-videochat tab because the videochat tab is active
                chrome.tabs.update(tabId, {selected: true});
                curId = tabId;
            } else {
                // selects the videochat tab because the non-videochat tab is active
                chrome.tabs.update(chatId, {selected: true});
                curId = chatId;
            }
            break;

        default:
            // redirect the command to the active videochat's content script
            chrome.tabs.sendMessage(chatId, {command: command})
            break;
    }
});

// triggered when the active tab changes
// requires 'tab' permission
// it is mainly used to track the active chat tab
chrome.tabs.onActivated.addListener(function (chTab) {
    chrome.tabs.get(chTab["tabId"], function (tab) {
        if (tab["url"] !== undefined && tab["id"] !== undefined) {
            if (tab["url"].search(".*videochatru.com.*") !== -1 || tab['url'].search(".*ome.tv.*") !== -1) {
                // if the chat is open in torrentWindowId then torrentWindowId can no longer be used for iknowwhatyoudownload tabs
                if (tab.windowId === torrentWindowId) {
                    torrentWindowId = -1;
                    chrome.storage.local.set({torrentWindowId: -1})
                }

                // store active videochat tab id
                chatId = tab["id"];
                chrome.storage.local.set({chatId: chatId})
            } else {
                // if the active tab is not a videochat, then store tab id in the 'tabId' variable
                tabId = tab["id"];
                chrome.storage.local.set({tabId: tabId})
            }
            // store active tab id in the 'curId' variable
            curId = tab["id"];
            chrome.storage.local.set({curId: curId})
        }
    });
});

// this thing handles all messages coming from content scripts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
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
        // if torrentWindowId window does not exists, proceeds with creating one
        if (request.checkTorrents) {
            chrome.windows.getAll().then(res => {
                let found = false
                for (var prop in res) {
                    if (res[prop].id === torrentWindowId) {
                        chrome.tabs.create({
                            url: request.url,
                            windowId: torrentWindowId,
                            active: true
                        })
                        found = true

                        // gets all unactive iknowwhatyoudownload tabs in the torrentWindowId window and closes them
                        chrome.windows.get(torrentWindowId, {populate: true}).then(res => {
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
                                torrentWindowId = res.id;
                                chrome.storage.local.set({torrentWindowId: res.id})
                            }
                        }
                    );
                }

            })

            sendResponse('k');
        }
    }
);

// very old post-install poll, a google script then uses webhook to forward the response to the text channel in the extension's discord server
// very demotivating experience for a dev, should be replaced with less intrusive
// chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/1TIynfMSRGrFb7_Co9Rb0ZEhts3WROMRcrCNPV8XE0ls")

// this thing controls what happens when you click on the extension icon
chrome.action.onClicked.addListener(function (tab) {
    // the idea is to open last videochat
    chrome.storage.sync.get(["lastInstanceOpened"], function (result) {
        chrome.tabs.create({url: result.lastInstanceOpened});
    });
});

// triggered when installing/updating the extension
chrome.runtime.onInstalled.addListener((details) => {
    // the idea is to open a localised Chatruletka instance on install,
    // but it should change to the videochat platform selector
    if (details.reason === "install") {
        setTimeout(() => {
            chrome.storage.sync.set({askForMode: true}, () => {
                if (chrome.i18n.getMessage("map_lang") === "ru") {
                    chrome.tabs.create({url: "https://videochatru.com/embed/"});
                } else {
                    chrome.tabs.create({url: "https://ome.tv/embed/"});
                }
            });
        }, 1000)
    } else {
        // store the previous version to show a changelog if necessary
        if (details.reason === "update") {
            chrome.storage.sync.set({lastVersion: details.previousVersion})
        }
    }
});

// drafts for the future
// // this should set the Icon of the last used platform and apply badge with 'ext' text
// chrome.action.setIcon({path: ""})
// chrome.action.setBadgeBackgroundColor({ color: "#000000"})
// chrome.action.setBadgeText({ text: "ext" });