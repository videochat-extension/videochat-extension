Sentry.init({
    dsn: "https://09512316dbc3422f931ad37d4fb12ed2@o1272228.ingest.sentry.io/6533563",
    release: "videochatru-extension@" + chrome.runtime.getManifest().version,
    autoSessionTracking: false
});