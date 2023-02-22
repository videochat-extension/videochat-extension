export function syncBlackList() {
    if (globalThis.settings.dontBanMobile) {
        if (!globalThis.curInfo.mobile) {
            globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
            chrome.storage.local.set({"ips": globalThis.local.ips});

            if (globalThis.settings.skipSound)
                globalThis.male.play();
        }
    } else {
        globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
        chrome.storage.local.set({"ips": globalThis.local.ips});

        if (globalThis.settings.skipSound)
            globalThis.male.play();
    }
}