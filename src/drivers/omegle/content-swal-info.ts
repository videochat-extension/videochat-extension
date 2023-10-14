import {SwalWithSteps} from "../chatruletka/content-swal-info";

export class ContentSwalInfoOmegleSimplified extends SwalWithSteps {
    protected steps = ['🎉']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1")
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor() {
        super();
        this.platform = "Omegle"
        let copyrightLicense = `<b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> project <a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension/blob/main/LICENSE">licensed under BSD-4</a>.</b><br><br><b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
            All rights reserved.</b></div>`
        this.values = {
            "en": [
                `<p><b>This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br><b>You can choose between the stable 'simple' minimalistic mode (IP Locator & Dark Mode) and the 'advanced' mode, which is still under development.</b><br><br>Open the video chat page, so you can check it yourself.<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a>, so you can follow the life of the project and give your feedback!<br><br>` + copyrightLicense
            ],
            "ru": [
                `<p><b>Это ваше первое использование Чат Рулетного Расширения на платформе видеочата «${this.platform}»!</b><br><br><b>Вы можете выбрать между стабильным режимом 'минимализм' (IP Геолокация & Тёмная тема) и 'нормальным' режимом, который ещё находится в разработке.</b><br><br>Вступайте в наш <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">Discord</a>, чтобы следить за жизнью проекта и поделиться своим отзывом!<br><br>` + copyrightLicense
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