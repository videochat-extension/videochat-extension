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
            html: this.getHTML(),
            currentProgressStep: this.currentStep
        })
    }

    protected getHTML = () => {
        return `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${this.getValue()}</div></div>`
    }

    protected arrowHotkeys = (e: KeyboardEvent) => {
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
        "Extension Features",
        "License"
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor(platform: string) {
        super();
        this.platform = platform

        this.values = {
            "en": [
                `<p>This is your first use of the 'Videochat Extension' on the '${this.platform}' video chat platform!<br><br>Launched in 2011 by the Ukranians, this video chat platform quickly gained popularity among the Russian-speaking segment of the Internet.<br><br>${this.platform} is currently one of the most popular video chat platforms in the world, featuring 40+ websites and several very popular mobile apps.<br><br>This video chat is known by such names as chatruletka, ome.tv, minichat, chatrulez and others.<br><br>The purpose of the extension is to provide ${this.platform} users with more features, while not harming the platform itself.</p>`,
                `${this.platform} is the first platform we started to support.<br><br>Now you can enjoy such features as the stranger's IP Locator, Picture-in-Picture mode, city and gender filtering, streamer mode, hotkeys and 40+ other features!<br><br>Join the Videochat Extension's <a target=\"_blank\" style=\"text-decoration: none!important;\"href=\"https://discord.gg/gYmQWWjwEb \">Discord server</a> so that you can monitor the project's life and give us feedback we can work on!<br><br>We strongly encourage you to read the video chat rules and privacy policy before you start using it.`,
                `<div style="max-height: 300px; text-align: left;"><b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> extension licensed under BSD-4.</b><br><br><b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
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
   software developed by Fyodor Kurlyuk, Videochat Extension project and its contributors. <br>
 * Neither the name of Videochat Extension nor the names of its 
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
            ],
            "ru": [
                "page1",
                "page2",
                "page3"
            ]
        }

        this.swalQueueStep = this.swalQueueStep.mixin({
            progressSteps: this.steps,
            preDeny: () => {
                chrome.storage.sync.set({"swalInfoCompleted": true})
            },
            didDestroy() {
                chrome.storage.sync.set({"swalInfoCompleted": true})
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