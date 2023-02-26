const addIceCandidateHandler = {
    apply(target: any, thisArg: any, args: any) {
        try {
            // firefox does not return .address / .type when creating RTCIceCandidate in the content script,
            // so here is a workaround for this issue
            let candidate: any = new RTCIceCandidate(args[0])

            let obj: any = {};
            Object.getOwnPropertyNames(candidate).forEach(e => {
                if (e != "toJSON") {
                    obj[e] = candidate[e]
                }
            });
            // Object.getOwnPropertyNames does not work in Chrome, so need to pass full description also
            obj.json = candidate.toJSON();

            window.dispatchEvent(new CustomEvent("[object Object]", {detail: {candidate: JSON.parse(JSON.stringify(obj))}}));
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
