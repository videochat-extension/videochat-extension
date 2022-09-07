var defaults = {
    mirror: false,
    mirrorAlt: false,
    prikol: false,
    expand: true,
    hideWatermark: false,
    hideBanner: false,
    autoBan: false,
    dontBanMobile: false,
    skipMale: false,
    skipFemale: false,
    possibleReview: false,
    ws: false,
    nsfw: false,
    skipSound: false,
    enableFaceApi: false,
    skipFourSec: false,
    autoResume: false,
    hotkeys: true,
    wsconfig: {
        theyskipsound: true,
        skipwrongcountry: true,
        replacePic: false,
        deletePic: false,
        replaceReportPics: false,
    },
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
    risky: false,
    streamerMirror: false,
    blurOnStart: true,
    streamerPip: true,
    blurPreview: true,
    blurFilter: 55,
    blurPreviewFilter: 20,
    nsfwjs: {
        PREDICATIONS_ARRAY_SIZE: 4,
        PANIC_PROPABILITY: 0.8,
        WEIGHT_PORN: 2,
        WEIGHT_SEXY: 1,
        BLUR_DURATION: 5,
        BLUR_PANIC: 6,
        TIMEOUT: 100
    },
    letUnblur: false,
    nsfwjsUnblur: false,
    blurReport: true,
    cover: false,
    coverPreview: false,
    coverNoise: false,
    coverStop: false,
    coverSrc: "https://i.imgur.com/Ud2uLYQ.gif",
    ipApiLocalisation: true,
    hideMobileLocation: true,
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
    torrentsEnable: true,
    torrentsInfo: true,
    showISP: false,
    askForMode: false,
    minimalism: false,
    lastInstanceOpened: "https://videochatru.com/embed/",
    showDangerWarning: true,
    lastVersion: ""
};

chrome.storage.sync.get(defaults, function (result) {
    chrome.storage.sync.set(result);
});

var tabId = -1,
    chatId = -1,
    curId = -1,
    torrentWindowId = -1;

chrome.storage.local.get({ips: [], tabId: -1, chatId: -1, curId: -1, torrentWindowId: -1}, function (result) {
    chrome.storage.local.set(result)
    tabId = result.tabId
    chatId = result.chatId
    curId = result.curId
    torrentWindowId = result.torrentWindowId
})

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case "switch":
            if (curId === -1 || chatId === -1 || tabId === -1)
                return
            if (curId === chatId) {
                chrome.tabs.update(tabId, {selected: true});
                curId = tabId;
            } else {
                chrome.tabs.update(chatId, {selected: true});
                curId = chatId;
            }
            break;

        default:
            chrome.tabs.sendMessage(chatId, {command: command}).catch((error) => {
                console.dir(error)
            })

            break;
    }
});

chrome.tabs.onActivated.addListener(function (chTab) {
    chrome.tabs.get(chTab["tabId"], function (tab) {
        if (tab["url"].search(".*videochatru.com.*") !== -1 || tab['url'].search(".*ome.tv.*") !== -1) {
            chatId = tab["id"];
            if (tab.windowId === torrentWindowId) {
                torrentWindowId = -1;
                chrome.storage.local.set({torrentWindowId: res.id})
            }
            chrome.storage.local.set({chatId: chatId})
        } else {
            tabId = tab["id"];
            chrome.storage.local.set({tabId: tabId})
        }
        curId = tab["id"];
        chrome.storage.local.set({curId: curId})
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.testApi) {
            fetch(`http://ip-api.com/json/1.1.1.1`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then(
                            function (data) {
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    apiTestResult: data,
                                    apiTestCode: response.status,
                                })
                            }
                        )
                    } else {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            apiTestResult: response.status,
                            apiTestCode: response.status,
                        })
                    }
                }).catch(error => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    apiTestResult: error,
                    apiTestCode: 0
                })
            });
            sendResponse('fetch should be in progress');
        }
        if (request.remoteIP) {
            fetch(`http://ip-api.com/json/${request.remoteIP}?fields=status%2Cmessage%2Ccountry%2CcountryCode%2Cregion%2CregionName%2Ccity%2Cdistrict%2Czip%2Clat%2Clon%2Ctimezone%2Cisp%2Corg%2Cas%2Cmobile%2Cproxy%2Chosting%2Cquery&lang=${request.language}`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then(
                            function (data) {
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    ipData: data,
                                    apiCode: response.status,
                                    apiQuery: request.remoteIP
                                })
                            }
                        )
                    } else {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            ipData: {},
                            apiCode: response.status,
                            apiQuery: request.remoteIP
                        })
                    }
                })
            sendResponse('fetch should be in progress');
        }

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
                        chrome.windows.get(windowId = torrentWindowId, {populate: true}).then(res => {
                                let list_to_close = []
                                for (var prop in res.tabs) {
                                    if (!res.tabs[prop].active && res.tabs[prop].url.includes("iknowwhatyoudownload")) {
                                        list_to_close.push(res.tabs[prop].id)
                                    }
                                }

                                chrome.tabs.remove(list_to_close)
                            }
                        )
                        break
                    }
                }
                if (!found) {
                    chrome.windows.create({
                        url: request.url
                    }).then(res => {
                            torrentWindowId = res.id;
                            chrome.storage.local.set({torrentWindowId: res.id})
                        }
                    );
                }

            })

            sendResponse('k');
        }
    }
);

chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/1TIynfMSRGrFb7_Co9Rb0ZEhts3WROMRcrCNPV8XE0ls")

chrome.action.onClicked.addListener(function (tab) {
    chrome.storage.sync.get(["lastInstanceOpened"], function (result) {
        chrome.tabs.create({url: result.lastInstanceOpened});
    });
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        setTimeout(() => {
            chrome.storage.sync.set({askForMode: true}, function (params) {
                if (chrome.i18n.getMessage("map_lang") === "ru") {
                    chrome.tabs.create({url: "https://videochatru.com/embed/"});
                } else {
                    chrome.tabs.create({url: "https://ome.tv/embed/"});
                }
            });
        }, 1000)
    } else {
        if (details.reason === "update") {
            chrome.storage.sync.set({lastVersion: details.previousVersion})
        }
    }
});
