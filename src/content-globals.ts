import {ContentSwalChangelog} from "./content-swal-changelog"
import {ContentSwalInfo} from "./content-swal-info"

export {}

declare global {
    var settings: any;
    var local: any;
    var resize: NodeJS.Timeout;
    var info: ContentSwalInfo;
    var changelog: ContentSwalChangelog;
    // var driver: ChatruletkaDriver | ChatruletkaSimpleDriver;
    var driver: any;
    //blacklist
    var male: HTMLAudioElement;
}

globalThis.settings = {}
globalThis.local = {ips: ["-"]}
globalThis.changelog = new ContentSwalChangelog()
globalThis.info = new ContentSwalInfo()


// blacklist
globalThis.male = new Audio(chrome.runtime.getURL('resources/audio/male.mp3'))
globalThis.male.volume = 0.3

