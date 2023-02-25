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
    var map: any;
    var controls: HTMLElement;
    var resize: NodeJS.Timeout;
    var info: ContentSwalInfo;
    var changelog: ContentSwalChangelog;
    var mapModule: mapModule;
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

