function updateRemoteAddress(remoteAddress) {
  $.getJSON("https://freegeoip.app/json/" + remoteAddress)
      .done(function (json) {
          remoteIPInfo.innerText = JSON.stringify(json)

          remoteInfo.innerHTML = "<b>Страна: </b>" + json.country_name + " [" + json.country_code + "] </br>" +
              "</br>" +
              "<b>Город: </b>" + json.city + " (" + json.region_code + ") </br>" +
              "<b>Регион: </b>" + json.region_name + "</br>" +
              "<b>TZ: </b>" + json.time_zone + "</br>" +
              "</br>" +
              "<b>IP: </b>" + json.ip
      })
      .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          remoteInfo.innerHTML = "<b>" + err + "</b>"
          console.error("Request Failed: " + err);
      });
}

// based on magic from https://github.com/fippo/rtcstats (MIT)

var origPeerConnection = window.RTCPeerConnection;
var id = 0;

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
              updateRemoteAddress(args[0].address)
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