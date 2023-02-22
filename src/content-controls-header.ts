import * as utils from "./utils";

export function createHeader() {
    return utils.createElement('center', {
        style: "user-select:none"
    }, [
        utils.createElement('div', {
            style: "position:absolute; left:0;top:0",
        }, [
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_remote"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: "color: green; height:15px",
                title: "pip remote",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("remote-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("remote-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: function f() {
                    if (globalThis.settings.streamer && globalThis.settings.streamerPip) {
                        return "height:15px"
                    } else {
                        return "display:none"
                    }
                }(),
                title: "pip remote clone (for streamers)",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("echo-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("echo-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
        utils.createElement('a', {
            target: "_blank",
            style: (() => {
                if (globalThis.settings.darkMode)
                    return "text-decoration: none!important; color: #E8E6E3;"
                else
                    return "text-decoration: none!important; color: #000000;"
            })(),
            href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
        }, [
            utils.createElement('b', {
                innerText: chrome.i18n.getMessage("extension_name").replace(" (ome.tv) ", " ") + " v" + chrome.runtime.getManifest().version.substring(0, 3),
                id: "connectionStatus",
            })
        ]),
        utils.createElement('div', {
            style: "position:absolute; right:0; top:0",
        }, [
            utils.createElement('button', {
                style: "color: green; height:15px",
                title: "pip local",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("local-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("local-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_local"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
    ])
}