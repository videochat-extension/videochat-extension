import Swal from "sweetalert2";
import $ from "jquery";

export class SwalWithSteps {
    protected steps: string[] = []

    protected currentStep: number = 0

    protected titles: string[] = []

    protected values: any = []
    protected swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEnterKey: true,
        showDenyButton: true,
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        denyButtonText: chrome.i18n.getMessage('denyButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        heightAuto: false,
        reverseButtons: true,
        progressSteps: this.steps,
    });

    public async show() {
        return await this.swalQueueStep.fire(
            {
                title: this.titles[this.currentStep],
                html: this.getHTML(),
                currentProgressStep: this.currentStep,
                showCancelButton: this.currentStep > 0,

                willOpen: this.willOpen,
                didOpen: this.didOpen,
                didRender: this.didRender,
                willClose: this.willClose
            }
        )
    }

    protected getValue: () => string = () => {
        return this.values[this.currentStep]
    }

    protected selectStep = (step: number) => {
        this.swalQueueStep.update({
            title: this.titles[this.currentStep],
            showCancelButton: this.currentStep > 0,
            html: `<div id="swalWithStepsContainer">${this.getHTML()}</div>`,
            currentProgressStep: this.currentStep
        })
        let con = document.getElementById('swalWithStepsContainer')
        if (con) {
            con.scrollIntoView()
        }
    }

    protected getHTML = () => {
        return `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${this.getValue()}</div></div>`
    }

    public arrowHotkeys = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowLeft":
                if (this.currentStep !== 0) {
                    Swal.getCancelButton()!.click()
                    Swal.getCancelButton()!.focus()
                } else {
                    Swal.getConfirmButton()!.focus()
                }
                break;

            case "ArrowUp":
                Swal.getDenyButton()!.click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton()!.click()
                Swal.getConfirmButton()!.focus()
                break;
        }
        e.preventDefault()
    }

    protected willOpen = (e: HTMLElement) => {
        (e.querySelector('.swal2-cancel') as HTMLElement).onclick = (e) => {
            if (this.currentStep - 1 >= 0) {
                this.currentStep = this.currentStep - 1
                this.selectStep(this.currentStep)
            } else {
                // Swal.close()
            }
        }
        (e.querySelector('.swal2-confirm') as HTMLElement).onclick = (e) => {
            if (this.currentStep + 1 < this.steps.length) {
                this.currentStep = this.currentStep + 1
                this.selectStep(this.currentStep)
            } else {
                Swal.close()
            }
        }
    }

    protected didOpen = () => {
        document.removeEventListener('keyup', this.arrowHotkeys)
        document.addEventListener('keyup', this.arrowHotkeys)
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
            self.currentStep = self.steps.indexOf(el.target.innerText)
            self.selectStep(self.currentStep)
        })
    }

    protected willClose = () => {
        document.removeEventListener('keyup', this.arrowHotkeys)
    }
}

export class ContentSwalInfoSimplified extends SwalWithSteps {
    protected steps = ['🎉']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1")
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor(platform: string) {
        super();
        this.platform = platform
        let copyrightLicense = `<b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> project <a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension/blob/main/LICENSE">licensed under BSD-4</a>.</b><br><br><b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
            All rights reserved.</b></div>`
        this.values = {
            "en": [
                `<b>This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br>Now you can enjoy such features as the stranger's IP Locator, Picture-in-Picture mode, city and gender filtering, streamer mode, hotkeys and 40+ other features!<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a>, so you can follow the life of the project and give your feedback!<br><br>` + copyrightLicense
            ],
            "ru": [
                `<b>Это ваше первое использование Чат Рулетного Расширения на платформе видеочата «${this.platform}»!</b><br><br>Теперь вам доступен такой функционал, как геолокация IP собеседника, режим Картинка-в-Картинке, фильтр по городу и полу, режим стримера, горячие клавиши и ещё 40+ функций!<br><br>Вступайте в наш <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">Discord</a>, чтобы следить за жизнью проекта и поделиться своим отзывом!<br><br>` + copyrightLicense
            ]
        }

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
        let lang = chrome.i18n.getMessage('lang')
        if (lang == "en" || lang === "ru") {
            return this.values[lang][this.currentStep]
        } else {
            return this.values["en"][this.currentStep]
        }
    }

    public showFromStart = async () => {
        this.currentStep = 0
        return this.show()
    }
}