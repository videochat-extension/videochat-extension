import {ChatruletkaDriver} from "../content-driver-chatruletka";
import * as utils from "../../utils/utils";
import $ from "jquery";
import {ContentSwalChangelog} from "../../swal/content-swal-changelog";
import {ContentSwalInfo} from "./content-swal-info";
import {ControlsTabApi} from "./content-module-geolocation";

require('tooltipster')

export class ControlsModule {
    private static instanceRef: ControlsModule;
    public videoContainerHeight = 0
    public chatContainerHeight = 0
    public driver: ChatruletkaDriver;
    private tabs: any = []
    private controls: HTMLElement | undefined;
    public vertical = false

    protected constructor(driver: ChatruletkaDriver) {
        this.driver = driver
        if (driver.site.vertical) {
            this.vertical = true
        }
    }

    static initInstance(driver: ChatruletkaDriver): ControlsModule {
        if (ControlsModule.instanceRef === undefined) {
            ControlsModule.instanceRef = new ControlsModule(driver);
        }

        return ControlsModule.instanceRef;
    }

    public start(tabs: any[]) {
        tabs.forEach((tab) => {
            this.tabs.push(tab)
        })
        this.controls = this.createControls();
    }

    public resizeControls = () => {
        if (this.vertical) {
            return
        }
        // TODO: CHECK IF FIX FOR OME.TV WORKED
        if ($('li.active')[0].innerText === chrome.i18n.getMessage("tab3")) {
            if (globalThis.platformSettings.get("expand")) {
                setTimeout(()=>{this.resizemap(true)}, 600)
            } else {
                this.videoContainerHeight = 0
                this.chatContainerHeight = 0
                this.resizemap(false)
            }
        } else {
            this.videoContainerHeight = 0
            this.chatContainerHeight = 0
            this.resizemap(false)
        }
    }

    // TODO: FIX IT ON OME.TV: GO SETTINGS -> resize window -> GO OTHER TAB -> size wont change
    public resizemap = (extend: boolean): void => {
        if (extend && globalThis.platformSettings.get("expand")) {
            let newVideoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height)
            let newChatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height)

            if (newVideoContainerHeight !== (newVideoContainerHeight + newChatContainerHeight) / 2) {
                this.videoContainerHeight = parseFloat((document.getElementById("video-container") as HTMLElement).style.height);
                this.chatContainerHeight = parseFloat((document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height);
                // console.dir(this.videoContainerHeight);
                // console.dir(this.chatContainerHeight);
                // console.trace("1");

                (document.getElementById("video-container") as HTMLElement).style.height = (this.videoContainerHeight + this.chatContainerHeight) / 2 + "px";
                (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = (this.videoContainerHeight + this.chatContainerHeight) / 2 + "px"
            }
        } else {
            // console.dir('resize false')
            // console.dir(this.videoContainerHeight)
            // console.dir(this.chatContainerHeight)
            if (this.videoContainerHeight !== 0 && this.chatContainerHeight !== 0) {
                (document.getElementById("video-container") as HTMLElement).style.height = this.videoContainerHeight + "px";
                (document.getElementsByClassName("chat-container")[0] as HTMLElement).style.height = this.chatContainerHeight + "px"
            }
        }

        let tabs = $(".tabs__caption")[0]

        // I remade the old hardcoded resize function to support the custom set of tabs,
        // but this must be redone normally in the future, without changing what the interface looks like
        Array.from({length: 2}, () => {
            this.tabs.forEach((tab: any) => {
                let el = <HTMLElement>tab.content.lastElementChild
                if (el) {
                    if (tab.content.childElementCount > 0) {
                        let newHeight = tab.content.offsetHeight - tabs.offsetHeight - tab.marginBottom
                        if (tab.content.childElementCount > 1) {
                            [...Array(tab.content.childElementCount - 1).keys()].forEach((key) => {
                                newHeight += -(tab.content.children[key] as HTMLElement).offsetHeight
                            })
                        }
                        if (this.vertical) {
                            newHeight += -15
                        }
                        el.style.height = newHeight + "px"
                    }
                }
            })
        });

        this.tabs.forEach((tab: any) => {
            tab.handleResize()
        })
    }

    public static defaults = {
        expand: true
    }
    public settings = [
        {
            type: "header",
            text: chrome.i18n.getMessage("settingsControls")
        },
        {
            type: "checkbox",
            important: false,
            key: "expand",
            text: chrome.i18n.getMessage("expand"),
            tooltip: chrome.i18n.getMessage("tooltipExpand"),
            enable: () => {
                setTimeout(() => {
                    this.resizemap(true)
                }, 100)
            },
            disable: () => {
                this.resizemap(false)
            }
        },
    ]

