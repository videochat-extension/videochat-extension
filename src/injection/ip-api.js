function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? "H" : "H") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? "M, " : "M") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? "S" : "S") : "";
    return hDisplay + mDisplay + sDisplay;
}

setInterval(() => {
    if (typeof remoteTM !== 'undefined') {
        if (localStage.innerText === "3")
            remoteTM.innerText = secondsToHms(+new Date() / 1000 - startDate)
    }
    if (typeof remoteTZ !== 'undefined' && typeof remoteTime !== 'undefined') {
        remoteTime.innerText = new Date().toLocaleTimeString("ru", {timeZone: remoteTZ.innerText}).slice(0, -3)
    }
}, 1000)
// based on magic from https://github.com/fippo/rtcstats (MIT)

var origPeerConnection = window.RTCPeerConnection;
var id = 0;
var rmdaddr = "0.0.0.0"

window.RTCPeerConnection = function () {
    var pc = new origPeerConnection(arguments[0], arguments[1]);

    return pc;
};
window.RTCPeerConnection.prototype = origPeerConnection.prototype;

['addIceCandidate'].forEach(function (method) {
    var nativeMethod = window.RTCPeerConnection.prototype[method];
    if (nativeMethod) {
        window.RTCPeerConnection.prototype[method] = function () {
            var pc = this;
            var args = arguments;
            if (args[0].type === "srflx") {
                console.dir("IP: " + args[0].address)
                if (rmdaddr !== args[0].address) {
                    rmdaddr = args[0].address
                    remoteIP.innerText = args[0].address
                    console.dir("IP CHANGE")
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
});