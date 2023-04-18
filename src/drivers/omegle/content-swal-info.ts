import {SwalWithSteps} from "../chatruletka/content-swal-info";

export class ContentSwalInfoOmegle extends SwalWithSteps {
    protected steps = ['1', '2', '3']
    protected titles = [
        "Congratulations!",
        "Extension Features",
        "License",
    ]
    protected values: string[]
    private platform: string;

    public constructor() {
        super();
        this.platform = "Omegle"
        this.values = [
            `<p><b>This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br><br>Launched in the USA in 2009 by 18-year-old Leif K-Brooks, «${this.platform}» still remains one of the biggest video chat websites in the world!<br><br><br><b>The purpose of the extension is to provide ${this.platform} users with more features, while not harming the platform itself.</b></p>`,

            `We just recently started experimenting with ${this.platform} and there is still a long way to go for implement its full support.<br><br><b>At the moment only the IP Locator and the Dark Mode are available!</b><br>Open the video chat page, so you can check it yourself.<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a> so that you can monitor the project's life and give us feedback we can work on!<br><br>We strongly encourage you to read the video chat's <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://www.omegle.com/static/terms.html\">Terms of Service</a>, <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://www.omegle.com/static/privacy.html\">Privacy Policy</a> and <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://www.omegle.com/static/guidelines.html\">Community Guidelines</a> before you start using it.`,


            `<div style="max-height: 300px; text-align: left;"><b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> extension licensed under BSD-4.</b><br><br>` + `<b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
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
        ]

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
        return this.values[this.currentStep]
    }

    public showFromStart = async () => {
        this.currentStep = 0
        return this.show()
    }
}

export class ContentSwalInfoOmegleSimplified extends SwalWithSteps {
    protected steps = ['🎉']
    protected titles = [
        "Congratulations!",
    ]
    protected values: string[]
    private platform: string;

    public constructor() {
        super();
        this.platform = "Omegle"
        this.values = [
            `<p><b>This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br><b>At the moment only the IP Locator and the Dark Mode are available!</b><br>Open the video chat page, so you can check it yourself.<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/7DYWu5RF7Y\">our Discord server</a> so that you can monitor the project's life and give us feedback we can work on!<br><br><b>Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> project <a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension/blob/main/LICENSE">licensed under BSD-4</a>.</b><br><br>` + `<b>Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
            All rights reserved.</b></div>`
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