    public injectControls(tabs: any[]) {
        this.start(tabs)

        // TODO: do I really need both tooltipster and css-tooltip?
        const c = document.createElement('link');
        c.rel = "stylesheet";
        c.href = chrome.runtime.getURL('libs/css/css-tooltip.min.css');

        const cs = document.createElement('link');
        cs.rel = "stylesheet";
        cs.href = chrome.runtime.getURL("libs/css/tooltipster.bundle.min.css");

        (document.head || document.documentElement).appendChild(c);
        (document.head || document.documentElement).appendChild(cs);

        ($(".gender-selector")[0] as HTMLElement).parentElement!.remove()
        if (this.vertical) {
            let chat = $("[class='chat']")
            let controls = utils.createElement('div', {
                id: "videochat-extension-controls-container",
                style: "height:290px; width:390px; border: 1px solid #d5d5d5;box-shadow: 0 0 5px 0 rgba(0,0,0,.15) inset;background: #fff;"
            })
            controls.style.height = "225px"
            // controls.style.width = parseFloat($(".buttons__button.start-button")[0].style.width) * 2 + 8 + "px"
            $(controls).appendTo(chat)

            let body = $("[class='chat__body']")
            body[0].style.top = parseInt(controls.style.height) + 9 + "px"
            if (this.controls) {
                $(this.controls).appendTo("#videochat-extension-controls-container");
            }

        } else {
            if (this.controls) {
                $(this.controls).insertBefore(".chat");
            }
        }

        this.addTabClickHandler()

        $('.tooltip').tooltipster({maxWidth: 300, distance: -1})

        if (!this.vertical) {
            let oldWidth = 0
            const observer = new MutationObserver((mutationList: any, observer: any) => {
                if (this.controls) {
                    for (const mutation of mutationList) {
                        if (mutation.type === "attributes" && mutation.attributeName === "style") {
                            if (oldWidth !== mutation.target.style.width) {
                                // console.dir("MUTATED")
                                oldWidth = mutation.target.style.width
                                let mar = parseInt(window.getComputedStyle(this.controls).marginRight)
                                mutation.target.style.maxWidth = (parseInt(mutation.target.style.width) - (parseInt(this.controls.style.width) + mar) / 2) + "px"
                                this.driver.chat.style.maxWidth = (parseInt(mutation.target.style.width) - (parseInt(this.controls.style.width) + mar) / 2) + "px"
                                this.resizeControls()
                            }
                        }
                    }
                }
            });
            observer.observe(this.driver.buttons, {attributes: true});
            new ResizeObserver(this.resizeControls).observe(document.getElementById("overlay") as HTMLElement)

            window.dispatchEvent(new Event('resize'));
        }
    }

    protected createStyle() {
        return utils.createElement('style', {
            textContent: `.tabs__content {
                display: none;
                padding-left: 5px;
                padding-right: 5px;
              }
              
              .tabs__content.active {
                display: block;
              }
              
              .tabs {
                position: relative;
                height: 100%;
                word-break: break-word;
                user-select: text;
              }
              
              .tabs__caption {
                display: flex;
                flex-wrap: wrap;
                list-style-type: none;
                bottom: 0px;
                background: #f8f8f8;
                margin: 0;
                position: absolute;
                width: 100%;
                border-bottom: 1px solid lightgray;
                user-select: none;
              }
              
              .tabs__caption li {
                padding: 0.2rem 0.5rem;
                text-decoration: none;
                color: black;
                text-align: center;
                flex-shrink: 0;
                flex-grow: 1;
              }
      
              .tabs__caption li:not(.active) {
                cursor: pointer;
              }
              
              .tabs__caption .active {
                font-weight: bold;
              }
              
              .controls__row:after {
                content: "";
                display: table;
                box-sizing: border-box;
                clear: both;
              }
              
              dd {
                margin-inline-start: 20px!important;
              }
              
              input {
                margin-left: 5px!important;
              }
              
              p {
                display: inline-block;
              }
              
              small {font-size: xx-small!important;}
              `
        })
    }

    protected createTabs() {
        let tabs: HTMLElement[] = []
        this.tabs.forEach((tab: any) => {
            tabs.push(tab.tab)
        })
        if (tabs.length > 0) {
            tabs[0].className = "active"
        }
        return utils.createElement('ul', {
            className: "tabs__caption"
        }, tabs)
    }

    protected createContent() {
        let content: HTMLElement[] = []
        this.tabs.forEach((tab: ControlsTabApi) => {
            content.push(tab.content)
        })
        return content
    }

