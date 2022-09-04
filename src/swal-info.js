const showSwalInfo = async function () {
    const steps = ['1', '2', '3', '4', '5', '6', '7']

    const titles = [
        chrome.i18n.getMessage("swalInfoTitle1"),
        chrome.i18n.getMessage("swalInfoTitle2"),
        chrome.i18n.getMessage("swalInfoTitle3"),
        chrome.i18n.getMessage("swalInfoTitle4"),
        chrome.i18n.getMessage("swalInfoTitle5"),
        chrome.i18n.getMessage("swalInfoTitle6"),
        "License"
    ]

    const values = [
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

    let currentStep = 0

    const swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEnterKey: true,
        showDenyButton: true,
        preDeny: () => {
            chrome.storage.sync.set({"swalInfoCompleted": true})
        },
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        denyButtonText: chrome.i18n.getMessage('denyButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps,
    })

    const selectStep = function (step) {
        swalQueueStep.update({
            title: titles[currentStep],
            html: `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${values[currentStep]}</div></div>`,
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,
        })
    }

    const arrowHotkeys = function (e) {
        switch (e.key) {
            case "ArrowLeft":
                if (currentStep !== 0) {
                    Swal.getCancelButton().click()
                    Swal.getCancelButton().focus()
                } else {
                    Swal.getConfirmButton().focus()
                }
                break;

            case "ArrowUp":
                Swal.getDenyButton().click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton().click()
                Swal.getConfirmButton().focus()
                break;
        }
        e.preventDefault()
    }

    const result = await swalQueueStep.fire(
        {
            title: titles[currentStep],
            html: `<div style="min-height: 300px;align-items: center;display: flex;justify-content: center;"><div>${values[currentStep]}</div></div>`,
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,

            willOpen: (e) => {
                e.querySelector('.swal2-cancel').onclick = (e) => {
                    if (currentStep - 1 >= 0) {
                        currentStep = currentStep - 1
                        selectStep(currentStep)
                        Swal.getCancelButton().focus()
                    } else {
                        Swal.close()
                    }
                }
                e.querySelector('.swal2-confirm').onclick = (e) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                        Swal.getConfirmButton().focus()
                    } else {
                        Swal.close()
                        chrome.storage.sync.set({"swalInfoCompleted": true})
                    }
                }
            },
            didOpen: () => {
                document.removeEventListener('keyup', arrowHotkeys)
                document.addEventListener('keyup', arrowHotkeys)
            },
            didRender: () => {
                let progressSteps = $(".swal2-progress-step")
                progressSteps.css({
                    "user-select": "none",
                    'cursor': 'pointer'
                })
                progressSteps.click(function (el) {
                    currentStep = steps.indexOf(el.target.innerText)
                    selectStep(currentStep)
                })
            },
            willClose: () => {
                document.removeEventListener('keyup', arrowHotkeys)
            }
        }
    )
}