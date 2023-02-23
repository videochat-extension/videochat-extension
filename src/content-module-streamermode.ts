import $ from "jquery";
import * as utils from "./utils";

export function injectStreamerMode() {
    try {
        (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
    } catch (e) {
        console.dir(e)
    }

    try {
        (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
    } catch (e) {
        console.dir(e)
    }

    if (globalThis.settings.blurReport)
        (document.getElementById("report-screen") as HTMLElement).style.filter = "blur(10px)"

    if (globalThis.settings.cover || globalThis.settings.coverPreview || globalThis.settings.coverNoise || globalThis.settings.coverStop) {
        $(utils.createElement('img', {
            src: globalThis.settings.coverSrc,
            id: "cover",
            style: "height:100%; position: absolute; display:none"
        })).insertBefore("#remote-video")

        $(utils.createElement('img', {
            src: globalThis.settings.coverSrc,
            id: "cover2",
            style: "height:100%; position: absolute; transform: scaleX(-1)"
        })).insertBefore("#local-video")

        $(".remote-video__preview").insertBefore("#cover")

        $(".remote-video__noise").insertBefore("#cover")
    }

    const streamerModeScript = document.createElement('script');
    streamerModeScript.src = chrome.runtime.getURL('injection/streamer-mode.js');
    streamerModeScript.onload = () => streamerModeScript.remove();
    (document.head || document.documentElement).appendChild(streamerModeScript);
}