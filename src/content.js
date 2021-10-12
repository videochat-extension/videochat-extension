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

function syncBlackList() {
    if (settings.dontBanMobile) {
        if (!JSON.parse(remoteIPInfo.innerText).mobile) {
            local.ips.push(remoteIP.innerText)
            chrome.storage.local.set({ "ips": local.ips });

            if (settings.skipSound)
                male.play()
        }
    } else {
        local.ips.push(remoteIP.innerText)
        chrome.storage.local.set({ "ips": local.ips });
    
        if (settings.skipSound)
            male.play()
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
    local = { ips: [] },
    stage = 0,
    search = 0,
    found = 0,
    play = 0,
    map,
    dc,
    faceApiLoaded = false

chrome.storage.local.get(null, function (result) {
    local = result;
})

chrome.storage.sync.get(null, function (result) {
    settings = result;

    setInterval(() => {
        if (settings.skipFourSec) {
            try {
                if ((stage == 2) && (found + 4000 < Date.now())) {
                    console.dir("Skipping due to loading time limit")
                    document.getElementsByClassName('buttons__button start-button')[0].click()
                }
            } catch (e) {
                console.dir(e)
            }
        }
        
        if (settings.autoResume) {
            try {
                if (document.getElementsByClassName("video-warning__btn")[0].firstElementChild.offsetParent != null)
                    document.getElementsByClassName("video-warning__btn")[0].firstElementChild.click()
            } catch (e) {
                console.dir(e)
            }
        }
    }, 1000)


    if (settings.mirror) {
        const s1 = document.createElement('script');
        s1.src = chrome.extension.getURL('injection/mirror.js');
        s1.onload = () => s1.remove();
        (document.head || document.documentElement).appendChild(s1);
    } else if (settings.mirrorAlt) {
        const s1 = document.createElement('script');
        s1.src = chrome.extension.getURL('injection/mirror-shwartz.js');
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
            createElement('p', {
                id: "remoteIP",
                style: "display: none;"
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
                    createElement('button', {
                        style: "color: green; height:15px",
                        title: "pip remote",
                        onclick: () => {
                            document.getElementById("remote-video").requestPictureInPicture()
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
                        style: "color: green; height:15px",
                        title: "pip local",
                        onclick: () => {
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
                    innerText: chrome.i18n.getMessage("tab1"),
                }),
                createElement('li', {
                    innerText: chrome.i18n.getMessage("tab2"),
                }),
                createElement('li', {
                    innerText: "Bans",
                }),
                createElement('li', {
                    innerText: "Stats"
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
                id: "bansPanel",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "bansInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                    [
                        createElement('span', {
                            innerText: `banned ips: `
                        }),
                        createElement('span', {
                            id: 'stBnCt'
                        }),
                        createElement('br'),
                        createElement('br'),
                        createElement('span', {
                            innerText: `good ips: `
                        }),
                        createElement('span', {
                            id: 'stNwIp'
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerText: `bad ips: `
                        }),
                        createElement('span', {
                            id: 'stBnIp'
                        }),
                    ]
                )
            ]),

            createElement('div', {
                className: "tabs__content",
                id: "statsPanel",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "statsInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                    [
                        createElement('span', {
                            innerText: `whole: `
                        }),
                        createElement('span', {
                            id: 'stWhole'
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerText: `time spent: `
                        }),
                        createElement('span', {
                            id: 'stTime'
                        }),
                        createElement('br'),
                        createElement('br'),
                        createElement('span', {
                            innerText: `male skip: `
                        }),
                        createElement('span', {
                            id: 'stMlSk'
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerText: `female skip: `
                        }),
                        createElement('span', {
                            id: 'stFmlSk'
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerText: `manual skip: `
                        }),
                        createElement('span', {
                            id: 'stMnSk'
                        }),
                        createElement('br'),
                        createElement('br'),
                        createElement('span', {
                            innerText: `ml count: `
                        }),
                        createElement('span', {
                            id: 'stMlCnt'
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerText: `fml count: `
                        }),
                        createElement('span', {
                            id: 'stFmlCnt'
                        }),
                    ]
                )
            ]),
            createElement('div', {
                className: "tabs__content",
                id: "settingsPanel",
                style: "height:100%;"
            }, [
                createElement('div', {
                    id: "settingsInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                    [
                        createElement('span', {
                            innerText: "forced faceapi: ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.enableFaceApi,
                                id: "enableFaceApiCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "enableFaceApi": enableFaceApiCheck.checked }, function () {
                                        if (!faceApiLoaded)
                                            location.reload()
                                    });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: chrome.i18n.getMessage("skip_males"),
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.skipMale,
                                id: "skipMaleCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "skipMale": skipMaleCheck.checked }, function () {
                                        if (!faceApiLoaded)
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
                                        if (!faceApiLoaded)
                                            location.reload()
                                    });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: "autoban (skip by gender): ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.autoBan,
                                id: "autoBanCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "autoBan": autoBanCheck.checked }, function () {
                                        //location.reload()
                                    });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: "do not ban mobile (disable if ip api not working): ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.dontBanMobile,
                                id: "dontBanMobileCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "dontBanMobile": dontBanMobileCheck.checked }, function () {
                                        //location.reload()
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
                                    chrome.storage.sync.set({ "mirror": mirrorCheck.checked, "mirrorAlt": false }, function () {
                                        location.reload()
                                    });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: "mirror 2: ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.mirrorAlt,
                                id: "mirrorAltCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "mirror": false, "mirrorAlt": mirrorAltCheck.checked }, function () {
                                        location.reload()
                                    });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: "autoskip (4 seconds loading): ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.skipFourSec,
                                id: "skipFourSecCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "skipFourSec": skipFourSecCheck.checked });
                                }
                            })
                        ]),
                        createElement('br'),
                        createElement('span', {
                            innerText: "autoresume ('make yourself visible'): ",
                        }, [
                            createElement('input', {
                                type: "checkbox",
                                checked: settings.autoResume,
                                id: "autoResumeCheck",
                                onclick: () => {
                                    chrome.storage.sync.set({ "autoResume": autoResumeCheck.checked });
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
                        createElement('br'),
                        createElement('br'),
                        createElement('button', {
                            onclick: () => {
                                const result = confirm("Clear?");
                                if (result) {
                                    let stats = {
                                        stats: {
                                            countAll: 0,
                                            countNew: 0,
                                            countDup: 0,
                                            countMales: 0,
                                            countFemales: 0,
                                            countManSkip: 0,
                                            countMaleSkip: 0,
                                            countFemaleSkip: 0,
                                            time: 0
                                        }
                                    }
                                    settings.stats = stats.stats
                                    chrome.storage.sync.set(settings, function () {
                                        updStats()
                                    });
                                }
                            },
                        }, [
                            createElement('b', {
                                innerText: "clear stats"
                            })
                        ]),
                        createElement('br'),
                        createElement('button', {
                            onclick: () => {
                                const result = confirm("Clear?");
                                if (result) {
                                    local.ips = []
                                    chrome.storage.local.set({ "ips": [] }, function () {
                                        updStats()
                                    });
                                }
                            },
                        }, [
                            createElement('b', {
                                innerText: "clear blacklist"
                            })
                        ])
                    ])
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
                            innerHTML: chrome.i18n.getMessage("rating"),
                        }),
                        createElement('br'),
                        createElement('br'),
                        
                        createElement('span', {
                            innerHTML: chrome.i18n.getMessage("github"),
                        }),
                        createElement('br'),
                        createElement('br'),

                        createElement('span', {
                            innerHTML: "<b>Community:</b>",
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerHTML: `<a target='_blank' style='text-decoration: none!important;' href = "https://t.me/videochatru_extension"><img src="https://img.shields.io/endpoint?color=blue&label=News&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fvideochatru_extension"></a>`
                        }),
                        createElement('br'),
                        createElement('span', {
                            innerHTML: `<a target='_blank' style='text-decoration: none!important;' href = "https://t.me/videochatru_chat"><img src="https://img.shields.io/endpoint?color=blue&label=Chat&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fvideochatru_chat"></a>`
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
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
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
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/fippo/rtcstats",
                                        innerText: "rtcstats",
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
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
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/justadudewhohacks/face-api.js",
                                        innerText: "face-api.js",
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://github.com/uzairfarooq/arrive",
                                        innerText: "arrive.js",
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
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
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
                                    })
                                ]),
                                createElement('dd', {
                                    style: "margin-inline-start: 20px;"
                                }, [
                                    createElement('a', {
                                        href: "https://carto.com",
                                        innerText: "carto",
                                        style: "text-decoration: none!important;",
                                        target: "_blank"
                                    })
                                ])
                            ]),
                    ]
                )
            ])
        ])
    ])

    $(".gender-selector")[0].parentElement.remove()

    buttons = $(".buttons")[0]
    chat = $(".chat")[0]

    $(controls).insertBefore(".chat");

    var target = document.querySelector('#remoteIP')
    var observer = new MutationObserver(function (mutations) {

        if (local.ips.includes(target.innerText)) {
            settings.stats.countDup++
            console.dir("old ip")
            if (settings.skipSound)
                ban.play()
            document.getElementsByClassName('buttons__button start-button')[0].click()
        } else {
            settings.stats.countNew++
            console.dir("new ip")
        }
    });


    function secondsToTime(secs) {
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return hours + ":" + minutes + ":" + seconds;
    }

    function updStats() {
        stWhole.innerText = settings.stats.countAll
        stMlSk.innerText = settings.stats.countMaleSkip
        stFmlSk.innerText = settings.stats.countFemaleSkip
        stMlCnt.innerText = settings.stats.countMales
        stFmlCnt.innerText = settings.stats.countFemales
        stMnSk.innerText = settings.stats.countManSkip
        stBnCt.innerText = local.ips.length
        stNwIp.innerText = settings.stats.countNew
        stBnIp.innerText = settings.stats.countDup

        stTime.innerText = secondsToTime(settings.stats.time)

        chrome.storage.sync.set({ "stats": settings.stats });
    }

    var config = { attributes: true, childList: true, characterData: true };

    observer.observe(target, config);

    document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
        if (e.target.outerText == "Next") {
            if (stage == 3)
                settings.stats.countManSkip++

            if (e.shiftKey && !local.ips.includes(remoteIP.innerText)) {
                syncBlackList()
            }
        }
    })

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

    async function detectGender() {
        if (!settings.skipMale && !settings.skipFemale && !settings.enableFaceApi)
            return
        let stop = false
        let skip_m = false
        let skip_f = false
        let text = ''
        if (stage == 3) {
            console.time("faceapi: detectAllFaces()")

            clearInterval(tim)

            array = await faceapi.detectAllFaces(document.getElementById('remote-video'), new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

            for (var i = 0; i < array.length; i++) {
                text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
                if (array[i].gender == "male" && (array[i].genderProbability * 100).toFixed(0) > 90) {
                    skip_m = true
                    stop = true
                    settings.stats.countMales++
                }
                if (array[i].gender == "female" && (array[i].genderProbability * 100).toFixed(0) > 90) {
                    skip_f = true
                    stop = true
                    settings.stats.countFemales++
                }
            }

            if (skip_m && settings.skipMale) {
                text += `<b>male skipping...</b></br>`
                document.getElementsByClassName('buttons__button start-button')[0].click()
                console.log("MALE SKIPPED")
                settings.stats.countMaleSkip++
                settings.stats.countManSkip--

                if (settings.skipSound)
                    male.play()

                if (settings.autoBan) {
                    syncBlackList()
                }
            }

            if (skip_f && settings.skipFemale) {
                text += `<b>female skipping...</b></br>`
                document.getElementsByClassName('buttons__button start-button')[0].click()
                console.log("FEMALE SKIPPED")
                settings.stats.countFemaleSkip++
                settings.stats.countManSkip--

                if (settings.skipSound)
                    female.play()

                if (settings.autoBan) {
                    syncBlackList()
                }
            }

            if (text != '')
                remoteFace.innerHTML = text

            console.timeEnd("faceapi: detectAllFaces()")
        }
        if (!stop)
            tim = setTimeout(detectGender, 500)
    }

    if (settings.skipMale || settings.skipFemale || settings.enableFaceApi) {
        setTimeout(async () => {
            console.time("faceapi: loading models")
            await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.extension.getURL('/models'))
            await faceapi.nets.ageGenderNet.loadFromUri(chrome.extension.getURL('/models'))
            console.timeEnd("faceapi: loading models")

            console.time("faceapi: initial facedetect")
            remoteFace.innerHTML = chrome.i18n.getMessage("initialFaceDetect")
            let tempImage = document.createElement('img')
            tempImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
            await faceapi.detectAllFaces(tempImage, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
            console.timeEnd("faceapi: initial facedetect")
            remoteFace.innerHTML = ""

            faceApiLoaded = true

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

    L.Icon.Default.imagePath = chrome.extension.getURL('js/leaflet/');

    map = L.map('mapid', { zoomControl: false }).setView([54.39554, 39.266102], 17);
    map.locate({ setView: true });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 18,
        attribution: '&copy; <a href="https://carto.com/">carto.com</a>'
    }).addTo(map);

    resize = false

    function resizemap() {
        mapid.style.height = $("#faceapiContent")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight + "px"
        remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"
        aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"

        settingsInfo.style.height = $("#settingsPanel")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"

        bansInfo.style.height = $("#bansPanel")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"
        statsInfo.style.height = $("#statsPanel")[0].offsetHeight - $(".tabs__caption")[0].offsetHeight - 4 + "px"
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
                resizemap()
            }, 1000)
        }
    }

    new ResizeObserver(outputsize).observe(document.getElementsByClassName("chat-container")[0])

    var targetNode = document.getElementById('remoteIPInfo');

    var config = { childList: true };

    var callback = function (mutationsList, observer) {
        let json = JSON.parse(remoteIPInfo.innerText)
        if (typeof marker !== 'undefined')
            map.removeLayer(marker)

        if (typeof circle !== 'undefined')
            map.removeLayer(circle)


        if (json.mobile) {
            circle = L.circle([json.lat, json.lon], 300000, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.2
            })

            map.setView(new L.LatLng(json.lat, json.lon), 5);
            marker = new L.Marker([json.lat, json.lon]);
        }
        else {
            circle = L.circle([json.lat, json.lon], 30000, {
                color: 'blue',
                fillColor: '#808080',
                fillOpacity: 0.1
            })

            map.setView(new L.LatLng(json.lat, json.lon), 13);
            marker = new L.Marker([json.lat, json.lon]);
        }
        map.addLayer(circle)
        map.addLayer(marker)
    };

    var observer2 = new MutationObserver(callback);

    observer2.observe(targetNode, config);

    var $div = $("#remote-video-wrapper");
    var observer2 = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {

                if (stage == 3) {
                    settings.stats.time += parseInt((Date.now() - play) / 1000)
                }

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

                    settings.stats.countAll++
                } else if (attributeValue.includes("s-stop")) {
                    // offline.play()
                    clearInterval(tim)

                    remoteFace.innerHTML = ''

                    stage = 0
                    localStage.innerText = 0
                }

                updStats()
            }
        });
    });
    observer2.observe($div[0], {
        attributes: true
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace == "sync")
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

            case "skip_ban":
                if (!local.ips.includes(remoteIP.innerText)) {
                    syncBlackList()
                }

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

$(document).arrive(".ban-popup__unban_msg.tr", function (el) {
    Arrive.unbindAllArrive();
    console.dir(el)
    let new_el = $(el).clone()
    new_el.css('height', '30px');
    new_el.css('line-height', '26px');
    new_el[0].innerHTML = chrome.i18n.getMessage("avoidBan"),
        new_el.insertAfter(el)
});
