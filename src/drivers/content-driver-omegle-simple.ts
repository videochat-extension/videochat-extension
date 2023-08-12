import $ from "jquery";
import * as DOMPurify from "dompurify";
import * as utils from "../utils/utils";
import {ContentSwalInfoOmegle} from "./omegle/content-swal-info";
import * as SDPUtils from "sdp"
import {switchModeOmegle} from "./omegle/content-swal-switchmode";

export class OmegleSimpleDriver {
    private static instanceRef: OmegleSimpleDriver;

    private stageObserver: MutationObserver;

    private mode: "video" | "text" | undefined

    private dark = this.createDarkMode()

    // https://ip-api.com/docs/api:json#:~:text=DEMO-,Localization,-Localized%20city%2C
    private apiLanguage = function () {
        let lang = window.navigator.language.slice(0, 2)
        if (lang === "pt") {
            lang = "pt-BR"
        } else if (lang == "zh") {
            lang = "zn-CN"
        }
        return lang
    }();
    private apiProviders = ["ve-api", "ip-api", "geojs"];
    private rmdaddr = "0.0.0.0"
    private curIps: string[] = []

    private resultsContainer: HTMLElement = utils.createElement('div', {
        className: "logitem"
    })
    private browser = utils.getUserBrowser();

    private constructor() {
        this.stageObserver = new MutationObserver(this.onChangeStage)
    }

    static getInstance(): OmegleSimpleDriver {
        if (OmegleSimpleDriver.instanceRef === undefined) {
            OmegleSimpleDriver.instanceRef = new OmegleSimpleDriver();
        }

        return OmegleSimpleDriver.instanceRef;
    }

    public start(element: HTMLElement): boolean {
        this.stageObserver.observe(element, {attributes: true});
        this.injectIpEventListener()
        this.injectResultsContainer()

        document.arrive("div > p:nth-child(2) > label > input[type=checkbox]", (el: any) => {
            if (globalThis.platformSettings.get('c1Checked'))
                el.click()
            // remember user choice
            el.addEventListener("change", (event: JQuery.ChangeEvent) => {
                globalThis.platformSettings.set({'c1Checked': event.currentTarget.checked})
            })
        })

        document.arrive("div > p:nth-child(3) > label > input[type=checkbox]", (el: any) => {
            if (globalThis.platformSettings.get('c2Checked'))
                el.click()
            // remember user choice
            el.addEventListener("change", (event: JQuery.ChangeEvent) => {
                globalThis.platformSettings.set({'c2Checked': event.currentTarget.checked})
            })
        })

        document.arrive("#logo > canvas", {onceOnly: true, existing: true}, this.processDarkMode.bind(this))
        return true
    }

    private createDarkMode() {
        let dark = document.createElement('link');
        dark.rel = "stylesheet";
        dark.id = "darkMode"
        dark.href = chrome.runtime.getURL(`resources/dark/omegle.css`)
        return dark
    }

    private processDarkMode() {
        document.arrive(`div[style*="background-color: rgb(255, 255, 255)"]`, {
            existing: true
        }, (el) => {
            if (globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.backgroundColor = "black"
            }
        })
        document.arrive(`label[style*="color: black"]`, {
            existing: true
        }, (el) => {
            if (globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.color = "#e8e6e3"
            }
        })

        document.arrive(`div[style*="black"]`, {
            existing: true
        }, (el) => {
            if (!globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.backgroundColor = "background-color: rgb(255, 255, 255)"
            }
        })
        document.arrive(`label[style*="color: rgb(232, 230, 227)"]`, {
            existing: true
        }, (el) => {
            if (!globalThis.platformSettings.get('darkMode')) {
                (<HTMLElement>el).style.color = "black"
            }
        })

        if (globalThis.platformSettings.get('darkMode')) {
            if (!document.getElementById("darkMode")) {
                (document.body || document.documentElement).appendChild(this.dark);
                $("#logo > canvas")[0].style.filter = "invert(100%)";
                $('[src=\"/static/tagline.png\"]').hide()
            }
        } else {
            if (document.getElementById("darkMode") as HTMLElement) {
                (document.getElementById("darkMode") as HTMLElement).remove();
                $("#logo > canvas")[0].style.filter = ""
                $('[src=\"/static/tagline.png\"]').show()
            }
        }
    }

