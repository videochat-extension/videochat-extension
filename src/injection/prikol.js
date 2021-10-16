// based on https://github.com/unixpickle/camera-hijack

(function () {
    streamCanvas = document.createElement('canvas');
    streamCanvas.id = "streamCanvas"
    streamCanvas.width = 640
    streamCanvas.height = 480

    streamCanvasCon = streamCanvas.getContext('2d', {
        alpha: false
    });

    localVideo = document.getElementById('remote-video')

    function drawFn(con) {
        const imageWidth = 640;
        const imageHeight = 480;
        // Resize values
        const resizeRatio = Math["max"](640 / imageWidth, 480 / imageHeight);
        const resizeWidth = imageWidth * resizeRatio;
        const resizeHeight = imageHeight * resizeRatio;
        // Cropping values
        const sWidth = imageWidth / (resizeWidth / 640);
        const sHeight = imageHeight / (resizeHeight / 480);
        const sX = (imageWidth - sWidth) * 1 / 2;
        const sY = (imageHeight - sHeight) * 1 / 2;
        // Draw image
        con.drawImage(prikol, 0, 0, 640, 480);
    }

    let timerId = setTimeout(function tick() {
        drawFn(streamCanvasCon);
        timerId = setTimeout(tick, 1000 / 30); // (*)
    }, 1000 / 30);

    function hijackStream(stream) {
        const track = stream.getVideoTracks()[0];

        if (!track) {
            return stream;
        }

        const newStream = new MediaStream();

        //add fake track here
        stream.getAudioTracks().forEach((track) => newStream.addTrack(track));

        stream.getAudioTracks().forEach((track) => stream.removeTrack(track));

        const newTrack = streamCanvas.captureStream(15).getVideoTracks()[0];

        newStream.addTrack(newTrack);

        //activeStream = newStream

        return newStream;
    }

    if (navigator.getUserMedia) {
        const oldDeprecatedMethod = navigator.getUserMedia;
        navigator.getUserMedia = (constraints, successCb, errorCb) => {
            oldDeprecatedMethod.call(navigator, constraints, (stream) => {
                if (successCb) {
                    successCb(hijackStream(stream));
                }
            }, errorCb);
        };
        navigator.webkitGetUserMedia = navigator.getUserMedia;
    }

    const oldMethod = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = (options) => {
        return oldMethod.call(navigator.mediaDevices, options).then(hijackStream);
    };
})();