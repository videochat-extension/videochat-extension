const showSwalInfo = async function () {
    const steps = ['1', '2', '3', '4', '5', '6', '7']
    const swalQueueStep = Swal.mixin({
        progressSteps: steps,
        heightAuto: false,
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        allowOutsideClick: false, // optional classes to avoid backdrop blinking between steps
        allowEnterKey: true,
        reverseButtons: true,
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'}
    })

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
        `<div style="max-height: 40vh">MIT License<br><br>

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
    let currentStep

    for (currentStep = 0; currentStep < steps.length;) {
        const result = await swalQueueStep.fire({
            title: titles[currentStep],
            html: values[currentStep],
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep
        })

        if (result.value) {
            currentStep++
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            currentStep--
        } else {
            break
        }
    }

    if (currentStep === steps.length) {
        chrome.storage.sync.set({"swalInfoCompleted": true})
    }
}