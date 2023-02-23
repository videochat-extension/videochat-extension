import "./content-globals"

import * as Sentry from "@sentry/browser";

import $ from "jquery";

import * as faceapi from 'face-api.js';
import * as utils from "./utils"

import {hotkeys, registerHotkeys, unregisterHotkeys} from "./content-module-hotkeys";
import "./content-sentry"
import "./background-listener"
import "./content-swal-context-invalidated"
import {updStats} from "./content-controls-tab-stats";
import {injectInterface} from "./content-controls";
import {injectSwitchModeButton, switchMode} from "./content-swal-switchmode";
import {detectGender, injectFaceApi} from "./content-module-faceapi";
import {checkApi, onUpdateIP} from "./content-module-geolocation";
import "./content-module-interface"
import "./content-module-geolocation"
import {startMinimalism} from "./content-module-simplemode";
import {injectDarkMode, interfaceModuleTweaks, tweakLoginWindow} from "./content-module-interface";
import {injectStreamerMode} from "./content-module-streamermode";
import {
    injectAutomationAutoResume,
    injectAutomationSkipFourSec,
    injectAutomationSkipWrongCountry
} from "./content-module-automation";

require('arrive')
require('tooltipster')

// "controls/header.js",
// "controls/tab-about.js",
// "controls/tab-api.js",
// "controls/tab-bans.js",
// "controls/tab-map.js",
// "controls/tab-settings.js",
// "controls/tab-settings-automation.js",
// "controls/tab-settings-blacklist.js",
// "controls/tab-settings-faceapi.js",
// "controls/tab-settings-geolocation.js",
// "controls/tab-settings-hotkeys.js",
// "controls/tab-settings-interface.js",
// "controls/tab-settings-misc.js",
// "controls/tab-settings-stats.js",
// "controls/tab-settings-streamer.js",
// "controls/tab-stats.js",
// "content.js",


chrome.storage.local.get(null, function (result) {
    globalThis.local = result;
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync")
        chrome.storage.sync.get(null, function (result) {
            globalThis.settings = result;
        });
});


export function stopAndStart(delay?: number | undefined) {
    globalThis.requestToSkip = false

    if (typeof delay !== "undefined") {
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
        clearTimeout(globalThis.timeout)
        globalThis.timeout = setTimeout(() => {
            (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
        }, delay)
    } else {
        globalThis.requestToStartTiming = +new Date();
        (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
    }
}

const onChangeStage = function (mutations: any[]) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {

            if (globalThis.stage === 3) {
                globalThis.settings.stats.time += Math.ceil((Date.now() - globalThis.play) / 1000)
            }

            const attributeValue = String($(mutation.target).prop(mutation.attributeName));
            if (attributeValue.includes("s-search")) {
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                globalThis.stage = 1
                globalThis.curIps = []
                globalThis.needToClear = true
                globalThis.needToCheckTarget = true
                // console.dir("СТАДИЯ ПОИСКА")
                // offline.play()

                clearInterval(globalThis.tim);
                (document.getElementById("localStage") as HTMLElement).innerText = '1'
                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                if (globalThis.play < globalThis.search) {
                    // console.log("Dialog ended before even started")
                }

                globalThis.search = Date.now()
            } else if (attributeValue.includes("s-found")) {
                // console.dir("СТАДИЯ НАШЕЛ")

                // (document.getElementById("remoteFace") as HTMLElement).innerHTML = ''
                globalThis.stage = 2;
                (document.getElementById("localStage") as HTMLElement).innerText = '2'
                globalThis.needToCheckTarget = true

                globalThis.found = Date.now()
                if (globalThis.requestToSkip)
                    stopAndStart()
            } else if (attributeValue.includes("s-play")) {
                // online.play()
                // console.dir("СТАДИЯ ВОСПРОИЗВЕДЕНИЯ")

                globalThis.stage = 3;
                (document.getElementById("localStage") as HTMLElement).innerText = '3'

                clearInterval(globalThis.tim)
                globalThis.tim = setTimeout(detectGender, 0)

                globalThis.play = Date.now()
                console.log("Loading took: ", ((globalThis.play - globalThis.found) / 1000).toFixed(2), "sec")


                if (globalThis.requestToSkip || (document.getElementById("remoteIP") as HTMLElement).innerText === "-") {
                    globalThis.requestToStartTiming = +new Date();
                    (document.getElementsByClassName('buttons__button stop-button')[0] as HTMLElement).click()
                } else
                    globalThis.settings.stats.countAll++
            } else if (attributeValue.includes("s-stop")) {
                // offline.play()
                clearInterval(globalThis.tim)
                // console.dir("СТАДИЯ СТОП")
                if ((document.getElementById("remoteIP") as HTMLElement).innerText !== "")
                    (document.getElementById("remoteIP") as HTMLElement).innerText = "-"
                globalThis.curIps = []
                // (document.getElementById("remoteInfo") as HTMLElement).innerHTML = ''
                globalThis.needToClear = true;
                (document.getElementById("remoteFace") as HTMLElement).innerHTML = '';

                globalThis.stage = 0;
                (document.getElementById("localStage") as HTMLElement).innerText = '0'

                if (globalThis.requestToStartTiming !== 0 && +new Date() - globalThis.requestToStartTiming < 1000) {
                    globalThis.requestToStartTiming = 0;
                    (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                }
            }

            updStats(false)
        }
    });
}

