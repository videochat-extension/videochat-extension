### actual

* **problem:** mp3 audio sounds don't work

### solved

* **problem:** chrome.storage.session not implemented in firefox
    * **solution** use chrome.storage.local and reset values on browser restart
* **problem:** global hotkeys for switch don't work
    * **solution:** remove switch command from manifest
* **problem:** requestPictureInPicture doesn't work
    * **solution:** hide pip buttons if firefox detected
* **problem:** faceapi can't fetch models from the content script
    * **solution:** monkeyPatch readFile method, use loadFromDisk instead of loadFromUri
* **problem:** user gesture in welcome.html not recognised, permissions can't be asked for
    * **solution**: fixed by using shared platforms dict instead of awaiting fetch
* **problem:** streamer mode is useless without requestPictureInPicture
    * **solution:** disable streamer mode for firefox ¯\_(ツ)_/¯
* **problem:** sentry CRASHES WHOLE TAB when initialising in the content script
    * **solution:** disable sentry initialising ¯\_(ツ)_/¯
* **problem:** content scripts executes in about:blank in dynamic script which shows
    * **solution:** filter location.href when executing content()
* to be continued...