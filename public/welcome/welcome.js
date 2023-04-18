let platforms
let lang = chrome.i18n.getMessage('lang') || "en"

function toObject(from, to) {
    for (let key in from) {
        let value = from[key]

        if (typeof value === 'object' && value && !Array.isArray(value)) {
            toObject(value, from[key])
            continue
        }

        to[key] = value
    }
}

function createElement(tagName, options, childs) {
    const element = document.createElement(tagName)

    toObject(options, element)

    for (let child of childs)
        element.appendChild(child)

    return element
}

const showSwalChangelog = async function () {
    const steps = [
        '1', '2', '3', '4', '5', '6'
    ]

    const titles = {
        "en": [
            'Videochat Extension',
            'Features',
            'Supported websites',
            'How to use it?',
            'Favorites',
            'Privacy and License'
        ],
        "ru": [
            'Чат Рулетное Расширение',
            'Функции',
            'Поддерживаемые чаты',
            'Как пользоваться?',
            'Избранное',
            'Приватность и лицензия'
        ]
    }

    platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
    let countAllSites = platforms.map(pl => pl.sites.length).reduce((partialSum, a) => partialSum + a, 0)

    const simple = {
        "ru": [
            `<img style="height: 145px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${typeof browser === "undefined" ? chrome.runtime.getURL('welcome/img/chromium_' + lang + '.png') : chrome.runtime.getURL('welcome/img/firefox_' + lang + '.png')}">` +
            '<br>' +
            '<b>Что я установил(а)?</b><br>' +
            'Это браузерное расширение для Чат Рулеток:' +
            '<ul>' +
            '<li><strong>Chatruletka</strong>, <strong>Ome.tv</strong>, <strong>Minichat</strong>, <strong>Chatrulez</strong>.</li>' +
            '<li><strong>Omegle (IP Locator &amp; Dark Mode only)</strong>.</li>' +
            '<li><strong>Coomeet Free (bot recognition only)</strong>.</li>' +
            '</ul>' +
            '<b>Важно</b><br>' +
            'Чат Рулетное Расширение — это <b><a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension#policy-of-neutrality-acceptable-use-and-functional-limitations">независимый</a></b> проект с <b><a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension">открытым исходным кодом</a></b>, наше сообщество размещено в <b><a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">Discord</a></b>.'
        ],
        "en": [
            `<img style="height: 170px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${typeof browser === "undefined" ? chrome.runtime.getURL('welcome/img/chromium_' + lang + '.png') : chrome.runtime.getURL('welcome/img/firefox_' + lang + '.png')}">` +
            '<br>' +
            '<b>What did I just install?</b><br>' +
            'This is a browser extension for the following video chats:' +
            '<ul>' +
            '<li><strong>Chatruletka</strong>, <strong>Ome.tv</strong>, <strong>Minichat</strong>, <strong>Chatrulez</strong>.</li>' +
            '<li><strong>Omegle (IP Locator &amp; Dark Mode only)</strong>.</li>' +
            '<li><strong>Coomeet Free (bot recognition only)</strong>.</li>' +
            '</ul>' +
            '<b>Important</b><br>' +
            'Videochat Extension is an <b><a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension/videochat-extension#policy-of-neutrality-acceptable-use-and-functional-limitations">independent</a></b> <b><a style="text-decoration:none;" target="_blank" href="https://github.com/videochat-extension">open source</a></b> project, our community is hosted on <b><a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">Discord</a></b>.'
        ]
    }

    const values = {
        "en": [
            `<img style="height: 170px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${typeof browser === "undefined" ? chrome.runtime.getURL('welcome/img/chromium_' + lang + '.png') : chrome.runtime.getURL('welcome/img/firefox_' + lang + '.png')}">` +
            '<br>' +
            '<b>What did I just install?</b><br>' +
            'You have just installed an <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">open source</a> browser extension, which will try to improve your experience of using online video chats.<br>' +
            '<br>' +
            '<b>What does this mean?</b><br>' +
            'The most important thing: now you can find out the approximate location of your interlocutor (by trying to geolocate his IP address) and whether he uses a VPN.' +
            '<br>' +
            '<br>' +
            "<b>Click the red button to check it out now!</b><br><br>Or don't, so you can stay and learn more about what features are available, how to join our <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://discord.gg/7DYWu5RF7Y\">discord</a>, which videochats we support, how to use the extension and how we do NOT process/store you data.",

            '<br>' +
            '<b>What features are available?</b><br>' +
            '<ul>' +
            '<li><b>IP Locator</b></li>' +
            '<ul><li>uses the ip geolocation service to determine the approximate location and whether the stranger\'s using a mobile/vpn/tor connection</li></ul>' +

            '<li><b>map</b></li>' +
            '<ul><li>IP Locator\'s data is displayed on a world map</li></ul>' +

            '<li><b>auto-skip of certain genders</b></li>' +
            '<ul><li>ai-powered client-side gender recognition</li></ul>' +
            '<ul><li>possibility to add a stranger to the blacklist if he was skipped because of gender</li></ul>' +
            '<ul><li>statistics on the number of men/women encountered</li></ul>' +

            '<li><b>search for specific cities/regions</b></li>' +
            '<ul><li>auto-skip if the stranger is not from a list of cities/regions you have specified</li></ul>' +

            '<li><b>iknowwhatyoudownload</b></li>' +
            '<ul><li>allows to open a window with a list of torrents potentially downloaded by a stranger</li></ul>' +
            '<ul><li>it\'s a great way to talk to a stranger about their tastes in games, music, movies</li></ul>' +
            '<ul><li>does not work for mobile/vpn/tor connections</li>' +
            '<li>not useful in countries where torrents are illegal</li></ul>' +

            '<li><b>screenshot</b></li>' +
            '<ul><li>the ability to take screenshot from a stranger\'s camera</li></ul>' +
            '<ul><li>the ability to take screenshot from your own camera</li></ul>' +

            '<li><b>picture-in-picture</b></li>' +
            '<ul><li>ability to activate PiP mode on remote/local camera</li></ul>' +
            '<ul><li>this way you can see people while you are doing other things on your PC</li></ul>' +
            '<ul><li>does not work in firefox, but firefox lets you turn on the PiP by clicking on the video</li></ul>' +

            '<li><b>local hotkeys</b></li>' +
            '<ul><li>use the keyboard arrows to skip/skip+blacklist/stop/report</li></ul>' +

            '<li><b>global hotkeys</b></li>' +
            '<ul><li>browser-level hotkeys to skip/skip+blacklist/stop</li></ul>' +
            '<ul><li>browser-level hotkeys to make remote/local screenshot</li></ul>' +
            '<ul><li>browser-level hotkey to switch from the current tab to the chat tab and back (does not work in firefox)</li></ul>' +

            '<li><b>automation</b></li>' +
            '<ul><li>auto-skip strangers that take more than 4 seconds to connect</li></ul>' +
            '<ul><li>auto-skip if you were looking for someone from X country but the videochat found you someone from Y country</li></ul>' +
            '<ul><li>automatically close \'make yourself visible\' (not on all platforms)</li></ul>' +

            '<li><b>blacklist</b></li>' +
            '<ul><li>ability to blacklist the stranger\'s IP to auto-skip him the next time you meet</li></ul>' +
            '<ul><li>option not to add mobile IPs to the blacklist due to their temporary nature</li></ul>' +
            '<ul><li>statistics on how many blacklisted IPs you\'ve encountered again</li></ul>' +

            '<li><b>statistics</b></li>' +
            '<ul><li>counts the number of people you\'ve met in video chat</li></ul>' +
            '<ul><li>counts how much time you spent in video chat</li></ul>' +
            '<ul><li>counts various statistics for other modules such as blacklist / gender skipping</li></ul>' +

            '<li><b>interface tweaks</b></li>' +
            '<ul><li>dark mode</li></ul>' +
            '<ul><li>hide/show logo, banner, header, watermark</li></ul>' +
            '<ul><li>ability to cancel camera reflection (not on all platforms)</li></ul>' +
            '<ul><li>ability to disable cropping stranger\'s video (not on all platforms)</li></ul>' +
            '<ul><li>ability to hide your own camera to make conversation more natural</li></ul>' +

            '<li><b>streamer mode</b></li>' +
            '<ul><li>a set of features to help streamers to combat nsfw on streams and much more</li></ul>' +
            '<ul><li>ability to hide a stranger\'s camera image with a blur or custom picture/gif and look at it in picture-in-picture mode to check for nsfw</li></ul>' +
            '<ul><li>optional auto blurring/hiding when starting a new conversation</li></ul>' +
            '<ul><li>hotkey to mute/blur/cover a stranger</li></ul>' +
            '<ul><li>does not work in firefox</li></ul>' +
            '<ul><li>this mode is in alfa version, if you have feedback please contact the developer in the project\'s discord</li></ul>' +

            '<li>other less important QoL-features</li><br>' +
            '</ul>' +
            '<b>Please note:</b><br>' +
            'Not all extension features are available on all platforms.' +
            '<br>' +
            '<br>' +
            'Newly supported platforms take time to adjust to its specifics, so only a small \'early-access\' selection of essential features are available for you on this chats.' +
            '<br>' +
            '<br>' +
            'Many video chats are very similar to each other and the architecture of the extension allows to reuse some code written for other platforms, but there are still many non-obvious things, such as the reaction of the chat moderation system to frequent skips or interface differences that need to be clarified and tested before giving you access.' +
            '<br>' +
            '<br>' +
            'Join <a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">our discord</a> to receive updates about the life of the project!',
            '<br>' +
            '<b>Which video chats does the extension support?</b><br>' +
            `In 2021 we only supported videochatru.com, but in 2022 ome.tv support was added.<br><br>In 2023, the extension was rewritten almost from scratch, which made it possible to support ${countAllSites} video chat sites belonging to ${platforms.length} platforms.` +
            '<br>' +
            '<br>' +
            `Not all features of the extension are available on all platforms, but this problem is only a matter of time, priority, and technical feasibility.<br><br>The architecture of the extension makes it easy to add support for more chats, so there could be even more supported platforms in the future.<br><br>Join <a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">our discord</a> to receive updates about the life of the project!` +
            '<br>' +
            '<br>' +
            `<b>Full text list of platforms?</b><br>${platforms.map(p => p.name).join(', ')}.`,

            `<img style="height: 170px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/img/firefox-test.png')}">` +
            '<br>' +

            '<b>How to use this extension?</b><br>' +
            '1. Pin the extension to the list of extensions in your browser.<br>' +
            '2. Click on the Videochat Extension icon.<br>' +
            '3. Select the video chat you are interested in from the list of supported.<br>' +
            '4. Make sure that the extension is ready to work (hover over the icon on the left in the list to make sure everything is in order).<br>' +
            '5. Open the video chat by clicking on the link!',

            '<br>' +
            '<b>Favorites, Recent and on/off.</b><br>' +
            'You can star your favorite video chats to be at the top of the list!' +
            '<br>' +
            'You can turn the extension on/off for certain video chats' +
            '<br>' +
            '<br>' +
            `<b>I didn't add chats to favorites, but who did?</b><br>` +
            `When you install the extension for the first time, it checks if you have any tabs open with supported video chats and adds them to your favorites so that you don't get lost.` +
            '<br>' +
            '<br>' +
            'If nothing is found, then videochatru.com and ome.tv are added to the favorites by default, because for years these were the only supported chats and by clicking on the icon the extension always opened one of them.' +
            '<br>' +
            '<br>' +
            'When I was rewriting the extension, it was important for me that its old users would not get lost in the new huge menu and could immediately return to action.' +
            '<br>' +
            '<br>' +
            'You can also add all the video chats from the browser history of the past month to your favorites with a single click. To do this, you need to temporarily allow the extension to ask your browser if there are any video chats in the history that we support.' +
            '<br>' +
            '<br>' +
            '<button class="swal2-confirm swal2-styled" id="historyToFavorites">Add video chats from the history to the favorites</button>' +
            '<br>' +
            '<br>' +
            '<b>Which video chat should I use?</b><br>' +
            `The extension does not enter into commercial relations with video chats and does not recommend specific ones either: all of them have their pros and cons.<br><br>You probably already use some kind of video chat, so you should start with it.`,

            '<br>' +
            '<b>Privacy:</b><br>' +
            'Videochat Extension respects its users and does not collect any data about you.<br><br>The only exceptions are extension store analytics (we do not control it) and automatic anonymous collection of extension errors, which can be disabled in the extension settings or right here (error collection is active: <input type="checkbox" id="sentryCheck">).<br><br>We do not process your IP geolocation requests, but directly use a battle-proven ip-api.com service, which <a style="text-decoration:none;" target="_blank" href="https://ip-api.com/docs/legal ">claims that it does not log requests.</a>' +
            '<br>' +
            '<br>' +
            '<b>Pay attention:</b><br>' +
            'This extension is being developed independently and is not affiliated with the video chat admins in any way.<br><br>We avoid functionality that can harm video chats or ban you, but you should still remember that you use the extension at your own risk, as indicated in <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension/blob/main/LICENSE ">the license</a>.'
        ],
        "ru": [
            `<img style="height: 170px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${typeof browser === "undefined" ? chrome.runtime.getURL('welcome/img/chromium_' + lang + '.png') : chrome.runtime.getURL('welcome/img/firefox_' + lang + '.png')}">` +
            '<br>' +
            '<b>Что я установил(а)?</b><br>' +
            'Вы установили браузерное расширение с <a style="text-decoration:none;" target="_blank" href="https://github.com/qrlk/videochat-extension">открытым исходным кодом</a>, которое постарается улучшить ваш опыт использования онлайн видеочатов.<br>' +
            '<br>' +
            '<b>Что это значит?</b><br>' +
            'Самое главное: теперь вы сможете узнать приблизительное местоположение вашего собеседника (путём геолокации его IP адреса), а так же использует ли он VPN.' +
            '<br>' +
            '<br>' +
            "<b>Нажмите красную кнопку, чтобы проверить это прямо сейчас!</b><br><br>Или не делайте этого, чтобы остаться и узнать больше о доступных функциях, о нашем <a style= \"text-decoration:none;\" target=\"_blank\" href=\"https://discord.gg/7DYWu5RF7Y\">discord</a>, о том, какие видеочаты мы поддерживаем, как использовать расширение и как мы НЕ обрабатываем/храним ваши данные",

            '<br>' +
            '<b>Какие функции доступны?</b><br>' +
            '<ul>' +
            '<li><b>IP геолокация</b></li>' +
            '<ul><li>использует сервис ip-геолокации для определения приблизительного местоположения и того, использует ли собеседник мобильное/vpn/тор соединение</li></ul>' +

            '<li><b>карта</b></li>' +
            '<ul><li>данные IP геолокации отображаются на карте мира</li></ul>' +

            '<li><b>автопропуск по полу</b></li>' +
            '<ul><li>распознавание пола собеседника на стороне клиента с помощью ИИ</li></ul>' +
            '<ul><li>возможность добавить собеседника в черный список, если он был пропущен из-за пола</li></ul>' +
            '<ul><li>статистика по количеству встреченных мужчин/женщин</li></ul>' +

            '<li><b>поиск определенных городов/регионов</b></li>' +
            '<ul><li>автопропуск, если собеседника не из указанного вами списка городов/регионов</li></ul>' +

            '<li><b>iknowwhatyoudownload</b></li>' +
            '<ul><li>позволяет открыть окно со списком торрентов, потенциально загруженных собеседником</li></ul>' +
            '<ul><li>это отличный способ поговорить с незнакомцем о его вкусах в играх, музыке, фильмах</li></ul>' +
            '<ul><li>не работает для мобильных/vpn/tor соединений</li>' +
            '<li>не пригодится в странах, где торренты запрещены</li></ul>' +

            '<li><b>скриншот</b></li>' +
            '<ul><li>возможность сделать скриншот с камеры незнакомца</li></ul>' +
            '<ul><li>возможность сделать снимок экрана со своей камеры</li></ul>' +

            '<li><b>картинка-в-картинке</b></li>' +
            '<ul><li>возможность активировать режим PiP на удаленной/локальной камере</li></ul>' +
            '<ul><li>таким образом вы можете видеть людей, пока занимаетесь другими делами на своем компьютере</li></ul>' +
            '<ul><li>не работает в firefox, но firefox позволяет включить PiP, нажав на видео</li></ul>' +

            '<li><b>локальные горячие клавиши</b></li>' +
            '<ul><li>используйте стрелки клавиатуры для пропуска/пропуска+ЧС/остановки/жалобы</li></ul>' +

            '<li><b>глобальные горячие клавиши</b></li>' +
            '<ul><li>пропуск/пропуск+ЧС/стоп</li></ul>' +
            '<ul><li>скриншот вашей камеры/камеры собеседника</li></ul>' +
            '<ul><li>переключения с текущей вкладки на вкладку чата и обратно (не работает в firefox)</li></ul>' +

            '<li><b>автоматизация</b></li>' +
            '<ul><li> автопропуск незнакомцев, подключение к которым занимает дольше 4 секунд</li></ul>' +
            '<ul><li>автопропуск, если вы искали человека из страны X, но видеочат нашел вам человека из страны Y</li></ul>' +
            '<ul><li>возможность автоматически закрывать "вы здесь?" (не на всех платформах)</li></ul>' +

            '<li><b>черный список</b></li>' +
            '<ul><li>возможность занести IP незнакомца в черный список, чтобы автоматически исключить его из списка при следующей встрече</li></ul>' +
            '<ul><li>возможность не добавлять мобильные IP в черный список из-за их временного натуры</li></ul>' +
            '<ul><li>статистика о том, сколько IP из черного списка вы встретили снова</li></ul>' +

            '<li><b>статистика</b></li>' +
            '<ul><li>подсчитывает количество людей, с которыми вы встречались в видеочате</li></ul>' +
            '<ul><li>подсчитывает, сколько времени вы провели в видеочате</li></ul>' +
            '<ul><li>подсчитывает различную статистику для других модулей, таких как черный список / пропуск по полу</li></ul>' +

            '<li><b>настройки интерфейса</b></li>' +
            '<ul><li>тёмная тема</li></ul>' +
            '<ul><li>возможность скрыть логотип, баннер, заголовок, водяной знак</li></ul>' +
            '<ul><li>возможность отменить отражение вашей камеры (не на всех платформах)</li></ul>' +
            '<ul><li>возможность отключить обрезку чужого видео (не на всех платформах)</li></ul>' +
            '<ul><li>возможность скрыть собственную камеру, чтобы сделать разговор более естественным</li></ul>' +

            '<li><b>режим стримера</b></li>' +
            '<ul><li>набор функций, помогающих стримерам бороться с nsfw на стримах и многое другое</li></ul>' +
            '<ul><li>возможность скрыть изображение с камеры незнакомца с помощью размытия или пользовательской картинки/gif и просмотреть его в режиме "картинка в картинке" для проверки на наличие nsfw</li></ul>' +
            '<ul><li>опциональное автоматическое размытие/скрытие при начале нового разговора</li></ul>' +
            '<ul><li>горячая клавиша для отключения звука/размытия/прикрытия незнакомца</li></ul>' +
            '<ul><li>не работает в firefox</li></ul>' +
            '<ul><li> этот режим находится в alfa версии, если у вас есть идеи о том как его улучшить, пожалуйста, свяжитесь с разработчиком в discord проекта</li></ul>' +

            '<li>другие менее значимые улучшения</li><br>' +
            '</ul>' +
            '<b>Обратите внимание:</b><br>' +
            'Не все функции расширения доступны на всех платформах.' +
            '<br>' +
            '<br>' +
            'Для некоторых платформ требуется время, чтобы адаптироваться к их особенностям, поэтому иногда для вас доступен лишь небольшой набор основных функций "раннего доступа".' +
            '<br>' +
            '<br>' +
            'Многие видеочаты очень похожи друг на друга, и архитектура расширения позволяет повторно использовать часть кода, написанного для других платформ, но есть еще много неочевидных вещей, таких как реакция системы модерации чата на частые пропуски или различия в интерфейсе, которые необходимо прояснить и протестировать, прежде чем предоставить вам доступ.' +
            '<br>' +
            '<br>' +
            `Вступайте в <a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">наш дискорд</a>, чтобы следить за обновлениями проекта!`,


            '<br>' +
            '<b>Какие видеочаты поддерживает расширение?</b><br>' +
            `В 2021 году поддерживался только videochatru.com, но уже в 2022 была добавлена поддержка ome.tv.<br><br>В 2023 году расширение было переписано практически с нуля, что позволило поддерживать сразу ${countAllSites} сайтов-видеочатов, относящихся к ${platforms.length} разным платформам.` +
            '<br>' +
            '<br>' +
            `Не на всех платформах доступны все функции расширения, но эта проблема - лишь вопрос времени и технической возможности их реализации.<br><br>Архитектура расширения позволяет легко добавлять поддержку для видеочатов, так что в будущем может появиться больше поддерживаемых платформ.<br><br>Вступайте в <a style="text-decoration:none;" target="_blank" href="https://discord.gg/7DYWu5RF7Y">наш дискорд</a>, чтобы следить за обновлениями проекта!` +
            '<br>' +
            '<br>' +
            `<b>Полный текстовый список платформ?</b><br>${platforms.map(p => p.name).join(', ')}.`,


            `<img style="height: 170px;
            margin-left: auto;
            margin-right: auto;
            display: block;" src="${chrome.runtime.getURL('welcome/img/firefox-test.png')}">` +
            '<br>' +
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

    let isCurious = (await chrome.storage.sync.get({['curious']: false}))['curious']

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
        denyButtonText: chrome.i18n.getMessage("welcomeDenyButtonText"),
        cancelButtonText: '<-',
        heightAuto: false,
        reverseButtons: true,
        progressSteps: isCurious ? steps : ['👋'],
        footer: createElement('div', {}, [
            createElement('span', {}, [
                createElement('span', {
                    innerText: chrome.i18n.getMessage('welcomeCuriousCheckText'),
                    className: "tooltip",
                    style: "cursor: pointer",
                    title: chrome.i18n.getMessage('welcomeCuriousCheckTitle'),
                    onclick: () => {
                        document.getElementById(`curiousCheck`).click()
                    }
                }, []),
                createElement('input', {
                    type: "checkbox",
                    checked: isCurious,
                    id: `curiousCheck`,
                    onchange: (event) => {
                        let checked = event.currentTarget.checked

                        let syncDict = {}
                        syncDict['curious'] = event.currentTarget.checked
                        chrome.storage.sync.set(syncDict, function () {
                            if (checked) {
                                showSwalChangelog()
                            } else {
                                showSwalChangelog()
                            }
                        })
                    },
                }, [])
            ]),
        ])
    })

    const selectStep = function (step) {
        swalQueueStep.update({
            title: titles[lang][currentStep],
            html: `<div id="container" style="text-align: left; min-height: 400px; max-height: 400px">${isCurious ? values[lang][currentStep] : simple[lang][currentStep]}</div>`,
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
                        alert(chrome.i18n.getMessage("welcomeHistoryScanNotFound"))
                    } else {
                        alert(chrome.i18n.getMessage("welcomeHistoryScanAdded", [found.length, found.map(r => r.site.text).join(', ')]))
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
            title: titles[lang][currentStep],
            html: `<div id="container" style="text-align: left; min-height: 400px; max-height: 400px">${isCurious ? values[lang][currentStep] : simple[lang][currentStep]}</div>`,
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
                    if (isCurious && currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                    } else {
                        await fixPermissions()
                    }
                }
                e.querySelector('.swal2-deny').onclick = async (e) => {
                    await fixPermissions()
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

function getSiteByDomain(domain, platforms) {
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (site.text === domain) {
                return {site: site, platform: platform.id}
            }
        }
    }
}

function extractDomain(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1");
}

async function fixPermissions() {
    let origins = []
    let block = []
    let contentScripts = chrome.runtime.getManifest().content_scripts
    if (contentScripts) {
        for (const script of contentScripts) {
            for (const match of script.matches) {
                let domain = extractDomain(match)
                if (domain) {
                    let site = getSiteByDomain(domain, platforms)
                    if (site && site.site && site.site.id) {
                        block.push(site.site.id)
                    }
                }
            }
        }
    }
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (!block.includes(site.id)) {
                origins.push(site.origin)
            }
        }
    }
    console.dir(origins)

    // firefox does not let use await here :(
    let shouldWait = true
    chrome.permissions.contains({
        permissions: ["scripting"],
        origins: origins
    }).then((res) => {
        if (!res) {
            Swal.fire({
                title: chrome.i18n.getMessage('welcomeSwalPermissionTitle'),
                html: chrome.i18n.getMessage('welcomeSwalPermissionContent'),
                icon: 'warning',
            })
        } else {
            shouldWait = false
        }
    })

    // might break if not called inside a user gesture
    try {
        chrome.permissions.request({
            permissions: ["scripting"],
            origins: origins
        }).then(() => {
            if (shouldWait) {
                location.href = chrome.runtime.getURL('popup/popup.html?zoom=120&scanHistory')
            } else {
                // background service worker needs some time to register content scripts on new origins
                let timerInterval
                Swal.fire({
                    html: chrome.i18n.getMessage('welcomeSwalTimerText'),
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    location.href = chrome.runtime.getURL('popup/popup.html?zoom=120&scanHistory')
                })
            }
        })
    } catch (el) {
        // TODO: should collect this error
        console.dir(el)
        location.href = chrome.runtime.getURL('popup/popup.html?zoom=120&scanHistory')
    }
}

document.title = chrome.i18n.getMessage('welcomeTitle')

console.dir(showSwalChangelog())