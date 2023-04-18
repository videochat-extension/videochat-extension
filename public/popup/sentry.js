function getUserBrowser() {
    let manifest = chrome.runtime.getManifest()
    if (manifest.browser_specific_settings) {
        return "firefox"
    } else {
        if (manifest.update_url) {
            if (manifest.update_url.includes('microsoft') || manifest.update_url.includes('edge')) {
                return "edge"
            } else if (manifest.update_url.includes('google')) {
                return "chrome"
            }
        } else {
            return Math.round(Math.random()) ? "edge" : "chrome"
        }
    }
    return "chrome"
}

try {
    Sentry.init({
        dsn: "https://09512316dbc3422f931ad37d4fb12ed2@o1272228.ingest.sentry.io/6533563",
        release: "videochat-extension@" + chrome.runtime.getManifest().version,
        environment: chrome.runtime.getManifest().update_url ? getUserBrowser() : "development",
        autoSessionTracking: false, // disable session tracking
        ignoreErrors: [
            "Extension context invalidated."
        ],
        async beforeSend(event) {
            let enabled = await (await chrome.storage.sync.get({['sentry']: 'true'}))['sentry']
            if (enabled) return event;
            return null;
        },
    });
} catch (e) {
    console.dir(e)
}