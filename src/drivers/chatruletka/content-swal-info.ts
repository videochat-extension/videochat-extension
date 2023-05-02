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

    public didRender = () => {
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

export class ContentSwalInfo extends SwalWithSteps {
    protected steps = ['1', '2', '3']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1"),
        chrome.i18n.getMessage("swalInfoTitle2"),
        chrome.i18n.getMessage("swalInfoTitle3"),
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor(platform: string) {
        super();
        this.platform = platform
        let copyrightLicense = `<b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
All rights reserved.</b><br><br>

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:<br><br>

 * Redistributions of source code must retain the above copyright notice, 
   this list of conditions and the following disclaimer. <br>
 * Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in the 
   documentation and/or other materials provided with the distribution. <br>
 * All advertising materials mentioning features or use of this software 
   must display the following acknowledgement: This product includes 
   software developed by the Videochat Extension and its contributors. <br>
 * Neither the name of the Videochat Extension nor the names of its 
   contributors may be used to endorse or promote products derived from 
   this software without specific prior written permission. <br><br>

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.</div>`
        this.values = {
            "en": [
                `<p><b>This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br>Launched in 2011 by the Ukranians, this video chat platform quickly gained popularity among the Russian-speaking segment of the Internet.<br><br>${this.platform} is currently one of the most popular video chat platforms in the world, featuring 40+ websites and several very popular mobile apps.<br><br>This video chat is known by such names as chatruletka, ome.tv, minichat, chatrulez and others.<br><br>The purpose of the extension is to provide ${this.platform} users with more features, while not harming the platform itself.</p>`,
                `${this.platform === "Chatruletka" ? this.platform : "Chatruletka (aka " + this.platform + ")"} is the very first platform that we started to support.<br><br>Now you can enjoy such features as the stranger's IP Locator, Picture-in-Picture mode, city and gender filtering, streamer mode, hotkeys and 40+ other features!<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a> so that you can monitor the project's life and give us feedback we can work on!<br><br>We strongly encourage you to read the video chat rules and privacy policy before you start using it.`,
                `<div style="max-height: 400px; text-align: left;"><b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> project licensed under BSD-4.</b><br><br>` + copyrightLicense
            ],
            "ru": [
                `<p><b>Это ваше первое использование Чат Рулетного Расширения на платформе видеочата «${this.platform}»!</b><br><br>Запущенная украинцами в 2011 году, эта платформа видеочата быстро завоевала популярность в русскоязычном сегменте Интернета.<br><br>${this.platform} в настоящее время является одной из самых популярных платформ в мире, объединяя более 40 веб-сайтов и несколько очень популярных мобильных приложений.<br><br>Этот видеочат известен под такими названиями, как чат рулетка, ome.tv, MiniChat, ChatRulez и др.<br><br>Цель расширения: предоставить пользователям ${this.platform} больше возможностей, при этом не навредив самой платформе.</p>`,
                `${this.platform === "Chatruletka" ? this.platform : "Chatruletka (" + this.platform + ")"} - самая первая платформа, которую мы начали поддерживать.<br><br>Теперь вам доступен такой функционал, как пробив IP собеседника, режим Картинка-в-Картинке, фильтр по городу и полу, режим стримера, горячие клавиши и ещё 40+ функций!<br><br>Вступайте в наш <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">Discord</a>, чтобы вы могли следить за жизнью проекта и давать обратную связь!<br><br>Мы настоятельно рекомендуем вам прочитать правила видеочата и политику конфиденциальности, прежде чем начать им пользоваться.`,
                `<div style="max-height: 400px; text-align: left;"><b>Чат Рулетное Расширение является <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> проектом с лицензией BSD-4.</b><br><br>` + copyrightLicense
            ]
        }

        this.swalQueueStep = this.swalQueueStep.mixin({
            progressSteps: this.steps,
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