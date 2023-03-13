const addIceCandidateHandler = {
    apply(target: any, thisArg: any, args: any) {
        try {
            window.dispatchEvent(new CustomEvent("[object Object]", {detail: {candidate: JSON.stringify(args[0])}}));
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
