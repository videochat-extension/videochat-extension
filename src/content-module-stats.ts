import {ChatruletkaDriver} from "./content-driver-chatruletka";
import * as utils from "./utils";

export class StatsModule {
    private static instanceRef: StatsModule;
    public countBeforeSaveStats = 0;
    private driver: ChatruletkaDriver;
    private stats = globalThis.settings.stats

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
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
        (document.getElementById("stWhole") as HTMLElement).innerText = globalThis.settings.stats.countAll;
        (document.getElementById("stMlSk") as HTMLElement).innerText = globalThis.settings.stats.countMaleSkip;
        (document.getElementById("stFmlSk") as HTMLElement).innerText = globalThis.settings.stats.countFemaleSkip;
        (document.getElementById("stMlCnt") as HTMLElement).innerText = globalThis.settings.stats.countMales;
        (document.getElementById("stFmlCnt") as HTMLElement).innerText = globalThis.settings.stats.countFemales;
        (document.getElementById("stMnSk") as HTMLElement).innerText = globalThis.settings.stats.countManSkip;

        if (this.driver.modules.blacklist) {
            (document.getElementById("stNwIp") as HTMLElement).innerText = globalThis.settings.stats.countNew;
            (document.getElementById("stBnIp") as HTMLElement).innerText = globalThis.settings.stats.countDup;
        }

        (document.getElementById("stTime") as HTMLElement).innerText = utils.secondsToHms(globalThis.settings.stats.time)
        this.countBeforeSaveStats += 1
        if (force || this.countBeforeSaveStats >= 10) {
            this.countBeforeSaveStats = 0
            this.saveStats()
        }
    }

    private saveStats() {
        chrome.storage.sync.set({"stats": this.stats});
    }
}