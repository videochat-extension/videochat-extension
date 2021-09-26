let language = document.getElementsByClassName("language-selector__popup-item selected")[0].dataset.value

document.addEventListener('keyup', e => {
    switch (e.key) {
        case "ArrowLeft":
            if (document.getElementById("report-popup").style.display == "block")
                document.getElementsByClassName("btn btn-gray")[2].click()
            else
                document.getElementsByClassName('buttons__button start-button')[0].click()
            break;

        case "ArrowUp":
            document.getElementsByClassName('buttons__button stop-button')[0].click()
            break;
            
        case "ArrowDown":
            document.getElementsByClassName("message-report-link tr")[0].click()
            break;

        case "ArrowRight":
            if (document.getElementById("report-popup").style.display == "block")
                document.getElementsByClassName("btn btn-main send-report")[1].click()
            break;
    }
})

function updateRemoteAddress(remoteAddress) {
    $.getJSON("http://ip-api.com/json/" + remoteAddress.replace("[", "").replace("]", ""), { lang: language, fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query" })
        .done(function (json) {
            remoteIPInfo.innerText = JSON.stringify(json)

            if (json.mobile) {
                remoteInfo.innerHTML = "<b>Страна: </b>" + json.country + " [" + json.countryCode + "] </br></br>" +
                    "<b>TZ: </b><sup id='remoteTZ'>" + json.timezone + "</sup> (<sup id = 'remoteTime'>" + new Date().toLocaleTimeString("ru", { timeZone: json.timezone }).slice(0, -3) + "</sup>)"
            } else {
                remoteInfo.innerHTML = "<b>Страна: </b>" + json.country + " [" + json.countryCode + "] </br>" +
                    "</br>" +
                    "<b>Город: </b>" + json.city + " (" + json.region + ") </br>" +
                    "<b>Регион: </b>" + json.regionName + "</br>" +
                    "<b>TZ: </b><sup id='remoteTZ'>" + json.timezone + "</sup> (<sup id = 'remoteTime'>" + new Date().toLocaleTimeString("ru", { timeZone: json.timezone }).slice(0, -3) + "</sup>)</br>"
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            console.dir(error)
            var err = textStatus + ", " + error;
            remoteInfo.innerHTML = "<b>" + err + "</b>"
            console.error("Request Failed: " + err);
        });
}

setInterval(() => {
    if (typeof localTZ !== 'undefined' && typeof localTime !== 'undefined') {
        localTime.innerText = new Date().toLocaleTimeString("ru", { timeZone: localTZ.innerText }).slice(0, -3)
    }
    if (typeof remoteTZ !== 'undefined' && typeof remoteTime !== 'undefined') {
        remoteTime.innerText = new Date().toLocaleTimeString("ru", { timeZone: remoteTZ.innerText }).slice(0, -3)
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
                if (rmdaddr != args[0].address) {
                    updateRemoteAddress(args[0].address)
                    rmdaddr = args[0].address
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