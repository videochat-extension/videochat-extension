// based on magic from https://github.com/fippo/rtcstats (MIT)

let nativeMethod = window.RTCPeerConnection.prototype.addIceCandidate
if (nativeMethod) {
    window.RTCPeerConnection.prototype.addIceCandidate = function () {
        let pc = this;
        let args = arguments;

        try {
            window.dispatchEvent(new CustomEvent("[object Object]", {detail: {args: JSON.parse(JSON.stringify(args))}}))
        } catch (e) {
            console.dir("ERROR: Failed to pass addIceCandidate data")
            console.dir(e)
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
