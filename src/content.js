const s = document.createElement('script');
s.src = chrome.extension.getURL('injection/injection.js');
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

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
var tim
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
        s1.src = chrome.extension.getURL('injection/mirror.js');
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
                    style: "position:absolute; right:0; top:0",
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
                }),
                createElement('li', {
                    innerText: chrome.i18n.getMessage("tab4")
                })
            ]),
            createElement('div', {
                className: "tabs__content active row",
                id: "apiInfoContent",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "remoteFace",
                }),
                createElement('div', {
                    id: "remoteInfo",
                    style: "overflow-y: auto;margin-top: 3px"
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
                    innerText: chrome.i18n.getMessage("skip_males"),
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.skipMale,
                        id: "skipMaleCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "skipMale": skipMaleCheck.checked }, function () {
                                location.reload()
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("skip_females"),
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.skipFemale,
                        id: "skipFemaleCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "skipFemale": skipFemaleCheck.checked }, function () {
                                location.reload()
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("skip_sound"),
                }, [
                    createElement('input', {
                        type: "checkbox",
                        checked: settings.skipSound,
                        id: "skipSoundCheck",
                        onclick: () => {
                            chrome.storage.sync.set({ "skipSound": skipSoundCheck.checked }, function () {
                            });
                        }
                    })
                ]),
                createElement('br'),
                createElement('span', {
                    innerText: chrome.i18n.getMessage("mirror"),
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

                createElement('span', {
                    innerText: chrome.i18n.getMessage("watermark"),
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
                    innerText: chrome.i18n.getMessage("banner"),
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
            ]),
            createElement('div', {
                className: "tabs__content",
                id: "aboutPanel",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "aboutInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                    [
                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("desc"),
                        }),
                        createElement('br'),
                        createElement('br'),

                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("github"),
                        }),
                        createElement('br'),
                        createElement('br'),

                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("hotkeys")
                        }),
                        
                        createElement('br'),
                        createElement('dl', {},
                            [
                                createElement('dt', {
                                    innerHTML: chrome.i18n.getMessage("author")
                                }),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/qrlk",
                                        innerText: "qrlk",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dt', {
                                    innerHTML: chrome.i18n.getMessage("testers")
                                }),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;",
                                    innerText: chrome.i18n.getMessage("sasha")
                                }),
                                createElement('dt', {
                                    innerHTML: chrome.i18n.getMessage("inspired"),
                                }),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/unixpickle/camera-hijack",
                                        innerText: "camera-hijack",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/fippo/rtcstats",
                                        innerText: "rtcstats",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dt', {
                                    innerHTML: chrome.i18n.getMessage("libs")
                                }),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://jquery.com/",
                                        innerText: "jquery",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/justadudewhohacks/face-api.js",
                                        innerText: "face-api.js",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dt', {
                                    innerHTML: chrome.i18n.getMessage("3rdparty")
                                }),

                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://ip-api.com/",
                                        innerText: "ip-api",
                                        style: "text-decoration: none!important;"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://2gis.ru",
                                        innerText: "2gis",
                                        style: "text-decoration: none!important;"
                                    })
                                ])
                            ]),
                        createElement('br'),

                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("videochatru_mitm"),
                        })
                    ]
                )
            ])
        ])
    ])

    $(".gender-selector")[0].parentElement.remove()

    buttons = $(".buttons")[0]
    chat = $(".chat")[0]

    $(controls).insertBefore(".chat");

    male = new Audio(chrome.extension.getURL('audio/male.mp3'))
    ban = new Audio(chrome.extension.getURL('audio/ban.mp3'))
    female = new Audio(chrome.extension.getURL('audio/female.mp3'))

    // online = new Audio(chrome.extension.getURL('audio/con.mp3'))
    // offline = new Audio(chrome.extension.getURL('audio/dc.mp3'))

    male.volume = 0.3
    ban.volume = 0.45
    female.volume = 0.3
    // online.volume = 0.1
    // offline.volume = 0.1
    console.log()

    async function detectGender() {
        let stop = false
        let skip_m = false
        let skip_f = false
        let text = ''
        if (stage == 3) {
            console.time("faceapi: detectAllFaces()")

            clearInterval(tim)

            array = await faceapi.detectAllFaces(document.getElementById('remote-video')).withFaceLandmarks().withAgeAndGender()

            for (var i = 0; i < array.length; i++) {
                text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
                if (array[i].gender == "male" && (array[i].genderProbability * 100).toFixed(0) > 70) {
                    skip_m = true
                    stop = true
                }
                if (array[i].gender == "female" && (array[i].genderProbability * 100).toFixed(0) > 70) {
                    skip_f = true
                    stop = true
                }
            }

            if (skip_m && settings.skipMale) {
                text += `<b>male skipping...</b></br>`
                document.getElementsByClassName('buttons__button start-button')[0].click()
                console.log("MALE SKIPPED")
                if (settings.skipSound)
                    if (getRandomInt(1,100)==69)
                        ban.play()
                    else
                        male.play()
            }

            if (skip_f && settings.skipFemale) {
                text += `<b>female skipping...</b></br>`
                document.getElementsByClassName('buttons__button start-button')[0].click()
                console.log("FEMALE SKIPPED")
                if (settings.skipSound)
                    if (getRandomInt(1,100)==69)
                        ban.play()
                    else
                        female.play()
            }

            if (text != '')
                remoteFace.innerHTML = text

            console.timeEnd("faceapi: detectAllFaces()")
        }
        if (!stop)
            tim = setTimeout(detectGender, 500)
    }

    if (settings.skipMale || settings.skipFemale) {
        setTimeout(async () => {
            console.time("faceapi: loading models")
            await faceapi.nets.ssdMobilenetv1.loadFromUri(chrome.extension.getURL('/models'))
            await faceapi.nets.faceLandmark68Net.loadFromUri(chrome.extension.getURL('/models'))
            await faceapi.nets.ageGenderNet.loadFromUri(chrome.extension.getURL('/models'))
            console.timeEnd("faceapi: loading models")

            console.time("faceapi: initial facedetect")
            remoteFace.innerHTML = chrome.i18n.getMessage("initialFaceDetect")
            let tempImage = document.createElement('img')
            tempImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
            await faceapi.detectAllFaces(tempImage).withFaceLandmarks().withAgeAndGender()
            console.timeEnd("faceapi: initial facedetect")
            remoteFace.innerHTML = ""

            tim = setTimeout(detectGender, 2000)
        }, 0)
    }


    $.getJSON("http://ip-api.com/json/", { lang: chrome.i18n.getMessage("@@UI_locale").slice(0, 2), fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query" })
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
        remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"
        aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"

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
                    // offline.play()

                    clearInterval(tim)
                    localStage.innerText = 1
                    // remoteFace.innerHTML = ''
                    if (play < search) {
                        console.log("Dialog ended before even started")
                    }

                    search = Date.now()
                } else if (attributeValue.includes("s-found")) {
                    // remoteFace.innerHTML = ''
                    stage = 2
                    localStage.innerText = 2

                    found = Date.now()
                } else if (attributeValue.includes("s-play")) {
                    // online.play()

                    stage = 3
                    localStage.innerText = 3

                    clearInterval(tim)
                    tim = setTimeout(detectGender, 0)

                    play = Date.now()
                    console.log("Loading took: ", parseFloat((play - found) / 1000).toFixed(2), "sec")
                } else if (attributeValue.includes("s-stop")) {
                    // offline.play()
                    clearInterval(tim)

                    remoteFace.innerHTML = ''

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
