import $ from "jquery";
import * as DOMPurify from "dompurify";
import Swal from "sweetalert2";
import * as utils from "../../utils/utils";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {mapModule} from "./content-module-controls-map";
import * as SDPUtils from "sdp";
import {getPlatform} from "../../utils/utils";


export function injectIpGrabber() {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injection/ip-api.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}


export class GeolocationModule {
    private static instanceRef: GeolocationModule;
    public curIps: string[] = []
    public static defaults = {
        ipApiLocalisation: true,
        hideMobileLocation: true,
        showCT: false,
        showMoreEnabledByDefault: true,
        skipMobileTarget: true,
        enableTargetCity: false,
        enableTargetRegion: false,
        targetCity: "Moscow",
        targetRegion: "Moscow",
        targetSound: false,
        torrentsEnable: false,
        torrentsInfo: true,
        showISP: false
    }
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsGeolocation")
        },
        {
            type: "checkbox",
            important: false,
            key: "ipApiLocalisation",
            text: chrome.i18n.getMessage("apiLocalisation"),
            tooltip: chrome.i18n.getMessage("tooltipApiLocalisation")
        },
        {
            type: "br"
        },
        {
            type: "checkbox",
            important: false,
            key: "hideMobileLocation",
            text: chrome.i18n.getMessage("hideMobile"),
            tooltip: chrome.i18n.getMessage("tooltipHideMobile")
        },
        {
            type: "checkbox",
            important: false,
            key: "showCT",
            text: chrome.i18n.getMessage("showCT"),
            tooltip: chrome.i18n.getMessage("tooltipShowCT")
        },
        {
            type: "br"
        },
        {
            type: "checkbox",
            important: false,
            key: "showMoreEnabledByDefault",
            text: chrome.i18n.getMessage("showMoreInfo"),
            tooltip: chrome.i18n.getMessage("tooltipShowMoreInfo")
        },
        {
            type: "checkbox",
            important: false,
            key: "showISP",
            text: chrome.i18n.getMessage("showISP"),
            tooltip: chrome.i18n.getMessage("tooltipShowISP")
        },
        {
            type: "br"
        },
        {
            type: "checkbox",
            important: false,
            key: "enableTargetCity",
            text: chrome.i18n.getMessage("targetCity"),
            tooltip: chrome.i18n.getMessage("tooltipTargetCity"),
            controlsSection: "targetCityDiv",
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("enableTargetCity"),
            sectionId: "targetCityDiv",
            children: [
                {
                    type: "button",
                    text: chrome.i18n.getMessage("prefixTargetCity") + globalThis.platformSettings.get("targetCity"),
                    onclick: (e: MouseEvent) => {
                        const result = prompt(chrome.i18n.getMessage("promptTargetCity"), globalThis.platformSettings.get("targetCity"))
                        if (result) {
                            // TODO: test this
                            globalThis.platformSettings.setBack({"targetCity": result}, function () {
                                (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                            });

                            // chrome.storage.sync.set({"targetCity": result}, function () {
                            //     (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                            // });
                        }
                    }
                }
            ]
        },
        {
            type: "checkbox",
            important: false,
            key: "enableTargetRegion",
            text: chrome.i18n.getMessage("targetRegion"),
            tooltip: chrome.i18n.getMessage("tooltipTargetRegion"),
            controlsSection: "targetRegionDiv",
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("enableTargetRegion"),
            sectionId: "targetRegionDiv",
            children: [
                {
                    type: "button",
                    text: chrome.i18n.getMessage("prefixTargetRegion") + globalThis.platformSettings.get("targetRegion"),
                    onclick: (e: MouseEvent) => {
                        const result = prompt(chrome.i18n.getMessage("promptTargetRegion"), globalThis.platformSettings.get("targetRegion"))
                        if (result) {
                            // TODO: test this
                            globalThis.platformSettings.setBack({"targetRegion": result}, function () {
                                (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                            })

                            // chrome.storage.sync.set({"targetRegion": result}, function () {
                            //     (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                            // });
                        }
                    }
                }
            ]
        },
        {
            type: "br"
        },
        {
            type: "checkbox",
            important: false,
            key: "skipMobileTarget",
            text: chrome.i18n.getMessage("targetSkipMobile"),
            tooltip: chrome.i18n.getMessage("tooltipTargetSkipMobile")
        },
        {
            type: "checkbox",
            important: false,
            key: "targetSound",
            text: chrome.i18n.getMessage("targetSound"),
            tooltip: chrome.i18n.getMessage("tooltipTargetSound")
        },
        {
            type: "br"
        },
        {
            type: "checkbox",
            important: false,
            key: "torrentsEnable",
            text: chrome.i18n.getMessage("torrentsEnable"),
            tooltip: chrome.i18n.getMessage("tooltipTorrentsEnable")
        },
        {
            type: "checkbox",
            important: false,
            key: "torrentsInfo",
            text: chrome.i18n.getMessage("torrentsInfo"),
            tooltip: chrome.i18n.getMessage("tooltipTorrentsInfo")
        }
    ]
    public curInfo: { [key: string]: { [key: string]: string } } = {};
    public tabs: any = []
    private driver: ChatruletkaDriver;
    private rmdaddr = "0.0.0.0"
    private api: number = 0;
    private torrenstsConfirmed = false;
    private started: number = 0;
    private targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.targetSound.volume = 0.5
        this.createTabs()
    }

    static initInstance(driver: ChatruletkaDriver): GeolocationModule {
        if (GeolocationModule.instanceRef === undefined) {
            GeolocationModule.instanceRef = new GeolocationModule(driver);
        }

        return GeolocationModule.instanceRef;
    }

    public injectIpEventListener() {
        window.addEventListener("[object Object]", (evt) => {
            let candidate: any = (<CustomEvent>evt).detail.candidate

            let parsedCandidate = SDPUtils.parseCandidate(JSON.parse(candidate).candidate)

            if (parsedCandidate.type === "srflx" && parsedCandidate.address) {
                console.dir("IP: " + parsedCandidate.address)
                if (this.rmdaddr !== parsedCandidate.address) {
                    this.rmdaddr = parsedCandidate.address;
                    console.dir("IP CHANGED")
                    this.onNewIP(this.rmdaddr)
                }
            }
        }, false);
    }

    public checkApi() {
        chrome.runtime.sendMessage({aremoteIP: "1.1.1.1", language: "en"}, (response) => {
            if (response.status === 200) {
                this.api = 2;
                (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + chrome.i18n.getMessage("main", [this.driver.site.text])

                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    this.driver.modules.controls.resizemap(false)
                }
                console.dir(`ip-api.com test passed: ${response.status}`)
            } else if (response.status === 429) {
                (document.getElementById("apiStatus") as HTMLElement).innerHTML = '';
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus429") + "</br></br>" + chrome.i18n.getMessage("main", [this.driver.site.text])
                this.api = 2;

                console.dir(`ip-api.com test passed: ${response.status}`)
            } else {
                this.api = 0
                console.dir(`ip-api.com test failed: ${response.status} ${response.body}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + response.status);

                (document.getElementById("apiStatus") as HTMLElement).innerHTML = DOMPurify.sanitize('<b>ERROR: ' + response.status + ' || </b>' + chrome.i18n.getMessage("apiStatus0"));
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("main", [this.driver.site.text])
                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    this.driver.modules.controls.resizemap(false)
                }
            }
        })
    }

    public onNewIP = (newIp: string) => {
        // TODO: validate ip address
        newIp = newIp.replace("[", "").replace("]", "")

        if (this.curIps.includes(newIp)) {
            return
        }

        console.dir("IP CHANGE DETECTED")
        if (this.driver.modules.blacklist.isIpInBlacklist(newIp)) {
            if (this.driver.modules.stats) {
                this.driver.modules.stats.increaseCountDup()
            }
            console.dir("old ip")
            this.driver.modules.blacklist.playBanSound()
            this.driver.stopAndStart()
        } else {
            this.curIps.push(newIp)
            console.dir(this.curIps)
            if (this.driver.modules.stats) {
                this.driver.modules.stats.increaseCountNew()
            }
            console.dir("new ip")
            switch (this.api) {
                case 2:
                    this.doLookupRequest2(newIp)
                    break;
                default:
                    break;
            }
        }
    }

    public doLookupRequest2(ip: string) {
        chrome.runtime.sendMessage({aremoteIP: ip, language: this.getApiLanguage()}, (response) => {
            console.dir(`ip-api.com returned ${response.status} (${response.body.status}) for '${ip}'`)

            if (response.status === 200) {
                this.processData(response.body, ip)
            } else if (response.status === 429) {
                if (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion")) {
                    this.driver.stopAndStart(5000)
                } else {
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = '<div id="ipApiContainer" style="display:flex; flex-direction:row"><div>' + chrome.i18n.getMessage("apiStatus429")
                    let button = utils.createElement('button', {
                        innerText: chrome.i18n.getMessage('apiTryAgainButton'),
                        onclick: () => {
                            this.curIps.forEach(ip => this.doLookupRequest2(ip))
                        }
                    })
                    $("<br>").appendTo(document.getElementById("remoteInfo")!)
                    $("<br>").appendTo(document.getElementById("remoteInfo")!)
                    $(button).appendTo(document.getElementById("remoteInfo")!)
                }
            } else {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize("<b>HTTP ERROR " + response.status + "</b>")
                if (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion")) {
                    if (response.status === 429) {
                        this.driver.stopAndStart(5000)
                    }
                }
            }
        });
    }

    public checkTorrents(ip: string) {
        if (globalThis.platformSettings.get("torrentsEnable")) {
            if (this.torrenstsConfirmed || !globalThis.platformSettings.get("torrentsInfo")) {
                let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
                chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                    console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
                });
            } else {
                Swal.fire({
                    title: 'iknowwhatyoudownload',
                    heightAuto: false,
                    showCancelButton: true,
                    confirmButtonText: chrome.i18n.getMessage("YKWYDConfirmButtonText"),
                    cancelButtonText: chrome.i18n.getMessage("YKWYDCancelButtonText"),
                    html: chrome.i18n.getMessage("YKWYDHtml"),
                    reverseButtons: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.torrenstsConfirmed = true;
                        let url = `https://iknowwhatyoudownload.com/${chrome.i18n.getMessage("iknowwhatyoudownload_lang")}/peer/?ip=${ip}`
                        chrome.runtime.sendMessage({checkTorrents: true, url: url}, function (response) {
                            console.dir(`request to open iknowwhatyoudownload in the new tab/window: ${response}`)
                        });
                    }
                })
            }
        }
    }

    public processData(json: any, ip: string) { // TODO: fix type
        if (!this.curIps.includes(ip)) {
            return
        }

        this.curInfo[ip] = json
        this.started = Date.now()
        let strings = []
        let newInnerHTML = ''
        let newIpDiv = utils.createElement('div')
        if (globalThis.platformSettings.get("showMoreEnabledByDefault") && (json.mobile || json.proxy || json.hosting)) {
            if (json.mobile) {
                if (globalThis.platformSettings.get("hideMobileLocation") || globalThis.platformSettings.get("showCT")) {
                    if (!globalThis.platformSettings.get("showCT")) {
                        strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobileHidden')}]</small>`)
                    } else {
                        strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobile')}]</small>`)
                    }
                } else {
                    strings.push(`<small>MOBILE [${chrome.i18n.getMessage('apiMobile')}]</small>`)
                }
            }
            if (json.proxy && json.hosting) {
                strings.push(`<small>PROXY+HOSTING [${chrome.i18n.getMessage('apiProxy')}]</small>`)
            } else {
                if (json.proxy)
                    strings.push(`<small>PROXY [${chrome.i18n.getMessage('apiProxy')}]</small>`)
                if (json.hosting)
                    strings.push(`<small>HOSTING [${chrome.i18n.getMessage('apiHosting')}]</small>`)
            }
        }

        if ((globalThis.platformSettings.get("hideMobileLocation") || globalThis.platformSettings.get("showCT")) && json.mobile) {
            newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br></br>"

            if (globalThis.platformSettings.get("showCT")) {
                newInnerHTML += chrome.i18n.getMessage("apiCT") + `${json.city}/${json.regionName}</br>`
                try {
                    newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
                } catch {
                    newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + "???" + "</sup>) </br>"
                }
            } else {
                newInnerHTML += "<br><br><br>"
            }
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms((+new Date() - this.started) / 1000) + "</sup>"

        } else {
            newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br>"

            newInnerHTML += "</br>" +
                chrome.i18n.getMessage("apiCity") + json.city + " (" + json.region + ") </br>" +
                chrome.i18n.getMessage("apiRegion") + json.regionName + "</br>"
            try {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
            } catch {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ'>" + json.timezone + "</sup> (<sup class = 'remoteTime'>" + "???" + "</sup>) </br>"
            }
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms((+new Date() - this.started) / 1000) + "</sup>"
        }

        if (globalThis.platformSettings.get("showISP")) {
            newInnerHTML += `<br><small style="font-size: x-small!important;"><b>${json.isp}</b></small>`
        }

        if (strings.length > 0)
            newInnerHTML += "</br>" + strings.join('<small> || </small>')


        newIpDiv.innerHTML += DOMPurify.sanitize(newInnerHTML)
        if (this.driver.needToClear) {
            this.driver.needToClear = false
            $(document.getElementById("ipApiContainer") as HTMLElement).parent().children(':not(#ipApiContainer)').remove()
            $(document.getElementById("ipApiContainer") as HTMLElement).children().remove();
        }
        $(newIpDiv).appendTo(document.getElementById("ipApiContainer") as HTMLElement)
        console.dir("RENDER ++")

        if (globalThis.platformSettings.get("torrentsEnable") && !json.mobile && !json.proxy && !json.hosting) {
            newIpDiv.innerHTML += `<br><br>`
            $(utils.createElement('button', {
                innerHTML: "<b>" + chrome.i18n.getMessage("YKWYDButtonText") + "</b>",
                onclick: () => {
                    this.checkTorrents(DOMPurify.sanitize(json.query))
                }
            })).appendTo(newIpDiv)
        }

        if ((globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion")) && this.driver.needToCheckTarget) {
            if (globalThis.platformSettings.get("skipMobileTarget") && json.mobile) {
                if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                    this.driver.stopAndStart()
                }
                return
            } else {
                if (globalThis.platformSettings.get("enableTargetCity")) {
                    if (!globalThis.platformSettings.get("targetCity").includes(json.city)) {
                        if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                            console.dir("SKIPPING WRONG CITY")
                            this.driver.stopAndStart()
                        }
                        return
                    } else {
                        this.driver.needToCheckTarget = false
                        if (globalThis.platformSettings.get("targetSound")) {
                            // TODO: does not work in firefox
                            this.targetSound.play();
                            console.dir(`FOUND TARGET CITY: ${globalThis.platformSettings.get("targetCity")}`)
                        }
                    }
                }
                if (globalThis.platformSettings.get("enableTargetRegion")) {
                    if (!globalThis.platformSettings.get("targetRegion").includes(json.regionName)) {
                        if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                            this.driver.stopAndStart()
                        }
                        return
                    } else {
                        this.driver.needToCheckTarget = false
                        if (globalThis.platformSettings.get("targetSound")) {
                            // TODO: does not work in firefox
                            (this.targetSound).play();
                            console.dir(`FOUND TARGET REGION: ${globalThis.platformSettings.get("targetRegion")}`)
                        }
                    }
                }
            }
        }

        if (this.tabs[1].map && $(this.tabs[1].tab).hasClass("active"))
            this.tabs[1].map.updateMap(this.curInfo)

        return true
    }

    public startTimer() {
        setInterval(() => {
            if (document.getElementsByClassName("remoteTM").length > 0) {
                if (this.driver.stage === 4) {
                    for (let el of document.getElementsByClassName("remoteTM") as HTMLCollectionOf<HTMLElement>) {
                        el.innerText = utils.secondsToHms((+new Date() - this.started) / 1000)
                    }
                }
            }
            if (document.getElementsByClassName("remoteTZ").length > 0 && document.getElementsByClassName("remoteTime").length > 0) {
                for (let el of document.getElementsByClassName("remoteTime") as HTMLCollectionOf<HTMLElement>) {
                    try {
                        el.innerText = new Date().toLocaleTimeString("ru", {timeZone: $(el).parent().find('.remoteTZ')[0].innerText}).slice(0, -3)
                    } catch {
                        el.innerText = "???"
                    }
                }
            }
        }, 1000)
    }

    protected createTabs() {
        this.tabs[0] = ControlsTabApi.initInstance(this.driver, this)
        this.tabs[1] = ControlsTabMap.initInstance(this.driver, this)
    }

    // https://ip-api.com/docs/api:json#:~:text=DEMO-,Localization,-Localized%20city%2C
    private getApiLanguage() {
        if (!globalThis.platformSettings.get("ipApiLocalisation")) return "en"
        let lang = window.navigator.language.slice(0, 2)
        if (lang === "pt") {
            lang = "pt-BR"
        } else if (lang == "zh") {
            lang = "zh-CN"
        }
        return lang
    }
}