    protected createControls() {
        let content = [this.createStyle(), createHeader(), this.createTabs(), ...this.createContent()]
        if (this.vertical) {
            return utils.createElement('div', {
                className: 'chatt', id: 'controls', style: "width:100%; height: 100%;"
            }, [utils.createElement('div', {
                className: "tabs"
            }, content)])
        } else {
            return utils.createElement('div', {
                className: 'chat', id: 'controls', style: "width:390px; margin-right: calc(100vh / 768 * 10)"
            }, [utils.createElement('div', {
                className: "tabs chat"
            }, content)])
        }
    }

    protected doThisAfterTabClicked(tabElement: any) {

        this.tabs.forEach((tab: any) => {
            tab.handleTabClick()
        })


        if (tabElement.innerText === chrome.i18n.getMessage("tab3")) {
            this.resizemap(true)
        } else {
            this.resizemap(false)
        }
    }

    protected addTabClickHandler() {
        let self = this
        $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
            $(this)
                .addClass('active').siblings().removeClass('active')
                .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
            self.doThisAfterTabClicked(this)
        });
    }
}

export class ControlsTabAbout {
    private static instanceRef: ControlsTabAbout;
    public name = chrome.i18n.getMessage("tab4")
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

    static initInstance(driver: ChatruletkaDriver, module?: any): ControlsTabAbout {
        if (ControlsTabAbout.instanceRef === undefined) {
            ControlsTabAbout.instanceRef = new ControlsTabAbout(driver, module);
        }

        return ControlsTabAbout.instanceRef;
    }

    public handleTabClick() {

    }

    public handleResize() {

    }

    protected getTabHTML() {
        return utils.createElement('li', {
            innerText: this.name
        })
    }

