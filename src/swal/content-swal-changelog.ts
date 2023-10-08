import {SwalWithSteps} from "../drivers/chatruletka/content-swal-info";
import {ControlsTabSettings} from "../drivers/chatruletka/content-module-settings";
import $ from "jquery";

let changelog: { url: string, version: string, date: string, keyTitle: string, keyContent: string }[] = [
    {
        version: "0.1",
        date: "2021-09-27",
        url: "https://www.patreon.com/posts/90513013",
        keyTitle: "clog_v0_1_title",
        keyContent: "clog_v0_1_summary"
    },
    {
        version: "0.2",
        date: "2021-10-01",
        url: "https://www.patreon.com/posts/90513155",
        keyTitle: "clog_v0_2_title",
        keyContent: "clog_v0_2_summary"
    },
    {
        version: "0.3",
        date: "2021-10-13",
        url: "https://www.patreon.com/posts/90513208",
        keyTitle: "clog_v0_3_title",
        keyContent: "clog_v0_3_summary"
    },
    {
        version: "0.4",
        date: "2021-11-01",
        url: "https://www.patreon.com/posts/90513238",
        keyTitle: "clog_v0_4_title",
        keyContent: "clog_v0_4_summary"
    },
    {
        version: "0.5",
        date: "2021-12-27",
        url: "https://www.patreon.com/posts/90513269",
        keyTitle: "clog_v0_5_title",
        keyContent: "clog_v0_5_summary"
    },
    {
        version: "0.6",
        date: "2021-12-31",
        url: "https://www.patreon.com/posts/90513288",
        keyTitle: "clog_v0_6_title",
        keyContent: "clog_v0_6_summary"
    },
    {
        version: "0.7",
        date: "2022-01-03",
        url: "https://www.patreon.com/posts/90513305",
        keyTitle: "clog_v0_7_title",
        keyContent: "clog_v0_7_summary"
    },
    {
        version: "0.7.1",
        date: "2022-01-07",
        url: "https://www.patreon.com/posts/90513326",
        keyTitle: "clog_v0_7_1_title",
        keyContent: "clog_v0_7_1_summary"
    },
    {
        version: "1.0",
        date: "2022-05-24",
        url: "https://www.patreon.com/posts/90513341",
        keyTitle: "clog_v1_0_title",
        keyContent: "clog_v1_0_summary"
    },
    {
        version: "1.1",
        date: "2022-05-27",
        url: "https://www.patreon.com/posts/90513357",
        keyTitle: "clog_v1_1_title",
        keyContent: "clog_v1_1_summary"
    },
    {
        version: "1.1.1",
        date: "2022-08-04",
        url: "https://www.patreon.com/posts/90513373",
        keyTitle: "clog_v1_1_1_title",
        keyContent: "clog_v1_1_1_summary"
    },
    {
        version: "1.1.2",
        date: "2022-08-04",
        url: "https://www.patreon.com/posts/90513400",
        keyTitle: "clog_v1_1_2_title",
        keyContent: "clog_v1_1_2_summary"
    },
    {
        version: "1.1.3",
        date: "2022-08-04",
        url: "https://www.patreon.com/posts/90513416",
        keyTitle: "clog_v1_1_3_title",
        keyContent: "clog_v1_1_3_summary"
    },
    {
        version: "1.1.4",
        date: "2022-08-05",
        url: "https://www.patreon.com/posts/90513436",
        keyTitle: "clog_v1_1_4_title",
        keyContent: "clog_v1_1_4_summary"
    },
    {
        version: "1.2.0",
        date: "2022-08-05",
        url: "https://www.patreon.com/posts/90513468",
        keyTitle: "clog_v1_2_0_title",
        keyContent: "clog_v1_2_0_summary"
    },
    {
        version: "1.3.0",
        date: "2022-08-07",
        url: "https://www.patreon.com/posts/90513487",
        keyTitle: "clog_v1_3_0_title",
        keyContent: "clog_v1_3_0_summary"
    },
    {
        version: "1.3.1",
        date: "2022-08-07",
        url: "https://www.patreon.com/posts/90513502",
        keyTitle: "clog_v1_3_1_title",
        keyContent: "clog_v1_3_1_summary"
    },
    {
        version: "1.3.2",
        date: "2022-08-09",
        url: "https://www.patreon.com/posts/90513519",
        keyTitle: "clog_v1_3_2_title",
        keyContent: "clog_v1_3_2_summary"
    },
    {
        version: "1.3.3",
        date: "2022-08-12",
        url: "https://www.patreon.com/posts/90513533",
        keyTitle: "clog_v1_3_3_title",
        keyContent: "clog_v1_3_3_summary"
    },
    {
        version: "1.4.0",
        date: "2022-09-01",
        url: "https://www.patreon.com/posts/90513560",
        keyTitle: "clog_v1_4_0_title",
        keyContent: "clog_v1_4_0_summary"
    },
    {
        version: "1.4.1",
        date: "2022-09-02",
        url: "https://www.patreon.com/posts/90513589",
        keyTitle: "clog_v1_4_1_title",
        keyContent: "clog_v1_4_1_summary"
    },
    {
        version: "1.4.2",
        date: "2022-09-02",
        url: "https://www.patreon.com/posts/90513686",
        keyTitle: "clog_v1_4_2_title",
        keyContent: "clog_v1_4_2_summary"
    },
    {
        version: "1.5.0",
        date: "2022-09-05",
        url: "https://www.patreon.com/posts/90513722",
        keyTitle: "clog_v1_5_0_title",
        keyContent: "clog_v1_5_0_summary"
    },
    {
        version: "1.5.1",
        date: "2022-09-08",
        url: "https://www.patreon.com/posts/90513738",
        keyTitle: "clog_v1_5_1_title",
        keyContent: "clog_v1_5_1_summary"
    },
    {
        version: "1.5.2",
        date: "2022-09-11",
        url: "https://www.patreon.com/posts/90513763",
        keyTitle: "clog_v1_5_2_title",
        keyContent: "clog_v1_5_2_summary"
    },
    {
        version: "1.5.3",
        date: "2022-10-06",
        url: "https://www.patreon.com/posts/90513787",
        keyTitle: "clog_v1_5_3_title",
        keyContent: "clog_v1_5_3_summary"
    },
    {
        version: "1.5.4",
        date: "2022-10-19",
        url: "https://www.patreon.com/posts/90514122",
        keyTitle: "clog_v1_5_4_title",
        keyContent: "clog_v1_5_4_summary"
    },
    {
        version: "1.5.5",
        date: "2022-10-19",
        url: "https://www.patreon.com/posts/90514139",
        keyTitle: "clog_v1_5_5_title",
        keyContent: "clog_v1_5_5_summary"
    },
    {
        version: "1.6.0",
        date: "2022-11-17",
        url: "https://www.patreon.com/posts/90514171",
        keyTitle: "clog_v1_6_0_title",
        keyContent: "clog_v1_6_0_summary"
    },
    {
        version: "1.6.1",
        date: "2022-11-25",
        url: "https://www.patreon.com/posts/90514186",
        keyTitle: "clog_v1_6_1_title",
        keyContent: "clog_v1_6_1_summary"
    },
    {
        version: "1.6.2",
        date: "2023-01-15",
        url: "https://www.patreon.com/posts/90514206",
        keyTitle: "clog_v1_6_2_title",
        keyContent: "clog_v1_6_2_summary"
    },
    {
        version: "1.6.3",
        date: "2023-01-15",
        url: "https://www.patreon.com/posts/90514231",
        keyTitle: "clog_v1_6_3_title",
        keyContent: "clog_v1_6_3_summary"
    },
    {
        version: "1.7.0",
        date: "2023-03-14",
        url: "https://www.patreon.com/posts/90514249",
        keyTitle: "clog_v1_7_0_title",
        keyContent: "clog_v1_7_0_summary"
    },
    {
        version: "1.7.1",
        date: "2023-03-19",
        url: "https://www.patreon.com/posts/90514271",
        keyTitle: "clog_v1_7_1_title",
        keyContent: "clog_v1_7_1_summary"
    },
    {
        version: "1.7.2",
        date: "2023-03-20",
        url: "https://www.patreon.com/posts/90514289",
        keyTitle: "clog_v1_7_2_title",
        keyContent: "clog_v1_7_2_summary"
    },
    {
        version: "1.7.3",
        date: "2023-03-26",
        url: "https://www.patreon.com/posts/90514311",
        keyTitle: "clog_v1_7_3_title",
        keyContent: "clog_v1_7_3_summary"
    },
    {
        version: "1.7.5",
        date: "2023-04-05",
        url: "https://www.patreon.com/posts/90514336",
        keyTitle: "clog_v1_7_5_title",
        keyContent: "clog_v1_7_5_summary"
    },
    {
        version: "1.7.6",
        date: "2023-04-05",
        url: "https://www.patreon.com/posts/90514358",
        keyTitle: "clog_v1_7_6_title",
        keyContent: "clog_v1_7_6_summary"
    },
    {
        version: "1.7.7",
        date: "2023-04-14",
        url: "https://www.patreon.com/posts/90514368",
        keyTitle: "clog_v1_7_7_title",
        keyContent: "clog_v1_7_7_summary"
    },
    {
        version: "1.7.8",
        date: "2023-04-15",
        url: "https://www.patreon.com/posts/90514380",
        keyTitle: "clog_v1_7_8_title",
        keyContent: "clog_v1_7_8_summary"
    },
    {
        version: "1.7.9",
        date: "2023-04-20",
        url: "https://www.patreon.com/posts/90514399",
        keyTitle: "clog_v1_7_9_title",
        keyContent: "clog_v1_7_9_summary"
    },
    {
        version: "1.8.0",
        date: "2023-05-04",
        url: "https://www.patreon.com/posts/90514415",
        keyTitle: "clog_v1_8_0_title",
        keyContent: "clog_v1_8_0_summary"
    },
    {
        version: "1.8.1",
        date: "2023-05-31",
        url: "https://www.patreon.com/posts/90514427",
        keyTitle: "clog_v1_8_1_title",
        keyContent: "clog_v1_8_1_summary"
    },
    {
        version: "1.8.2",
        date: "2023-07-20",
        url: "https://www.patreon.com/posts/90514442",
        keyTitle: "clog_v1_8_2_title",
        keyContent: "clog_v1_8_2_summary"
    },
    {
        version: "1.9.0",
        date: "2023-08-23",
        url: "https://www.patreon.com/posts/90514455",
        keyTitle: "clog_v1_9_0_title",
        keyContent: "clog_v1_9_0_summary"
    },
    {
        version: "2.0.0",
        date: "2023-09-07",
        url: "https://www.patreon.com/posts/90514477",
        keyTitle: "clog_v2_0_0_title",
        keyContent: "clog_v2_0_0_summary"
    },
]


