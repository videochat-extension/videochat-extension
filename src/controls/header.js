function createHeader() {
    return createElement('center', {}, [
        createElement('div', {
            style: "position:absolute; left:0;top:0",
        }, [
            createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_remote"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = document.getElementById('remote-video').videoWidth
                    dwncanvas.height = document.getElementById('remote-video').videoHeight

                    const ctx = dwncanvas.getContext('2d');

                    ctx.drawImage(document.getElementById("remote-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                    downloadImage(dwncanvas.toDataURL('image/jpg'))
                    dwncanvas = null
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: "color: green; height:15px",
                title: "pip remote",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("remote-video"))
                        document.exitPictureInPicture()
                    else
                        document.getElementById("remote-video").requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: function f() {
                    if (settings.streamer && settings.streamerPip) {
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
                        document.getElementById("echo-video").requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
        createElement('a', {
            target: "_blank",
            style: (() => {
                if (settings.darkMode)
                    return "text-decoration: none!important; color: #E8E6E3;"
                else
                    return "text-decoration: none!important; color: #000000;"
            })(),
            href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
        }, [
            createElement('b', {
                innerText: chrome.i18n.getMessage("extension_name"),
                id: "connectionStatus",
            })
        ]),
        createElement('div', {
            style: "position:absolute; right:0; top:0",
        }, [
            createElement('button', {
                style: "color: green; height:15px",
                title: "pip local",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("local-video"))
                        document.exitPictureInPicture()
                    else
                        document.getElementById("local-video").requestPictureInPicture()
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
            createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_local"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = document.getElementById('local-video').videoWidth
                    dwncanvas.height = document.getElementById('local-video').videoHeight

                    const ctx = dwncanvas.getContext('2d');

                    ctx.drawImage(document.getElementById("local-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                    downloadImage(dwncanvas.toDataURL('image/jpg'))
                    dwncanvas = null
                },
            }, [
                createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
    ])
}
