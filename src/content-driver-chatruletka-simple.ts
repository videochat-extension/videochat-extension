import $ from "jquery";
import {createSwitchModeButton} from "./content-swal-switchmode";
import * as DOMPurify from "dompurify";
import * as utils from "./utils";

export class ChatruletkaSimpleDriver {
    private static instanceRef: ChatruletkaSimpleDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    private stageObserver: MutationObserver;

    // https://ip-api.com/docs/api:json#:~:text=DEMO-,Localization,-Localized%20city%2C
    private apiLanguage = function(){
        let lang = window.navigator.language.slice(0, 2)
        if (lang === "pt") {
            lang = "pt-BR"
        }
        else if (lang == "zh") {
            lang = "zn-CN"
        }
        return lang
    }();
    private rmdaddr = "0.0.0.0"
    private curIps: string[] = []

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
        return true
    }

    public injectIpEventListener = () => {
        window.addEventListener("[object Object]", (evt) => {
            let candidate: any = (<CustomEvent>evt).detail.candidate

            // chrome returns only one property
            if (Object.keys(candidate).length === 1) {
                candidate = new RTCIceCandidate((<CustomEvent>evt).detail.candidate.json)
            }

            if (candidate.type === "srflx" && candidate.address) {
                console.dir("IP: " + candidate.address)
                if (this.rmdaddr !== candidate.address) {
                    this.rmdaddr = candidate.address;
                    console.dir("IP CHANGED")
                    this.onNewIP(this.rmdaddr)
                }
            }
        }, false);
    }

    private checkApi() {
        chrome.runtime.sendMessage({aremoteIP: "1.1.1.1", language: this.apiLanguage}, (response) => {
            console.dir(`ip-api.com test: ${response.status}`)
            if (response.status === 200) {
                let apiStatusContainer = $('#apiStatusContainer')
                if ($('span[data-tr="rules"]').length === 1 && apiStatusContainer.length == 1) {
                    apiStatusContainer[0].innerHTML = chrome.i18n.getMessage("apiStatus2")
                }
            } else {
                let apiStatusContainer = $('#apiStatusContainer')
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
                console.dir(arguments[0].dataset.tr)
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

        let rules = $("[data-tr=\"rules\"]")
        if (rules.length === 1) {
            addButtonTo(rules[0])
        }

        document.arrive("[data-tr=\"rules\"]", function (el) {
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

        chrome.runtime.sendMessage({aremoteIP: newIp, language: "en"}, (response) => {
            if (!this.curIps.includes(newIp)) {
                return
            }
            if (response.status === 200) {
                this.processData(response.body, newIp)
            }
        });
    }

    private processData = (json: any, ip: string) => {
        setTimeout(() => {
            if ($('span[data-tr="connection"]').length === 1) {
                if (json.status === "success") {
                    if (!this.curIps.includes(ip)) {
                        return
                    }

                    let ipApiString = ``

                    if (json.mobile) {
                        ipApiString += `<b>${json.country}.</b>`
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainMobile")}`
                    } else {
                        ipApiString += `<b>${json.city} (${json.regionName}), ${json.country}.</b>`
                    }
                    if (json.proxy) {
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainProxy")}`
                    }
                    if (json.hosting) {
                        ipApiString += `<br>${chrome.i18n.getMessage("minimalismExplainHosting")}`
                    }

                    $(`<br><span>${DOMPurify.sanitize(ipApiString)}</span>`).appendTo($(".message-bubble")[0])
                }
            }
        }, 250)
    }

    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));

                if (attributeValue.includes("s-stop")) {
                    this.curIps = []
                }
                else if (attributeValue.includes("s-search")) {
                    this.curIps = []
                }
            }
        });
    }
}