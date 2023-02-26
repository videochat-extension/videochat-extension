import $ from "jquery";
import {ChatruletkaDriver} from "./content-driver-chatruletka";

require('arrive')

export class AutomationModule {
    private static instanceRef: AutomationModule;

    private driver: ChatruletkaDriver;

    private constructor(driver: ChatruletkaDriver) {
        this.driver = driver
    }

    static initInstance(driver: ChatruletkaDriver): AutomationModule {
        if (AutomationModule.instanceRef === undefined) {
            AutomationModule.instanceRef = new AutomationModule(driver);
        }

        return AutomationModule.instanceRef;
    }

    public injectAutomationSkipFourSec() {
        setInterval(() => {
            if (globalThis.settings.skipFourSec) {
                try {
                    if ((this.driver.stage === 2) && (this.driver.found + 4000 < Date.now())) {
                        console.dir("Skipping due to loading time limit");
                        (document.getElementsByClassName('buttons__button start-button')[0] as HTMLElement).click()
                        //settings.stats.countManSkip--
                    }
                } catch (e) {
                    //console.dir(e)
                }
            }
        }, 1000)
    }

    public injectAutomationAutoResume() {
        (document.getElementById('overlay') as HTMLElement).style.background = "none";
        // document.getElementById('overlay').style.position = "unset"

        (document.getElementById('local-video-warning-popup') as HTMLElement).style.filter = "opacity(0)"
        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                    if (mutation.attributeName === "class") {
                        if ((mutation.target as HTMLElement).className.includes("disabled")) {
                            $(".ok").removeClass("disabled");
                            let disabledButton: HTMLElement = (document.getElementsByClassName("video-warning__btn")[0]).firstElementChild as HTMLElement
                            disabledButton.click()
                        }
                    }
                }
            )
        }).observe($(".ok")[0], {attributes: true});
    }

    public injectAutomationSkipWrongCountry() {
        let self = this
        document.arrive(".tr-country", function (el: any) { // TODO: FIX TYPE
            if (globalThis.settings.skipwrongcountry) {
                try {
                    if (el.parentElement?.className === "message-bubble") {
                        let expectedCountry = "ZZ" // http://xml.coverpages.org/country3166.html#:~:text=ZZ,or%20unspecified%20country

                        if ($(".country-filter-popup__country").filter(".all").filter(".selected").length == 0) {
                            expectedCountry = $(".country-filter-popup__country").filter(".selected").children('span[data-tr]')[0].getAttribute('data-tr')!
                        }
                        let receivedCountry = el.dataset.tr
                        if (expectedCountry !== "ZZ" && expectedCountry !== receivedCountry) {
                            self.driver.stopAndStart()
                            console.dir(el)
                            console.dir(`SKIPPED WRONG COUNTRY. EXPECTED: ${expectedCountry}, RECEIVED: ${receivedCountry}.`)
                        }
                    }
                } catch (e) {
                    console.dir("SKIP WRONG COUNTRY EXCEPTION BEGIN")
                    console.dir(e)
                    console.dir("SKIP WRONG COUNTRY EXCEPTION END")
                }
            }
        })
    }
}
