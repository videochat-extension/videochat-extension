import {SwalWithSteps} from "../chatruletka/content-swal-info";
import $ from "jquery";

export class ContentSwalInfoCoomeetFreeSimplified extends SwalWithSteps {
    protected steps = ['🎉']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1")
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor() {
        super();
        this.platform = "Coomeet Free"
        let copyrightLicense = `<b style="font-weight: bold!important;">Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> extension <a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension/blob/main/LICENSE">licensed under BSD-4</a>.</b><br><br><b style="font-weight: bold!important;">Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
            All rights reserved.</b></div>`
        this.values = {
            "en": [
                `<b style="font-weight: bold!important;">This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br><b style="font-weight: bold!important;">Full support for the platform is not planned, only volume control, displaying the stranger's country & bot filter features are implemented</b>.<br><br><b style="font-weight: bold!important;">Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a>, so you can follow the life of the project and give your feedback!</b><br><br>` + copyrightLicense
            ],
            "ru": [
                `<b style="font-weight: bold!important;">Это ваше первое использование Чат Рулетного Расширения на платформе видеочата «${this.platform}»!</b><br><br><b style="font-weight: bold!important;">Полной поддержки платформы не планируется, реализована только регулировка громкости, отображение страны собеседника и фильтр ботов</b>.<br><br><b style="font-weight: bold!important;">Вступайте в наш <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">Discord</a>, чтобы следить за жизнью проекта и поделиться своим отзывом!</b><br><br>` + copyrightLicense
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

        document.arrive('.swal2-progress-step', {existing: true}, (el) => {
            (<HTMLElement>el).style.marginBottom = '0';
            (<HTMLElement>el).style.marginLeft = '0';
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