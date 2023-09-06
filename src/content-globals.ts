import {PlatformSettings} from "./content-platform";

export {}

declare global {
    var platformSettings: PlatformSettings;
    // var driver: ChatruletkaDriver | ChatruletkaSimpleDriver;
    var driver: any;
    var patreon: any;
}