export class ContentSwalChangelog extends SwalWithSteps {
    private static instanceRef: ContentSwalChangelog;

    // TODO: this is awful, please rework
    protected didOpen = () => {
        document.removeEventListener('keyup', this.arrowHotkeys)
        document.addEventListener('keyup', this.arrowHotkeys)
        chrome.storage.sync.get({'allowShowChangelog': true}, (res) => {
            (<HTMLInputElement>document.getElementById('allowShowChangelogCheck')).checked = res.allowShowChangelog
        })
    }

    public didRender = (e: HTMLElement) => {
        e.style.fontSize = "initial"
        e.style.fontFamily = "pt sans,sans-serif"
        let progressSteps = $(".swal2-progress-step")
        progressSteps.css({
            "user-select": "none",
            'cursor': 'pointer'
        })
        let self = this
        progressSteps.click(function (el) {
            self.currentStep = self.steps.indexOf(self.styleStep(el.target.innerText))
            self.selectStep(self.currentStep)
        })
    }

    private styleStep(v: string) {
        return `<span style="font-size: 14px;font-family: 'Times New Roman',serif; vertical-align: super;">${v}</span>`
    }

    private constructor() {
        super();

        this.steps = []
        changelog.forEach((log) => {
            this.steps.push(this.styleStep(log.version))
        })

        this.titles = []
        changelog.forEach((log) => {
            if (log.url) {
                this.titles.push(`<a href="${log.url}" style=\"text-decoration: none!important;\" target=\"_blank\">v${log.version} (${log.date})</a>`)
            }
        })

        this.swalQueueStep = this.swalQueueStep.mixin({
            showCancelButton: true,
            allowEscapeKey: true,
            progressSteps: this.steps,
            progressStepsDistance: "2%",
            // TODO: this changes platform settings, but need to change global
            footer: ControlsTabSettings.createSettingsCheckbox(true, 'span', 'allowShowChangelog', chrome.i18n.getMessage('showChangelogToggle'), chrome.i18n.getMessage("tooltipShowChangelogToggle"))
        })
    }

