import {SwalWithSteps} from "../chatruletka/content-swal-info";
import $ from "jquery";

export class ContentSwalInfoCoomeetFree extends SwalWithSteps {
    protected steps = ['1', '2', '3']
    protected titles = [
        chrome.i18n.getMessage("swalInfoTitle1"),
        chrome.i18n.getMessage("swalInfoTitle2"),
        chrome.i18n.getMessage("swalInfoTitle3"),
    ]
    protected values: { en: string[], ru: string[] }
    private platform: string;

    public constructor() {
        super();
        this.platform = "Coomeet Free"
        let copyrightLicense = `<b style="font-weight: bold!important;">Copyright (c) 2021-2023, <a href="http://qrlk.me" style="text-decoration: none!important;" target="_blank">Fyodor Kurlyuk</a><br>
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
   software developed the Videochat Extension project and its contributors. <br>
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
                `<p><b style="font-weight: bold!important;">This is your first use of the «Videochat Extension» on the «${this.platform}» video chat platform!</b><br><br>Unfortunately I have very little information about this video chat site, but it seems that its only purpose is to attract customers to <a id="coometpremiumlink" style="font-weight: bold!important; cursor:pointer!important; color: #056AA8">Coomeet Premium</a>, which pays girls money to chat with people like you.<br><br>However, Coomeet Free can still be used to chat with random people for free.<br><br>The purpose of the extension is to add a few features to this site to make it more usable.</p>`,
                `<div style="max-height: 300px;">Coomeet Free is an unusual video chat platform.<br><br>Connection with the stranger goes through the platform server (not directly as usual), so it is impossible to implement IP geolocation.<br><br><b style="font-weight: bold!important;">Full support for the platform is not planned, only a few features are implemented: displaying the country of the stranger, bot filter and displaying the list of countries the service is going to connect you to</b>.<br><br>Join <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/9jCuhYg55P\">our Discord server</a>, so you can follow the life of the project and give your feedback!<br><br>About the bots: there are real people on the platform, but not as many as the platform wants you to think. It seems that snippets of conversations between real people are used by the platform to keep you on the site.<br><br>I was able to implement a mechanism to recognize such bots, but you shouldn't skip them because they are probably also used to determine if you are a real person before connecting you to real people.<br><br>The option to hide video/audio from bots is available because you probably don't really want to look at fake people, especially if you're livestreaming your conversation.</div>`,
                `<div style="max-height: 300px; text-align: left;"><b style="font-weight: bold!important;">Videochat Extension is an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> extension licensed under BSD-4.</b><br><br>` + copyrightLicense
            ],
            "ru": [
                `<p><b style="font-weight: bold!important;">Это ваше первое использование Чат Рулетного Расширения на платформе видеочата «${this.platform}»!</b><br><br>К сожалению, у меня очень мало информации об этом сайте видеочата, но похоже, что его единственная цель - привлечь клиентов на сайт <a id="coometpremiumlink" style="font-weight: bold!important; cursor:pointer!important; color: #056AA8">Coomeet Premium</a>, который платит девушкам деньги за общение с людьми вроде вас.<br><br>Тем не менее, Coomeet Free можно использовать для общения со случайными людьми бесплатно.<br><br>Цель расширения - добавить несколько функций на этот сайт, чтобы сделать его более удобным для использования.`,
                `<div style="max-height: 300px;">Coomeet Free это необычная платформа видеочата.<br><br>Соединение с собеседником идёт через сервер платформы, а не напрямую как обычно, так что реализовать геолокацию IP невозможно.<br><br><b style="font-weight: bold!important;">Полной поддержки платформы не планируется, реализовано только несколько фич: отображение страны собеседника, фильтр ботов и отображение списка стран, с которыми сервис планирует вас соединить</b>.<br><br>Вступайте в наш <a target=\"_blank\" style=\"text-decoration: none!important;\" href=\"https://discord.gg/gYmQWWjwEb\">Discord</a>, чтобы вы могли следить за жизнью проекта и дать своим отзывом!<br><br>Про ботов: реальные люди на платформе есть, но их не так много, как платформа хочет, чтобы вы думали. Похоже что отрывки разговоров реальных людей используются платформой для эмуляции собеседников, чтобы держать вас на сайте.<br><br>У меня получилось реализовать механизм распознавания таких ботов, но вам не стоит их пропускать, так как вероятно они так же используются, чтобы определить являетесь ли вы реальным человеком, перед тем как соединить вас с другими людьми.<br><br>Доступна опция скрытия видео/аудио от ботов, потому что вам вероятно не очень хочется смотреть на ненастоящих людей, особенно если вы ведете прямую трансляцию вашего разговора.</div>`,
                `<div style="max-height: 300px; text-align: left;"><b style="font-weight: bold!important;">Чат Рулетное Расширения является <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> проектом с лицензией BSD-4.</b><br><br>` + copyrightLicense
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

        document.arrive('.swal2-progress-step', {existing: true}, (el) => {
            (<HTMLElement>el).style.marginBottom = '0';
            (<HTMLElement>el).style.marginLeft = '0';
        })
    }

    // TODO: this is awful, please rework
    protected didOpen = () => {
        document.removeEventListener('keyup', this.arrowHotkeys)
        document.addEventListener('keyup', this.arrowHotkeys)

        // this is just an experiment, I'm not going to promote certain chats in the extension interface / other chats,
        // this is an affiliate link from open program asking to visit coomeet premium displaying only on the coomeet free platform welcome window
        // coomeet free will attempt to trick user into opening coomeet.me any way, it's their business model
        // there is no messing with other partners ids too
        let lnk = document.getElementById('coometpremiumlink')
        if (lnk) {
            lnk.onclick = () => {
                chrome.runtime.sendMessage({openLink: "https://coomeet.me/?id=16795588704389"})
            }
        }
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