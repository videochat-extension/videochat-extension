try {
    Sentry.init({
        dsn: "https://09512316dbc3422f931ad37d4fb12ed2@o1272228.ingest.sentry.io/6533563",
        release: "videochat-extension@" + chrome.runtime.getManifest().version,
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