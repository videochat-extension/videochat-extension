export function syncBlackList() {
    if (globalThis.settings.dontBanMobile) {
        if (!globalThis.curInfo.mobile) {
            // TODO: BLACKLIST MUST USE curIps
            // globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
            // chrome.storage.local.set({"ips": globalThis.local.ips});

            if (globalThis.settings.skipSound)
                globalThis.male.play();
        }
    } else {
        // TODO: BLACKLIST MUST USE curIps
        // globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
        // chrome.storage.local.set({"ips": globalThis.local.ips});

        if (globalThis.settings.skipSound)
            globalThis.male.play();
    }
}