function createTabAbout() {
    return createElement('div', {
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
                createElement('span', {}, [
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important",
                        href: "https://discord.gg/YZKnbKGWen"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/discord/925632108150530108?label=support&logo=discord"
                        }),
                    ]),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-left: 3px",
                        href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi/reviews"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/chrome-web-store/rating/alchldmijhnnapijdmchpkdeikibjgoi?label=rating"
                        }),
                    ]),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-left: 3px",
                        href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/chrome-web-store/users/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20users"
                        }),
                    ]),
                ]),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    innerHTML: chrome.i18n.getMessage("github"),
                }),
                createElement('br'),
                createElement('br'),
                createElement('span', {
                    style: "margin-top: 10px"
                }, [
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important",
                        href: "https://t.me/videochatru_extension_ru"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/badge/dynamic/json?label=Новости&query=result&suffix=%20Subscribers&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_extension_ru"
                        }),
                    ]),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-left: 3px",
                        href: "https://t.me/videochatru_chat_ru"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/badge/dynamic/json?label=Чат&query=result&suffix=%20Members&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_chat_ru"
                        }),
                    ]),
                    createElement('br'),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important",
                        href: "https://t.me/videochatru_extension"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/badge/dynamic/json?label=News%20EN&query=result&suffix=%20Subscribers&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_extension"
                        }),
                    ]),
                    createElement('a', {
                        target: "_blank",
                        style: "text-decoration: none!important; margin-left: 3px",
                        href: "https://t.me/videochatru_chat"
                    }, [
                        createElement('img', {
                            src: "https://img.shields.io/badge/dynamic/json?label=Chat&query=result&suffix=%20Members&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_chat"
                        }),
                    ]),
                ]),
                createElement('br'),
                createElement('br'),
                createElement('dl', {},
                    [
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("author")
                        }),
                        createElement('dd', {}, [
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
                            innerText: "kryzh"
                        }),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("inspired"),
                        }),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/unixpickle/camera-hijack",
                                innerText: "camera-hijack",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
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
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://jquery.com/",
                                innerText: "jquery",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/justadudewhohacks/face-api.js",
                                innerText: "face-api.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/uzairfarooq/arrive",
                                innerText: "arrive.js",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/infinitered/nsfwjs",
                                innerText: "nsfwjs",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/calebjacob/tooltipster",
                                innerText: "tooltipster",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: "<b>Css:</b>"
                        }),

                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://github.com/alterebro/css-tooltip",
                                innerText: "css-tooltip",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dt', {
                            innerHTML: chrome.i18n.getMessage("3rdparty")
                        }),

                        createElement('dd', {}, [
                            createElement('a', {
                                href: "https://ip-api.com/",
                                innerText: "ip-api",
                                style: "text-decoration: none!important;",
                                target: "_blank"
                            })
                        ]),
                        createElement('dd', {}, [
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
}