import $ from "jquery";
import {ContentSwalChangelog} from "./content-swal-changelog"
import {ContentSwalInfo} from "./content-swal-info"
import {mapModule} from "./content-module-map";

export {}

declare global {
    var api: number;
    var settings: any;
    var local: any;
    var curIps: any[];
    var stage: number;
    var search: number;
    var found: number;
    var startDate: number;
    var curInfo: any;
    var needToClear: boolean;
    var needToCheckTarget: boolean;
    var play: number;
    var map: any;
    var marker: any;
    var circle: any;
    var tim: NodeJS.Timeout;
    var dc: any;
    var faceApiLoaded: boolean;
    var buttons: HTMLElement;
    var chat: HTMLElement;
    var controls: HTMLElement;
    var resize: NodeJS.Timeout;
    var language: string;
    var timeout: NodeJS.Timeout;
    var requestToStartTiming: number;
    var requestToSkip: boolean;
    var torrenstsConfirmed: boolean;
    var info: ContentSwalInfo;
    var dark: HTMLLinkElement;
    var changelog: ContentSwalChangelog;
    var mapModule: mapModule;
    //blacklist
    var male: HTMLAudioElement;
    var ban: HTMLAudioElement;
    // geolocation
    var targetSound: HTMLAudioElement;
}

globalThis.api = 1
globalThis.settings = {}
globalThis.local = {ips: ["-"]}
globalThis.curIps = []
globalThis.changelog = new ContentSwalChangelog()
globalThis.info = new ContentSwalInfo()

globalThis.stage = 0
globalThis.search = 0
globalThis.found = 0
// globalThis.startDate
globalThis.curInfo = {}
globalThis.needToClear = false
globalThis.needToCheckTarget = false
globalThis.play = 0
// globalThis.map
// globalThis.marker
// globalThis.circle
// globalThis.tim
// globalThis.dc
globalThis.faceApiLoaded = false
globalThis.buttons = $(".buttons")[0]
globalThis.chat = $(".chat")[0]
// globalThis.controls
// globalThis.resize
globalThis.language = window.navigator.language.slice(0, 2)
// globalThis.timeout
globalThis.requestToStartTiming = 0
globalThis.requestToSkip = false
globalThis.torrenstsConfirmed = false

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