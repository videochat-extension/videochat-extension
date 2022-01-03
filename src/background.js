var defaults = {
    mirror: false,
    mirrorAlt: false,
    prikol: false,
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
        deleteReportPics: false
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
    coverSrc: "https://i.imgur.com/Ud2uLYQ.gif",
    ipApiLocalisation: true,
    hideMobileLocation: true,
    showMore: false,
    skipMobileTarget: true,
    enableTargetCity: false,
    enableTargetRegion: false,
    targetCity: "Moscow",
    targetRegion: "Moscow",
    targetSound: false,
    darkMode: false,
    hideLogo: false
};
chrome.storage.sync.get(defaults, function (result) {
    chrome.storage.sync.set(result);
});

chrome.storage.local.get({ips: []}, function (result) {
    chrome.storage.local.set(result)
})

var tabId = -1,
    chatId = -1,
    curId = -1;

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case "switch":
            if (curId === -1 || chatId === -1 || tabId === -1)
                return
            if (curId == chatId) {
                chrome.tabs.update(tabId, {selected: true});
                curId = tabId;
            } else {
                chrome.tabs.update(chatId, {selected: true});
                curId = chatId;
            }
            break;

        default:
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: command});
            });
            chrome.tabs.sendMessage(chatId, {command: command});
            break;
    }
});

chrome.tabs.onActivated.addListener(function (chTab) {
    chrome.tabs.get(chTab["tabId"], function (tab) {
        if (tab["url"].search(".*videochatru.com.*") != -1) {
            chatId = tab["id"];
        } else {
            tabId = tab["id"];
        }
        curId = tab["id"];
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: "https://videochatru.com/embed/"});
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install")
        chrome.tabs.create({url: "https://videochatru.com/embed/"});
});