    public injectResultsContainer() {
        let self = this
        document.arrive(".logbox", function (el) {
            if (self.mode === "video") {
                $(self.resultsContainer).insertAfter(el.children[0].children[0])
            }
        })
        document.arrive(".logtopicsettings", function (el) {
            let switchDarkMode = utils.createElement('label', null, [
                utils.createElement('input', {
                    type: "checkbox",
                    checked: globalThis.platformSettings.get('darkMode'),
                    onchange: async function () {
                        globalThis.platformSettings.setBack({'darkMode': this.checked}, () => {
                            self.processDarkMode()
                        })
                    }
                }),
                utils.createElement('span', {
                    innerText: " Enable unofficial dark mode"
                })
            ])
            $('<br>').insertBefore(el.children[0])
            $(utils.createElement('span', {
                innerText: " (?)",
                style: "cursor:pointer",
                onclick: () => {
                    new ContentSwalInfoOmegle().showFromStart()
                }
            })).insertBefore(el.children[0])
            $(switchDarkMode).insertBefore(el.children[0])

            let switchModeLabel = utils.createElement('label', null, [
                utils.createElement('input', {
                    type: "checkbox",
                    checked: !globalThis.platformSettings.get('minimalism'),
                    onchange: async function (ev: JQuery.ChangeEvent) {
                        switchModeOmegle()
                        ev.currentTarget.checked = false
                    }
                }),
                utils.createElement('span', {
                    innerText: " Enable advanced mode"
                })
            ])
            $('<br>').insertBefore(el.children[0])
            $(switchModeLabel).insertBefore(el.children[0])
        })

    }

    public injectIpEventListener = () => {
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
                console.dir("IP: " + parsedCandidate.address)
                if (this.rmdaddr !== parsedCandidate.address) {
                    this.rmdaddr = parsedCandidate.address;
                    console.dir("IP CHANGED")
                    this.onNewIP(this.rmdaddr)
                }
            }
        }, false);
    }


    private onNewIP = (newIp: string) => {
        // TODO: validate ip address
        newIp = newIp.replace("[", "").replace("]", "")

        if (this.curIps.includes(newIp)) {
            return
        } else {
            this.curIps.push(newIp)
        }

        chrome.runtime.sendMessage({
            makeGeolocationRequest: newIp,
            language: this.apiLanguage,
            allow: this.apiProviders
        }, (response) => {
            if (response.failed && response.failed.includes('ve-api')) {
                this.apiProviders = this.apiProviders.filter(provider => provider !== "ve-api")
            }
            if (!this.curIps.includes(newIp)) {
                return
            }
            if (response.status === 200) {
                this.processData(response.body, newIp)
            }
        });
    }

    private processData = (json: any, ip: string) => {
        if (json.status === "success") {
            if (!this.curIps.includes(ip)) {
                return
            }

            let ipApiString = ``
            let title = ``

            if (json.mobile) {
                ipApiString += `<span><b>${json.country} (${chrome.i18n.getMessage("minimalismExplainMobile")}: ${json.regionName}, ${json.city}).</b></span>`
                title = `${chrome.i18n.getMessage("lowAccuracy")} |||| IP: ${json.query}  Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || ISP: ${json.isp} ||  Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`

                title = `${chrome.i18n.getMessage("lowAccuracy")} || IP: ${json.query} || Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`
            } else {
                ipApiString += `<span><b>${json.city} (${json.regionName}), ${json.country}.</b></span>`
                title = `IP: ${json.query} || Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || ISP: ${json.isp} || Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`
            }
            if (json.proxy) {
                ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainProxy")}`
            }
            if (json.hosting) {
                ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainHosting")}`
            }

            if (this.resultsContainer.innerHTML !== "") {
                $("<br>").appendTo(this.resultsContainer)
            }

            $(`<span title="${DOMPurify.sanitize(title)}">${DOMPurify.sanitize(ipApiString)}</span>`).appendTo(this.resultsContainer)
        }
    }

    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            console.dir(document.body.className)
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("video")) {
                    this.mode = "video"
                    if (attributeValue.includes('inconversation')) {
                        // active or in search
                        this.resultsContainer.innerHTML = ""
                    } else {
                        this.curIps = []
                    }
                } else {
                    this.mode = "text"
                }
            }
        });
    }
}