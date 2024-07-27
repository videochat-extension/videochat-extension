(function () {
    //chrome: alchldmijhnnapijdmchpkdeikibjgoi
    //edge: jdpiggacibaaecfbegkhakcmgaafjajn
    //firefox: TODO
    let p: chrome.runtime.Port | null = chrome.runtime.connect("alchldmijhnnapijdmchpkdeikibjgoi", {name: "hello", includeTlsChannelId: true})
    if (p) {
        // @ts-ignore
        p.disconnect = undefined;
        // @ts-ignore
        delete p.disconnect;
        p.onDisconnect.addListener(function() {
            // @ts-ignore
            p = null;
        });
    }

    const addIceCandidateHandler = {
        apply(target: any, thisArg: any, args: any) {
            try {
                if (p) {
                    p.postMessage(JSON.stringify(args[0]))
                }
            } catch (e) {
                console.dir("ERROR: Failed to pass addIceCandidate data to the content script");
                console.dir(e);
            }
            return Reflect.apply(target, thisArg, args)
        },
    }

    RTCPeerConnection.prototype.addIceCandidate = new Proxy(
        RTCPeerConnection.prototype.addIceCandidate,
        addIceCandidateHandler,
    )
})();
