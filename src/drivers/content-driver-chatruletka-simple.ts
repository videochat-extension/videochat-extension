import $ from "jquery";
import {createSwitchModeButton} from "./chatruletka/content-swal-switchmode";
import * as DOMPurify from "dompurify";
import * as utils from "../utils/utils";
import * as SDPUtils from "sdp";
import Swal from "sweetalert2";
import {isIP} from 'is-ip';

export class ChatruletkaSimpleDriver {
    private static instanceRef: ChatruletkaSimpleDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    public stage: 0 | 1 | 2 | 3 | 4 = 0
    private stageObserver: MutationObserver;

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
    private apiProviders: { [key: string]: { options: {} } } = {
        've-api': {
            'options': {}
        },
        'ip-api': {
            'options': {}
        },
        'geojs': {
            'options': {}
        }
    }
    private rmdaddr = "0.0.0.0"
    private curIps: string[] = []
    private browser = utils.getUserBrowser()

    private resultsContainer: HTMLElement = utils.createElement('span')

    public curDisplayed: number = 0;
    public play: number = 0;
    public search: number = 0;
    public found: number = 0;

    private constructor() {
        this.stageObserver = new MutationObserver(this.onChangeStage)
    }

    static getInstance(): ChatruletkaSimpleDriver {
        if (ChatruletkaSimpleDriver.instanceRef === undefined) {
            ChatruletkaSimpleDriver.instanceRef = new ChatruletkaSimpleDriver();
        }

        return ChatruletkaSimpleDriver.instanceRef;
    }

    public start(element: HTMLElement): boolean {
        this.stageObserver.observe(element, {attributes: true});
        this.injectIpEventListener()
        this.injectSwitchModeButton()
        this.injectResultsContainer()
        return true
    }

    public injectResultsContainer() {
        let self = this
        document.arrive(".message-report-link", function (el) {
            $(self.resultsContainer).appendTo(el.parentElement!)
        })
    }

    public injectIpEventListener = () => {
        if (globalThis.workerPort) {
            globalThis.workerPort.onMessage.addListener((mes) => {
                if (mes !== "pong") {
                    let candidate: string = JSON.parse(mes)

                    let parsedCandidate: RTCIceCandidate | SDPUtils.SDPIceCandidate | undefined
                    if (this.browser === "firefox") {
                        // avoiding errors while parsing useless candidates
                        if (candidate.includes('srflx')) {
                            parsedCandidate = SDPUtils.parseCandidate(candidate)
                        }
                    } else {
                        // @ts-ignore
                        parsedCandidate = new RTCIceCandidate(candidate)
                    }

                    if (typeof parsedCandidate !== "undefined" && parsedCandidate.type === "srflx" && parsedCandidate.address) {
//                        console.dir("IP: " + parsedCandidate.address)
                        if (this.rmdaddr !== parsedCandidate.address) {
                            this.rmdaddr = parsedCandidate.address;
//                            console.dir("IP CHANGED")
                            this.onNewIP(this.rmdaddr)
                        }
                    }
                }

            })

            globalThis.workerPort.onDisconnect.addListener(function () {
                // @ts-ignore
                globalThis.workerPort = null;
                Swal.fire({
                    icon: 'error',
                    toast: true,
                    width: 600,
                    position: 'bottom-start',
                    title: "Videochat Extension - Geolocation broke down",
                    html: "Please reload the page, something went wrong. Sorry for the inconvenience.",
                    confirmButtonText: "OK (Close warning)"
                })
            });
        }
    }

    private checkApi() {
        this.apiProviders = {
            've-api': {
                'options': {}
            },
            'ip-api': {
                'options': {}
            },
            'geojs': {
                'options': {}
            }
        }
        if (globalThis.patreon) {
            this.apiProviders[globalThis.patreon.name] = globalThis.patreon
        }
        chrome.runtime.sendMessage({
                makeGeolocationRequest: "1.1.1.1",
                language: this.apiLanguage,
                allow: this.apiProviders
            }, (response) => {
                let apiStatusContainer = $('#apiStatusContainer')
                if (response.status == -429) {
//                    apiStatusContainer[0].innerHTML = "geolocation's internals are overloaded, sorry..."
                } else {
                    console.dir(`geolocation test: ${response.status}`)
                    if (response.failed && response.failed.includes('ve-api')) {
                        delete this.apiProviders['ve-api']
                    }
                    if (response.status === 200) {
                        if ($('span[data-tr="rules"]').length === 1 && apiStatusContainer.length == 1) {
                            apiStatusContainer[0].innerHTML = chrome.i18n.getMessage("apiStatus2")
                        }
                    } else {
                        if ($('span[data-tr="rules"]').length === 1 && apiStatusContainer.length == 1) {
                            apiStatusContainer[0].innerHTML = DOMPurify.sanitize('<b>ERROR: ' + response.status + ' || </b>' + chrome.i18n.getMessage("apiStatus0"))
                        }
                    }
                }
            })
    }

