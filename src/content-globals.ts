import $ from "jquery";
import {ContentSwalChangelog} from "./content-swal-changelog"
import {ContentSwalInfo} from "./content-swal-info"
import {mapModule} from "./content-module-map";

import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {ChatruletkaSimpleDriver} from "./content-driver-chatruletka-simple";

export {}

declare global {
    var settings: any;
    var local: any;
    var curIps: any[];
    var curInfo: any;
    var needToClear: boolean;
    var needToCheckTarget: boolean;
    var map: any;
    var tim: NodeJS.Timeout;
    var faceApiLoaded: boolean;
    var controls: HTMLElement;
    var resize: NodeJS.Timeout;
    var timeout: NodeJS.Timeout;
    var requestToStartTiming: number;
    var info: ContentSwalInfo;
    var changelog: ContentSwalChangelog;
    var mapModule: mapModule;
    // var driver: ChatruletkaDriver | ChatruletkaSimpleDriver;
    var driver: any;
    //blacklist
    var male: HTMLAudioElement;
    var ban: HTMLAudioElement;
    // geolocation
    var targetSound: HTMLAudioElement;
}

globalThis.settings = {}
globalThis.local = {ips: ["-"]}
globalThis.curIps = []
globalThis.changelog = new ContentSwalChangelog()
globalThis.info = new ContentSwalInfo()

globalThis.curInfo = {}
globalThis.needToClear = false
globalThis.needToCheckTarget = false
// globalThis.map
// globalThis.tim
globalThis.faceApiLoaded = false
// globalThis.controls
// globalThis.resize
// globalThis.timeout
globalThis.requestToStartTiming = 0

// blacklist
globalThis.male = new Audio(chrome.runtime.getURL('resources/audio/male.mp3'))
globalThis.ban = new Audio(chrome.runtime.getURL('resources/audio/ban.mp3'))
// target geolocation
globalThis.targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))

// blacklist
globalThis.male.volume = 0.3
globalThis.ban.volume = 0.45
// target geolocation
globalThis.targetSound.volume = 0.5