export class ControlsTabApi {
    private static instanceRef: ControlsTabApi;
    public name = chrome.i18n.getMessage("tab1")
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 5
    private driver: ChatruletkaDriver;
    private module: any
    private reviewLinkContainer: JQuery<HTMLElement>;

    private constructor(driver: ChatruletkaDriver, module?: any) {
        this.driver = driver
        this.module = module
        this.tab = this.getTabHTML()
        this.content = this.getContentHTML()

        this.reviewLinkContainer = this.getReviewLink()
        let self = this
        document.arrive("#reviewImageContainer", {existing: true}, function (el) {
            self.reviewLinkContainer.appendTo(el)
        })
    }

    static initInstance(driver: ChatruletkaDriver, module?: any): ControlsTabApi {
        if (ControlsTabApi.instanceRef === undefined) {
            ControlsTabApi.instanceRef = new ControlsTabApi(driver, module);
        }

        return ControlsTabApi.instanceRef;
    }

    public handleResize() {

    }

    public handleTabClick() {

    }

    protected getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    protected getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content active controls__row",
            id: "apiInfoContent",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                id: "remoteFace",
            }),
            utils.createElement('div', {
                id: "streamerStatus",
                // style: "display: none;"
            }),
            utils.createElement('div', {
                id: "apiStatus",
                style: "margin-top: 3px"
            }),
            utils.createElement('div', {
                id: "remoteInfo",
                style: "overflow-y: auto;margin-top: 3px"
            })
        ])
    }

    private getReviewLink() {
        return $(utils.createElement('a', {
                target: "_blank",
                style: "margin-left: 3px; text-decoration: none !important;",
                href: function f() {
                    switch (getPlatform()) {
                        case "chrome":
                            return "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi/reviews"
                        case "edge":
                            return "https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn"
                        case "firefox":
                            return "https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/reviews"
                    }
                }()
            }, [
                utils.createElement('img', {
                    src: function f() {
                        switch (getPlatform()) {
                            case "chrome":
                                return `https://img.shields.io/chrome-web-store/stars/alchldmijhnnapijdmchpkdeikibjgoi?label=${chrome.i18n.getMessage('mainReviewLabelChrome')}&logo=${chrome.i18n.getMessage('mainReviewLogoChrome')}&style=plastic`
                            case "edge":
                                // no stars from shields.io for edge yet, using cws rating to show stars as I don't expect a lot of edge enjoyers
                                return `https://img.shields.io/chrome-web-store/stars/alchldmijhnnapijdmchpkdeikibjgoi?label=${chrome.i18n.getMessage('mainReviewLabelEdge')}&logo=${chrome.i18n.getMessage('mainReviewLogoEdge')}&style=plastic`
                            case "firefox":
                                return `https://img.shields.io/amo/stars/videochat-extension-ip-locator?label=${chrome.i18n.getMessage('mainReviewLabelFirefox')}&logo=${chrome.i18n.getMessage('mainReviewLogoFirefox')}&style=plastic`
                        }
                    }()
                })
            ]
        ))
    }
}