chrome.storage.sync.get(null, function (result) {
    Sentry.wrap(function () {
        globalThis.settings = result;

        if (location.href.includes('videochatru')) {
            chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
        } else if (location.href.includes('ome.tv')) {
            chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
        }

        tweakLoginWindow()

        if (globalThis.settings.askForMode) {
            switchMode()
            return
        } else {
            if (globalThis.settings.minimalism) {

                startMinimalism()

                return true
            }
        }

        injectSwitchModeButton(true)

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
            if (globalThis.stage === 3)
                globalThis.settings.stats.countManSkip++

            clearTimeout(globalThis.timeout)
        })

        document.getElementsByClassName('buttons__button stop-button')[0].addEventListener("click", (e: any) => { // TODO: fix type
            if (e.pointerType !== "") {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main")
                checkApi()
            }
            clearTimeout(globalThis.timeout)
        })

        injectInterface()

        setInterval(() => {
            if (document.getElementsByClassName("remoteTM").length > 0) {
                if ((document.getElementById("localStage") as HTMLElement).innerText === "3") {
                    for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                        el.innerText = utils.secondsToHms(+new Date() / 1000 - globalThis.startDate)
                    }
                }
            }
            if (document.getElementsByClassName("remoteTZ").length > 0 && document.getElementsByClassName("remoteTime").length > 0) {
                for (let el of document.getElementsByClassName("remoteTime") as HTMLCollectionOf<HTMLElement>) {
                    try {
                        el.innerText = new Date().toLocaleTimeString("ru", {timeZone: $(el).parent().find('.remoteTZ')[0].innerText}).slice(0, -3)
                    } catch {
                        el.innerText = "???"
                    }
                }
            }
        }, 1000)

        checkApi()

        interfaceModuleTweaks()

        injectAutomationSkipFourSec()

        if (globalThis.settings.autoResume) {
            injectAutomationAutoResume()
        }

        if (!globalThis.settings.ipApiLocalisation)
            globalThis.language = "en"

        if (globalThis.settings.hotkeys) {
            unregisterHotkeys()
            registerHotkeys()
        }

        if (globalThis.settings.skipMale || globalThis.settings.skipFemale || globalThis.settings.enableFaceApi) {
            injectFaceApi()
        }

        if (globalThis.settings.streamer) {
            injectStreamerMode()
        }

        injectDarkMode()

        injectAutomationSkipWrongCountry()

        new ResizeObserver(globalThis.mapModule.outputsize).observe(document.getElementById("overlay") as HTMLElement)

        const observer = new MutationObserver(onUpdateIP)
        observer.observe(document.getElementById('remoteIP') as HTMLElement, {
            attributes: true,
            childList: true,
            characterData: true
        });

        var observer2 = new MutationObserver(onChangeStage)
        observer2.observe(document.getElementById('remote-video-wrapper') as HTMLElement, {attributes: true});

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
