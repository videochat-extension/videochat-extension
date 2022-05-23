function createStyle() {
    return createElement('style', {
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
              }
              
              dd {
                margin-inline-start: 20px!important;
              }
              
              input {
                margin-left: 5px!important;
              }
              
              p {
                display: inline-block;
              }
              `
    })
}

function createTabs() {
    return createElement('ul', {
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
            innerText: chrome.i18n.getMessage("tabBans")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tabStats")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tab3")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tab4")
        })
    ])
}

function createControls() {
    return createElement('div', {
        className: 'chat',
        id: 'controls',
        style: "width:350px; margin-right: calc(100vh / 768 * 10);"
    }, [
        createElement('div', {
            className: "tabs chat"
        }, [
            createStyle(),
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
            createHeader(),
            createTabs(),
            createTabApi(),
            createTabMap(),
            createTabBans(),
            createTabStats(),
            createTabSettings(),
            createTabAbout(),
        ])
    ])
}

function injectInterface() {
    controls = createControls()
    $(".gender-selector")[0].parentElement.remove()

    $(controls).insertBefore(".chat");

    $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');

        if (this.innerText === chrome.i18n.getMessage("tab3")) {
            resizemap(true)
        } else {
            resizemap()
        }
    });

    $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

    L.Icon.Default.imagePath = chrome.extension.getURL('libs/js/leaflet/');

    if (language === "ru") {
        map = L.map('mapid', {zoomControl: false}).setView([54.39554, 39.266102], 17);
    } else {
        map = L.map('mapid', {zoomControl: false}).setView([47.75409, 12.832031], 3);
    }

    map.locate({setView: true});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 18,
        attribution: '&copy; <a href="https://carto.com/">carto.com</a>'
    }).addTo(map);


    male = new Audio(chrome.extension.getURL('resources/audio/male.mp3'))
    ban = new Audio(chrome.extension.getURL('resources/audio/ban.mp3'))
    targetSound = new Audio(chrome.extension.getURL('resources/audio/found.mp3'))

    male.volume = 0.3
    ban.volume = 0.45
    targetSound.volume = 0.5
}

let videoContainerHeight = 0, chatContainerHeight = 0

function resizemap(extend) {
    if (extend && settings.expand) {
        let newVideoContainerHeight = parseFloat(document.getElementById("video-container").style.height)
        let newChatContainerHeight = parseFloat(document.getElementsByClassName("chat-container")[0].style.height)

        if (newVideoContainerHeight !== (newVideoContainerHeight + newChatContainerHeight) / 2) {
            videoContainerHeight = parseFloat(document.getElementById("video-container").style.height)
            chatContainerHeight = parseFloat(document.getElementsByClassName("chat-container")[0].style.height)

            document.getElementById("video-container").style.height = (videoContainerHeight + chatContainerHeight) / 2 + "px"
            document.getElementsByClassName("chat-container")[0].style.height = (videoContainerHeight + chatContainerHeight) / 2 + "px"
        }
    } else {
        if (videoContainerHeight !== 0 && chatContainerHeight !== 0) {
            document.getElementById("video-container").style.height = videoContainerHeight + "px"
            document.getElementsByClassName("chat-container")[0].style.height = chatContainerHeight + "px"
        }
    }

    let tabs = $(".tabs__caption")[0]

    mapid.style.height = $("#faceapiContent")[0].offsetHeight - tabs.offsetHeight + "px"
    mapid.style.height = $("#faceapiContent")[0].offsetHeight - tabs.offsetHeight + "px"

    remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $("#apiStatus")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    remoteInfo.style.height = $("#apiInfoContent")[0].offsetHeight - $("#apiStatus")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    aboutInfo.style.height = $("#aboutPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    settingsInfo.style.height = $("#settingsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    settingsInfo.style.height = $("#settingsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    bansInfo.style.height = $("#bansPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    bansInfo.style.height = $("#bansPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"

    statsInfo.style.height = $("#statsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    statsInfo.style.height = $("#statsPanel")[0].offsetHeight - tabs.offsetHeight - 5 + "px"
    map.invalidateSize()
}

function outputsize() {
    videoContainerHeight = 0
    chatContainerHeight = 0

    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
        resizemap(true)
    } else {
        resizemap()
    }

    if (!resize) {
        resize = true
        setTimeout(() => {
            let mar = parseInt(window.getComputedStyle(controls).marginRight)
            buttons.style.width = (parseInt(buttons.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
            chat.style.width = (parseInt(chat.style.width) - (parseInt(controls.style.width) + mar) / 2) + "px"
            resize = false
            if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
                resizemap(true)
            } else {
                resizemap()
            }
        }, 100)
    }
}
