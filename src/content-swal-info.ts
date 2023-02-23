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

    protected didRender = () => {
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
    protected steps = ['1', '2', '3', '4', '5', '6', '7']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1"),
        chrome.i18n.getMessage("swalInfoTitle2"),
        chrome.i18n.getMessage("swalInfoTitle3"),
        chrome.i18n.getMessage("swalInfoTitle4"),
        chrome.i18n.getMessage("swalInfoTitle5"),
        chrome.i18n.getMessage("swalInfoTitle6"),
        "License"
    ]
    protected values = [
        chrome.i18n.getMessage("swalInfoText1"),
        chrome.i18n.getMessage("swalInfoText2"),
        chrome.i18n.getMessage("swalInfoText3"),
        chrome.i18n.getMessage("swalInfoText4"),
        chrome.i18n.getMessage("swalInfoText5"),
        chrome.i18n.getMessage("swalInfoText6"),
        `<div style="max-height: 300px">MIT License<br><br>

Copyright (c) 2021-2022 <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"http://qrlk.me\">Fyodor Kurlyuk</a><br><br>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br><br>

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br><br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</div>`
    ]

    constructor() {
        super();
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

    public showFromStart = async () => {
        this.currentStep = 0
        return this.show()
    }
}