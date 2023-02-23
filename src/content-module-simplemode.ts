import $ from "jquery";
import {injectSwitchModeButton} from "./content-swal-switchmode";
import * as DOMPurify from "dompurify";
import {doLookupRequest1, doLookupRequest2, onNewIP} from "./content-module-geolocation";

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
            let candidate = new RTCIceCandidate((<CustomEvent>evt).detail.args[0])
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
        }

        chrome.runtime.sendMessage({remoteIP: newIp, language: "en"}, function (response) {
            console.dir(`request to send ip-api request sent to service worker: ${response}`)
        });
    }

    private processData = (json: any, ip: string) => {
        setTimeout(() => {
            if ($('span[data-tr="connection"]').length === 1) {
                if (json.status === "success") {
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