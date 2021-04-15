const s = document.createElement('script');
s.src = chrome.extension.getURL('injection.js');
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);

function toObject(from = {}, to = {}) {
    for (let key in from) {
        let value = from[key]

        if (typeof value === 'object' && value && !Array.isArray(value)) {
            toObject(value, from[key])
            continue
        }

        to[key] = value
    }
}

/**
 * @param {string} tagName 
 * @param {Partial<HTMLElement> & {ref(v: HTMLDivElement) => void}} options 
 * @param {HTMLElement[]} childs 
 */
function createElement(tagName = '', options = {}, childs = []) {
    const element = document.createElement(tagName)

    toObject(options, element)

    for (let child of childs)
        element.appendChild(child)

    if (typeof options.ref == 'function')
        options.ref(element)

    return element
}

function downloadImage(data) {
    let a = document.createElement('a');
    a.href = data;

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;

    a.download = dateTime;
    document.body.appendChild(a);
    a.click();
};

let settings = {},
    stage = 0,
    search = 0,
    found = 0,
    play = 0,
    map,
    dc

chrome.storage.sync.get(null, function (result) {
    settings = result;

    if (settings.mirror) {
        const s1 = document.createElement('script');
        s1.src = chrome.extension.getURL('mirror.js');
        s1.onload = () => s1.remove();
        (document.head || document.documentElement).appendChild(s1);
    }

    controls = createElement('div', {
        className: 'chat',
        id: 'controls',
        style: "width:350px; margin-right: calc(100vh / 768 * 10);"
    }, [
        createElement('div', {
            className: "tabs chat"
        }, [
            createElement('style', {
                textContent: `.tabs__content {
                display: none;
                padding-left: 5px;
                padding-right: 5px;
              }
              
              .tabs__content.active {
                display: block;
              }
              
              .tabs {
                position: relative;
                word-break: break-word;
                user-select: text;
              }
              
              .tabs__caption {
                display: flex;
                flex-wrap: wrap;
                list-style-type: none;
                bottom: 0px;
                background: #f8f8f8;
                margin: 0;
                position: absolute;
                width: 100%;
                border-bottom: 1px solid lightgray;
              }
              
              .tabs__caption li {
                padding: 0.2rem 0.5rem;
                text-decoration: none;
                color: black;
                text-align: center;
                flex-shrink: 0;
                flex-grow: 1;
              }
      
              .tabs__caption li:not(.active) {
                cursor: pointer;
              }
              
              .tabs__caption .active {
                font-weight: bold;
              }
              
              .row:after {
                content: "";
                display: table;
                box-sizing: border-box;
                clear: both;
              }`
            }),
            createElement('div', {
                id: "remoteIPInfo",
                style: "display: none;"
            }),
            createElement('div', {
                id: "localStage",
                style: "display: none"
            }),
            createElement('center', {}, [
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

                            var ctx = dwncanvas.getContext('2d');

                            ctx.drawImage(document.getElementById("remote-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                            downloadImage(dwncanvas.toDataURL('image/jpg'))
                            dwncanvas = null
                        },
                    }, [
                        createElement('b', {
                            innerText: "^"
                        })
                    ]),
                ]),

                createElement('b', {
                    innerText: chrome.i18n.getMessage("extension_name"),
                    id: "connectionStatus"
                }),

                createElement('div', {
                    style: "position:absolute; right:0;top:0",
                }, [
                    createElement('button', {
                        style: "color: red; height:15px",
                        title: chrome.i18n.getMessage("screen_local"),
                        onclick: () => {
                            let dwncanvas = document.createElement('canvas');
                            dwncanvas.width = document.getElementById('local-video').videoWidth
                            dwncanvas.height = document.getElementById('local-video').videoHeight

                            var ctx = dwncanvas.getContext('2d');

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
            ]),
            createElement('ul', {
                className: "tabs__caption"
            }, [
                createElement('li', {
                    className: "active",
                    innerText: chrome.i18n.getMessage("tab1")
                }),
                createElement('li', {
                    innerText: chrome.i18n.getMessage("tab2")
                }),
                createElement('li', {
                    innerText: chrome.i18n.getMessage("tab3")
                })
            ]),
            createElement('div', {
                className: "tabs__content active row",
                id: "apiInfoContent",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "remoteInfo",
                    style: "overflow-y: auto;"
                })
            ]),
            createElement('div', {
                className: "tabs__content",
                id: "faceapiContent",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "mapid",
                    style: "width: 100%"
                })
            ]),
            createElement('div', {
                className: "tabs__content",
                id: "settingsPanel",
            }, [
                createElement('span', {
                    innerText: "hide watermark: ",
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.hideWatermark,
                        id: "hideWatermarkCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "hideWatermark": hideWatermarkCheck.checked }, function () {
                                if (hideWatermarkCheck.checked) {
                                    document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 0.0
                                } else {
                                    document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 1.0
                                }
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('span', {
                    innerText: "hide banner: ",
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.hideBanner,
                        id: "hideBannerCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "hideBanner": hideBannerCheck.checked }, function () {
                                if (hideBannerCheck.checked) {
                                    document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 0.0
                                } else {
                                    document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 1.0
                                }
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerText: "mirror: ",
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.mirror,
                        id: "mirrorCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "mirror": mirrorCheck.checked }, function () {
                                location.reload()
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('br'),
                createElement('a', {
                    innerHTML: "<b>github</b>",
                    href: "https://github.com/qrlk/chatruletka-plusplus"
                })
            ])
        ])
    ])

    $(".gender-selector")[0].parentElement.remove()

    buttons = $(".buttons")[0]
    chat = $(".chat")[0]

    $(controls).insertBefore(".chat");

    $.getJSON("http://ip-api.com/json/", { lang: navigator.language.slice(0, 2), fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query" })
        .done(function (json) {
            remoteInfo.innerHTML = chrome.i18n.getMessage("api_working")
        })
        .fail(function (jqxhr, textStatus, error) {
            if (error == "") {
                remoteInfo.innerHTML = chrome.i18n.getMessage("api_insecure")
            } else {
                var err = textStatus + ", " + error;
                remoteInfo.innerHTML = "<b>" + err + "</b>"
                console.error("Request Failed: " + err);
            }
        });

    if (hideWatermarkCheck.checked) {
        document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 0.0
    } else {
        document.getElementsByClassName("remote-video__watermark")[0].style.opacity = 1.0
    }

    if (hideBannerCheck.checked) {
        document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 0.0
    } else {
        document.getElementsByClassName("caption remote-video__info")[0].style.opacity = 1.0
    }


    $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

        resizemap()
    });

    map = new mapgl.Map('mapid', {
        center: [39.2610736084446, 54.39525286954687],
        zoom: 10,
        lang: chrome.i18n.getMessage("map_lang"),
        key: 'bfd8bbca-8abf-11ea-b033-5fa57aae2de7',
        style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b'
    });

    resize = false

    function resizemap() {
        mapid.style.height = $("#faceapiContent")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight + "px"
        remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight + "px"

        map.invalidateSize()
    }

    function outputsize() {
        resizemap()

        if (!resize) {
            resize = true
            setTimeout(() => {
                let mar = parseInt(window.getComputedStyle(controls).marginRight)
                buttons.style.width = (parseInt(buttons.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
                chat.style.width = (parseInt(chat.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
                resize = false
            }, 1000)
        }
    }

    new ResizeObserver(outputsize).observe(document.getElementsByClassName("chat-container")[0])

    var targetNode = document.getElementById('remoteIPInfo');

    var config = { childList: true };

    var callback = function (mutationsList, observer) {
        let json = JSON.parse(remoteIPInfo.innerText)
        console.log(json)
        if (typeof marker !== 'undefined')
            marker.destroy()

        map.setCenter([json.lon, json.lat]);

        if (json.mobile) {
            marker = new mapgl.Marker(map, {
                coordinates: [json.lon, json.lat],
                icon: chrome.extension.getURL('mobile.svg')
            });
        } else {
            marker = new mapgl.Marker(map, {
                coordinates: [json.lon, json.lat],
            });
        }
    };


    var observer2 = new MutationObserver(callback);

    observer2.observe(targetNode, config);

    var $div = $("#remote-video-wrapper");
    var observer2 = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                if (attributeValue.includes("s-search")) {
                    stage = 1
                    localStage.innerText = 1
                    if (play < search) {
                        console.log("Dialog ended before even started")
                    }

                    search = Date.now()
                } else if (attributeValue.includes("s-found")) {
                    stage = 2
                    localStage.innerText = 2

                    found = Date.now()
                } else if (attributeValue.includes("s-play")) {
                    stage = 3
                    localStage.innerText = 3

                    play = Date.now()
                    console.log("Loading took: ", parseFloat((play - found) / 1000).toFixed(2), "sec")
                } else if (attributeValue.includes("s-stop")) {
                    stage = 0
                    localStage.innerText = 0
                }
            }
        });
    });
    observer2.observe($div[0], {
        attributes: true
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.sync.get(null, function (result) {
        settings = result;
    });
});

chrome.runtime.onMessage.addListener(
    function (request) {
        switch (request.command) {
            case "skip":
                document.getElementsByClassName('buttons__button start-button')[0].click()
                break;

            case "stop":
                document.getElementsByClassName('buttons__button stop-button')[0].click()
                break;

            case "screen_remote":
                dwncanvas = document.createElement('canvas');
                dwncanvas.width = document.getElementById('remote-video').videoWidth
                dwncanvas.height = document.getElementById('remote-video').videoHeight

                var ctx = dwncanvas.getContext('2d');

                ctx.drawImage(document.getElementById("remote-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                downloadImage(dwncanvas.toDataURL('image/jpg'))
                dwncanvas = null
                break;

            case "screen_local":
                dwncanvas = document.createElement('canvas');
                dwncanvas.width = document.getElementById('local-video').videoWidth
                dwncanvas.height = document.getElementById('local-video').videoHeight

                var ctx = dwncanvas.getContext('2d');

                ctx.drawImage(document.getElementById("local-video"), 0, 0, dwncanvas.width, dwncanvas.height);
                downloadImage(dwncanvas.toDataURL('image/jpg'))
                dwncanvas = null
                break;
        }
    }
);
