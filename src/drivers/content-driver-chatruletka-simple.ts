import $ from "jquery";
import {createSwitchModeButton} from "./chatruletka/content-swal-switchmode";
import * as DOMPurify from "dompurify";
import * as utils from "../utils/utils";
import * as SDPUtils from "sdp";

export class ChatruletkaSimpleDriver {
    private static instanceRef: ChatruletkaSimpleDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
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
    private rmdaddr = "0.0.0.0"
    private curIps: string[] = []

    private resultsContainer: HTMLElement = utils.createElement('span')

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
        document.arrive("[data-tr=\"connection\"]", function (el) {
            $(self.resultsContainer).appendTo(el.parentElement!)
        })
    }

    public injectIpEventListener = () => {
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

    private checkApi() {
        chrome.runtime.sendMessage({aremoteIP: "1.1.1.1", language: this.apiLanguage}, (response) => {
            console.dir(`ip-api.com test: ${response.status}`)
            let apiStatusContainer = $('#apiStatusContainer')
            if (response.status === 200) {
                if ($('span[data-tr="rules"]').length === 1 && apiStatusContainer.length == 1) {
                    apiStatusContainer[0].innerHTML = chrome.i18n.getMessage("apiStatus2")
                }
            } else {
                if ($('span[data-tr="rules"]').length === 1 && apiStatusContainer.length == 1) {
                    apiStatusContainer[0].innerHTML = DOMPurify.sanitize('<b>ERROR: ' + response.status + ' || </b>' + chrome.i18n.getMessage("apiStatus0"))
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
        // TODO: validate ip address
        newIp = newIp.replace("[", "").replace("]", "")

        if (this.curIps.includes(newIp)) {
            return
        } else {
            this.curIps.push(newIp)
        }

        chrome.runtime.sendMessage({aremoteIP: newIp, language: this.apiLanguage}, (response) => {
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
                title = `${chrome.i18n.getMessage("lowAccuracy")} || Country: ${json.country} || Region: ${json.regionName} || City: ${json.city} || Mobile: ${json.mobile} || Proxy: ${json.proxy} || Hosting: ${json.hosting}`
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
        }
    }

    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("s-stop")) {
                    this.curIps = []
                    this.resultsContainer.innerHTML = ""
                } else if (attributeValue.includes("s-search")) {
                    this.curIps = []
                    this.resultsContainer.innerHTML = ""
                }
            }
        });
    }
}