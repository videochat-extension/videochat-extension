import {SwalWithSteps} from "../chatruletka/content-swal-info";

export class ContentSwalInfoOmegleSimplified extends SwalWithSteps {
    protected steps = ['🎉']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1")
    ]
    protected values: string[];
    private platform: string;

    public constructor() {
        super();
        this.platform = "Omegle"
        let copyrightLicense = `<b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> project <a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension/blob/main/LICENSE">licensed under BSD-4</a>.</b><br><br><b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
            All rights reserved.</b></div>`
        this.values = [
            chrome.i18n.getMessage('swalInfoOmegleSimplified', this.platform) + copyrightLicense
        ]

        this.swalQueueStep = this.swalQueueStep.mixin({
            progressSteps: this.steps,
            backdrop: true,
            allowOutsideClick: true,
            showConfirmButton: false,
            focusDeny: true,
            preDeny: () => {
                globalThis.platformSettings.set({"swalInfoCompleted": true})
            },
            didDestroy() {
                globalThis.platformSettings.set({"swalInfoCompleted": true})
            }
        })
    }

    protected getValue: () => string = () => {
        return this.values[this.currentStep]
    }


    public showFromStart = async () => {
        this.currentStep = 0
        return this.show()
    }
}