    private injectSwitchModeButton() {
        let self = this
        let switchModeButtonContainer = utils.createElement('div', {
                id: "switchModeButtonContainer"
            }, [
                utils.createElement('br'),
                createSwitchModeButton(),
                utils.createElement('span', {
                    innerText: " "
                }),
                utils.createElement('span', {
                    id: "apiStatusContainer"
                })
            ])

        function addButtonTo(el: HTMLElement) {
            let switchModeButtonEnjoyer: HTMLElement = el.parentElement!
            $(switchModeButtonContainer).appendTo(switchModeButtonEnjoyer)
            let switchModeSelector = $('#switchModeButtonContainer')
            switchModeSelector.show()

            const obs = new MutationObserver((mutationList, observer) => {
                let switchModeSelector = $('#switchModeButtonContainer')

                if (arguments[0].dataset.tr === "searching") {
                    if (switchModeSelector.length == 1) {
                        switchModeSelector.hide()
                    }
                }
                if (arguments[0].dataset.tr === "rules") {
                    if (switchModeSelector.length == 1) {
                        switchModeSelector.show()
                    }
                }
            })
            obs.observe(el, {attributes: true})

            self.checkApi()
        }

        document.arrive("[data-tr=\"rules\"]", {existing: true}, function (el) {
            addButtonTo(<HTMLElement>el)
        })
    }

    private onNewIP = (newIp: string) => {
        newIp = newIp.replace("[", "").replace("]", "")

        // if a new IP reveals during ongoing conversation with an already established remote IP,
        // this is likely to silently supress events when mods are connecting during conversation
        // it should also kill any notice of renegotiations with the interlocutor, but wont affect the app itself
        if (this.stage == 4 && (this.curIps.length > 0 || this.curDisplayed > 0)) {
            // console.dir("IP suppressed")
            return
        }
        if (isIP(newIp)) {
            if (this.curIps.includes(newIp) || this.curIps.length > 3) {
                return
            } else {
                this.curIps.push(newIp)
            }

            chrome.runtime.sendMessage({
                    makeGeolocationRequest: newIp,
                    language: this.apiLanguage,
                    allow: this.apiProviders
                }, (response) => {

                    if (response.status == -429) {
                        let apiStatusContainer = $('#apiStatusContainer')
                        apiStatusContainer[0].innerHTML = "geolocation's internals are overloaded, sorry..."
                    } else {
                        if (!this.curIps.includes(newIp)) {
                            return
                        }
                        if (response.status === 200) {
                            this.processData(response.body, newIp)
                        }
                    }
                });
        }
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
                title = `${chrome.i18n.getMessage("lowAccuracy")} || Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || ISP: ${json.isp} ||  Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`
            } else {
                ipApiString += `<span><b>${json.city} (${json.regionName}), ${json.country}.</b></span>`
                title = `Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || ISP: ${json.isp} || Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`
            }
            if (json.proxy) {
                ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainProxy")}`
            }
            if (json.hosting) {
                ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainHosting")}`
            }

            $(`<br><span title="${DOMPurify.sanitize(title)}">${DOMPurify.sanitize(ipApiString)}</span>`).appendTo(this.resultsContainer)
            this.curDisplayed += 1
        }
    }

    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("s-stop")) {
                    this.stage = 0
                    this.curIps = []
                    this.curDisplayed = 0
                    this.resultsContainer.innerHTML = ""
                } else if (attributeValue.includes("s-search")) {
                    this.stage = 1
                    this.curIps = []
                    this.resultsContainer.innerHTML = ""
                    this.curDisplayed = 0
                    this.search = Date.now()
                } else if (attributeValue.includes("s-found")) {
                    this.stage = 2
                    this.found = Date.now()
                } else if (attributeValue.includes("s-connected")) {
                    this.stage = 3
                } else if (attributeValue.includes("s-play")) {
                    this.stage = 4
                    this.play = Date.now()
                }
            }
        });
    }
}