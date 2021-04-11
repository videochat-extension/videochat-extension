// based on https://github.com/unixpickle/camera-hijack

(function () {
    streamCanvas = document.createElement('canvas');
    streamCanvas.id = "streamCanvas"
    streamCanvas.width = 640
    streamCanvas.height = 480

    streamCanvasCon = streamCanvas.getContext('2d', {
        alpha: false
    });

    vignetteImage = document.createElement("img");
    vignetteImage.id = "vignetteImage"
    vignetteImage.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY3g9IjUwJSIgY3k9IiIgcj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC44Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4g"
    vignetteImage.style.display = "none"

    localPreview = document.createElement("img");
    localPreview.id = "localPreview"
    localPreview.style.display = "none"

    // Select the node that will be observed for mutations
    const targetNode = document.getElementsByClassName("preview")[0];

    // Options for the observer (which mutations to observe)
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {

        previewBase64 = targetNode.style.backgroundImage.replace("url(\"", "").replace("\")", "")

        if (previewBase64 == "none") {
            localPreview.removeAttribute("src")
        } else {
            localPreview.src = previewBase64
        }

        //console.log(previewBase64)
    };

    // Create an observer instance linked to the callback function
    const observer1 = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer1.observe(targetNode, config);

    localVideo = document.getElementById('remote-video')

    function drawFn(con) {
        if (localStage.innerText === "3") {
            const imageWidth = localVideo.videoWidth;
            const imageHeight = localVideo.videoHeight;
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
            con.drawImage(localVideo, Math.floor(sX), Math.floor(sY), Math.floor(sWidth), Math.floor(sHeight), 0, 0, 640, 480);
        } else if (localStage.innerText === "2") {
            if (localPreview.src == "") {
                con.drawImage(noise, 0, 0, 640, 480);
                con.drawImage(vignetteImage, 0, 0, 640, 480);
            } else {
                con.filter = "blur(10px)"

                const imageWidth = localPreview.width;
                const imageHeight = localPreview.height;
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
                con.drawImage(localPreview, Math.floor(sX), Math.floor(sY), Math.floor(sWidth), Math.floor(sHeight), 0, 0, 640, 480);
                con.filter = "none"
            }
        } else {
            con.drawImage(noise, 0, 0, 640, 480);
            con.drawImage(vignetteImage, 0, 0, 640, 480);
        }
    }

    setInterval(() => drawFn(streamCanvasCon), 1000 / 30);

    function hijackStream(stream) {
        const track = stream.getVideoTracks()[0];

        if (!track) {
            return stream;
        }

        const newStream = new MediaStream();

        //add fake track here
        stream.getAudioTracks().forEach((track) => newStream.addTrack(track));

        stream.getAudioTracks().forEach((track) => stream.removeTrack(track));

        const newTrack = streamCanvas.captureStream(25).getVideoTracks()[0];

        newStream.addTrack(newTrack);

        activeStream = newStream

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