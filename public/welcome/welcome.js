const showSwalChangelog = async function () {
    const steps = [
        '1', '2', '3', '4', '5'
    ]

    const titles = {
        "en": [
            'Videochat Extension',
            'Supported websites',
            'How to use it?',
            'Favorites',
            'Privacy and License'
        ],
        "ru": [
            'Чат Рулетное Расширение',
            'Поддерживаемые чаты',
            'Как пользоваться?',
            'Избранное',
            'Приватность и лицензия'
        ]
    }

    let platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
    let countAllSites = platforms.map(pl => pl.sites.length).reduce((partialSum, a) => partialSum + a, 0)

    const values = {
        "en": [
            `<img style="height: 150px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/pin.png')}">` +
            '<br>' +
            '<b>What did I just install?</b><br>' +
            'You have just installed an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> browser extension, which will try to improve your experience of using online video chats.<br>' +
            '<br>' +
            '<b>What does this mean?</b><br>' +
            'The most important thing: now you can find out the approximate location of your interlocutor, his IP address and whether he uses a VPN.' +
            '<br>' +
            '<br>' +
            "<b>Click the red button to check it out now!</b><br><br>Or don't, so you can stay and learn more about what features are available, how to join our <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://discord.gg/YZKnbKGWen\">discord</a>, which videochats we support, how to use the extension and how we DON'T process/store you data." +
            '<br>' +
            '<br>' +
            'Also, less interesting functions are now available to you: autoskip of genders/cities that you are not interested in, a map, hotkeys, blacklist, statistics, dark theme, streamer mode (the ability to hide the image from the interlocutor\'s camera using custom picture/gif and still look at him through picture-in-picture mode), wide tweaks of the video chat interface and much, much more!',

            '<br>' +
            '<b>Which video chats does the extension support?</b><br>' +
            `In 2021, we only supported videochatru.com, but in 2022 ome.tv support was added.<br><br>In 2023, the extension was rewritten almost from scratch, which made it possible to support ${countAllSites} video chat sites belonging to ${platforms.length} platforms.` +
            '<br>' +
            '<br>' +
            `Not all extension features are available on all platforms, but this problem is only a matter of time and technical feasibility of their implementation.<br><br>The architecture of the extension allows to easily add support for more chats, so there might be more supported platforms in the future.<br><br>Join <a style="text-decoration:none;" target="_blank" href="https://discord.gg/YZKnbKGWen">our discord</a> to receive updates about the life of the project!` +
            '<br>' +
            '<br>' +
            `<b>Full text list of platforms?</b><br>${platforms.map(p => p.name).join(', ')}.`,

            `<img style="height: 150px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/pin.png')}">` +

            '<b>How to use this extension?</b><br>' +
            '1. Pin the extension to the list of extensions in your browser.<br>' +
            '2. Click on the Videochat Extension icon.<br>' +
            '3. Select the video chat you are interested in from the list of supported ones.<br>' +
            '4. Make sure that the extension is ready to work (hover over the icon on the left in the list to make sure everything is in order).<br>' +
            '5. Open the video chat by clicking on the link!',

            '<br>' +
            '<b>Favorites, Recent and on/off.</b><br>' +
            'You can mark your favorite video chats so that they are at the very top of the list!' +
            '<br>' +
            'You can enable/disable the extension for specific video chats!' +
            '<br>' +
            '<br>' +
            `<b>I didn't add chats to favorites, but who did?</b><br>` +
            `When you install the extension for the first time, it checks if you have tabs open with supported video chats and adds them to your favorites so that you don't get lost.` +
            '<br>' +
            '<br>' +
            'If nothing was found, then videochatru.com and ome.tv is added to favorites by default, because for many years these were the only supported chats and by clicking on the icon, the extension always opened one of them.' +
            '<br>' +
            '<br>' +
            'When I was rewriting the extension, it was important for me that its old users would not get lost in the new huge menu and could immediately return to action.' +
            '<br>' +
            '<br>' +
            'It is also possible to add all video chats from your browser history for the last month to favorites with one click of the button. To do this, you need to temporary allow the extension to ask your browser whether there are video chats supported by us in your history.' +
            '<br>' +
            '<br>' +
            '<button class="swal2-confirm swal2-styled" id="historyToFavorites">Add video chats from history to favorites</button>' +
            '<br>' +
            '<br>' +
            '<b>Which video chat should I use?</b><br>' +
            `The extension does not enter into commercial relations with video chats and does not recommend specific ones either: they all have their pros and cons.<br><br>You probably already use some kind of video chat, so you should start with it.`,

            '<br>' +
            '<b>Privacy:</b><br>' +
            'Videochat Extension respects its users and does not collect any data about you.<br><br>The only exceptions are the extension store analytics (we do not control it) and the automatic collection of anonymous information about extension errors, which can be disabled in the extension settings or right here (error collection is active: <input type="checkbox" id="sentryCheck">).<br><br>We do not process your IP geolocation requests, but directly use a battle-proven service ip-api.com, which <a style="text-decoration:none;" target="_blank" href="https://ip-api.com/docs/legal ">declares that it does not log requests.</a>' +
            '<br>' +
            '<br>' +
            '<b>Pay attention:</b><br>' +
            'This extension is being developed independently and is not affiliated with the video chat admins in any way.<br><br>We try to avoid functionality that can harm video chats or ban you, but you should still remember that you use the extension at your own risk, as indicated in <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension/blob/main/LICENSE ">the license</a>.'
        ],
        "ru": [
            `<img style="height: 150px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/pin.png')}">` +
            '<br>' +
            '<b>Что я установил(а)?</b><br>' +
            'Вы установили браузерное расширение с <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">открытым исходным кодом</a>, которое постарается улучшить ваш опыт использования онлайн видеочатов.<br>' +
            '<br>' +
            '<b>Что это значит?</b><br>' +
            'Самое главное: теперь вы можете узнать приблизительное местоположение вашего собеседника, его IP адрес и использует ли он VPN.' +
            '<br>' +
            '<br>' +
            "<b>Нажмите красную кнопку, чтобы проверить это прямо сейчас!</b><br><br>Или не делайте этого, чтобы остаться и узнать больше о доступных функциях, о нашем<a style= \"text-decoration:none;\" target=\"_blank\" href=\"https://discord.gg/YZKnbKGWen\">discord</a>, о том, какие видеочаты мы поддерживаем, как использовать расширение и как мы НЕ обрабатываем/храним ваши данные" +
            '<br>' +
            '<br>' +
            'Так же теперь вам доступны и другие функции: автопропуск неинтересных вам гендеров/городов, карта, горячие клавиши, чёрный список, статистика, тёмная тема, режим стримера (возможность закрыть собеседника своей картинкой и смотреть на него через режим картинка-в-картинке), широкие настройки интерфейса видеочата и многое, многое другое!',


            '<br>' +
            '<b>Какие видеочаты поддерживает расширение?</b><br>' +
            `В 2021 году поддерживался только videochatru.com, но уже в 2022 была добавлена поддержка ome.tv.<br><br>В 2023 году расширение было переписано практически с нуля, что позволило поддерживать сразу ${countAllSites} сайтов-видеочатов, относящихся к ${platforms.length} разным платформам.` +
            '<br>' +
            '<br>' +
            `Не на всех платформах доступны все функции расширения, но эта проблема - лишь вопрос времени и технической возможности их реализации.<br><br>Архитектура расширения позволяет легко добавлять поддержку для видеочатов, так что в будущем может появиться больше поддерживаемых платформ.<br><br>Вступайте в <a style="text-decoration:none;" target="_blank" href="https://discord.gg/YZKnbKGWen">наш дискорд</a>, чтобы следить за обновлениями проекта!` +
            '<br>' +
            '<br>' +
            `<b>Полный текстовый список платформ?</b><br>${platforms.map(p => p.name).join(', ')}.`,


            `<img style="height: 150px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/pin.png')}">` +

            '<b>Как использовать расширение?</b><br>' +
            '1. Закрепите расширение в списке расширений вашего браузера.<br>' +
            '2. Нажмите на иконку Чат Рулетного Расширения.<br>' +
            '3. Выберите интересующий вас видеочат в списке поддерживаемых.<br>' +
            '4. Убедитесь что расширение готово к работе (наведите на иконку слева в списке, чтобы удостовериться, что всё в порядке).<br>' +
            '5. Откройте видеочат, нажав на ссылку!',


            '<br>' +
            '<b>Избранное, недавнее и вкл/выкл.</b><br>' +
            'Вы можете отмечать любимые видеочаты, чтобы они были в самом вверху списка!' +
            '<br>' +
            'Вы можете включать/выключать работу расширения для конкретных видеочатов!' +
            '<br>' +
            '<br>' +
            '<b>Я не добавлял чаты в избранное, а они там есть?</b><br>' +
            'Когда вы впервые устанавливаете расширение, оно проверяет открыты ли у вас вкладки с поддерживаемыми видеочатами и добавляет их в избранное, чтобы вы не заблудились.' +
            '<br>' +
            '<br>' +
            'Если ничего не было найдено, то videochatru.com и ome.tv добавляются в избранное по умолчанию, потому что долгие годы это были единственные поддерживаемые чаты и по клику на иконку расширение всегда открывало один из них.' +
            '<br>' +
            '<br>' +
            'Когда я переписывал расширение, для меня было важно, чтобы его старые пользователи не потерялись в новой огромной менюшке и могли сразу вернуться к действию.' +
            '<br>' +
            '<br>' +
            'Так же есть возможность одной кнопкой добавить в избранное все видеочаты из истории вашего браузера за последний месяц. Для этого нужно, чтобы вы временно разрешили расширению узнать у вашего браузера есть ли в вашей истории поддерживаемые нами видеочаты.' +
            '<br>' +
            '<br>' +
            '<button class="swal2-confirm swal2-styled" id="historyToFavorites">Добавить видеочаты из истории в избранное</button>' +
            '<br>' +
            '<br>' +
            '<b>Какой видеочат мне лучше использовать?</b><br>' +
            `Расширение не вступает в коммерческие отношения с видеочатами и конкретные тоже не рекомендует: у всех них есть свои плюсы и минусы.<br><br>Вероятно, вы уже пользуетесь каким-то видеочатом, так что вам стоит начать с него.`,

            '<br>' +
            '<b>Приватность:</b><br>' +
            'Чат Рулетное Расширение уважает своих пользователей и не собирает никаких данных о вас.<br><br>Исключением может считаться только анатилика магазина расширений (её мы не контролируем) и автоматический сбор анонимной информации об ошибках расширения, который можно отключить в настройках расширения или прямо здесь (сбор ошибок активен: <input type="checkbox" id="sentryCheck">).<br><br>Мы не обрабатываем ваши запросы геолокации IP, а используем напрямую зарекомендовавший себя сервис ip-api.com, который <a  style="text-decoration:none;" target="_blank" href="https://ip-api.com/docs/legal">заявляет, что не логирует запросы.</a>' +
            '<br>' +
            '<br>' +
            '<b>Обратите внимание:</b><br>' +
            'Это расширение разрабатывается независимо и никак не связано с администрациями видеочатов.<br><br>Мы стараемся избегать функционала, который может навредить видеочатам или забанить вас, но вам всё же стоит помнить, что вы используете расширение на свой страх и риск, как указано в <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension/blob/main/LICENSE">лицензии</a>.'
        ],
    }

    let index = 0

    let currentStep = index

    const swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "->",
        denyButtonText: 'хочу сразу в чат',
        cancelButtonText: '<-',
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps,
    })

    const selectStep = function (step) {
        swalQueueStep.update({
            title: titles[chrome.i18n.getMessage('lang')][currentStep],
            html: `<div id="container" style="text-align: left; min-height: 400px; max-height: 400px">${values["en"][currentStep]}</div>`,
            currentProgressStep: currentStep
        })
        document.getElementById('container').scrollIntoView()
        if (document.getElementById('sentryCheck')) {
            chrome.storage.sync.get({"sentry": false}, (res) => {
                document.getElementById('sentryCheck').checked = res["sentry"]
            })
            document.getElementById('sentryCheck').addEventListener('change', (el) => {
                chrome.storage.sync.set({"sentry": el.target.checked})
            })
        }
        if (document.getElementById('historyToFavorites')) {
            document.getElementById('historyToFavorites').addEventListener('click', async (e) => {
                let res = await chrome.permissions.request({
                    permissions: ["history"]
                })
                if (res && chrome.history) {
                    let startDate = +new Date() - 28 * 24 * 3600 * 1000
                    let found = []
                    let favorites = (await chrome.storage.sync.get({'favorites': []}))["favorites"]

                    for (const platform of platforms) {
                        for (const site of platform.sites) {
                            let res = await chrome.history.search({
                                "text": site.text,
                                "maxResults": 1,
                                "startTime": startDate
                            })
                            if (res.length > 0) {
                                if (!favorites.includes(site.id)) {
                                    found.push({site: site, last: res[0].lastVisitTime})
                                }
                            }
                        }
                    }

                    await chrome.permissions.remove({
                        permissions: ["history"]
                    })

                    let recentDict = (await chrome.storage.sync.get({"recentDict": {}})).recentDict
                    for (const res of found) {
                        recentDict[res.site.id] = Math.ceil(res.last / 1000)
                        favorites.push(res.site.id)
                    }
                    await chrome.storage.sync.set({"recentDict": recentDict})
                    await chrome.storage.sync.set({favorites: favorites})
                    if (found.length === 0) {
                        alert("Мы не нашли поддерживаемых видеочатов в вашей истории / они уже в Favorites.")
                    } else {
                        alert(`Добавлено ${found.length} видеочатов в избранное: ${found.map(r => r.site.text).join(', ')}`)
                    }
                }
            })
        }
    }

    const arrowHotkeys = function (e) {
        switch (e.key) {
            case "ArrowLeft":
                Swal.getCancelButton().click()
                break;

            case "ArrowUp":
                Swal.getDenyButton().click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton().click()
                break;
        }
        e.preventDefault()
    }

    const result = await swalQueueStep.fire(
        {
            title: titles[chrome.i18n.getMessage('lang')][currentStep],
            html: `<div id="container" style="text-align: left; min-height: 400px; max-height: 400px">${values["en"][currentStep]}</div>`,
            currentProgressStep: currentStep,

            willOpen: (e) => {
                e.querySelector('.swal2-cancel').onclick = (e) => {
                    if (currentStep - 1 >= 0) {
                        currentStep = currentStep - 1
                        selectStep(currentStep)
                    } else {
                        // Swal.close()
                    }
                }
                e.querySelector('.swal2-confirm').onclick = async (e) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                    } else {
                        await fixPermissions()
                        Swal.close()
                    }
                }
                e.querySelector('.swal2-deny').onclick = async (e) => {
                    await fixPermissions()
                    Swal.close()
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
    return result
}

async function fixPermissions() {
    let platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
    let origins = []
    let block = ["7fef97eb-a5cc-4caa-8d19-75dab7407b6b", "98ea82db-9d50-4951-935e-2405d9fe892e"]
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (!block.includes(site.id)) {
                origins.push(site.origin)
            }
        }
    }
    console.dir(origins)
    // might break if not called inside a user gesture
    try {
        await chrome.permissions.request({
            permissions: ["scripting"],
            origins: origins
        })
    } catch (el) {
        // TODO: should collect this error
        console.dir(el)
    }
}

console.dir(showSwalChangelog().then(() => {
    // background service worker needs some time to register content scripts on new origins
    setTimeout(() => {
        location.href = chrome.runtime.getURL('popup/popup.html')
    }, 1000)
}))