// based on magic from https://github.com/fippo/rtcstats (MIT)

var id = 0;
var rmdaddr = "0.0.0.0"

var nativeMethod = window.RTCPeerConnection.prototype.addIceCandidate
if (nativeMethod) {
    window.RTCPeerConnection.prototype.addIceCandidate = function () {
        let pc = this;
        let args = arguments;
        if (args[0].type === "srflx") {
            console.dir("IP: " + args[0].address)
            if (rmdaddr !== args[0].address) {
                rmdaddr = args[0].address
                remoteIP.innerText = args[0].address
                console.dir("IP CHANGED")
                startDate = +new Date() / 1000
            }
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
