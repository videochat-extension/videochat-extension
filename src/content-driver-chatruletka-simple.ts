import $ from "jquery";
import {injectSwitchModeButton} from "./content-swal-switchmode";
import * as DOMPurify from "dompurify";

export class ChatruletkaSimpleDriver {
    private static instanceRef: ChatruletkaSimpleDriver;
    // Stages: stop = 0 | search = 1 | found = 2 | connected = 3 | play = 4
    private stageObserver: MutationObserver;
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
        injectSwitchModeButton(true)
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

    private onNewIP = (newIp: string) => {
        // TODO: validate ip address
        newIp = newIp.replace("[", "").replace("]", "")

        if (this.curIps.includes(newIp)) {
            return
        } else {
            this.curIps.push(newIp)
        }

        chrome.runtime.sendMessage({aremoteIP: newIp, language: "en"}, (response) => {
            console.dir(response)
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

                    $('<br><span>' + DOMPurify.sanitize(ipApiString) + '</span>').appendTo($(".message-bubble")[0])
                }
            }
        }, 250)
    }

    private onChangeStage = (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            if (mutation.attributeName === "class") {
                const attributeValue = String($(mutation.target).prop(mutation.attributeName));
                if (attributeValue.includes("s-search")) {
                    this.curIps = []
                } else if (attributeValue.includes("s-stop")) {
                    this.curIps = []
                }
            }
        });
    }
}