    protected getContentHTML() {
        return utils.createElement('div', {
            className: "tabs__content",
            id: "aboutPanel",
            style: "height:100%;"
        }, [
            utils.createElement('div', {
                    id: "aboutInfo",
                    style: "overflow-y: auto; margin-top: 3px"
                },
                [
                    utils.createElement('span', {
                        innerHTML: chrome.i18n.getMessage("desc"),
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {}, [
                        this.createBadgeLink("https://discord.gg/YZKnbKGWen", chrome.i18n.getMessage("discordBadge")),
                        this.createBadgeLink("https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi", "https://img.shields.io/chrome-web-store/users/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20users&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAW80lEQVR42u1deZAc1X3%2Bfj2zh6Rdg5B2V6t7zSlVYhuE%2FwjgQiATkhgMhBhcJlRSDuVUyoFQhjihTBUJTnAqOKbAiZ04NoQQsMuADSQOlihRgDh8CRSDkLhWq2NXQqx2de1qd7rf%2B%2BWPd3bPzB4zPbOzUr%2Farpnp7unued%2F3%2B37He91LzIysnbgtyLogI0DWMgJkLSNA1jICZC0jQNYyAmQtI0DWMgJkLSNA1jICZO14b%2Fmp7khEDXfxewYGbnrpxZfutSuKhjW8FWUuf9ojIYkvnHfe%2BX%2BxfNmS%2Bxqtb6Y6xjNrFWDPwMBNUsh7J6FtFUhPfkgAkFLcu2t3%2F02ZC2gE8GdIpGYzCYLj0%2FIrNugqSCBnJQmC4x%2F8GriBMsGBIsGemzIC1AT8vVMDvx5ugCZTgtlDgllBgD39e1OV%2FVqzYzaRIJgV4MvZAn5CCfY0PgloqvniTNUBdu3u54mc%2BPJlS2e0QNG3c1eJYoNbtXLF8hm5vuO0DkDI2gnmAijDPAsCZ0%2FjjABZywiQtYwAWcsIkLXZkVdNNV8c2LuXq8053f7lgiaaZP8pBFpU6jtT%2BB5Pb0P5n0wVfKf0uabWqxzrOXOOnpUrKFOAEzCqr7sLyG4uzmKArJ2oBFDWn0lAo7ibStQ4qDf4J6rLaNTfna%2F8h3DKjM%2BK%2Fg1NgJl6lEwlp505a5t9JA4aHcwTLS2r9y8NGuPnUY0NkDNezTQBsnrBCUyAiUu51KCk4Tp%2F7wSIAarrHK6AbJmazTgBJk4bU7R%2BOj4s8rgiwMQgUurWP7OKXQ2Zq3M31YTQ%2BfoAzykSJws00%2Fzt%2BdpeCNfH%2Bqk2ljVjMUYdiZOvv9XTcWzFs%2B%2Fi8%2BkBXr3VV%2BQ6qAriZPHhdMYCqulNmkXWWMn3ZiIAbAgXwBV3zGy0%2FsZyT5yKaeVr02NUZcfyDFn%2FzJ%2BzIi7zjClA9TJfMfhUC6vkuv3uWRgEpv9DawM%2B1wRnnvUuo3SbsUmh6cv%2BbEz%2FeDYpQK2An2ZH1Mz6Z17%2BeZp70mxTgBkHP%2FWax8zLf7Xnyc%2FsRXJ9jS1xOu7tBQignp4TUv5rTgBOS25p%2BirCWzYD72wHDx1A8P6AkjsenxKnImoGQOCuxeD5HaDTzwJ99GMNJf%2Bp5W5Tne27p3%2BAqwO9tuDzjj7ITRsR7N4BGj%2BCIKAJny8zEXwsGcwCJABmqWZES0C2nQJe2QP6xMWg5T2o%2FCbQ4n6oxP9PdJ6p3hxaNQGm7oMqYO4k4HNfH%2BSGp0C9b4Eg1ZPMAgIFAUABKEBZEtCE4EuQfoX3CslgCUAKyFwz%2BIzfQHDp74GWr6zaCBqeALv3DHCtxW2q4Iv1TwObNgIjwwhyBKYAAREQBArwgEBEYCKQfu8TgcowmSUAA7qUmhBCb1MqYEkhGMRSEWb%2BQtDaSxB88tIaW%2F%2BsIUCVfqoM%2BNGPfwhsehYojINyDuggAJgCrQCB%2Br52AQQCBwRCoK6LyDs8A0xgSBBDAQtt6cyAlAA88CWDpHEJmiSGHCyBlrngiy9F7oqray7%2FaDwCpBCcUGn3Ej3zU%2BC%2FHwcKYwrAIFDWnSMQARQE2uIBMr6fNBGgPweApkPshApwfTJmtZWN9StisLZ8EuzAt0qhv2fcBDO4tQ3BVdcgWHfJjMh%2FjQjQX9u8pYTVyzdeh3joAWBwL4gCZdXGsgMt%2FYEiARupD0hjThp8z%2FKTD%2B%2FQnxXs5CyeWe0n1S1xyuq1AmjZd5bvqQUbpdDvFy9F7vobQKtX11X%2BZxcByln9v38b%2FOJzaruWdguwRwLj30lbuXIFsIrgyFAmINQnZKk7l40YaLC1a3BAJ8F3lu%2FHCNaNCAatuxT5G76QmvXjuCBAGSzk7l2I7r4LGBrUkTx5JHBWThQ4aTdBXiwAVCdxmOv35D96mGIdqfqCtexbJniAe9ZtCMETgO%2BrQWc38rfdhmDx0ppbf2MToLwRInryCYjHfgBEhZi1K%2Fl3%2Ftx%2B1ioAxInAIKX80AFfQOokBLCfDRipB3n%2B36zzLR6etWuXYYH3APeUIQa%2B0AA2NSO47jrkL%2Ft0xcWftAlQn8EgmrxoFN77DYhNzzsLDgCSxlAliPU6mEhdh3QcAMRqO7FWAoBZbyfty60auJNKNpcmXSpoNvgkMIAirgomRoDNBmBJYRRAHVpHkmNjkN%2F9LsIdfWi68aaKujHtMYZ8PQEvl9cX%2Fv7vIH%2F1CxXFK2VWrwEAAVDAynLZBILab0P7WAo0%2BM7PU6CUIBZcUrFhxW9cYucK2LN8oMgdEHv7SS87sL7MZBNs%2BWW%2Byxs2oHB0BE233TaLxgJSKH0ngedDhzH%2B5VvAe%2FeCjJxLBgIGCwJYq4Gx3kCCBQBpqnyaBgE71ug8nw3aNhVMqGnyM%2BtMgKVLDw3AHnhk3YEv%2FYgpgNlGXoqp3IFHgk2bUOjrQ9PdXwd9qH3KwV%2FarW53BxeBf%2FgIxv7yFsj%2BfttpbNMt%2Fbt9y5IMFibIEmAhVKea9SwBIQEp1XHMItyCSCkGBAMRu21S6P3dK4RQxxISiCQ4YkCoY8J8z782EwsIBul0EbpAZK4zlj1IhuzbifDWW8GHj1RkQHUdDBo%2BeJArtfRSbfT66yF377JBHJn0zgRwscgeLtUjz9I9yUegfL4KAlnvq4lE5ccErNSbmgCzOg67qqC%2FX8ziE%2FGAcxHacg0xvGqie882EKGelWh96MHJK4bTIEBXZ0ftnxTKXHqZrI3dcQdkX1%2B8kmas1NTXPSs2VmssGnoxqsCSlZUKpQzwrJ6lsXhZehFOXcyx7XGi%2BDnc9sR1Cf96tdXb3%2BMBrtfbIFOvl%2B%2F2ovC3X03R%2Bjn9GCAt%2BRm%2F%2B%2BsIn9mordIL%2BowFCngKwACpAJCIrJ9ncnV80gUeNhavzZlMvk9ed1CZqhMnV3nrjaWb7MAG9drHJwNGmVAI3%2Bq9%2FVxxSX2OfrIeaGtH8y03p1dab5g0UP%2BgwpNPofDYj2zBxkTYRCbKV%2BAr2SSvru%2F2Q6Br%2FhpZ9os7JgMgKgadynQqF5OBEZd9lQ7CRf6AHi423%2FOAt4NJKCoiFYHvB4kMhN%2F%2FIYIzTkf%2B8k%2FVxfqnFQMMDR%2BsZGacy7n7BzBy3R8BIyOOAMY3U6KoYwd1XARvC0Nw5V02Eb%2B%2FTzJkpsSbood5x2MAN0KoUz24lI%2FYU4hYHOCBnXyfIEZ8HyTIA1BbG%2BY88h%2Bgxd1VEaCrs5PqTICJNw9eeQ1o50405YJ4ABcL7EoQIRnoee8dG9havdnO2reY3Xmy4opC2%2BOBIwCY4umgB54NDG3BxwNYemQpZfW%2BW%2FEDszNOw5xHHqzQ9U6PAMH0DjzRUr49vvV%2B7BvagTERQQhp0zsbHJk0ScKmdSp1MsGXlw6aICwyAZWboKECMqneRy5dhJAgs0i96M8sBCCFDixdoGfH%2BwXblNNdlwlI9XkleymnDjqNzxfq9%2FlTy9gfWCrR5NvvovCd76FSxZ0OaWpeB9g1uhNPHnsGj%2F3pqWDJGI0iSClVfVyPq5clgl2kB74hjkx0vJ%2F3qxw%2Blj3YWgLbY9j8XHhA%2BQSLvBzeHt%2BvR7hzwiv0WOCF9H4fEhnBxP0Wfud%2BiLfeqXlkVnMC%2FNeuB0EAdpwG9Pa0gpkxEoYQeuy9mAjSI4Ijhg%2ByUwZVoDFpGIQ3GicSxaBIlFhk0X4xsCXr45t0UsZSQmP9lrR%2BmuhZvK3%2BCZ6WeRb%2B6d6K4q2GIcDm4V9h%2B5FtOt8gPH5jj73U0SiEiKSTQxG3eiPJClQkXISXmxvCxIDRlholLb7EYvaLVQY5UVUsBThbslj18CqCEIido5I8Wr76GsRzL1RVbp9RAjy868FYRH7wFIGXLl7gSCC0OzAxQWJ41aqC18nxzvcKMYJjZd%2BSpWDplsn2tf7d9%2BlJ0A3pOE4OTk4UqaIVvnFvzay%2FpnWATYPPY7AwGK%2B9EGHj1R1Y8%2FIQWsfYkmBuLq%2BYaPJ69sZvTCHHjPbZYV29IyVz%2FcQ2b%2FCHAeRPOxVB2zzkuheBuruQ6wohh%2FZCDu2DHBqAPLDPqx%2FbMccEkBx%2FZVaDT0UDHiWy0eRhaLJ1vZDrH0Fw6edqUqybRho4PK3Df%2Bn%2FbowTwCPCOT%2BXuPpb78Q6Z24ur6Z2F12hlw6yN6pH3khf%2FG0s56e2NjRfeAHmXHUFms44Dcg3FdULSM0e0ZnJMUSHtiDc%2F2OEg8%2BAxSFHBDZFK9ajl1Jfm55JZEcj2V6z2qYqk64vOJYBu3oV64kscU7TnC4cXvrapNbvQ7moq7O%2BE0L8k28e%2FiUGxwfjYPmxwccY5y1uQvdAGHMH8%2FJNxcOeZhDGqIAmAQFunJ3cxB7TKbnFizHv5i%2Bi5aK1FvDkq6VLENhzETWjufNCNHddCGag8P4TOPbeXeDxPQg04AGxBVb9sTcJWeoqJnt1LOkRYgLA9bHM7wtyjFwOoGAALWNPY7z1d1Mv1U9ZAQ4MTV0BvrbtTmw%2Fus0r5BTv0%2FNeDjfc%2BWZsXQ6EOfn89Me%2B%2FYphezvab70ZLVdcbieHuk5Xb8YFsP9IZAFhAJ1tLWjJ%2BapDKibRyl7ofwCFHXcC4qAmDWKW7rssIo7NSHcAx9dbEpjalgY8yLEikHc3dNh0HoYXPDEl658RBbAVv%2FEPsP3Im67UW6btWBlh29nzseq1YbtOgHEsiqZPAl2Vazp3DU76138GtbZo4BX4x0LGq%2F1j6BsOsWu4gFAycgTkgsC6W8lH0BQQls9vxlmdrVjV1YLWfGBP0LL082jquAzjW38fPPp6kdXa9yUAj29z%2BwY5Ri4oBrxUayq8jJzYDZFblupAXeoE2PTB81PbMUf4nz9chJ5tB9E6xlWToPWzn0Hb7X%2FtAU8YGhVY%2F%2FYoNvePIR8AOSLk9CsCM6Ln6jcFwdi6bxy%2F3juOSALnLGnF75zVjvlzAjAzgpZOtJ69CeF7N0MOPhCbbETECRUoJkeQYwQBkJsC4KVa89jTODbvCxVX%2FeriAr605c9xIBx09X5gQiW4%2BEeHse7JvcX8mIY7aL32M5h3%2B1%2FFwP%2FJ9lE8%2FdaoAj6AtnhCTt89FpCbaOyX6022KZghJNCcI1x46jx8alWbHQlkZoi%2Bm8GD9%2BtZx14y4sl8tYAnLTyiZRjq2jyh9M%2BoCxgc%2FwCD44M2sJlKe%2Bm3T8LZz%2B%2FHKQdFbP1UlSAJ%2FoFRiX955TAGDkfIBaRm%2Fko9x0AymBS5pDcQmRyplRp8wcDRAuOprUfx5vvj%2BOL58zEnr64mWHGPYtDQ92I%2BPA3Ay4qm2KPdwNJUrD%2FlwSDG5qFfTm7yiTbextj4Bysg%2FYkXCRKU%2B535c9dg7le%2BbD%2FvPBjh9g3D2DkcFQEZSVe%2FiQQjkmoJJdR7b13kJh3Z2s%2B2%2FQV8beMQdh2MLNmw7B7kT74ALa0SrXMFWlolmpql8um1mMVJQPOx%2F23csYBth9%2Bs6HuvfTzAO8uby5NARMV90d6O9m%2B5KtkHIwJf3XgIRwtsi3fCk3JhZoEJNxssFIoMoYhvs%2FNH7awxdYwdwyG%2B%2FcohjBSkPW%2B09GFQ04dqA3ipYHD85dSsP3UCbD9UGQGoNYfnrl2pOpq5iAiCGWMi7iLm%2Fc1XgJZmAMBIgfGPLxzB0YKEN3hnSWCs2gKvl8h7jWQxCRTwHDtW71CIOzYMORXIzUe44B%2Fqgz6rbCDN2cGpEWDnyE6MitHKh41XEzavOUmTQBaRIGRpSZA783Tk111kt%2F3g16PoHYriFu9bsCUBFwHtq4Ejg%2BcK2LkDFSAyeodCfH%2BLm8odtl8PmV9ec%2FBVnekw8uHWxiPArpG%2BKiMcwvpruzDSAqsESTUwJGi54fP2a71DAk9uG4uB7st%2BnAQ%2BuIxQuMVfnySHiwnccR9%2B9SjeP%2BpUqbDgLtSr5QtvNB4BPhj7wE9OKjpGuDiPn52%2FMEaApBrI7i7k1621n%2F%2FtFyNu7kcMcC45CzwssnbPFYji95FHHD82EAw8tPmoiwXmXgEOTqoLAQKxu%2FEIUGkAmGwvXH0yDrQHFvykGrRetNbuu%2B%2BIwJa9Ycwyfen3pTxMSr9wsUCY%2BOy7CSHZKkqUOMdP3x7FviNOBcK26%2BqjADoQrCsByt0EUvKGEK5cB3InNeOZK5cWgW8IMffKy%2B2%2Bj20d86ySJ7j%2Fg4tiAGvlwoHvCJJwByLpRpybebFvzKnAh%2F64Zr7fpNbMSPWWgdQUwGYAKVzcexfOQ293UxH4ghn500%2Bzk0de7Y8S0s9WqkUCMBfoOZ8fekusFiAmuJFIsnUvQgLP9bqHT4r8WTWNAdmmgq80Zh0gZvlVMJXm5PDsdT1F4Defu8buc7TAePuAKJL%2BkhF%2FKZ8u4u4g6RLCskoSdwWb9xTcbCYAovk3ayMAQE1uFgpqc6XVtwMfacbPPtoWcwVoa7Od%2Ffag0JY4FemPAx8DOun7E0Wh0HMHpZRFMPD2YGTHCGoSCPrGlHisTUMqQBEZKpmq1BTg559dgtEmlxY2nXmG3X54XFoAojIRv5N%2BJ%2FHhBBJvXEQUcwnlXAEsAQ%2BPe5XBlgvqUQ5IzRrzqcs%2Fw3sUC8Vm1023iZ5WvHBBBy7ZuB8MhjRTraGszjyfMdCzdHIESCL%2FQWKI3WluB4B4YmPz7gVN3M5nxxj8OaLsT2qtiUtNBICT3aM1jcvIp3qtXGbyYxV18tevWoBzXtmP%2BaPxDmZ7oyZBmLu39GwcRQCKE8B7RZm5KrHb%2FhC%2F8Vfq8yVnhRvpr7W1x55mNvGjrmvlAiYZDUz0Xlpdku9sxfqrliqrg7utalGbepwLq8d4QnKJip8oTv38nL9UIagoFpB%2BpdDtL%2B1dw9L5%2F1qpQML%2FT%2FQY%2FumePp%2F6hfoLJbZXqAT7181H79MDmL%2Bn33Zwd5t%2BLp%2B7qxSknhlun8vkpJ9jKlBOlPw7xX0%2B%2B67AdbSZHCJj4OcKr9dE%2FosfaFWd9KfvAtjdpm%2Bx1gEBV%2BcFELTl8cKfnIrVz%2B6xHb%2BojSCl0I%2BCCWJEMBqv5uprwP0Z5SVIUOIxAUX%2FCNvdGs72IVLMjDVLmpy340M1kX93akr1X%2BZMJwu4b7Ir5tgzdErUA6pQx5GPzMHG6D37ubs9h0XzGFIKSCnAUkCyvotXP5jJ3p%2BngYrd2FMyqvcCO%2B975njwj6vPe8YCiilA0%2FhL6WZTJeS%2F1H9cS6y7rxYE%2BOZEG1edtKrMXeOcSpmAWnJ446pujPT22s4%2BuzsHlhFYRpYEzOZVus8xQvgLe0tim93fkUrq4znSRThnSZM9Rj7annI2TbFg1PSpaD1vMr%2F%2FzdQJ0LFw4bvMeHTS8QBOZCpTTF2mlBaunotXtmywHX7Zma2QIipepFmEtVRpiCFFHFxOkEQ6AllS6eOxdMc36z69aq6z%2FqP%2FmX7wp%2B94UUQoDgJLgP%2Fo4u5F79aqEPQ5ACXHIledvNq6AfhugFNxVbZt6NhqO%2FycJS3omscQIoSUoQY9BGsixAATwpJCAShKLJG1bh9kKRPEEiGkCHHO4iac2dFss4Dmsern63GJ3J%2FZd7GEaM555dLP3Rqj2lQCOzsWRgA%2BDODRIoVo7Ug8DMkD3z5jr3rDOLRgBH27HQlu%2BcTJCpAotMAI6d478MK49ZrtIorva7eVUBXhnUOE%2BLPfOtleR%2FP4c8hVO06f8P1sH2TtWb8EZH5pKUt6FMCHF3cvimpaCu7sWBh1diy8BsDpfrCxon2FfSYyyxLBYIoq8PjIU7bj1546D2d35yFEASIqQESODMIDzAdaxABOvg8T%2B8VfhShAihBre%2Bbg48uU%2FEsp0Xr0npr5frb%2FtUSRQLas9o3pPgCnL%2B5edM10wVdZC8%2Fm%2F9mbtcYaDMpaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWkaArGUEyFpGgKxlBMhaRoCsZQTIWoO0%2Fwchgys9ixzDyQAAAABJRU5ErkJggg%3D%3D&amp;style=plastic"),
                    ]),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('span', {
                        innerHTML: chrome.i18n.getMessage("github"),
                    }),
                    utils.createElement('br'),
                    utils.createElement('br'),
                    utils.createElement('dl', {},
                        [
                            this.createDTHeader(chrome.i18n.getMessage("author")),
                            this.createDDLink("qrlk", "https://github.com/qrlk"),

                            this.createDTHeader(chrome.i18n.getMessage("inspired")),
                            this.createDDLink("rtcstats", "https://github.com/fippo/rtcstats"),

                            this.createDTHeader(chrome.i18n.getMessage("libs")),
                            this.createDDLink("jquery", "https://jquery.com/"),
                            this.createDDLink("FaceAPI", "https://github.com/vladmandic/face-api"),
                            this.createDDLink("arrive.js", "https://github.com/uzairfarooq/arrive"),
                            this.createDDLink("leaflet", "https://github.com/Leaflet/Leaflet"),
                            this.createDDLink("tooltipster", "https://github.com/calebjacob/tooltipster"),
                            this.createDDLink("sweetalert2", "https://github.com/sweetalert2/sweetalert2"),
                            this.createDDLink("DOMPurify", "https://github.com/cure53/DOMPurify"),

                            this.createDTHeader("<b>Css:</b>"),
                            this.createDDLink("dark reader", "https://darkreader.org/"),
                            this.createDDLink("css-tooltip", "https://github.com/alterebro/css-tooltip"),

                            this.createDTHeader(chrome.i18n.getMessage("3rdparty")),
                            this.createDDLink("ip-api", "https://ip-api.com/"),
                            this.createDDLink("carto", "https://carto.com"),
                        ]),
                    utils.createElement('br'),
                    utils.createElement('button', {
                        onclick: async () => {
                            ContentSwalChangelog.getInstance().showFromVersion((await chrome.storage.sync.get({'lastVersion': ''})).lastVersion)
                        },
                    }, [
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("changelogButtonText")
                        })
                    ]),
                    utils.createElement('br'),
                    utils.createElement('button', {
                        onclick: () => {
                            new ContentSwalInfo(this.driver.platform.name).showFromStart()
                        },
                    }, [
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("welcomeButtonText")
                        })
                    ]),
                    utils.createElement('br'),
                    utils.createElement('button', {
                        onclick: () => {
                            chrome.runtime.sendMessage({openWelcome: true})
                        },
                    }, [
                        utils.createElement('b', {
                            innerText: chrome.i18n.getMessage("postInstallButtonText")
                        })
                    ]),
                ]
            )
        ])
    }

    protected createBadgeLink(href: string, badgeSrc: string) {
        return utils.createElement('a', {
            target: "_blank",
            style: "text-decoration: none!important; margin-right: 3px",
            href: href
        }, [
            utils.createElement('img', {
                src: badgeSrc,
            }),
        ])
    }

    protected createDTHeader(innerHTML: string) {
        return utils.createElement('dt', {
            innerHTML: innerHTML
        })
    }

    protected createDDLink(innerText: string, href: string) {
        return utils.createElement('dd', {}, [
            utils.createElement('a', {
                href: href,
                innerText: innerText,
                style: "text-decoration: none!important;",
                target: "_blank"
            })
        ])
    }
}

