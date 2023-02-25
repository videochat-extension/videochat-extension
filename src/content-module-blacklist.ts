export function syncBlackList() {
    if (globalThis.settings.dontBanMobile) {
        if (!globalThis.driver.curInfo.mobile) {
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

document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e: any) => { // TODO: any should be KeyboardEvent but TS doesn't like it
    // TODO (!!!): blacklist must use globalThis.curIps, not last ip
    // if (e.shiftKey && !globalThis.local.ips.includes(document.getElementById("remoteIP")?.innerText!)) // TODO: remove remoteIP bs
    //     syncBlackList()
})