    static getInstance(): ContentSwalChangelog {
        if (ContentSwalChangelog.instanceRef === undefined) {
            ContentSwalChangelog.instanceRef = new ContentSwalChangelog();
        }

        return ContentSwalChangelog.instanceRef;
    }

    public showFromVersion = async (version: string) => {
        if (version === "") {
            version = chrome.runtime.getManifest().version
        }
        let index = this.steps.indexOf(this.styleStep(version))
        if (index + 1 < this.steps.length) {
            index++
        }

        this.currentStep = index

        return await this.show()
    }

    protected getHTML = () => {
        return `<div style="text-align: left; min-height: 300px; max-height: 300px">${this.getValue()}</div>`
    }

    protected getValue: () => string = () => {
        let v = changelog[this.currentStep]
        let content = chrome.i18n.getMessage(v.keyContent!).split('\n')
        let summary = ''
        content.forEach(value => {
            summary += `— ${value}<br>`
        })

        let str = `<b>${chrome.i18n.getMessage(v.keyTitle!)}</b><br><br><b><a href="${v.url!}" style=\"text-decoration: none!important;\" target=\"_blank\">${chrome.i18n.getMessage('clog_full', v.version)}</a></b><br><br><b>- ${chrome.i18n.getMessage('clog_caption')}</b><br>${summary}`

        str += `<br><b><a href="${v.url!}" style=\"text-decoration: none!important;\" target=\"_blank\">${chrome.i18n.getMessage('clog_full', v.version)}</a></b>`


        // // generate markdown code for a github release
        // let l = ''
        // content.forEach(value => {
        //     l += `- ${value}\n`
        // })
        //
        // let step = this.steps.indexOf(this.styleStep(v.version))
        // let compareLink = ''
        // if (step == 0) {
        //     compareLink = `[View commits on GitHub](https://github.com/videochat-extension/videochat-extension/commits/v${changelog[step].version})`
        // } else {
        //     compareLink = `https://github.com/videochat-extension/videochat-extension/compare/v${changelog[step-1].version}...v${changelog[step].version}`
        // }
        //
        // let gh = `# ${chrome.i18n.getMessage(v.keyTitle)}\n\n----\n\n* #### [${chrome.i18n.getMessage('clog_full', v.version)}](${v.url})\n----\n## ${chrome.i18n.getMessage('clog_caption')}\n${l}\n----\n\n* #### [${chrome.i18n.getMessage('clog_full', v.version)}](${v.url})\n* #### ${compareLink}`
        //
        // // generate markdown code for a canny / discord release
        //
        // let canny = `# ${chrome.i18n.getMessage(v.keyTitle)}\n\n- [**${chrome.i18n.getMessage('clog_full', v.version)}**](${v.url})\n\n# ${chrome.i18n.getMessage('clog_caption')}\n${l}\n----\n\n- [**${chrome.i18n.getMessage('clog_full', v.version)}**](${v.url})\n- [**View changes on GitHub**](${compareLink})`
        //
        // console.dir(canny)

        return str.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" style=\"text-decoration:none;\" target=\"_blank\" >$1</a>')
    }
}