export class ControlsTabMap {
    private static instanceRef: ControlsTabMap;
    public name = chrome.i18n.getMessage("tab2")
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 0
    public map: mapModule;
    private driver: ChatruletkaDriver;
    private module: any;

    private mapContainer: HTMLElement;

    private constructor(driver: ChatruletkaDriver, module?: any) {
        this.driver = driver
        this.module = module
        this.tab = this.getTabHTML()

        this.mapContainer = utils.createElement('div', {
            id: "mapid",
            style: "width: 100%; margin-top: 1px;"
        })
        this.map = new mapModule(this.mapContainer)
        this.content = this.getContentHTML()
    }

    static initInstance(driver: ChatruletkaDriver, module?: any): ControlsTabMap {
        if (ControlsTabMap.instanceRef === undefined) {
            ControlsTabMap.instanceRef = new ControlsTabMap(driver, module);
        }

        return ControlsTabMap.instanceRef;
    }

    public handleResize() {
        this.map.map.invalidateSize()
        this.mapContainer.style.height = parseInt(this.mapContainer.style.height) - 2 + "px"
    }

    public handleTabClick() {
        if (this.map && $(this.tab).hasClass("active"))
            this.map.updateMap(this.module.curInfo)
    }

    protected getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name,
            id: "mapTabButton",
        })
    }

    protected getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "faceapiContent",
            style: "height:100%;"
        }, [
            this.mapContainer
        ])
    }
}