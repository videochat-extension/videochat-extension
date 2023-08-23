import $ from "jquery";
import * as DOMPurify from "dompurify";
import Swal from "sweetalert2";
import * as utils from "../../utils/utils";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {mapModule} from "./content-module-controls-map";
import * as SDPUtils from "sdp";
import {getUserBrowser} from "../../utils/utils";
import {OmegleDriver} from "../content-driver-omegle";


export function injectScript(path: string) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(path);
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}


export class GeolocationModule {
    public curIps: string[] = []
    public static defaults = {
        customApiBehaviour: false,
        allowVeApi: true,
        allowIpApi: true,
        allowGeoJs: true,
        ipApiLocalisation: true,
        ipApiPreferredLang: 'auto',
        hideMobileLocation: true,
        showCT: false,
        showMoreEnabledByDefault: true,
        filterIgnoreMobile: true,
        enableFilter: false,
        enableFilterCity: false,
        enableFilterRegion: false,
        enableFilterCountry: false,
        filterCity: "Enter city here",
        filterRegion: "Enter region here",
        filterCountry: "IN",
        skipMobileTarget: true,
        enableTarget: false,
        enableTargetCity: false,
        enableTargetRegion: false,
        enableTargetCountry: false,
        targetCity: "Enter city here",
        targetRegion: "Enter region here",
        targetCountry: "Entry country code here",
        targetSound: false,
        torrentsEnable: false,
        torrentsInfo: true,
        showISP: false,
    }
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsGeolocation")
        },

        {
            type: "checkbox",
            important: false,
            key: "customApiBehaviour",
            controlsSection: "providersSection",
            text: chrome.i18n.getMessage("customApiBehaviour"),
            tooltip: chrome.i18n.getMessage("tooltipCustomApiBehaviour"),
            enable: () => {
                this.apiProviders = this.getApiProviders()
            },
            disable: () => {
                this.apiProviders = this.getApiProviders()
            }
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("customApiBehaviour"),
            sectionId: "providersSection",
            children: [
                {
                    type: "checkbox",
                    important: false,
                    key: "allowVeApi",
                    text: chrome.i18n.getMessage("allowVeApi"),
                    tooltip: chrome.i18n.getMessage("tooltipAllowVeApi"),
                    enable: () => {
                        this.apiProviders = this.getApiProviders()
                    },
                    disable: () => {
                        this.apiProviders = this.getApiProviders()
                    }
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "allowIpApi",
                    text: chrome.i18n.getMessage("allowIpApi"),
                    tooltip: chrome.i18n.getMessage("tooltipAllowIpApi"),
                    enable: () => {
                        this.apiProviders = this.getApiProviders()
                    },
                    disable: () => {
                        this.apiProviders = this.getApiProviders()
                    }
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "allowGeoJs",
                    text: chrome.i18n.getMessage("allowGeoJs"),
                    tooltip: chrome.i18n.getMessage("tooltipAllowGeoJs"),
                    enable: () => {
                        this.apiProviders = this.getApiProviders()
                    },
                    disable: () => {
                        this.apiProviders = this.getApiProviders()
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
            key: "ipApiLocalisation",
            controlsSection: "languageSelectSection",
            text: chrome.i18n.getMessage("apiLocalisation"),
            tooltip: chrome.i18n.getMessage("tooltipApiLocalisation"),
            enable: () => {
                this.apiLanguage = this.getApiLanguage()
            },
            disable: () => {
                this.apiLanguage = this.getApiLanguage()
            }
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("ipApiLocalisation"),
            sectionId: "languageSelectSection",
            children: [
                {
                    type: "select",
                    important: false,
                    key: "ipApiPreferredLang",
                    options: [
                        {
                            value: "auto",
                            text: chrome.i18n.getMessage("ipApiPreferredLangAutoOption")
                        },
                        {
                            value: 'en',
                            text: "English"
                        },
                        {
                            value: 'de',
                            text: "Deutsch (German)"
                        },
                        {
                            value: 'es',
                            text: "Español (Spanish)"
                        },
                        {
                            value: 'pt-BR',
                            text: "Português (Portuguese)"
                        },
                        {
                            value: 'fr',
                            text: "Français (French)"
                        },
                        {
                            value: 'ja',
                            text: "日本語 (Japanese)"
                        },
                        {
                            value: 'zh-CN',
                            text: "中国 (Chinese)"
                        },
                        {
                            value: 'ru',
                            text: "Русский (Russian)"
                        }
                    ],
                    text: chrome.i18n.getMessage("ipApiPreferredLang"),
                    tooltip: chrome.i18n.getMessage("tooltipIpApiPreferredLang"),
                    onchange: () => {
                        this.apiLanguage = this.getApiLanguage()
                    }
                },
            ],
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
            important: true,
            key: "enableFilter",
            text: chrome.i18n.getMessage("filter"),
            tooltip: chrome.i18n.getMessage("tooltipFilter"),
            controlsSection: "filterSection",
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("enableFilter"),
            sectionId: "filterSection",
            children: [
                {
                    type: "checkbox",
                    important: false,
                    key: "enableFilterCountry",
                    text: chrome.i18n.getMessage("filterCountry"),
                    tooltip: chrome.i18n.getMessage("tooltipFilterCountry"),
                    controlsSection: "filterCountryDiv",
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("enableFilterCountry"),
                    sectionId: "filterCountryDiv",
                    children: [
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("countryCodeListButtonText"),
                            onclick: (e: MouseEvent) => {
                                window.open(chrome.i18n.getMessage("countryCodeListUrl"))
                            }
                        },
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("prefixFilterCountry") + globalThis.platformSettings.get("filterCountry"),
                            onclick: (e: MouseEvent) => {
                                const result = prompt(chrome.i18n.getMessage("promptFilterCountry"), globalThis.platformSettings.get("filterCountry"))
                                if (result) {
                                    globalThis.platformSettings.setBack({"filterCountry": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixFilterCountry") + result
                                    })
                                }
                            }
                        },
                    ]
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "filterIgnoreMobile",
                    text: chrome.i18n.getMessage("filterIgnoreMobile"),
                    tooltip: chrome.i18n.getMessage("tooltipFilterIgnoreMobile")
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "enableFilterRegion",
                    text: chrome.i18n.getMessage("filterRegion"),
                    tooltip: chrome.i18n.getMessage("tooltipFilterRegion"),
                    controlsSection: "filterRegionDiv",
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("enableFilterRegion"),
                    sectionId: "filterRegionDiv",
                    children: [
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("prefixFilterRegion") + globalThis.platformSettings.get("filterRegion"),
                            onclick: (e: MouseEvent) => {
                                const result = prompt(chrome.i18n.getMessage("promptFilterRegion"), globalThis.platformSettings.get("filterRegion"))
                                if (result) {
                                    globalThis.platformSettings.setBack({"filterRegion": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixFilterRegion") + result
                                    })
                                }
                            }
                        }
                    ]
                },
                {
                    type: "checkbox",
                    important: false,
                    key: "enableFilterCity",
                    text: chrome.i18n.getMessage("filterCity"),
                    tooltip: chrome.i18n.getMessage("tooltipFilterCity"),
                    controlsSection: "filterCityDiv",
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("enableFilterCity"),
                    sectionId: "filterCityDiv",
                    children: [
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("prefixFilterCity") + globalThis.platformSettings.get("filterCity"),
                            onclick: (e: MouseEvent) => {
                                const result = prompt(chrome.i18n.getMessage("promptFilterCity"), globalThis.platformSettings.get("filterCity"))
                                if (result) {
                                    globalThis.platformSettings.setBack({"filterCity": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixFilterCity") + result
                                    });
                                }
                            }
                        }
                    ]
                },
            ]
        },

        {
            type: "br"
        },
        {
            type: "checkbox",
            important: true,
            key: "enableTarget",
            text: chrome.i18n.getMessage("target"),
            tooltip: chrome.i18n.getMessage("tooltipTarget"),
            controlsSection: "targetSection",
        },
        {
            type: "section",
            hide: globalThis.platformSettings.get("enableTarget"),
            sectionId: "targetSection",
            children: [
                {
                    type: "checkbox",
                    important: false,
                    key: "enableTargetCountry",
                    text: chrome.i18n.getMessage("targetCountry"),
                    tooltip: chrome.i18n.getMessage("tooltipTargetCountry"),
                    controlsSection: "targetCountryDiv",
                },
                {
                    type: "section",
                    hide: globalThis.platformSettings.get("enableTargetCountry"),
                    sectionId: "targetCountryDiv",
                    children: [
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("countryCodeListButtonText"),
                            onclick: (e: MouseEvent) => {
                                window.open(chrome.i18n.getMessage("countryCodeListUrl"))
                            }
                        },
                        {
                            type: "button",
                            text: chrome.i18n.getMessage("prefixTargetCountry") + globalThis.platformSettings.get("targetCountry"),
                            onclick: (e: MouseEvent) => {
                                const result = prompt(chrome.i18n.getMessage("promptTargetCountry"), globalThis.platformSettings.get("targetCountry"))
                                if (result) {
                                    globalThis.platformSettings.setBack({"targetCountry": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCountry") + result
                                    })
                                }
                            }
                        },
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
                                    globalThis.platformSettings.setBack({"targetRegion": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetRegion") + result
                                    })
                                }
                            }
                        }
                    ]
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
                                    globalThis.platformSettings.setBack({"targetCity": result}, function () {
                                        (e.target! as HTMLElement).innerText = chrome.i18n.getMessage("prefixTargetCity") + result
                                    });
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
            ]
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
    protected driver: ChatruletkaDriver | OmegleDriver;
    private rmdaddr = "0.0.0.0"
    private api: number = 0;
    private browser = utils.getUserBrowser()
    private torrenstsConfirmed = false;
    private targetSound = new Audio(chrome.runtime.getURL('resources/audio/found.mp3'))
    public delayIPs: string[] = [];
    private needToShowHint = globalThis.platformSettings.get("showHints") ? (globalThis.platformSettings.get("showHintsMoreOften") ? true : utils.getRandomInt(1, 3) === 2) : false;
    private hint: number = -1;
    private apiProviders = this.getApiProviders();
    public checks = 0
    public mainDisclaimerKey = "main";

    public constructor(driver: ChatruletkaDriver | OmegleDriver) {
        this.driver = driver
        this.targetSound.volume = 0.5

        // firefox audio issue workaround
        if (utils.getUserBrowser() == "Firefox") {
            document.append(this.targetSound)
            document.addEventListener("click", () => {
                this.targetSound.load()
            }, {once: true})
        }

        this.createTabs()
    }

    public injectIpEventListener() {
        window.addEventListener("[object Object]", (evt) => {
            let candidate: string = (<CustomEvent>evt).detail.candidate

            let parsedCandidate: RTCIceCandidate | SDPUtils.SDPIceCandidate | undefined
            if (this.browser === "firefox") {
                // avoiding errors while parsing useless candidates
                if (candidate.includes('srflx')) {
                    parsedCandidate = SDPUtils.parseCandidate(JSON.parse(candidate).candidate)
                }
            } else {
                parsedCandidate = new RTCIceCandidate(JSON.parse(candidate))
            }

            if (typeof parsedCandidate !== "undefined" && parsedCandidate.type === "srflx" && parsedCandidate.address) {
                this.driver.addStringToLog(false, "IP: " + parsedCandidate.address)
                if (this.rmdaddr !== parsedCandidate.address) {
                    this.rmdaddr = parsedCandidate.address;
                    this.driver.addStringToLog(true, "NEW IP: " + parsedCandidate.address)
                    this.driver.addStringToLog(false, "IP CHANGED")
                    this.onNewIP(this.rmdaddr)
                }
            }
        }, false);
    }

    public checkApi() {

        if (this.needToShowHint) {
            // only one hint per session
            if (this.hint === -1) {
                this.hint = utils.getRandomInt(0, this.tabs[0].hints.length - 1);
            }
            (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStartCheck") + "</br></br>" + this.tabs[0].getHintHTML(this.hint);
        } else {
            (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStartCheck") + "</br></br>" + chrome.i18n.getMessage(this.mainDisclaimerKey, [this.driver.site.text]);
        }

        this.apiProviders = this.getApiProviders();

        chrome.runtime.sendMessage({
            makeGeolocationRequest: "1.1.1.1",
            language: "en",
            allow: this.apiProviders
        }, (response) => {
            this.checks += 1
            if (response.failed && response.failed.includes('ve-api')) {
                this.apiProviders = this.apiProviders.filter(provider => provider !== "ve-api")
            }
            if (response.status === 200) {
                this.api = 2;
                // prevents geolocation data from being overwritten if the api check result arrives after the geolocation result.
                // this happens if a person with a very good internet connection triggers api check and immediately presses 'start', while the extension server is overloaded with requests.
                if (this.driver.stage < 2 || this.checks == 1) {
                    if (this.needToShowHint) {
                        // TODO: need to find a better solution
                        if (this.driver.platform.name === "Omegle") {
                            if (this.checks > 1) {
                                this.needToShowHint = false;
                            }
                        } else {
                            this.needToShowHint = false;
                        }
                        (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + this.tabs[0].getHintHTML(this.hint)
                    } else {
                        (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus2") + "</br></br>" + chrome.i18n.getMessage(this.mainDisclaimerKey, [this.driver.site.text])
                    }
                    if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                        this.driver.modules.controls.resizemap(false)
                    }
                }
                console.dir(`geolocation test passed: ${response.status}`)
            } else if (response.status === 429) {
                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = chrome.i18n.getMessage("apiStatus429") + "</br></br>" + chrome.i18n.getMessage(this.mainDisclaimerKey, [this.driver.site.text])
                this.api = 2;

                console.dir(`geolocation test passed: ${response.status}`)
            } else if (response.status === 0) {
                this.api = 0
                console.dir(`geolocation test failed: ${response.status} ${response.body}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + response.status);

                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize(`<b>ERROR: ${response.status} (${response.body}) || </b>`) + chrome.i18n.getMessage("apiStatus0") + "</br></br>" + chrome.i18n.getMessage("mainDiscord", [this.driver.site.text])
                if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab1")) {
                    this.driver.modules.controls.resizemap(false)
                }
            } else {
                this.api = 0
                console.dir(`geolocation test failed: ${response.status} ${response.body}`)
                console.dir(chrome.i18n.getMessage("apiStatus0") + ' ERROR: ' + response.status);

                (document.getElementById("remoteInfo") as HTMLElement).innerHTML = DOMPurify.sanitize(`<b>HTTP ERROR: ${response.status} || `) + '<b>' + chrome.i18n.getMessage("apiStatusRegular") + "</b></br></br>" + chrome.i18n.getMessage("mainDiscord", [this.driver.site.text]);
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
        if (this.driver.modules.blacklist && this.driver.modules.blacklist.isIpInBlacklist(newIp)) {
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
                case 2: {
                    if (globalThis.platformSettings.get("skipwrongcountry")) {
                        if (this.driver.modules.automation && this.driver.modules.automation.checkedCountry) {
                            console.dir('CHECKED')
                            this.doLookupRequest2(newIp)
                        } else {
                            console.dir(`${newIp} ADDED TO delayIPs`)
                            this.delayIPs.push(newIp)
                        }
                    } else {
                        this.doLookupRequest2(newIp)
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }

    public processDelayed() {
        console.dir("PROCESS DELAYED")
        console.dir(this.delayIPs)
        this.delayIPs.forEach((ip: string) => {
            this.doLookupRequest2(ip)
        })
    }

    public doLookupRequest2(ip: string) {
        chrome.runtime.sendMessage({
            makeGeolocationRequest: ip,
            language: this.apiLanguage,
            allow: this.apiProviders
        }, (response) => {
            console.dir(`geolocation returned ${response.status} (${response.body.status}) for '${ip}'`)

            if (response.status === 200) {
                this.processData(response.body, ip)
            } else if (response.status === 429) {
                if (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))) {
                    this.driver.stopAndStart(5000)
                } else {
                    (document.getElementById("remoteInfo") as HTMLElement).innerHTML = '<div id="ipApiContainer" style="display:flex; flex-direction:row; justify-content: space-between;"><div>' + chrome.i18n.getMessage("apiStatus429")
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
                if (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))) {
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
            console.dir(`DISCARD ${ip}`)
            return
        }
        console.dir(`PROCESS ${ip}`)

        this.curInfo[ip] = json
        let strings = []
        let newInnerHTML = ''
        let newIpDiv = utils.createElement('div')
        if (globalThis.platformSettings.get("showMoreEnabledByDefault") && (json.mobile || json.proxy || json.hosting)) {
            if (json.mobile) {
                if (globalThis.platformSettings.get("hideMobileLocation") || globalThis.platformSettings.get("showCT")) {
                    if (!globalThis.platformSettings.get("showCT")) {
                        strings.push(`<small title="${chrome.i18n.getMessage("lowAccuracy")} || Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || ISP: ${json.isp}">MOBILE [${chrome.i18n.getMessage('apiMobileHidden')}]</small>`)
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
                    newInnerHTML += "<b>TZ: </b><sup class='remoteTZ' style='font-size:100%;vertical-align:baseline'>" + json.timezone + "</sup> (<sup class = 'remoteTime' style='font-size:100%;vertical-align:baseline'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
                } catch {
                    newInnerHTML += "<b>TZ: </b><sup class='remoteTZ' style='font-size:100%;vertical-align:baseline'>" + json.timezone + "</sup> (<sup class = 'remoteTime' style='font-size:100%;vertical-align:baseline'>" + "???" + "</sup>) </br>"
                }
            } else {
                newInnerHTML += "<br><br><br>"
            }
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(0) + "</sup>"

        } else {
            newInnerHTML = chrome.i18n.getMessage("apiCountry") + json.country + " [" + json.countryCode + "] </br>"

            newInnerHTML += "</br>" +
                chrome.i18n.getMessage("apiCity") + json.city + " (" + json.region + ") </br>" +
                chrome.i18n.getMessage("apiRegion") + json.regionName + "</br>"
            try {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ' style='font-size:100%;vertical-align:baseline'>" + json.timezone + "</sup> (<sup class = 'remoteTime' style='font-size:100%;vertical-align:baseline'>" + new Date().toLocaleTimeString("ru", {timeZone: json.timezone}).slice(0, -3) + "</sup>) </br>"
            } catch {
                newInnerHTML += "<b>TZ: </b><sup class='remoteTZ' style='font-size:100%;vertical-align:baseline'>" + json.timezone + "</sup> (<sup class = 'remoteTime' style='font-size:100%;vertical-align:baseline'>" + "???" + "</sup>) </br>"
            }
            newInnerHTML += "<b>TM: </b><sup class='remoteTM'>" + utils.secondsToHms(0) + "</sup>"
        }

        if (globalThis.platformSettings.get("showISP")) {
            newInnerHTML += `<br><small style="font-size: x-small!important;"><b>${json.isp}</b></small>`
        }

        if (strings.length > 0)
            newInnerHTML += "</br>" + strings.join('<small> || </small>')


        newIpDiv.innerHTML += DOMPurify.sanitize(newInnerHTML)

        if (this.driver.modules.streamer) {
            this.driver.modules.streamer.setGeoData(json)
        }

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
        
        if (globalThis.platformSettings.get("enableFilter")) {
            if (globalThis.platformSettings.get("enableFilterCountry")) {
                if (globalThis.platformSettings.get("filterCountry").toLowerCase().includes(json.countryCode.toLowerCase())) {
                    this.driver.addStringToLog(true, `Auto-skipping banned country: ${json.countryCode} found in ${globalThis.platformSettings.get("filterCountry")}`)
                    this.driver.needToCheckTarget = false
                    this.driver.stopAndStart()
                    return
                }
            }
            
            if (!json.mobile || (json.mobile && !globalThis.platformSettings.get("filterIgnoreMobile"))) {
                if (globalThis.platformSettings.get("enableFilterRegion")) {
                    if (globalThis.platformSettings.get("filterRegion").toLowerCase().includes(json.regionName.toLowerCase())) {
                        this.driver.addStringToLog(true, `Auto-skipping banned region: ${json.regionName} found in ${globalThis.platformSettings.get("filterRegion")}`)
                        this.driver.needToCheckTarget = false
                        this.driver.stopAndStart()
                        return
                    }
                }

                if (globalThis.platformSettings.get("enableFilterCity")) {
                    if (globalThis.platformSettings.get("filterCity").toLowerCase().includes(json.city.toLowerCase())) {
                        this.driver.addStringToLog(true, `Auto-skipping banned city: ${json.city} found in ${globalThis.platformSettings.get("filterCity")}`)
                        this.driver.needToCheckTarget = false
                        this.driver.stopAndStart()
                        return
                    }
                }
            }
        }

        if (globalThis.platformSettings.get("enableTarget")) {
            if (globalThis.platformSettings.get("enableTargetCountry")) {
                if (globalThis.platformSettings.get("targetCountry").toLowerCase().includes(json.countryCode.toLowerCase())) {
                    this.driver.needToCheckTarget = false
                    if (globalThis.platformSettings.get("targetSound")) {
                        this.targetSound.play();
                    }
                    this.driver.addStringToLog(true, `Found target country: ${json.countryCode} is in ${globalThis.platformSettings.get("targetCountry")}`)
                }
            }

            if ((globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion")) && this.driver.needToCheckTarget) {
                if (globalThis.platformSettings.get("skipMobileTarget") && json.mobile) {
                    if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                        this.driver.addStringToLog(true, "Skipping mobile in target mode")
                        this.driver.stopAndStart()
                    }
                    return
                } else {
                    if (globalThis.platformSettings.get("enableTargetRegion")) {
                        if (globalThis.platformSettings.get("targetRegion").toLowerCase().includes(json.regionName.toLowerCase())) {
                            this.driver.needToCheckTarget = false
                            if (globalThis.platformSettings.get("targetSound")) {
                                (this.targetSound).play();
                                this.driver.addStringToLog(true, `Found target region: ${json.regionName} is in '${globalThis.platformSettings.get("targetRegion")}'`)
                            }
                        }
                    }
                    if (globalThis.platformSettings.get("enableTargetCity")) {
                        if (globalThis.platformSettings.get("targetCity").toLowerCase().includes(json.city.toLowerCase())) {
                            this.driver.needToCheckTarget = false
                            if (globalThis.platformSettings.get("targetSound")) {
                                this.targetSound.play();
                                this.driver.addStringToLog(true, `Found target city: ${json.city} is in '${globalThis.platformSettings.get("targetCity")}'`)
                            }
                        }
                    }
                }
            }
            if (this.driver.needToCheckTarget) {
                if (this.curIps.indexOf(ip) + 1 === this.curIps.length) {
                    this.driver.addStringToLog(true, "Skipping due to lack of matches in targeted searches...")
                    this.driver.stopAndStart()
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
                        el.innerText = utils.secondsToHms((Date.now() - this.driver.play) / 1000)
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
        this.tabs[0] = new ControlsTabApi(this.driver, this)
        this.tabs[1] = new ControlsTabMap(this.driver, this)
    }

    // https://ip-api.com/docs/api:json#:~:text=DEMO-,Localization,-Localized%20city%2C
    private getApiLanguage() {
        if (!globalThis.platformSettings.get("ipApiLocalisation")) return "en"
        let pr = globalThis.platformSettings.get('ipApiPreferredLang')
        let lang = pr === "auto" ? window.navigator.language.slice(0, 2) : pr
        if (lang === "pt") {
            lang = "pt-BR"
        } else if (lang == "zh") {
            lang = "zh-CN"
        }
        return lang
    }

    private apiLanguage = this.getApiLanguage();

    private getApiProviders() {
        let allow = []

        if (!globalThis.platformSettings.get('customApiBehaviour')) {
            return ["ve-api", "ip-api"]
        }

        if (globalThis.platformSettings.get('allowVeApi')) {
            allow.push('ve-api')
        }

        if (globalThis.platformSettings.get('allowIpApi')) {
            allow.push('ip-api')
        }

        if (globalThis.platformSettings.get('allowGeoJs')) {
            allow.push('geojs')
        }

        return allow
    }
}

export class ControlsTabApi {
    public name = chrome.i18n.getMessage("tab1")
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 5
    private driver: ChatruletkaDriver | OmegleDriver;
    private module: any
    private reviewLinkContainer: JQuery<HTMLElement>;
    private discordLinkContainer: JQuery<HTMLElement>;

    public constructor(driver: ChatruletkaDriver | OmegleDriver, module?: any) {
        this.driver = driver
        this.module = module
        this.tab = this.getTabHTML()
        this.content = this.getContentHTML()

        this.reviewLinkContainer = this.getReviewLink()
        this.discordLinkContainer = this.getDiscordLink()
        let self = this
        document.arrive("#reviewImageContainer", {existing: true}, function (el) {
            self.reviewLinkContainer.appendTo(el)
        })
        document.arrive("#discordImageContainer", {existing: true}, function (el) {
            self.discordLinkContainer.appendTo(el)
        })
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

    protected hintsGenerateCheckboxShorcut(checkbox: string, label: string, id: string) {
        return `<label for="${id}ShortcutCheck">${label}</label><input type="checkbox" onchange="document.getElementById('${checkbox}').click()" id="${id}ShortcutCheck">`
    }

    protected hintsDict = {
        "en": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `The extension community is hosted on <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">Discord</a>.<br><br>On <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">our Discord server</a> you can subscribe to project updates, report a bug, suggest an idea, get technical help and discuss the extension with the developer and other users!`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension',
                src: 'https://img.shields.io/github/last-commit/videochat-extension/videochat-extension?label=last%20commit&style=plastic&logo=github',
                strength: 1,
                enabled: true,
                text: `Our source code is available on <a href=\"https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">GitHub</a>!<br><br>This extension is an open source project (BSD-4) and will always be distributed free of charge.`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension',
                src: 'https://img.shields.io/github/stars/videochat-extension/videochat-extension?label=Star%20this%20project%20on%20GitHub&style=plastic&logo=github',
                strength: 1,
                enabled: true,
                text: `Our source code is available on <a href=\"https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">GitHub</a>!<br><br>This extension is an open source project (BSD-4 license) and will always be distributed for free.`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension#installation-from-store',
                src: 'https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Weekly%20Users&query=users&url=https%3A%2F%2Fve-api.starbase.wiki%2Fusers?dots&cacheSeconds=3600&style=plastic&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAA85JREFUWMO12M1PXGUUBvDfXKZDS2shARNboMTEVtqQQuwHxITEhW7EBUld6HThojZ2I4Ymmkj5E4zRxGg14MZSGyPtpnYFq26kpY0L01JsNBkyjUkRGWwHwU6vCwYKZYYZpvTc1bzPe5/n3vPeOV8RhWybfdocsk+tKuWYMy3ppit+dsO9tW+PrInt0eF1zWrw0H1p84ipsFWAv/zikp/cKkWgyTFvqsMfrrvmpjtS5lCu0k6NDnrJ85gwqN+vBX2xzGqcMiGUMiiuQTTnrqgGcYNSQgk9aoqlbzMslDagXazg7ph2Z6SFhrUVJo+ISwiN6iyC/JFIp6tCE46uearKdJmR0ad+PR4F9fpkzOhSlv/pu6TN6rVl3fSwRa9Zs7ryvcVRM2Z153+Cglam26wZR3OBbSZk9D4B/YJEr4zE6uOuMSzUV6JzVjqqT2hY9crlU0KjJRxtLqs3KtSzfKnJhLTODaGHTmkTmiCKiGPqnHVpacMmNQX/BfMm/ZcHu+SCuGO6F2LRi4Zs94bLWbjVBw7aXEDgX9d8ZiQP2u6ilNfcCtChztDS1lYD3i4irtR4y4DWZW+9336bsr9GDKnXAdsMCcWXtn0vdE6zXRrWuHZpdk7obJZyt69MmvSRIMsUFxqyjcMm/a4hu7zDuCnNRR1liynjnlXhXWNCKRljnsuiDX531+FAm2rXJbPLMZvd83dRAlPu2eIV3/nabhccd0eF8iyadF2NtqjDGPVgxa2RogQiQjv02W7cJ86oFi5DH7jmiENRez00VhThagtFBU771G+sCjJjHtoXVeu+OyUKRPzjPT/I5EST7qsNVElLlSww7XIeelLSqgLl5s2VKCCHYx7ZnHnlwTqoSrLAnNjSp1WKZfIi5WLmAtMqVJZIHqrSntdJlSpMB5K22lmywDO+8YXdOdFaWyUDNwUaSxSIeCDjhIuOq1jlrEaBG4ErOPhY7RYWRR+K+NNx573gtDNeXhEBog7gau5g11KUQFHBbnW4Pit0TkvBcN3yWLj+0l2TPlwdrjkpNLiUIlvdFpqSKHBNCd1elnCiKxJOzKDQyYW4uceQyhJS5qjPC6TMV41HMe5H3U4YMQ9GvPOEST/mhO2+Nb640CSx4WVLYqFsWbSeDS+8Pl65WG1YqH9DSsf+XKUjbRJPs/iF+IaV7/Hc8MY0IOn8DQhl3jcjo9+uddMX0UItvEWpTeCoUEK8mJJn/W3sQPFt7IJV68k24ueftBFfe5RwRL3FUcKY5LJRQq1GB4oZJaztsT06dDytYciiLY5z9qorZZzzP0lWce5vPFYWAAAAAElFTkSuQmCC',
                strength: 2,
                enabled: true,
                text: `Extension is available for download at <a href=\"https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi\" target=\"_blank\" style=\"text-decoration: none!important; \">Chrome Web Store</a>, <a href=\"https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn\" target=\"_blank\" style=\"text-decoration: none !important;\">Microsoft Edge Add-ons</a> & <a href=\"https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/\" target=\" _blank\" style=\"text-decoration: none!important;\">Mozilla Firefox Add-ons</a>.`
            },
            {
                imgcontainer: undefined,
                href: "https://videochat-extension.starbase.wiki",
                src: "https://img.shields.io/website?url=https%3A%2F%2Fvideochat-extension.starbase.wiki&style=plastic&label=Bookmark%20the%20extension%27s%20website&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAA85JREFUWMO12M1PXGUUBvDfXKZDS2shARNboMTEVtqQQuwHxITEhW7EBUld6HThojZ2I4Ymmkj5E4zRxGg14MZSGyPtpnYFq26kpY0L01JsNBkyjUkRGWwHwU6vCwYKZYYZpvTc1bzPe5/n3vPeOV8RhWybfdocsk+tKuWYMy3ppit+dsO9tW+PrInt0eF1zWrw0H1p84ipsFWAv/zikp/cKkWgyTFvqsMfrrvmpjtS5lCu0k6NDnrJ85gwqN+vBX2xzGqcMiGUMiiuQTTnrqgGcYNSQgk9aoqlbzMslDagXazg7ph2Z6SFhrUVJo+ISwiN6iyC/JFIp6tCE46uearKdJmR0ad+PR4F9fpkzOhSlv/pu6TN6rVl3fSwRa9Zs7ryvcVRM2Z153+Cglam26wZR3OBbSZk9D4B/YJEr4zE6uOuMSzUV6JzVjqqT2hY9crlU0KjJRxtLqs3KtSzfKnJhLTODaGHTmkTmiCKiGPqnHVpacMmNQX/BfMm/ZcHu+SCuGO6F2LRi4Zs94bLWbjVBw7aXEDgX9d8ZiQP2u6ilNfcCtChztDS1lYD3i4irtR4y4DWZW+9336bsr9GDKnXAdsMCcWXtn0vdE6zXRrWuHZpdk7obJZyt69MmvSRIMsUFxqyjcMm/a4hu7zDuCnNRR1liynjnlXhXWNCKRljnsuiDX531+FAm2rXJbPLMZvd83dRAlPu2eIV3/nabhccd0eF8iyadF2NtqjDGPVgxa2RogQiQjv02W7cJ86oFi5DH7jmiENRez00VhThagtFBU771G+sCjJjHtoXVeu+OyUKRPzjPT/I5EST7qsNVElLlSww7XIeelLSqgLl5s2VKCCHYx7ZnHnlwTqoSrLAnNjSp1WKZfIi5WLmAtMqVJZIHqrSntdJlSpMB5K22lmywDO+8YXdOdFaWyUDNwUaSxSIeCDjhIuOq1jlrEaBG4ErOPhY7RYWRR+K+NNx573gtDNeXhEBog7gau5g11KUQFHBbnW4Pit0TkvBcN3yWLj+0l2TPlwdrjkpNLiUIlvdFpqSKHBNCd1elnCiKxJOzKDQyYW4uceQyhJS5qjPC6TMV41HMe5H3U4YMQ9GvPOEST/mhO2+Nb640CSx4WVLYqFsWbSeDS+8Pl65WG1YqH9DSsf+XKUjbRJPs/iF+IaV7/Hc8MY0IOn8DQhl3jcjo9+uddMX0UItvEWpTeCoUEK8mJJn/W3sQPFt7IJV68k24ueftBFfe5RwRL3FUcKY5LJRQq1GB4oZJaztsT06dDytYciiLY5z9qorZZzzP0lWce5vPFYWAAAAAElFTkSuQmCC",
                strength: 2,
                enabled: true,
                text: "Our simple website <a href=\"https://videochat-extension.starbase.wiki\" target=\"_blank\" style=\"text-decoration: none!important;\">exists</a>."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                enabled: true,
                strength: 1,
                text: "This extension is an independent open-source project.<br><br>The developer is not affiliated with the video chats that the extension supports, and does not even have any contact with their administration.<br><br>However, the project maintains its own <a href=\"https://github.com/videochat-extension/videochat-extension#policy-of-neutrality-acceptable-use-and-functional-limitations\" target=\"_blank\" style=\" text-decoration: none!important;\">policy of neutrality, acceptable use and functional limitations</a>, which prohibits commercial relations with video chats, competing with their paid features, as well as developing functionality that may be dangerous for their ecosystem. This greatly reduces the need for any countermeasures.<br><br>In theory, video chats have the ability to prevent the extension from working at their code level, but simple functions (like the geolocation of the interlocutor) can still be implemented in a separate program."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: (globalThis.platformSettings.get("hideMobileLocation") && !globalThis.platformSettings.get("showCT")),
                text: "Mobile (cellular) IP addresses have very low geolocation accuracy.<br><br>Wired internet usually has good accuracy (within the radius of the agglomeration). But in the case of mobile IPs, we had to hide the city, region, and time zone by default.<br><br>You can hover your mouse over <small title='Nice try!'>[LOCATION HIDDEN]</small> to view geolocation data, or enable the CT ('cell tower') thing in the geolocation settings."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: "We respect your privacy.<br><br>We do not analyze your activities on the sites, collect any data about you, or log your geolocation requests.<br><br>This extension doesn't track you — it is <a href=\" https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">open source</a> so you can go check for yourself."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: "We respect your privacy.<br><br>We use only internal analytics of the stores, which cannot be disabled. We know the number of installs and uninstalls, as well as how many unique browsers regulary check for updates.<br><br>You should know that we collect anonymized information about extension's errors by default (it can be disabled in the settings)."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: `We can turn on the dark theme for you: <input type="checkbox" onchange="document.getElementById('darkModeCheck').click()">`
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: globalThis.platformSettings.get("hotkeys"),
                text: `You have local hotkeys activated.<br><br>For example, you can skip people with the left arrow on your keyboard. You can see the full list of hotkeys in the settings.<br><br>If you accidentally pressed a hotkey, just hold it down for five seconds and release it to prevent the effect.`
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 15,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `You have 'target search' enabled.<br><br>The extension will now skip everyone until it finds you someone from a country/region/city that you specified in the list in the settings.<br><br>You can disable this feature in the geolocation settings.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: !globalThis.platformSettings.get("skipwrongcountry"),
                text: `The extension can automatically skip 'wrong' countries: <input type="checkbox" onchange="document.getElementById('skipwrongcountryCheck').click()"><br><br>Chat often fails to find a chat partner for you from the country you are looking for and gives you the 'wrong' countries instead. The extension can automatically skip interlocutors until it finds the country you need.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: !globalThis.platformSettings.get("hideCamera"),
                text: `The extension can hide your camera: <input type="checkbox" onchange="document.getElementById('hideCameraCheck').click()"><br><br>You should try chatting with people while hiding your camera, it makes communication more natural!`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: !globalThis.platformSettings.get("doNotCover"),
                text: `The extension can display uncut video from the stranger's camera: <input type="checkbox" onchange="document.getElementById('doNotCoverCheck').click()"><br><br>A lot of people use mobile applications, who shoot in portrait mode so part of the picture is cut off by the site interface.<br><br>You can reverse this effect to see the entire interlocutor (at the cost of black bars on the sides).`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: !globalThis.platformSettings.get("doNotReflect"),
                text: `The extension can reverse reflecting your camera: <input type="checkbox" onchange="document.getElementById('doNotReflectCheck').click()"><br><br>Video chat reflects your camera image by default. This effect can be reversed without changing how you look to the stranger.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: `We have no control over when your browser decides to update the extension.<br><br>Sometimes this can happen right during the conversation, in which case you need to manually reload the page to restore the work of the extension.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: 'You can disable this message in the control panel settings.'
            },
        ],
        "ru": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `Сообщество расширения размещено в <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">Discord</a>.<br><br>На <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">нашем Discord сервере</a> вы можете следить за новостями проекта, сообщить об ошибке, предложить функцию, получить техническую помощь и обсудить расширение с разработчиком и другими пользователями!`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension',
                src: 'https://img.shields.io/github/last-commit/videochat-extension/videochat-extension?label=%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9%20commit&style=plastic&logo=github',
                strength: 1,
                enabled: true,
                text: `Исходный код проекта доступен на <a href=\"https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">GitHub</a>!<br><br>Расширение является проектом с открытым исходным кодом (лицензия BSD-4) и всегда будет распространяться бесплатно.`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension',
                src: 'https://img.shields.io/github/stars/videochat-extension/videochat-extension?label=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D0%BD%D0%B0%D0%BC%20%D0%B7%D0%B2%D1%91%D0%B7%D0%B4%D0%BE%D1%87%D0%BA%D1%83%20%D0%BD%D0%B0%20GitHub&style=plastic&logo=github',
                strength: 1,
                enabled: true,
                text: `Исходный код проекта доступен на <a href=\"https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">GitHub</a>!<br><br>Расширение является проектом с открытым исходным кодом (лицензия BSD-4) и всегда будет распространяться бесплатно.`
            },

            {
                imgcontainer: undefined,
                href: 'https://github.com/videochat-extension/videochat-extension#installation-from-store',
                src: 'https://img.shields.io/badge/dynamic/json?color=brightgreen&label=%D0%90%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D1%85%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9&query=users&url=https%3A%2F%2Fve-api.starbase.wiki%2Fusers?dots&cacheSeconds=3600&style=plastic&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAA85JREFUWMO12M1PXGUUBvDfXKZDS2shARNboMTEVtqQQuwHxITEhW7EBUld6HThojZ2I4Ymmkj5E4zRxGg14MZSGyPtpnYFq26kpY0L01JsNBkyjUkRGWwHwU6vCwYKZYYZpvTc1bzPe5/n3vPeOV8RhWybfdocsk+tKuWYMy3ppit+dsO9tW+PrInt0eF1zWrw0H1p84ipsFWAv/zikp/cKkWgyTFvqsMfrrvmpjtS5lCu0k6NDnrJ85gwqN+vBX2xzGqcMiGUMiiuQTTnrqgGcYNSQgk9aoqlbzMslDagXazg7ph2Z6SFhrUVJo+ISwiN6iyC/JFIp6tCE46uearKdJmR0ad+PR4F9fpkzOhSlv/pu6TN6rVl3fSwRa9Zs7ryvcVRM2Z153+Cglam26wZR3OBbSZk9D4B/YJEr4zE6uOuMSzUV6JzVjqqT2hY9crlU0KjJRxtLqs3KtSzfKnJhLTODaGHTmkTmiCKiGPqnHVpacMmNQX/BfMm/ZcHu+SCuGO6F2LRi4Zs94bLWbjVBw7aXEDgX9d8ZiQP2u6ilNfcCtChztDS1lYD3i4irtR4y4DWZW+9336bsr9GDKnXAdsMCcWXtn0vdE6zXRrWuHZpdk7obJZyt69MmvSRIMsUFxqyjcMm/a4hu7zDuCnNRR1liynjnlXhXWNCKRljnsuiDX531+FAm2rXJbPLMZvd83dRAlPu2eIV3/nabhccd0eF8iyadF2NtqjDGPVgxa2RogQiQjv02W7cJ86oFi5DH7jmiENRez00VhThagtFBU771G+sCjJjHtoXVeu+OyUKRPzjPT/I5EST7qsNVElLlSww7XIeelLSqgLl5s2VKCCHYx7ZnHnlwTqoSrLAnNjSp1WKZfIi5WLmAtMqVJZIHqrSntdJlSpMB5K22lmywDO+8YXdOdFaWyUDNwUaSxSIeCDjhIuOq1jlrEaBG4ErOPhY7RYWRR+K+NNx573gtDNeXhEBog7gau5g11KUQFHBbnW4Pit0TkvBcN3yWLj+0l2TPlwdrjkpNLiUIlvdFpqSKHBNCd1elnCiKxJOzKDQyYW4uceQyhJS5qjPC6TMV41HMe5H3U4YMQ9GvPOEST/mhO2+Nb640CSx4WVLYqFsWbSeDS+8Pl65WG1YqH9DSsf+XKUjbRJPs/iF+IaV7/Hc8MY0IOn8DQhl3jcjo9+uddMX0UItvEWpTeCoUEK8mJJn/W3sQPFt7IJV68k24ueftBFfe5RwRL3FUcKY5LJRQq1GB4oZJaztsT06dDytYciiLY5z9qorZZzzP0lWce5vPFYWAAAAAElFTkSuQmCC',
                strength: 2,
                enabled: true,
                text: `Расширение доступно для скачивания в <a href=\"https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi\" target=\"_blank\" style=\"text-decoration: none!important;\">Chrome Web Store</a>, <a href=\"https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn\" target=\"_blank\" style=\"text-decoration: none!important;\">Microsoft Edge Add-ons</a> и <a href=\"https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/\" target=\"_blank\" style=\"text-decoration: none!important;\">Mozilla Firefox Add-ons</a>.`
            },

            {
                imgcontainer: undefined,
                href: "https://videochat-extension.starbase.wiki",
                src: "https://img.shields.io/website?url=https%3A%2F%2Fvideochat-extension.starbase.wiki&style=plastic&label=Добавляйте в закладки сайт расширения&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAA85JREFUWMO12M1PXGUUBvDfXKZDS2shARNboMTEVtqQQuwHxITEhW7EBUld6HThojZ2I4Ymmkj5E4zRxGg14MZSGyPtpnYFq26kpY0L01JsNBkyjUkRGWwHwU6vCwYKZYYZpvTc1bzPe5/n3vPeOV8RhWybfdocsk+tKuWYMy3ppit+dsO9tW+PrInt0eF1zWrw0H1p84ipsFWAv/zikp/cKkWgyTFvqsMfrrvmpjtS5lCu0k6NDnrJ85gwqN+vBX2xzGqcMiGUMiiuQTTnrqgGcYNSQgk9aoqlbzMslDagXazg7ph2Z6SFhrUVJo+ISwiN6iyC/JFIp6tCE46uearKdJmR0ad+PR4F9fpkzOhSlv/pu6TN6rVl3fSwRa9Zs7ryvcVRM2Z153+Cglam26wZR3OBbSZk9D4B/YJEr4zE6uOuMSzUV6JzVjqqT2hY9crlU0KjJRxtLqs3KtSzfKnJhLTODaGHTmkTmiCKiGPqnHVpacMmNQX/BfMm/ZcHu+SCuGO6F2LRi4Zs94bLWbjVBw7aXEDgX9d8ZiQP2u6ilNfcCtChztDS1lYD3i4irtR4y4DWZW+9336bsr9GDKnXAdsMCcWXtn0vdE6zXRrWuHZpdk7obJZyt69MmvSRIMsUFxqyjcMm/a4hu7zDuCnNRR1liynjnlXhXWNCKRljnsuiDX531+FAm2rXJbPLMZvd83dRAlPu2eIV3/nabhccd0eF8iyadF2NtqjDGPVgxa2RogQiQjv02W7cJ86oFi5DH7jmiENRez00VhThagtFBU771G+sCjJjHtoXVeu+OyUKRPzjPT/I5EST7qsNVElLlSww7XIeelLSqgLl5s2VKCCHYx7ZnHnlwTqoSrLAnNjSp1WKZfIi5WLmAtMqVJZIHqrSntdJlSpMB5K22lmywDO+8YXdOdFaWyUDNwUaSxSIeCDjhIuOq1jlrEaBG4ErOPhY7RYWRR+K+NNx573gtDNeXhEBog7gau5g11KUQFHBbnW4Pit0TkvBcN3yWLj+0l2TPlwdrjkpNLiUIlvdFpqSKHBNCd1elnCiKxJOzKDQyYW4uceQyhJS5qjPC6TMV41HMe5H3U4YMQ9GvPOEST/mhO2+Nb640CSx4WVLYqFsWbSeDS+8Pl65WG1YqH9DSsf+XKUjbRJPs/iF+IaV7/Hc8MY0IOn8DQhl3jcjo9+uddMX0UItvEWpTeCoUEK8mJJn/W3sQPFt7IJV68k24ueftBFfe5RwRL3FUcKY5LJRQq1GB4oZJaztsT06dDytYciiLY5z9qorZZzzP0lWce5vPFYWAAAAAElFTkSuQmCC",
                strength: 2,
                enabled: true,
                text: "На просторах сети Интернет существует <a href=\"https://videochat-extension.starbase.wiki\" target=\"_blank\" style=\"text-decoration: none!important;\">сайт-визитка расширения</a>."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                enabled: true,
                strength: 1,
                text: "Расширение является независимым open-source проектом.<br><br>Разработчик не аффилирован с видеочатами, которые поддерживает расширение, и даже не имеет никаких контактов с их администрацией.<br><br>Тем не менее, проект придерживается собственной <a href=\"https://github.com/videochat-extension/videochat-extension#policy-of-neutrality-acceptable-use-and-functional-limitations\" target=\"_blank\" style=\"text-decoration: none!important;\">политики нейтральности, допустимого использования и функциональных ограничений</a>, которая запрещает коммерчески сотрудничать с видеочатами, составлять конкуренцию их платным функциям, а так же разрабатывать опасный для их экосистемы функционал. Это сильно снижает необходимость контр-мер со стороны чатов.<br><br>В теории видеочаты имеют возможность намеренно помешать расширению работать на уровне кода сайта, но простые функции (вроде геолокации собеседника) всё равно будет возможно реализовать в виде отдельной программы."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: (globalThis.platformSettings.get("hideMobileLocation") && !globalThis.platformSettings.get("showCT")),
                text: "У мобильных IP адресов очень низкая точность геолокации.<br><br>У проводного интернета обычно приемлемая точность (в пределах агломерации), но у данных о мобильных IP мы по умолчанию скрываем город, регион и временную зону.<br><br>Вы можете навести мышкой на <small title='Хорошая попытка!'>[ЛОКАЦИЯ СКРЫТА]</small>, чтобы посмотреть данные геолокации, или включить отображение данных мобильных IP в настройках платформы."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: "Мы уважаем вашу приватность.<br><br>Мы не анализируем ваше поведение в чатах, не собираем никаких данных о вас, не логируем ваши запросы геолокации.<br><br>Расширение не следит за вами — у него <a href=\"https://github.com/videochat-extension\" target=\"_blank\" style=\"text-decoration: none!important;\">открытый исходный код</a> и вы сами можете в этом убедиться."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: "Мы уважаем вашу приватность.<br><br>Мы используем только внутренний инструмент аналитики магазинов расширений, который невозможно отключить. Мы знаем только количество установок и удалений, а так же сколько уникальных браузеров регулярно проверяют обновления.<br><br>Так же в расширении по умолчанию включен сбор анонимизированной информации о произошедших ошибках (это можно выключить в настройках)."
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: `Расширение может включить тёмную тему: <input type="checkbox" onchange="document.getElementById('darkModeCheck').click()">`
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: globalThis.platformSettings.get("hotkeys"),
                text: `У вас активны локальные горячие клавиши.<br><br>Например, вы можете пропускать собеседников левой стрелкой клавиатуры. В настройках вы можете увидеть полный список горячих клавиш.<br><br>Если вы случайно нажали клавишу, просто подержите её пять секунд и отпустите, чтобы отменить её действие.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 15,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `У вас включен таргетированный поиск.<br><br>Расширение будет пропускать всех ваших собеседников, пока не найдет кого-нибудь из списка стран/регионов/городов, который вы задали в настройках<br><br>Вы можете отключить эту функцию в настройках геолокации.'.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: !globalThis.platformSettings.get("skipwrongcountry"),
                text: `Расширение может автоматически пропускать 'неправильные' страны: <input type="checkbox" onchange="document.getElementById('skipwrongcountryCheck').click()"><br><br>Часто чат не успевает найти для вас собеседника из страны, которую вы ищите, и подсовывает вам 'неправильные' страны. Расширение может автоматически пропускать собеседников до тех пор, пока не найдет нужную вам страну.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: !globalThis.platformSettings.get("hideCamera"),
                text: `Расширение может скрыть вашу камеру: <input type="checkbox" onchange="document.getElementById('hideCameraCheck').click()"><br><br>Вы можете попробовать пообщаться с собеседниками, скрыв вашу камеру, чтобы общение ощущалось более естественным для вас.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 2,
                enabled: !globalThis.platformSettings.get("doNotCover"),
                text: `Расширение может отображать полное видео с камеры собеседника: <input type="checkbox" onchange="document.getElementById('doNotCoverCheck').click()"><br><br>Значительная часть пользователей видеочата использует мобильные приложения, которые снимают в портретном режиме, из-за его часть картинки обрезается в интерфейсе сайта.<br><br>Вы можете обратить этот эффект, чтобы видеть всего собеседника целиком (ценой чёрных полос по бокам).`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: !globalThis.platformSettings.get("doNotReflect"),
                text: `Расширение может обратить отражение вашей камеры: <input type="checkbox" onchange="document.getElementById('doNotReflectCheck').click()"><br><br>Видеочат по умолчанию отражает изображение с вашей камеры. Этот эффект можно обратить, при этом изображение у собеседника не изменится.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: `Мы не контролируем когда ваш браузер решает обновить расширение.<br><br>Иногда это может произойти прямо во время разговора, в этом случае вам нужно будет вручную перезагрузить страницу, чтобы восстановить работу расширения.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 1,
                enabled: true,
                text: `Вы можете отключить это сообщение в настройках контрольной панели.`
            },
        ]
    }

    public genHintsArray() {
        let lang = chrome.i18n.getMessage('lang') as "en" | "ru"
        let hints: {
            imgcontainer: string | undefined,
            href: string | undefined,
            src: string | undefined,
            strength: number,
            enabled: boolean,
            text: string
        }[] = []

        for (const hint of this.hintsDict[lang]) {
            if (hint.enabled) {
                // hint is pushed by ref so no memory issues here
                [...Array(hint.strength).keys()].forEach(index =>
                    hints.push(hint)
                )
            }
        }

        return hints
    }

    public hints = this.genHintsArray()

    public getHintHTML(id: number) {
        let lang = chrome.i18n.getMessage('lang') as "en" | "ru"
        let hint = this.hints[id];

        if (hint.imgcontainer) {
            return chrome.i18n.getMessage("mainHint", [hint.imgcontainer, hint.text])
        } else if (hint.href && hint.src) {
            return chrome.i18n.getMessage("mainHint", ['hintImageContainer', hint.text, this.getHintLink(hint.href, hint.src).outerHTML])
        }

        return ""
    }

    protected getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content active controls__row",
            id: "apiInfoContent",
            style: "height:100%; padding-top: 1px"
        }, [
            utils.createElement('div', {
                style: "display: flex; flex-flow: column; height:100%;"
            }, [
                utils.createElement('div', {
                    id: "remoteFace",
                }),
                utils.createElement('div', {
                    id: "remoteInfo",
                    style: "overflow-y: auto; height: 100%; padding-top:2px; line-height: 1"
                })
            ])
        ])
    }

    private getHintLink(href: string, src: string) {
        return utils.createElement('a', {
                target: "_blank",
                style: "margin-left: 3px; text-decoration: none !important;",
                href: href
            }, [
                utils.createElement('img', {
                    src: src
                })
            ]
        )
    }

    private getReviewLink() {
        return $(utils.createElement('a', {
                target: "_blank",
                style: "margin-left: 3px; text-decoration: none !important;",
                href: function f() {
                    switch (getUserBrowser()) {
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
                        switch (getUserBrowser()) {
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

    private getDiscordLink() {
        return $(utils.createElement('a', {
                target: "_blank",
                style: "margin-left: 3px; text-decoration: none !important;",
                href: "https://discord.gg/7DYWu5RF7Y"
            }, [
                utils.createElement('img', {
                    src: chrome.i18n.getMessage('mainDiscordBadge')
                })
            ]
        ))
    }
}

export class ControlsTabMap {
    public name = chrome.i18n.getMessage("tab2")
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 0
    public map: mapModule;
    private driver: ChatruletkaDriver | OmegleDriver;
    private module: any;

    private mapContainer: HTMLElement;

    public constructor(driver: ChatruletkaDriver | OmegleDriver, module?: any) {
        this.driver = driver
        this.module = module
        this.tab = this.getTabHTML()

        this.mapContainer = utils.createElement('div', {
            id: "mapid",
            style: "width: 100%; height:100%;"
        })
        this.map = new mapModule(this.mapContainer)
        this.content = this.getContentHTML()
    }

    public handleResize() {
        this.map.map.invalidateSize()
        // this.mapContainer.style.height = parseInt(this.mapContainer.style.height) - 2 + "px"
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
            style: "height:100%; padding-top: 1px"
        }, [
            this.mapContainer
        ])
    }
}