const s = document.createElement('script');
s.src = chrome.extension.getURL('injection/injection.js');
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);

const c = document.createElement('link');
c.rel = "stylesheet";
c.href = chrome.extension.getURL('libs/css/css-tooltip.min.css');
(document.head || document.documentElement).appendChild(c);

const cs = document.createElement('link');
cs.rel = "stylesheet";
cs.href = chrome.extension.getURL("libs/css/tooltipster.bundle.min.css");
(document.head || document.documentElement).appendChild(cs);


let settings = {},
    local = {ips: []},
    stage = 0,
    search = 0,
    found = 0,
    play = 0,
    map,
    countBeforeSaveStats = 0,
    tim,
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
                if ((stage === 2) && (found + 4000 < Date.now())) {
                    console.dir("Skipping due to loading time limit")
                    document.getElementsByClassName('buttons__button start-button')[0].click()
                }
            } catch (e) {
                //console.dir(e)
            }
        }
    }, 1000)

    if (settings.autoResume) {
        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                    if (mutation.attributeName === "class") {
                        if (mutation.target.className.includes("disabled")) {
                            $(".ok").removeClass("disabled")
                            document.getElementsByClassName("video-warning__btn")[0].firstElementChild.click()
                        }
                    }
                }
            )
        }).observe($(".ok")[0], {attributes: true});
    }

    if (settings.hotkeys) {
        document.removeEventListener('keyup', hotkeys)
        document.addEventListener('keyup', hotkeys)
    }

    controls = createControls()

    $(".gender-selector")[0].parentElement.remove()

    buttons = $(".buttons")[0]
    chat = $(".chat")[0]

    $(controls).insertBefore(".chat");

    $('.tooltip').tooltipster({maxWidth: 300, distance: -2})

    if (settings.doNotReflect) {
        $("#local-video").removeClass("video-container-local-video")
    }

    if (settings.hideCamera) {
        $("#local-video-wrapper")[0].style.display = "none"
    }

    if (settings.risky) {
        if (settings.mirror || settings.mirrorAlt || settings.prikol) {
            if (settings.prikol) {
                const prikolV = document.createElement('video');
                prikolV.id = "prikol"
                prikolV.loop = "loop"
                prikolV.autoplay = "autoplay"
                prikolV.muted = true
                prikolV.src = chrome.extension.getURL('resources/prikol.mp4');
                prikolV.onload = () => s1.remove();

                header.appendChild(prikolV);
            }

            const s1 = document.createElement('script');
            s1.src = chrome.extension.getURL('injection/mirror.js');
            s1.onload = () => s1.remove();
            (document.head || document.documentElement).appendChild(s1);
        }

        if (settings.ws) {
            const wss = document.createElement('script');
            wss.src = chrome.extension.getURL('injection/ws.js');
            wss.onload = () => wss.remove();
            (document.head || document.documentElement).appendChild(wss);
        }
    }

    if (settings.streamer) {
        if (settings.blurReport)
            document.getElementById("report-screen").style.filter = "blur(10px)"

        if (settings.cover || settings.coverPreview || settings.coverNoise) {
            $(createElement('img', {
                src: settings.coverSrc,
                id: "cover",
                style: "height:100%; position: absolute;"
            })).insertBefore("#remote-video")

            $(createElement('img', {
                src: settings.coverSrc,
                id: "cover2",
                style: "height:100%; position: absolute; transform: scaleX(-1)"
            })).insertBefore("#local-video")

            if (settings.coverPreview)
                $(".remote-video__preview")[0].style.display = "none"

            if (settings.coverNoise) {
            }
            $(".remote-video__noise")[0].style.display = "none"
        }

        const nsfwjs = document.createElement('script');
        nsfwjs.src = chrome.extension.getURL('libs/js/nsfwjs.min.js');
        nsfwjs.onload = () => {
            nsfwjs.remove()
            const nsfw = document.createElement('script');
            nsfw.src = chrome.extension.getURL('injection/nsfw.js');
            nsfw.onload = () => nsfw.remove();
            (document.head || document.documentElement).appendChild(nsfw);
        };
        (document.head || document.documentElement).appendChild(nsfwjs);
    }

    const target = document.querySelector('#remoteIP');
    const observer = new MutationObserver(function (mutations) {
        if (local.ips.includes(target.innerText)) {
            settings.stats.countDup++
            console.dir("old ip")
            if (settings.skipSound)
                ban.play()
            document.getElementsByClassName('buttons__button stop-button')[0].click()
            setTimeout(() => {
                document.getElementsByClassName('buttons__button start-button')[0].click()
            }, 250)
            //document.getElementsByClassName('buttons__button start-button')[0].click()
        } else {
            settings.stats.countNew++
            console.dir("new ip")
        }
    });

    var config = {attributes: true, childList: true, characterData: true};

    observer.observe(target, config);


    male = new Audio(chrome.extension.getURL('resources/audio/male.mp3'))
    ban = new Audio(chrome.extension.getURL('resources/audio/ban.mp3'))
    female = new Audio(chrome.extension.getURL('resources/audio/female.mp3'))

    skip = document.createElement("AUDIO");
    skip.id = "skip"
    skip.src = chrome.extension.getURL('resources/audio/skip.mp3')
    document.body.appendChild(skip)

    male.volume = 0.3
    ban.volume = 0.45
    female.volume = 0.3
    skip.volume = 0.3
    // online.volume = 0.1
    // offline.volume = 0.1

    function syncBlackList() {
        if (settings.dontBanMobile) {
            if (!JSON.parse(remoteIPInfo.innerText).mobile) {
                local.ips.push(remoteIP.innerText)
                chrome.storage.local.set({"ips": local.ips});

                if (settings.skipSound)
                    male.play()
            }
        } else {
            local.ips.push(remoteIP.innerText)
            chrome.storage.local.set({"ips": local.ips});

            if (settings.skipSound)
                male.play()
        }
    }

    async function detectGender() {
        if (!settings.skipMale && !settings.skipFemale && !settings.enableFaceApi)
            return
        let stop = false
        let skip_m = false
        let skip_f = false
        let text = ''
        if (stage === 3) {
            console.time("faceapi: detectAllFaces()")

            clearInterval(tim)

            array = await faceapi.detectAllFaces(document.getElementById('remote-video'), new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

            for (let i = 0; i < array.length; i++) {
                text += `<b>* ${array[i].gender} (${(array[i].genderProbability * 100).toFixed(0) + '%'}), ${(array[i].age).toFixed(0)}</b></br>`
                if (array[i].gender === "male" && (array[i].genderProbability * 100).toFixed(0) > 90) {
                    skip_m = true
                    stop = true
                    settings.stats.countMales++
                }
                if (array[i].gender === "female" && (array[i].genderProbability * 100).toFixed(0) > 90) {
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

                if (settings.autoBan) {
                    syncBlackList()
                }
            }

            if (text !== '')
                remoteFace.innerHTML = text

            console.timeEnd("faceapi: detectAllFaces()")
        }
        if (!stop)
            tim = setTimeout(detectGender, 500)
    }

    document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e) => {
        if (stage === 3)
            settings.stats.countManSkip++

        if (e.shiftKey && !local.ips.includes(remoteIP.innerText)) {
            syncBlackList()
        }
    })

    if (settings.skipMale || settings.skipFemale || settings.enableFaceApi) {
        setTimeout(async () => {
            console.time("faceapi: loading models")
            await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.extension.getURL('resources/models'))
            await faceapi.nets.ageGenderNet.loadFromUri(chrome.extension.getURL('resources/models'))
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


    $.getJSON("http://ip-api.com/json/", {
        lang: chrome.i18n.getMessage("@@UI_locale").slice(0, 2),
        fields: "status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
    })
        .done(function (json) {
            remoteInfo.innerHTML = chrome.i18n.getMessage("api_working")
        })
        .fail(function (jqxhr, textStatus, error) {
            if (error === "") {
                remoteInfo.innerHTML = chrome.i18n.getMessage("api_insecure")
            } else {
                const err = textStatus + ", " + error;
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

    L.Icon.Default.imagePath = chrome.extension.getURL('libs/js/leaflet/');

    map = L.map('mapid', {zoomControl: false}).setView([54.39554, 39.266102], 17);
    map.locate({setView: true});

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
            }, 500)
        }
    }

    new ResizeObserver(outputsize).observe(document.getElementsByClassName("chat-container")[0])

    const targetNode = document.getElementById('remoteIPInfo');

    const callback = function (mutationsList, observer) {
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
        } else {
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

    observer2.observe(targetNode, {childList: true});

    const $div = $("#remote-video-wrapper");
    var observer3 = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {

                if (stage === 3) {
                    settings.stats.time += parseInt((Date.now() - play) / 1000)
                }

                const attributeValue = $(mutation.target).prop(mutation.attributeName);
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

                updStats(false)
            }
        });
    });
    observer3.observe($div[0], {
        attributes: true
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync")
        chrome.storage.sync.get(null, function (result) {
            settings = result;
        });
});

$(document).arrive(".ban-popup__unban_msg.tr", function (el) {
    Arrive.unbindAllArrive();
    let new_el = $(el).clone()
    new_el.css('height', '30px');
    new_el.css('line-height', '26px');
    new_el[0].innerHTML = chrome.i18n.getMessage("avoidBan")
    new_el.insertAfter(el)
});
