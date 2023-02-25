// based on magic from https://github.com/fippo/rtcstats (MIT)
let nativeMethod = window.RTCPeerConnection.prototype.addIceCandidate
if (nativeMethod) {
    window.RTCPeerConnection.prototype.addIceCandidate = function () {
        let pc = this;
        let args = arguments;

        // if something fails, the videochat behaviour should not break, so try-catch block in this case is fine
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

        return new Promise(function (resolve, reject) {
            nativeMethod.apply(pc, [args[0],
                function () {
                    resolve();
                    if (args.length >= 2) {
                        args[1].apply(null, []);
                    }
                },
                function (err) {
                    reject(err);
                    if (args.length >= 3) {
                        args[2].apply(null, [err]);
                    }
                }]
            );
        });
    };
}
