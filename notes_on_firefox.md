### actual
* **problem:** mp3 audio sounds don't work
* **problem:** streamer mode is useless without requestPictureInPicture
    * **possible solution:** disable streamer mode for firefox?
### solved
* **problem:** global hotkeys for switch don't work
  * **solution:** remove switch command from manifest
* **problem:** requestPictureInPicture doesn't work
  * **solution:** hide pip buttons if firefox detected
* **problem:** faceapi can't fetch models from the content script
  * **solution:** monkeyPatch readFile method, use loadFromDisk instead of loadFromUri
* **problem:** user gesture in welcome.html not recognised, permissions can't be asked for
  * **solution**: fixed by using shared platforms dict instead of awaiting fetch
* to be continued...