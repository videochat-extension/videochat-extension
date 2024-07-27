import {PlatformSettings} from "./content-platform";

export {}

declare global {
    var platformSettings: PlatformSettings;
    var workerPort: chrome.runtime.Port | null;
    // var driver: ChatruletkaDriver | ChatruletkaSimpleDriver;
    var driver: any;
    var patreon: any;
}