function createHeader() {
    return utils.createElement('center', {
        style: "user-select:none"
    }, [
        utils.createElement('div', {
            style: "position:absolute; left:0;top:0",
        }, [
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_remote"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('remote-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('remote-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('remote-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                // requestPictureInPicture is not supported by firefox
                style: function f() {
                    // @ts-ignore
                    if (typeof browser !== "undefined") {
                        return "color: green; height:15px; display:none"
                    } else {
                        return "color: green; height:15px"
                    }
                }(),
                title: "pip remote",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("remote-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("remote-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                id: "streamerPipButton",
                style: function f() {
                    if (globalThis.platformSettings.get("streamer") && globalThis.platformSettings.get("streamerPip")) {
                        return "height:15px"
                    } else {
                        return "height:15px;display:none"
                    }
                }(),
                title: "pip remote clone (for streamers)",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("echo-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("echo-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
        utils.createElement('a', {
            target: "_blank",
            style: "text-decoration: none!important; color: #000000;",
            href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"
        }, [
            utils.createElement('b', {
                innerText: chrome.i18n.getMessage("extension_name_header").replace(" (ome.tv) ", " ") + " v" + chrome.runtime.getManifest().version.substring(0, 3),
                id: "connectionStatus",
            })
        ]),
        utils.createElement('div', {
            style: "position:absolute; right:0; top:0",
        }, [
            utils.createElement('button', {
                // requestPictureInPicture is not supported by firefox
                style: function f() {
                    // @ts-ignore
                    if (typeof browser !== "undefined") {
                        return "color: green; height:15px; display:none"
                    } else {
                        return "color: green; height:15px"
                    }
                }(),
                title: "pip local",
                onclick: () => {
                    if (document.pictureInPictureElement === document.getElementById("local-video"))
                        document.exitPictureInPicture()
                    else
                        (document.getElementById("local-video") as HTMLVideoElement).requestPictureInPicture()
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
            utils.createElement('button', {
                style: "color: red; height:15px",
                title: chrome.i18n.getMessage("screen_local"),
                onclick: () => {
                    let dwncanvas = document.createElement('canvas');
                    dwncanvas.width = (document.getElementById('local-video') as HTMLVideoElement)?.videoWidth
                    dwncanvas.height = (document.getElementById('local-video') as HTMLVideoElement)?.videoHeight

                    let ctx = dwncanvas.getContext('2d');
                    if (ctx instanceof CanvasRenderingContext2D) {
                        ctx.drawImage((document.getElementById('local-video') as HTMLVideoElement), 0, 0, dwncanvas.width, dwncanvas.height);
                        utils.downloadImage(dwncanvas.toDataURL('image/jpg'))
                    }
                },
            }, [
                utils.createElement('b', {
                    innerText: "^"
                })
            ]),
        ]),
    ])
}