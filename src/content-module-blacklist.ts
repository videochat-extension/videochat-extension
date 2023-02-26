import {ChatruletkaDriver} from "./content-driver-chatruletka";
import {ControlsModule} from "./content-module-controls";
import * as utils from "./utils";

export class BlacklistModule {
    private static instanceRef: BlacklistModule;
    private driver: ChatruletkaDriver;

    private list = ["-"]
    private blacklistLoaded = false;
    private ban = new Audio(chrome.runtime.getURL('resources/audio/ban.mp3'))
    private male = new Audio(chrome.runtime.getURL('resources/audio/male.mp3'))

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver;
        this.ban.volume = 0.45;
        this.male.volume = 0.3;

        chrome.storage.local.get('ips', (result) => {
            this.list = result.ips;
            this.blacklistLoaded = true
        })

        document.getElementsByClassName('buttons__button start-button')[0].addEventListener("click", (e: any) => { // TODO: any should be KeyboardEvent but TS doesn't like it
            if (e.shiftKey) {
                this.driver.modules.blacklist.addIpsToList(this.driver.modules.geolocation.curIps)
            }
        })
    }

    static initInstance(driver: ChatruletkaDriver): BlacklistModule {
        if (BlacklistModule.instanceRef === undefined) {
            BlacklistModule.instanceRef = new BlacklistModule(driver);
        }

        return BlacklistModule.instanceRef;
    }

    public isIpInBlacklist(ip: string) {
        if (this.blacklistLoaded) {
            return this.list.includes(ip)
        } else {
            return false
        }
    }

    public addIpsToList(ip: string[]) {
        if (ip.length === 0)
            return

        ip.forEach((ip) => {
            this.addIpToList(ip, false)
        })
        this.sync()
    }

    public playBanSound() {
        if (globalThis.settings.skipSound)
            this.ban.play();
    }

    public playMaleSound() {
        if (globalThis.settings.skipSound)
            this.male.play();
    }

    public clear() {
        this.list = []
        this.sync()
    }

    public updBlacklistStats() {
        (document.getElementById("stBnCt") as HTMLElement).innerText = String(this.list.length);
    }

    public processAutoBan(ips: string[]) {
        if (globalThis.settings.dontBanMobile) {
            ips.forEach((ip) => {
                if (ip in this.driver.modules.geolocation.curInfo) {
                    if (!this.driver.modules.geolocation.curInfo[ip].mobile) {
                        this.addIpToList(ip, true)
                        this.playMaleSound()
                    }
                }
            })
        } else {
            // TODO: BLACKLIST MUST USE curIps
            // globalThis.local.ips.push((document.getElementById("remoteIP") as HTMLElement).innerText)
            // chrome.storage.local.set({"ips": globalThis.local.ips});
            this.addIpsToList(ips)
            this.playMaleSound()
        }
    }

    private addIpToList(ip: string, needToSync: boolean) {
        if (!this.list.includes(ip)) {
            this.list.push(ip)
            this.playMaleSound()
        }
        if (needToSync)
            this.sync()
    }

    private sync() {
        chrome.storage.local.set({"ips": this.list})
        this.updBlacklistStats()
    }
}

export class ControlsTabBans {
    private static instanceRef: ControlsTabBans;
    public name = chrome.i18n.getMessage("tabBans")
    private controls: ControlsModule;

    private constructor(controls: ControlsModule) {
        this.controls = controls
    }

    static initInstance(controls: ControlsModule): ControlsTabBans {
        if (ControlsTabBans.instanceRef === undefined) {
            ControlsTabBans.instanceRef = new ControlsTabBans(controls);
        }

        return ControlsTabBans.instanceRef;
    }

    public getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    public getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "bansPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "bansInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("bannedips")
                    }),
                    utils.createElement('span', {
                        id: 'stBnCt'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("goodips")
                    }),
                    utils.createElement('span', {
                        id: 'stNwIp'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("badips")
                    }),
                    utils.createElement('span', {
                        id: 'stBnIp'
                    }),
                ]
            )
        ])
    }
}