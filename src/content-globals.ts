import {ContentSwalChangelog} from "./content-swal-changelog"
import {ContentSwalInfo} from "./content-swal-info"

export {}

declare global {
    var settings: any;
    var resize: NodeJS.Timeout;
    var info: ContentSwalInfo;
    var changelog: ContentSwalChangelog;
    // var driver: ChatruletkaDriver | ChatruletkaSimpleDriver;
    var driver: any;
    //blacklist
}

globalThis.settings = {}
globalThis.changelog = new ContentSwalChangelog()
globalThis.info = new ContentSwalInfo()


// blacklist


