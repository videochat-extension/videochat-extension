import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";

export class StatsModule {
    private static instanceRef: StatsModule;
    public countBeforeSaveStats = 0;
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsStats")
        },
        {
            type: "button",
            text: chrome.i18n.getMessage("clearStats"),
            onclick: (e: MouseEvent) => {
                const result = confirm("Clear?");
                if (result) {
                    this.clear()
                }
            }
        },
    ]
    public tabs: any = []
    private driver: ChatruletkaDriver;
    private stats = globalThis.settings.stats

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        this.createTabs()
    }

    static initInstance(driver: ChatruletkaDriver): StatsModule {
        if (StatsModule.instanceRef === undefined) {
            StatsModule.instanceRef = new StatsModule(driver);
        }

        return StatsModule.instanceRef;
    }

    public increaseCountAll() {
        this.stats.countAll++
        this.updStats(false)
    }

    public decreaseCountAll() {
        this.stats.countAll--
        this.updStats(false)
    }

    public increaseMaleSkip() {
        this.stats.countMaleSkip++
        this.updStats(false)
    }

    public decreaseMaleSkip() {
        this.stats.countMaleSkip--
        this.updStats(false)
    }

    public increaseFemaleSkip() {
        this.stats.countFemaleSkip++
        this.updStats(false)
    }

    public decreaseFemaleSkip() {
        this.stats.countFemaleSkip--
        this.updStats(false)
    }

    public increaseCountMales() {
        this.stats.countMales++
        this.updStats(false)
    }

    public decreaseCountMales() {
        this.stats.countMales--
        this.updStats(false)
    }

    public increaseCountFemales() {
        this.stats.countFemales++
        this.updStats(false)
    }

    public decreaseCountFemales() {
        this.stats.countFemales--
        this.updStats(false)
    }

    public increaseManSkip() {
        this.stats.countManSkip++
        this.updStats(false)
    }

    public decreaseManSkip() {
        this.stats.countManSkip++
        this.updStats(false)
    }

    public increaseStatsTime(param: number) {
        this.stats.time += param
        this.updStats(false)
    }

    public increaseCountNew() {
        if (this.driver.modules.blacklist) {
            this.stats.countNew++
            this.updStats(false)
        }
    }

    public decreaseCountNew() {
        if (this.driver.modules.blacklist) {
            this.stats.countNew--
            this.updStats(false)
        }
    }

    public increaseCountDup() {
        if (this.driver.modules.blacklist) {
            this.stats.countDup++
            this.updStats(false)
        }
    }

    public decreaseCountDup() {
        if (this.driver.modules.blacklist) {
            this.stats.countDup--
            this.updStats(false)
        }
    }

    public updStats(force: boolean) {
        (document.getElementById("stWhole") as HTMLElement).innerText = this.stats.countAll;
        (document.getElementById("stMlSk") as HTMLElement).innerText = this.stats.countMaleSkip;
        (document.getElementById("stFmlSk") as HTMLElement).innerText = this.stats.countFemaleSkip;
        (document.getElementById("stMlCnt") as HTMLElement).innerText = this.stats.countMales;
        (document.getElementById("stFmlCnt") as HTMLElement).innerText = this.stats.countFemales;
        (document.getElementById("stMnSk") as HTMLElement).innerText = this.stats.countManSkip;

        if (this.driver.modules.blacklist) {
            (document.getElementById("stNwIp") as HTMLElement).innerText = this.stats.countNew;
            (document.getElementById("stBnIp") as HTMLElement).innerText = this.stats.countDup;
        }

        (document.getElementById("stTime") as HTMLElement).innerText = utils.secondsToHms(this.stats.time)
        this.countBeforeSaveStats += 1
        if (force || this.countBeforeSaveStats >= 10) {
            this.countBeforeSaveStats = 0
            this.saveStats()
        }
    }

    public clear() {
        this.stats = {
            countAll: 0,
            countNew: 0,
            countDup: 0,
            countMales: 0,
            countFemales: 0,
            countManSkip: 0,
            countMaleSkip: 0,
            countFemaleSkip: 0,
            time: 0
        }
        this.updStats(true)
    }

    protected createTabs() {
        this.tabs[0] = ControlsTabStats.initInstance(this.driver, this)
    }

    private saveStats() {
        chrome.storage.sync.set({"stats": this.stats});
    }
}

export class ControlsTabStats {
    private static instanceRef: ControlsTabStats;
    public name = chrome.i18n.getMessage("tabStats")
    public content: HTMLElement
    public tab: HTMLElement
    public readonly marginBottom = 5
    private driver: ChatruletkaDriver;
    private module: any;

    private constructor(driver: ChatruletkaDriver, module?: any) {
        this.driver = driver
        this.module = module
        this.tab = this.getTabHTML()
        this.content = this.getContentHTML()
    }

    static initInstance(driver: ChatruletkaDriver, module?: any): ControlsTabStats {
        if (ControlsTabStats.instanceRef === undefined) {
            ControlsTabStats.instanceRef = new ControlsTabStats(driver, module);
        }

        return ControlsTabStats.instanceRef;
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
            className: "tabs__content",
            id: "statsPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "statsInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsWhole")
                    }),
                    utils.createElement('span', {
                        id: 'stWhole'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsTimeSpent")
                    }),
                    utils.createElement('span', {
                        id: 'stTime'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsMaleSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stMlSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsFemaleSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stFmlSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsManualSkip")
                    }),
                    utils.createElement('span', {
                        id: 'stMnSk'
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsMlCount")
                    }),
                    utils.createElement('span', {
                        id: 'stMlCnt'
                    }),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerText: chrome.i18n.getMessage("statsFmlCount")
                    }),
                    utils.createElement('span', {
                        id: 'stFmlCnt'
                    }),
                ]
            )
        ])
    }
}