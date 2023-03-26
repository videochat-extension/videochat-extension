import {SwalWithSteps} from "../drivers/chatruletka/content-swal-info";
import {ControlsTabSettings} from "../drivers/chatruletka/content-module-settings";

let changelog: { version: string, date: string, description: { en: string, ru: string } }[] = [
    {
        version: "0.1",
        date: "2021-09-27",
        description: {
            en: '<b>The first known version for a mass audience.</b><br>' +
                '<br>' +
                '<b>- Section \'Remote IP\'.</b><br>' +
                '— Added the \'Remote IP\' section.<br>' +
                '— The section displays information about the interlocutor\'s IP: country, city, region, time zone, network information: mobile/vps/vpn.<br>' +
                '— In order for the geolocation service to work, you need to allow unsafe content in the site settings.<br>' +
                '— At startup, an API check is triggered and information is given on how to fix the API if it does not work.<br>' +
                '<br>' +
                '<b>- Section \'Map\'.</b><br>' +
                '— Added the \'Map\' section.<br>' +
                '— The section shows the location of the interlocutor on the 2gis map.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added the \'Remote IP\' section.<br>' +
                '— Added the ability to hide the watermark.<br>' +
                '— Added the ability to hide the banner \'Video Chat RU\'.<br>' +
                '— Added the ability to reflect the image from the interlocutor\'s camera (mirror).<br>' +
                '<br>' +
                '<b>- Hotkeys.</b><br>' +
                '— Added chrome hotkeys: extension activation, skip, stop, a screenshot of the interlocutor/a screenshot of your camera.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added buttons (in the header) to save screenshots (^) from the user\'s camera and the interlocutor\'s camera.<br>' +
                '— Clicking on the extension icon will open the version of roulette without garbage (embed).',
            ru: '<b>Первая известная версия для массовой аудитории.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Remote IP\'.</b><br>' +
                '— Добавлен раздел \'Remote IP\'.<br>' +
                '— Определение информации об IP собеседника: страна, город, регион, временная зона, информация о сети: mobile/vps/vpn.<br>' +
                '— Чтобы сервис геолокации работал, нужно разрешить небезопасный контент в настройках сайта.<br>' +
                '— При старте срабатывает проверка и даётся информация о том, как починить API, если он не работает.<br>' +
                '<br>' +
                '<b>- Раздел \'Карта\'.</b><br>' +
                '— Добавлен раздел \'Карта\'.<br>' +
                '— Раздел показывает местоположение собеседника на карте 2gis.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлен раздел \'Настройки\'.<br>' +
                '— Добавлена возможность скрыть вотермарк.<br>' +
                '— Добавлена возможность скрыть баннер \'Видеочат RU\'.<br>' +
                '— Добавлена возможность отражать изображение с камеры собеседника (mirror).<br>' +
                '<br>' +
                '<b>- Хоткеи.</b><br>' +
                '— Добавлены chrome хоткеи: активация расширения, скип, стоп, скриншот собеседника/скриншот вашей камеры.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлены кнопки (в заголовке) для сохранения скриншотов (^) с камеры пользователя и камеры собеседника.<br>' +
                '— При клике на иконку расширения откроется версия рулетки без мусора (embed).'
        }
    },
    {
        version: "0.2",
        date: "2021-10-01",
        description: {
            en: '<b>Skipping interlocutors by gender, changing the map provider.</b><br>' +
                '<br>' +
                '<b>- Section \'Remote IP\'.</b><br>' +
                '— Now the section is displayed in English.<br>' +
                '— More detailed information about the problem which blocks http requests.<br>' +
                '— Information about the city and region of mobile IP is now hidden.<br>' +
                '— Information about mobile/VPN/VPS is no longer displayed.<br>' +
                '— Show time in the interlocutor\'s time zone.<br>' +
                '<br>' +
                '<b>- Section \'Map\'.</b><br>' +
                '— 2gis changed to carto.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added the ability to skip men/women (detection by faceapi on the client side).<br>' +
                '— Added the ability to play a sound when the interlocutor is skipped on the floor.<br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Added the \'Info\' section.<br>' +
                '— Information about the extension, various links.<br>' +
                '<br>' +
                '<b>- Hotkeys.</b><br>' +
                '— Added local hotkeys binded to the arrows: skip, stop, report.<br>' +
                '— Added chrome hotkey to quickly switch between the current tab and the chat tab.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— A link to instructions on how to bypass the ban has been added to the window with the ban.<br>' +
                '— \'chatruletka++\' renamed to \'Chat Roulette Extension\' / \'Чат Рулетное Расширение\'.<br>' +
                '— Minor fixes and improvements.',
            ru: '<b>Пропуск собеседников по полу, смена провайдера карт.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Remote IP\'.</b><br>' +
                '— Теперь раздел отображается на английском.<br>' +
                '— Более подробная информация о проблеме с блокировкой http запросов.<br>' +
                '— Информация о городе и регионе мобильных IP теперь скрыта.<br>' +
                '— Информация о mobile/VPN/VPS больше не отображается.<br>' +
                '— Добавлено отображение времени в часовом поясе собеседника.<br>' +
                '<br>' +
                '<b>- Раздел \'Карта\'.</b><br>' +
                '— 2gis сменен на carto.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлена возможность пропускать мужчин/женщин (определение по faceapi на стороне клиента).<br>' +
                '— Добавлена возможность проиграть звук, когда собеседник пропущен по полу.<br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Добавлен раздел \'Инфо\'.<br>' +
                '— Информация о расширении, разные ссылки.<br>' +
                '<br>' +
                '<b>- Хоткеи.</b><br>' +
                '— Добавлены локальные хоткеи на стрелочки: скип, стоп, репорт.<br>' +
                '— Добавлен chrome хоткей для быстрого переключения между текущей вкладкой и вкладкой чата.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— В окошко с баном добавлена ссылка на инструкцию о том, как обойти бан.<br>' +
                '— \'chatruletka++\' переименовано в \'Чат Рулетное Расширение\' / \'Chat Roulette Extension\'.<br>' +
                '— Мелкие фиксы и улучшения.'
        }
    },
    {
        version: "0.3",
        date: "2021-10-13",
        description: {
            en: '<b>Blacklist, statistics.</b><br>' +
                '<br>' +
                '<b>- Section \'Bans\'.</b><br>' +
                '— Added the \'Bans\' section.<br>' +
                '— Displays statistics on bans: IP in the blacklist, number of passed and blocked sessions.<br>' +
                '<br>' +
                '<b>- Section \'Stats\'.</b><br>' +
                '— Added the \'Stats\' section.<br>' +
                '— Displays statistics: number of conversations, time spent, number of manual and faceapi skips, number of male and female encounters.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— An alternative mirror has been added.<br>' +
                '— Added the ability to activate faceapi when gender skips are disabled.<br>' +
                '— Added the ability to add to the blacklist by skipping due to faceapi setting.<br>' +
                '— Added the ability to skip interlocutors who take more than 4 seconds to load.<br>' +
                '— Added the ability to automatically close the dialog \'Are you there?\' when the timer goes out.<br>' +
                '<br>' +
                '<b>- Hotkeys.</b><br>' +
                '— Added the ability to ban the interlocutor by pressing the local/chrome hotkey.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added buttons (in the header) to open the user\'s camera or the interlocutor\'s camera in PiP.<br>' +
                '— Minor fixes and improvements.',
            ru: '<b>Чёрный список, статистика.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Баны\'.</b><br>' +
                '— Добавлен раздел \'Баны\'.<br>' +
                '— Отображает статистику по банам: IP в чёрном списке, кол-во пропущенных и заблокированных разговоров.<br>' +
                '<br>' +
                '<b>- Раздел \'Стата\'.</b><br>' +
                '— Добавлен раздел \'Стата\'.<br>' +
                '— Отображает статистику: количество разговоров, потраченное время, количество ручных и faceapi скипов, количество встреченных male и female.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлено альтернативное зеркало.<br>' +
                '— Добавлена возможность активировать faceapi при отключенных скипах по полу.<br>' +
                '— Добавлена возможность добавлять в чёрный список по пропуску из-за faceapi.<br>' +
                '— Добавлена возможность скипать собеседников, которые загружаются больше 4х секунд.<br>' +
                '— Добавлена возможность автоматически закрывать диалог \'Вы здесь?\', когда таймер выходит.<br>' +
                '<br>' +
                '<b>- Хоткеи.</b><br>' +
                '— Добавлена возможность забанить собеседника по нажатию локального/chrome хоткея.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлены кнопки (в заголовке) для открытия в PiP камеры пользователя или камеры собеседника.<br>' +
                '— Мелкие фиксы и улучшения.'
        }
    },
    {
        version: "0.4",
        date: "2021-11-01",
        description: {
            en: '<b>Extension name changed in English localization.</b><br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Added badges from shields.io .<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— \'Chat Roulette Extension\' renamed to \'Chatruletka Extension\'.<br>' +
                '— Minor fixes and improvements.',
            ru: '<b>Смена названия в английской локализации.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Добавлены бейджи с shields.io.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— \'Chat Roulette Extension\' переименовано в \'Chatruletka Extension\'.<br>' +
                '— Мелкие фиксы и улучшения.'
        }
    },
    {
        version: "0.5",
        date: "2021-12-27",
        description: {
            en: '<b>Sections in settings, ws hacks, experiments with nsfw blocking.</b><br>' +
                '<br>' +
                '<b>- Section \'Bans\'.</b><br>' +
                '— The section has been translated into Russian.<br>' +
                '<br>' +
                '<b>- Section \'Stats\'.</b><br>' +
                '— The section has been translated into Russian.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added an alternative \'mirror\' from the local video.<br>' +
                '— Experiments with ws hacks.<br>' +
                '— Experiments with nsfw detection.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Minor fixes and improvements.',
            ru: '<b>Разделы в настройках, ws hacks, эксперименты с блокировкой nsfw.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Баны\'.</b><br>' +
                '— Раздел переведён на русский.<br>' +
                '<br>' +
                '<b>- Раздел \'Стата\'.</b><br>' +
                '— Раздел переведён на русский.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлено альтернативное \'зеркало\' из локального видео.<br>' +
                '— Эксперименты с ws hacks.<br>' +
                '— Эксперименты с обнаружением nsfw.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Мелкие фиксы и улучшения.'
        }
    },
    {
        version: "0.6",
        date: "2021-12-31",
        description: {
            en: '<b>Streamer mode, search by city/region.</b><br>' +
                '<br>' +
                '<b>- Streamer mode.</b><br>' +
                '— Streamer mode has been added: the ability to blur the interlocutor\'s camera on a hotkey, while looking at the original picture in Picture-in-Picture mode.<br>' +
                '— The ability to automatically activate the blur / image after changing the interlocutor.<br>' +
                '— The ability to customize the image.<br>' +
                '— The ability to mute the interlocutor by hotkey.<br>' +
                '— An attempt at automatic blur, if it recognizes nsfw (it is better not to use it in production, use hands).<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added the ability to search for an interlocutor by city/region.<br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Discord badge added.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— A lot of fixes and cosmetic improvements.<br>' +
                '— A lot of internal architectural changes.',
            ru: '<b>Режим стримера, поиск по городу/региону.</b><br>' +
                '<br>' +
                '<b>- Режим стримера.</b><br>' +
                '— Добавлен режим стримера: возможность блюрить камеру собеседника по хоткею, смотря при этом на оригинальную картинку в режиме Картинка-в-Картинке.<br>' +
                '— Возможность автоматически активировать блюр/заглушку после смены собеседника.<br>' +
                '— Возможность кастомизировать заглушку.<br>' +
                '— Возможность мутить собеседника по хоткею.<br>' +
                '— Попытка в автоматический блюр, если распознает nsfw (лучше не использовать на практике, только ручками).<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлена возможность поиска собеседника по городу/региону.<br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Добавлен Discord.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Много фиксов и косметических улучшений.<br>' +
                '— Много внутренние архитектурных изменений.'
        }
    },
    {
        version: "0.7",
        date: "2022-01-03",
        description: {
            en: '<b>Dark mode.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added dark mode.<br>' +
                '— Disabled nsfwjs blurring by default.<br>' +
                '— Typo fixed: nsfjw -> faceapi in skip faceapi tooltips.<br>' +

                '<br>' +
                '<b>- Hotkeys.</b><br>' +
                '— Fixed the hotkey report+left arrow.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Switching from ko-fi to buymeacoffee.<br>',
            ru: '<b>Тёмный режим.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлен темный режим.<br>' +
                '— Отключено размывание nsfwjs по умолчанию.<br>' +
                '— Исправлена опечатка: nsfjw -> faceapi во всплывающих подсказках скипа faceapi.<br>' +

                '<br>' +
                '<b>- Хоткеи.</b><br>' +
                '— Исправлена горячая клавиша репорт+стрелка влево.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Переход с ko-fi на buymeacoffee.<br>'
        }
    },
    {
        version: "0.7.1",
        date: "2022-01-07",
        description: {
            en: '<b>Polling when deleting an extension.</b><br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added a Google form asking the user why he deleted the extension, the response is sent to the public channel in Discord.',
            ru: '<b>Опрос при удалении расширения.</b><br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлена форма Google, спрашивающая пользователя, почему он удалил расширение, ответ отправляется в публичный канал в Discord.'
        }
    },
    {
        version: "1.0",
        date: "2022-05-24",
        description: {
            en: '<b>Manifest v3 (will work in 2023+).</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Added an alternative IP geolocation API.<br>' +
                '— It works via https, but is much inferior to its http counterpart (1k requests per day, cannot detect mobile Internet).<br>' +
                '— A detailed analysis of how to activate the normal api has been added to the wiki on github.<br>' +
                '— If the http api is unavailable, the link to the article will be in the IP tab.<br>' +
                '— The donation button has been replaced with a button with a call to leave a review in the Chrome Web Store.<br>' +
                '— When you click on the \'Stop\' button, the IP section is now reset.<br>' +
                '<br>' +
                '<b>- Section \'Map\'.</b><br>' +
                '— By default, Europe is displayed on the map (in the English version).<br>' +
                '<br>' +
                '<b>- Section \'Stats\'.</b><br>' +
                '— Fixed a decrease in the number of manual skips during auto-start due to too long connection.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— The \'Settings\' section now expands to half the screen, you can disable it.<br>' +
                '— If you change an important setting, the extension will remind you to reboot only after clicking the \' buttonStart\'.<br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Telegram extension groups/chats have been cut/deleted.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Extension adapted to manifest v3 (Will work in Chrome in 2023+)<br>' +
                '— The extension in the English version is now named \'Chatruletka (ome.tv) extension\'.<br>' +
                '— The extension version is now displayed in the control panel header.<br>' +
                '— A warning now appears on the login screen that Chat Roulette and ome.tv is the same thing.<br>' +
                '— Many people have deleted the extension, not understanding why they can\'t use it on their Chatruletka instance.<br>',
            ru: '<b>Manifest v3 (будет работать в 2023+).</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Добавлен альтернативный API пробива IP.<br>' +
                '— Он работает через https, но сильно уступает его http аналогу (1к запросов в день, не может определить мобильный интернет).<br>' +
                '— В вики на гитхабе добавлен подробный разбор как активировать нормальный api.<br>' +
                '— Если http апи недоступен, ссылка на статью будет в вкладке IP.<br>' +
                '— Кнопка доната заменена кнопкой с призывом оставить отзыв в Chrome Web Store.<br>' +
                '— При нажатии на кнопку \'Стоп\' теперь раздел IP сбрасывается.<br>' +
                '<br>' +
                '<b>- Раздел \'Карта\'.</b><br>' +
                '— По умолчанию на карте отображается Европа (в английской версии).<br>' +
                '<br>' +
                '<b>- Раздел \'Стата\'.</b><br>' +
                '— Пофикшено уменьшение числа ручных скипов при автопропуске из-за слишком долгого подключения.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Раздел \'Настройки\' теперь расширяется до половины экрана, можно отключить.<br>' +
                '— Если вы меняете важную настройку, расширение напомнит перезагрузиться только после нажатия на кнопку \'Старт\'.<br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Вырезаны/удалены группы/чаты расширения в Telegram.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Расширение адаптировано под manifest v3 (Будет работать в Chrome в 2023+)<br>' +
                '— Расширение в английской версии теперь называется \'Chatruletka (ome.tv) extension\'.<br>' +
                '— Теперь в заголовке контрольной панели отображается версия расширения.<br>' +
                '— На экране с логином теперь появляется предупреждение о том, что Чат Рулетка и оме.тв это одно и то же.<br>' +
                '— Многие люди удаляли расширение, не понимая, почему они не могут использовать его на своём инстансе Чат Рулетки.<br>'
        }
    },
    {
        version: "1.1",
        date: "2022-05-27",
        description: {
            en: '<b>Error monitoring system.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added the ability to hide the title (on by default).<br>' +
                '— Fixed crash when trying to hide a non-existent logo.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added an error monitoring system to report errors in the extension code.<br>' +
                '— Added a scroll bar to the login window.<br>' +
                '— Increased the width of the control menu.<br>',
            ru: '<b>Система мониторинга ошибок.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлена возможность скрыть заголовок (по умолчанию вкл).<br>' +
                '— Исправлен вылет при попытке скрыть несуществующий логотип.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлена система мониторинга ошибок для сообщения об ошибках в коде расширения.<br>' +
                '— Добавлена полоса прокрутки в окно входа.<br>' +
                '— Увеличена ширина меню управления.<br>'
        }
    },
    {
        version: "1.1.1",
        date: "2022-08-04",
        description: {
            en: '<b>Unsuccessful hotfix of the tab hanging issue.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Attempt to fix tab hanging with ws hacks enabled.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Limit the version string in the control panel to 3 characters',
            ru: '<b>Неудачный хотфикс фризов.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Попытка исправить зависание вкладок с включенными ws hacks.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Ограничение строки версии в панели управления до 3 символов'
        }
    },
    {
        version: "1.1.2",
        date: "2022-08-04",
        description: {
            en: '<b>A successful hotfix of the tab hanging issue.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— The sending of "face data" is disabled, which was the reason for the tab to hang when ws hacks is enabled.',
            ru: '<b>Удачный хотфикс фризов.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Отключена отправка "данных лица", которая была причиной зависания вкладки при включенном ws hacks.'
        }
    },
    {
        version: "1.1.3",
        date: "2022-08-04",
        description: {
            en: '<b>Minor fix.</b><br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Increased the delay before resizing after resizing the window.',
            ru: '<b>Мелкий фикс.</b><br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Увеличена задержка перед изменением размера после изменения размера окна.'
        }
    },
    {
        version: "1.1.4",
        date: "2022-08-05",
        description: {
            en: '<b>Failed attempt to fix http error 429.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Failed attempt to replace the backup ip geolocation provider.',
            ru: '<b>Неудачная попытка пофиксить http error 429.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Неудачная попытка заменить резервного провайдера ip геолокации.'
        }
    },
    {
        version: "1.2.0",
        date: "2022-08-05",
        description: {
            en: '<b>IP geolocation without any browser settings.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— IP geolocation should now work without the need to allow insecure content (but with a slightly longer delay).<br>' +
                '— The backup geolocation service was cut out because its limits policy applied to all users of the extension, and not just to a specific one, as I thought before.<br>' +
                '— The option to display additional IP information (tor vpn mobile) is now enabled by default.',
            ru: '<b>Геолокация IP без настройки браузера.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— IP-геолокация теперь должна работать без необходимости разрешать небезопасный контент (но с немного большей задержкой).<br>' +
                '— Служба резервной геолокации вырезана, потому что ее политика лимитов распространялась на всех пользователей расширения, а не только на конкретного, как я думал раньше.<br>' +
                '— Опция отображения дополнительной информации об IP (tor vpn mobile) теперь включена по умолчанию.'
        }
    },
    {
        version: "1.3.0",
        date: "2022-08-07",
        description: {
            en: '<b>Checking torrents and a welcome window.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Added the iknowwhatyoudownload button to open a link with possible torrent downloads of the interlocutor.<br>' +
                '— Added the ability to show the provider (disabled by default).<br>' +
                '— Seconds are shown >=0 in TM.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Changed the way to hide parts of the interface.<br>' +
                '— Added the ability to disable error collection.<br>' +
                '— Added a call not to use the removal of images in ws hacks, because perceived as empty.<br>' +
                '— The dangerous "prikol" function is now only available if the extension is unpacked.<br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Added a modal queue that welcomes new users with a bunch of useless information.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Sanitization of innerHTML assignments.<br>' +
                '— Hid the instructions for bypassing the ban for a paywall due to reaching the threshold of 5000 users.',
            ru: '<b>Проверка торрентов и приветственное окно.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Добавлена кнопка iknowwhatyoudownload для открытия ссылки с возможными торрент-загрузками собеседника.<br>' +
                '— Добавлена возможность показывать провайдера (по умолчанию отключена).<br>' +
                '— Показываются секунды >=0 в TM.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Изменён способ скрытия частей интерфейса.<br>' +
                '— Добавлена возможность отключения сбора ошибок.<br>' +
                '— Добавлен призыв не использовать удаление картинок в ws hacks, тк воспринимается как пустая.<br>' +
                '— Опасная функция "прикол" доступна только в том случае, если расширение распаковано.<br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Добавлена модальная очередь, которая приветствует новых пользователей кучей бесполезной информации.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Sanitization присвоений innerHTML.<br>' +
                '— Спрятал инструкцию по обходу бана за пейвол из-за достижения порога в 5000 пользователей.'
        }
    },
    {
        version: "1.3.1",
        date: "2022-08-07",
        description: {
            en: '<b>Minor fix.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Dark theme adapted for the welcome window.',
            ru: '<b>Мелкий фикс.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Тёмная тема адаптирована для приветственного окна.'
        }
    },
    {
        version: "1.3.2",
        date: "2022-08-09",
        description: {
            en: '<b>Minor fix.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Fixed: \'buttonCheck torrents\' for UI locales other than en/ru.',
            ru: '<b>Мелкий фикс.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Исправлено: кнопка \'Проверить торренты\' для локалей пользовательского интерфейса, отличных от en/ru.'
        }
    },
    {
        version: "1.3.3",
        date: "2022-08-12",
        description: {
            en: '<b>Information about multiple IP addresses.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— The case is taken into account when the interlocutor revealed several IP addresses: information on all will be displayed.',
            ru: '<b>Информация о нескольких IP адресах.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Учтён случай, когда собеседник раскрыл несколько IP адресов: будет отображаться информация по всем.'
        }
    },
    {
        version: "1.4.0",
        date: "2022-09-01",
        description: {
            en: '<b>Minimalism, ome.tv support, version history.</b><br>' +
                '<br>' +
                '<b>- Minimalism mode.</b><br>' +
                '— Added the "minimalism" mode: the extension will only show IP geolocation in the chat area.<br>' +
                '— When installing the extension, you will be prompted to choose how you want to use it.<br>' +
                '— You can switch between modes using the button that should appear in the chat area.<br>' +
                '<br>' +
                '<b>- The "Map" section.</b><br>' +
                '— The map will be updated only if the "map" tab is selected.<br>' +
                '<br>' +
                '<b>- The "Settings" section.</b><br>' +
                '— Ws hacks: The option to delete a report that was dangerous for the user has been removed.<br>' +
                '— Added the ability to search by multiple cities/regions.<br>' +
                '— Added a warning if the "Danger Zone" is enabled.<br>' +
                '<br>' +
                '<b>- The "Info" section.</b><br>' +
                '— Added version history.<br>' +
                '— The version history will open if you open the Chatruletka site (or ome.tv) with a newer version of the extension that you used earlier.<br>' +
                '— Version history does not open in the "minimalism" mode.<br>' +
                '— Added the "close" button to the "welcome window".<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added support for ome.tv .<br>' +
                '— Some users reported that it didn\'t work for them videochatru.com .<br>' +
                '— ome.tv is the same Chatruletka, just another instance positioned as an alternative to Omegle.<br>',
            ru: '<b>Минимализм, поддержка ome.tv, история версий.</b><br>' +
                '<br>' +
                '<b>- Режим "минимализм".</b><br>' +
                '— Добавлен режим "минимализм": расширение будет показывать только IP-геолокацию в области чата.<br>' +
                '— При установке расширения вам будет предложено выбрать способ его использования.<br>' +
                '— Вы можете переключаться между режимами с помощью кнопки, которая должна появиться в области чата.<br>' +

                '<br>' +
                '<b>- Раздел "Карта".</b><br>' +
                '— Карта будет обновляться, только если выбрана вкладка "карта".<br>' +

                '<br>' +
                '<b>- Раздел "Настройки".</b><br>' +
                '— Ws hacks: Удалена опасная для пользователя опция удаления репорта.<br>' +
                '— Добавлена возможность поиска по нескольким городам/регионам.<br>' +
                '— Добавлено предупреждение, если "Опасная зона" включена.<br>' +

                '<br>' +
                '<b>- Раздел "Инфо".</b><br>' +
                '— Добавлена история версий.<br>' +
                '— История версий откроется, если вы откроете сайт Чатрулетки (или ome.tv) с более новой версией расширения, которое вы использовали ранее.<br>' +
                '— История версий не открывается в режиме "минимализм".<br>' +
                '— Добавлена кнопка "закрыть" в "окно приветствия".<br>' +

                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлена поддержка ome.tv.<br>' +
                '— Некоторые пользователи сообщали, что у них не работал videochatru.com.<br>' +
                '— ome.tv - это та же чатрулетка, просто другой инстанс, позиционируемый как альтернатива Omegle.<br>'
        }
    },
    {
        version: "1.4.1",
        date: "2022-09-02",
        description: {
            en: '<b>Minor fixes.</b><br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— The maximum height of the changelog container is limited.<br>' +
                '— Disabled closing by external click (changelog).<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Improved the method of resizing the control panel.',
            ru: '<b>Мелкие фиксы.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Ограничена максимальная высота контейнера changelog.<br>' +
                '— Отключено закрытие по внешнему клику (changelog).<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Улучшен метод изменения размера панели управления.'
        }
    },
    {
        version: "1.4.2",
        date: "2022-09-02",
        description: {
            en: '<b>Minor fix.</b><br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Now the version history displays the new version after update, not the one you used before.',
            ru: '<b>Мелкий фикс.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Теперь история версий отображает новую версию при обновлении, а не ту, которую вы использовали раньше.'
        }
    },
    {
        version: "1.5.0",
        date: "2022-09-05",
        description: {
            en: '<b>Cosmetic improvements, a new option to prohibit camera cropping for mobile interlocutors.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— 0S will now be displayed in TM, example: \'1M, 0S\'.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Added a new interface setting: "do not crop the interlocutor\'s camera".<br>' +
                '— By default, if the interlocutor\'s camera does not shoot at 4:3, the image is simply cropped.<br>' +
                '— A new option can fix it and you will be able to see the interlocutor completely at the price of black bars.<br>' +
                '<br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Cosmetic improvements to changelog and welcome window: smooth transition between alerts, keyboard arrows/click switching, fixed sizes and many minor improvements.<br>' +
                '— The contents of the version history were rewritten from scratch.<br>' +
                '— Clickable version numbers in changelog.<br>' +
                '<br>' +
                '<b>- Hotkeys.</b><br>' +
                '— Fix the incompatibility of chrome hotkey \'switch between the active tab and the chat tab\' for ome.tv.<br>' +
                '— Local hotkeys are disabled while the warning / version history / welcome window are active.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Now if your browser updates the extension while you are in Chatruletka, you will receive a message that you need to reload the page.<br>' +
                '— It is no longer possible to select text in the upper and lower parts of the control panel.',
            ru: '<b>Косметические улучшения, новая опция для запрета обрезания камеры у мобильных собеседников.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— 0S теперь будет отображаться в TM, пример: 1M, 0S.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Добавлена новая настройка интерфейса: \'не обрезать камеру собеседника\'.<br>' +
                '— По умолчанию если у собеседника камера не снимает в 4:3, изображение просто обрезается.<br>' +
                '— Новая опция может исправить это недоразумение и вы сможете увидеть собеседника полностью.<br>' +
                '<br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Косметические улучшения changelog и приветственного окна: плавный переход между элементами, переключение стрелками клавиатуры/по клику, фиксированные размеры и много мелких доработок.<br>' +
                '— Содержимое истории версий переписано с нуля.<br>' +
                '— Кликабельные номера версий в changelog.<br>' +
                '<br>' +
                '<b>- Хоткеи.</b><br>' +
                '— Фикс несовместимости chrome хоткея переключения между активной вкладкой и вкладкой чата для ome.tv.<br>' +
                '— Локальные хоткеи отключены пока активно окно с предупреждением / историей версий / приветственным окном.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Теперь если ваш браузер обновит расширение пока вы в рулетке, вы получите сообщение о том, что нужно перезагрузить страницу.<br>' +
                '— Больше нельзя выделять текст в верхней и нижней частях контрольной панели.'
        }
    },
    {
        version: "1.5.1",
        date: "2022-09-08",
        description: {
            en: '<b>A few changes to the \'streamer mode\'.<br><br>Ignore this update if you haven\'t used \'streamer mode\' before, this information is useless to you.</b><br><br>Streamer mode allows you to cover your interlocutor with your custom image/blur his picture by watching him through the picture-in-picture mode (which is in a separate window and not captured by OBS) to make sure that he does not have NSFW and remove the cover. Previously, the neural network was responsible for evaluating the interlocutor, but this functionality broke down and in order to fix it for good, I would need to rewrite the entire extension from scratch (which would take 20+ hours of work and a lot of energy, I don’t have all this), so you have to evaluate it manually each time, by toggling the cover with the \'right arrow\' key on the keyboard. The cover is activated by default every time the chat state changes (stop, search, found, play), if \'auto apply blur/cover\' is activated in the settings.<br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— If the interlocutor has an incorrect time zone, it will still be shown.<br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Improved the cover logic: search noise no longer flickers black.<br>' +
                '— Now the cover closes everything, the \'cover over X\' setting is only responsible for activating the cover at a specific stage, if \'auto apply blur/cover\' is enabled.<br>' +
                '— The use of a cover is enabled by default for new users who have enabled streamer mode.<br>' +
                '— Disable banner/watermark display when streamer mode is enabled, as it conflicts with the cover.<br>' +
                '— Added the ability to apply a cover when the chat is stopped.<br>' +
                '— Temporarily disabled broken nsfwjs integration and removed its settings.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Removed poll when uninstalling an extension.<br>',
            ru: '<b>Несколько изменений для \'режима стримера\'.<br><br>Проигнорируйте это обновление, если вы не пользовались \'режимом стримера\' ранее, эта информация бесполезна для вас.</b><br><br>Режим стримера позволяет закрыть собеседника своей заглушкой/размыть его картинку, наблюдая за ним через режим "картинка в картинке" (который в отдельном окне и не захватывается OBS), чтобы убедиться, что у него нет NSFW и снять заглушку. Раньше за оценку собеседника отвечала нейросеть, но этот функционал сломался и чтобы его починить по хорошему нужно переписать всё расширение с нуля (на что нужно 20+ часов работы и много энергии, у меня всего этого нет), так что оценивать придётся каждый раз вручную, переключая заглушку с помощью клавиши правой стрелки на клавиатуре. При этом заглушка по умолчанию активируется каждый раз при смене состояния чата (поиск, превьюшка, разговор), если активировано \'авто активация блюра\' в настройках.<br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Если у собеседника определилась некорректная временная зона, она всё равно будет показана.<br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Улучшена логика заглушки: больше не мерцает чёрным поисковый шум.<br>' +
                '— Теперь заглушка закрывает всё, настройка \'закрывать X\' отвечает лишь за активацию заглушки на конкретном этапе, если включена \'авто активация блюра\'.<br>' +
                '— Использование заглушки включается по умолчанию у новых юзеров, включившим режим стримера.<br>' +
                '— Отключение отображения баннера/ватермарки при включенном режиме стримера, так как конфликтует с заглушкой.<br>' +
                '— Добавлена возможность применять заглушку при остановке чата.<br>' +
                '— Временно отключена сломанная интеграция nsfwjs и удалены ее настройки.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Удален опрос при удалении расширения.<br>'
        }
    },
    {
        version: "1.5.2",
        date: "2022-09-11",
        description: {
            en: '<b>Removed link to instructions for bypassing the ban.</b><br>' +
                '<br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Target city/region search now works as expected if the interlocutor has multiple networks.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Replaced the boosty link with a window with information on how not to get banned by accident. Instructions for bypassing the ban are no longer available to the general public, even for money.<br>' +
                '— Improved the notification that is shown when the browser has updated the extension while you are at Chatruletka: it is now less intrusive.<br>',
            ru: '<b>Удалена ссылка на инструкцию по обходу бана.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Поиск целевого города/региона теперь работает корректно, если у собеседника несколько сетей.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Ссылка на boosty заменена на окно с информацией о том, как не получить бан по ошибке. Инструкции по обходу бана больше не доступны широкой публике, даже за деньги.<br>' +
                '— Улучшено уведомление, которое показывается когда браузер обновил расширение пока вы в рулетке: оно стало менее навязчивым.<br>'
        }
    },
    {
        version: "1.5.3",
        date: "2022-10-06",
        description: {
            en: '<b>Change the default location display.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Instead of hiding the location of the cell ISP, it is now displayed as a cell tower.<br>— These locations of users of mobile/cellular operators <b>may not be accurate</b>.<br>— This was done because, according to my observations, most people are not familiar with the concept of a time zone and get confused.',
            ru: '<b>Изменения в отображении геолокации.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Вместо того, чтобы скрывать местоположение сотового интернет-провайдера, теперь оно отображается в виде вышки сотовой связи.<br>— Эти позиции пользователей мобильных операторов <b>могут быть неточными</b>.<br>— Большинство людей не знакомы с понятием часового пояса и путаются, поэтому вот такое изменение.'
        }
    },
    {
        version: "1.5.4",
        date: "2022-10-19",
        description: {
            en: '<b>Minor update.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Added a little explanation of what MOBILE/PROXY/HOSTING means.',
            ru: '<b>Незначительное обновление.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Добавлено небольшое пояснение того, что означает MOBILE/PROXY/HOSTING.'
        }
    },
    {
        version: "1.5.5",
        date: "2022-10-19",
        description: {
            en: '<b>Minor update.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— PROXY and HOSTING merged into one to save some space.',
            ru: '<b>Незначительное обновление.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— PROXY и HOSTING объеденены в одно, чтобы сократить место.'
        }
    },
    {
        version: "1.6.0",
        date: "2022-11-17",
        description: {
            en: '<b>Removal of the "danger zone", fixes for the minimalism mode.<br><br>Ignore this update if you did not use the "danger zone" in the settings.</b><br><br>In the "dangerous zone" of the extension were experimental features (written long before the publication of the extension), the main purpose of which was to provide the ability to communicate in video chat without a webcam (mirror mode), while not getting banned for an incorrect image. The "danger zone" also included the functionality of playing a sound when your interlocutor skip you, and a quick auto-skip in case you were looking for country X, and the Chatruletka gave you country Y.<br><br>This functionality was hidden behind a red "danger zone" checkbox in the settings and a dialog with a warning that using this functionality can lead to a ban, so you could hardly turn it on by accident. All other functions were not hidden in this way, because they interact with the Chatruletka naturally and cannot lead to a ban.<br><br>But apparently, due to the strong influx of users of the extension, some children began to abuse this functionality, thinking that if the automatic system for processing reports will not ban them, they can do anything (which is not true, because there is also manual moderation in chatruletka). As a result, some "danger zone" users of the extension began to complain about shadowbans due to the "danger zone" functionality, so I decided to remove this functionality from the extension to protect you from this. The ruletka script is periodically updated, new systems are introduced to deal with violators of its rules, which is very difficult to follow and, in principle, not really necessary, because the extension tries to develop in such a way as not to harm the platform itself. For some time, the "danger zone" will still be available if you installed the extension in developer mode, but in the future the section and all functionality will be removed. I strongly recommend not to go down this path and just forget about the existence of these functions, because using them in the current situation will almost certainly lead to your ban in ruletka.<br>' +
                '<br>' +
                '<b>- "Danger zone" in settings.</b><br>' +
                '— "Danger Zone" is now only available if the extension is installed manually via developer mode.<br>' +
                '— There were no "fixes" for the "danger zone", its use is still highly likely to lead to your ban.<br>' +
                '— The "danger zone" reminder in the settings can no longer be turned off, only hidden for 24 hours.<br>' +
                '<br>' +
                '<b>- Mode "minimalism".</b><br>' +
                '— Fixed a situation where the "switch mode" button did not appear, which indirectly affected the work of geolocation.<br>' +
                '— Fixed a couple of minor bugs.',
            ru: '<b>Отказ от "опасной зоны", исправления для режима минимализма.<br><br>Проигнорируйте это обновление, если вы не пользовались "опасной зоной" в настройках.</b><br><br>В "опасной зоне" расширения были экспериментальные штуки (написанные задолго до публикации расширения), основной задачей которых было обеспечить возможность общаться в видеочате без вебкамеры (режим зеркала), при этом не получая баны за некорректное изображение. Так же в "опасную зону" входил функционал воспроизведения звука, когда ваш собеседник вас пропустил, и быстрый автопропуск в случае, если вы искали страну X, а рулетка подсунула вам страну Y.<br><br>Этот функционал был скрыт за чек-боксом "опасная зона" в настройках и диалогами с предупреждением о том, что использование этого функционала может привести к бану, так что вы вряд ли могли его включить случайно. Все остальные функции не были скрыты таким образом, потому что они взаимодействуют с рулеткой лишь поверхностно и не могут привести к бану.<br><br>Но судя по всему из-за сильного наплыва пользователей расширения школьники начали злоупотреблять данным функционалом, думая что если автоматическая система обработки репортов их не забанит, они могут делать всё что угодно (что не является правдой ведь в рулетке есть и ручная модерация). В результате некоторые пользователи "опасной зоны" расширения начали жаловаться на теневые баны из-за функционала "опасной зоны", поэтому я решил убрать этот функционал. Периодически скрипт рулетки обновляется, вводятся новые системы борьбы с нарушителями её правил, за чем очень сложно следить и в принципе не очень-то и нужно, потому что расширение пытается развиваться таким образом, чтобы не навредить самой платформе. Некоторое время "опасная зона" ещё будет доступна в случае, если вы установили расширение в режиме разработчика, но в будущем раздел и весь функционал будет удалены. Настоятельно рекомендую не идти по этому пути и просто забыть о существовании этих функций, потому что их использование в текущей ситуации почти наверняка приведёт к вашему бану в рулетке.<br>' +
                '<br>' +
                '<b>- "Опасная зона" в настройках.</b><br>' +
                '— "Опасная зона" теперь доступна только если расширение установлено вручную через режим разработчика.<br>' +
                '— Никаких фиксов "опасной зоны" не было, её использование всё ещё с высокой вероятностью приведёт к вашему бану.<br>' +
                '— Напоминание про опасность "опасной зоны" в настройках теперь нельзя отключить, только скрыть на 24 часа.<br>' +
                '<br>' +
                '<b>- Режим "минимализм".</b><br>' +
                '— Исправлена ситуация, когда кнопка "сменить режим" не появлялась, что косвенно влияло на работу геолокации.<br>' +
                '— Фикс пары мелких багов.'
        }
    },
    {
        version: "1.6.1",
        date: "2022-11-25",
        description: {
            en: '<b>New automation setting: \'autoskip wrong country\', hide cellular (mobile) internet geolocation data by default.</b><br><br>\'Auto-skip wrong country\' auto-skips the interlocutor if is not from the country you need. Video chat connects you with interlocutors from other countries if it cannot find the one you need in a short time. By enabling this feature in the settings, \'wrong\' countries will be skipped (ip geolocation data is not used).<br><br><b>Now for interlocutors with mobile Internet, geolocation (CT) and time zone (TZ) are hidden by default.</b> <br><br>A significant part of video chat users use mobile Internet, but the IP geolocation accuracy of such networks is very low (10-20%).<br><br>Previously, only the time zone (TZ) was displayed for such networks, but this confused users.<br><br>A month and a half ago, the extension began to show by default the previously hidden data of the location of the mobile Internet in a separate section "CT" with a warning that the accuracy of such data is very low. In practice, it turned out that \'CT\' confuses new users even more, so the difficult decision was made to hide both CT and TZ.<br><br>In the geolocation settings, you can return everything as it was, but now it seems to me that only the most accurate data should be shown. There are a couple of ideas on how to compensate for the lack of geolocation accuracy in the future, so stay tuned.<br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Hide mobile internet location data by default.<br><br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Ability to show "CT" for mobile internet as it was before.<br>' +
                '— New automation setting to auto-skip the wrong country.<br>' +
                '<br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Removed dialogue from the ban popup.',
            ru: '<b>Новая настройка автоматизации: \'aвтопропуск неверной страны\', скрытие данных геолокации мобильного интернета по умолчанию.</b><br><br>\'Автопропуск неверной страны\' автопропускает собеседника, если он не из нужной вам страны. Видеочат соединяет вас с собеседниками из других стран, если не может найти нужную вам за короткое время. Включив этот пункт в настройках, неверные страны будут пропускаться (данные геолокации не используются).<br><br><b>Теперь для собеседников с мобильным интернетом геолокация (CT) и временная зона (TZ) скрыты по умолчанию.</b><br><br>Значительная часть пользователей видеочата использует видеочат с мобильного интернета, но точность геолокации IP таких сетей очень низкая, в районе 10-20%.<br><br>Раньше для таких сетей отображалась только временная зона (TZ), но это запутывало пользователей.<br><br>Полтора месяца назад расширение стало по умолчанию показывать ранее скрытые данные локации мобильного интернета в отдельном разделе "CT" с предупреждением, что точность таких данных очень низкая. На практике оказалось, что CT ещё больше запутывает новых пользователей, поэтому было принято непростое решение скрывать и CT, и TZ.<br><br>В настройках геолокации можно вернуть всё как было, но сейчас мне кажется что показывать только наиболее точные данные - наилучший путь. Есть пара идей как можно компенсировать недостаток точности геолокации в будущем, ждите новостей.<br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Скрытие данных геолокации мобильного интернета по умолчанию.<br><br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Возможность показывать локацию "CT" для мобильного интернета как это было раньше.<br>' +
                '— Новая настройка автоматизации для автопропуска неверной страны.<br>' +
                '<br>' +
                '<b>- Разное.</b><br>' +
                '— Убран диалог из окна бана.'
        }
    },
    {
        version: "1.6.2",
        date: "2023-01-15",
        description: {
            en: '<b>Minor release with 2 small fixes.</b><br>' +
                '<br>' +
                '<b>- Section \'Map\'.</b><br>' +
                '— Hotkeys are no longer activated if a map is selected, so that you can move around the map with arrows.<br><br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Fixed \'autoskip wrong country\' function.',
            ru: '<b>Небольшой релиз с 2 исправлениями.</b><br>' +
                '<br>' +
                '<b>- Раздел \'Карта\'.</b><br>' +
                '— Горячие клавиши больше не активируются, если выбрана карта, так что вы можете перемещаться по карте стрелками.<br><br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Исправлена работа функции «автопропуск неверной страны».'
        }
    },
    {
        version: "1.6.3",
        date: "2023-01-15",
        description: {
            en: '<b>Fixed \'check torrents\' function.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                "— Fixed an incorrect locale detection that caused torrent checking to work incorrectly for some users.",
            ru: '<b>Фикс ошибки проверки торрентов.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Исправлено неправильное определении локали, из-за которой у некоторых пользователей неправильно работала проверка торрентов.'
        }
    },
    {
        version: "1.7.0",
        date: "2023-03-14",
        description: {
            en: '<b>Support for 46 video chat sites, <a style="text-decoration:none;" target="_blank" href="https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/">Firefox</a>, <a style="text-decoration:none;" target="_blank" href="https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn">Edge</a> and TypeScript.</b>' +
                '<br>' +
                '<br>' +
                'This is a very big and important update: every inner gear has been touched. If you think something is broken, please report to <a style="text-decoration:none;" target="_blank" href="https://discord.gg/9jCuhYg55P">Discord</a> or directly write to the <a style="text-decoration:none;" target="_blank" href="mailto:qrluke@proton.me">developer\'s email</a>.' +
                '<br>' +
                '<br>' +
                'The goal of this update was to <b>rewrite the extension in a way that you wouldn\'t notice any changes</b>. Outwardly, almost nothing has changed, but inside, almost everything has changed.' +
                '<br>' +
                '<br>' +
                'Chatruletka Extension has grown tremendously over the past year, but its technical state has always been very bad. This extension was never intended to be published and to support such a wide audience. Because of this, with every unmotivated update, technical debt accumulated: a snowball of bad decisions that would sooner or later lead to disaster.' +
                '<br>' +
                '<br>' +
                'At the time these decisions were made, they were justified: saving time (time is the most valuable resource on the planet), loss of interest in developing videochat-related projects, lack of motivation to dive into new technologies in areas that were not interesting to me, and general universal sadness - all these things seemed like good reasons to forget about the serious development of this project.' +
                '<br>' +
                '<br>' +
                'But now that this project is in danger of becoming my most successful and popular yet, and its state at v1.6.3 does not justify the trust placed in it by you, I\'m just ashamed to leave it like this.' +
                '<br>' +
                '<br>' +
                'Due to the fact that further development of the old version would lead to even more trouble, I had to spend ~180 hours of time rethinking key aspects before moving on.' +
                '<br>' +
                '<br>' +
                'Although there is still a long way to go and there are still many things that I would like to rework, this update is a good first step towards reviving active work on the extension.' +
                '<br>' +
                '<br>' +
                'At the moment I have motivation to work on the project and I also have new ideas, which include: maintaining and developing everything that is already working, improving the quality of the code, new features, support for new video chat platforms and some experiments.' +
                '<br>' +
                '<br>' +
                '<b>At the same time, it is worth noting a few important things:</b>' +
                '<br>' +
                '<br>' +
                '1. This extension will never be sold to third parties and will never be monetized by the malicious methods. ' +
                '<br>' +
                '<br>' +
                '2. This extension will never interfere with the functionality that is critical for the functioning of video chats: I will not oppose the moderation, user identification and ban systems, as well as implement functionality similar to the paid functions of video chat platforms (for example, if video chat offers a gender filter for money - I don\'t implement the same in the extension and so on, there may be exceptions, such as: geolocation, adblock, bot filter, etc.).' +
                '<br>' +
                '<br>' +
                '3. This extension will never partner with video chats to promote them to the extension\'s audience. Video chat platforms in the list of supported ones are listed in the order of appearance of this very support.' +
                '<br>' +
                '<br>' +
                '4. I don\'t plan to create my own video chat and use my extension to promote it: I have my main project (unrelated to video chats), which takes most of my life energy and I\'m not going to cheat on it.' +
                '<br>' +
                '<br>' +
                '5. This extension and all its software components will always be distributed under free licenses.' +
                '<br>' +
                '<br>' +
                'If I need money to develop and support this project, I will create Patreon/Boosty to provide it at the expense of interested users. The previous five points can be considered the constitution of the extension with all the consequences, it severely limits the opportunities for monetization, but I believe this is the only way to develop the extension while avoiding conflicts of interest with supported video chats.' +
                '<br>' +
                '<br>' +
                '<b>I perceive this project as a \'show-off\' project and will develop it as such.</b>' +
                '<br>' +
                '<br>' +
                'This update took more time than all previous updates combined, so it\'s hard to come up with an exact list of changes, but here\'s some of them:' +
                '<br>' +
                '<br>' +
                '<b>TypeScript.</b><br>' +
                "— Extension rewritten almost from scratch using TypeScript.<br>" +
                "— Countless bugs fixed, new ones added.<br>" +
                "— This process is not yet complete, but the extension is already functioning with the full functionality of the previous version.<br>" +
                '<br>' +
                '<b>Support for 46 video chat sites.</b><br>' +
                "— The extension now supports all known mirror sites of the platforms: Chatruletka, ome.tv, minichat, chatrulez.<br>" +
                "— Implemented basic Omegle support similar to minimalistic mode, except for the dark theme.<br>" +
                "— Implemented support for an alternative ome.tv interface, such as, for example, on <a href='https://ome.chat' target='_blank' style='text-decoration: none!important;'>ome.chat</a>." +
                '<br><br>' +
                '<b>- Omegle platform support.</b><br>' +
                '— Features: IP Locator & Dark Mode.<br>' +
                '— Added basic support for omegle.com<br>' +
                '— Added basic support for omegle.tv' +
                '<br><br>' +
                '<b>- Chatruletka platform support (extension).</b><br>' +
                '— Added support for chatruletka.com<br>' +
                '— Added support for chatruletka.ua<br>' +
                '— Added support for ruletka.chat<br>' +
                '— Added support for videochatar.com<br>' +
                '— Added support for videochatau.com<br>' +
                '— Added support for videochatbr.com<br>' +
                '— Added support for brvideochat.com<br>' +
                '— Added support for videochatca.com<br>' +
                '— Added support for videochatde.com<br>' +
                '— Added support for videochatfr.com<br>' +
                '— Added support for frvideochat.com<br>' +
                '— Added support for roulettefrancais.com<br>' +
                '— Added support for videochatit.com<br>' +
                '— Added support for videochatjp.com<br>' +
                '— Added support for videochatmx.com<br>' +
                '— Added support for videochatnl.com<br>' +
                '— Added support for videochatpl.com<br>' +
                '— Added support for videochatpt.com<br>' +
                '— Added support for videochatuk.com<br>' +
                '— Added support for videochatus.com<br>' +
                '— Added support for roulette-espanol.com<br>' +
                '— Added support for ruletaespanol.com<br>' +
                '— Added support for ruletkavideochat.com<br>' +
                '— Added support for turkishvideochat.com' +
                '<br><br>' +
                '<b>- ome.tv platform support (extension).</b><br>' +
                '— Added support for ome.chat<br>' +
                '— Added support for camki.com<br>' +
                '— Added support for chatalternative.com<br>' +
                '— Added support for chatrooms.chat<br>' +
                '— Added support for chat-brasil.com<br>' +
                '— Added support for chat-de.com<br>' +
                '— Added support for chat-fr.com<br>' +
                '— Added support for chat-nl.com<br>' +
                '— Added support for chat-pl.com<br>' +
                '— Added support for chat-pt.com<br>' +
                '— Added support for prostochat.com<br>' +
                '— Added support for stickam.chat<br>' +
                '— Added support for ukr.chat<br>' +
                '— Added support for cafeclub.ua' +
                '<br><br>' +
                '<b>- Minichat platform support</b><br>' +
                '— Added support for minichat.com' +
                '<br><br>' +
                '<b>- Chatrulez platform support</b><br>' +
                '— Added support for chatrulez.ru<br>' +
                '— Added support for videochatruletka.com<br>' +
                '— Added support for videochatruletka.ru' +
                '<br><br>' +
                '<b>Firefox support.</b><br>' +
                "— A lot of work has been done to analyze all the issues and ensure compatibility with the latest versions of Firefox.<br>" +
                "— The extension has been added to the <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/\">Firefox browser add-ons store</a>.<br>" +
                "— There are still some problems: the error collection system, the hotkey for switching between chat and the last tab, the notification sounds and the streamer mode do not work, but all the main functionality works and the future will be implemented with Firefox support.<br>" +
                '<br>' +
                '<b>Edge support.</b><br>' +
                "— The extension has been added to the <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn\">Edge browser extension store</a>.<br>" +
                '<br>' +
                '<b>Name changed.</b><br>' +
                "— The English version of the extension has been renamed to <b>Videochat Extension</b>.<br>" +
                "— This happened due to the fact that English-speaking users (which are the majority) have no idea what Chatruletka is, while in the Russian-speaking segment of the Internet it is already a word for any random video chat." +
                '<br>' +
                '<br>' +
                '<b>License changed.</b><br>' +
                "— License changed from MIT to BSD-4.<br>" +
                "— This is due to the fact that I started to take this project more seriously and don't want to see my work reused in the works of possible competitors without complying with the terms of the BSD-4 license." +
                '<br>' +
                '<br>' +
                '<b>Extension icon changed.</b><br>' +
                "— The extension icon and description have been changed.<br>" +
                "— The old icon is enabled by default for old users.<br>" +
                "— For new users, by default, the icon is set to the icon of the last video chat and the text 'ext' is placed on it." +
                '<br>' +
                '<br>' +
                '<b>System of platforms and dynamic permissions.</b><br>' +
                "— Implemented a dynamic permissions system that allows dev to add support for new video chats without disabling the extension for users because of missing permissions.<br>" +
                "— If you open a chat to which you have not yet given permission, the extension will kindly ask you to grant access to this chat (can be disabled).<br>" +
                "— A system of local settings for each platform has been implemented (one platform can have several sites).<br>" +
                "— When updating from v1.6.3, the extension will try to migrate your old settings.<br>" +
                "— Your video chat usage statistics will be transferred to the platform (Chatruletka or ome.tv) you last used.<br>" +
                "— The blacklist is shared between all platforms.<br>" +
                '<br>' +
                '<b>Window after installation.</b><br>' +
                '— After installing the extension, a page with information about the extension opens, which allows you to learn more about the extension, or go directly to the chat.<br>' +
                '<br>' +
                '<b>Window when opening the platform for the first time.</b><br>' +
                '— The welcome window has been redesigned, now there are only three pages: brief information about the video chat, features supported by the extension, and extension license.<br>' +
                '<br>' +
                '<b>Popup.</b><br>' +
                "— Clicking on the extension now opens not the last video chat, but a special menu.<br>" +
                "— The menu has lists of favorite, recent and supported video chats, global settings and links.<br>" +
                "— Menu allows you to fix possible problems with missing permissions.<br>" +
                "— The menu allows you to enable / disable the extension for specific video chats.<br>" +
                "— The menu allows you to set a star for your favorite video chats so that they are at the very top of the list.<br>" +
                "— When first installed, the extension checks open tabs in the browser and if it finds supported video chats, it adds them to the list of favorites.<br>" +
                "— If the extension does not find video chats, videochatru.com and ome.tv are added to favorites.<br>" +
                "— The extension offers to scan the history and add video chats to favorites on the page that opens after installation.<br>" +
                "— Video chat platforms in the list of supported ones are listed in the order of appearance of this very support.<br>" +
                '<br>' +
                '<b>Minimalism mode.</b><br>' +
                '— Changed the logic of the minimalism mode and the geolocation data display format.<br>' +
                '— Cellural location data is displayed for Russia and Ukraine with city and region.' +
                '<br>' +
                '<br>' +
                '<b>Geolocation.</b><br>' +
                "— The reserve request method has been adopted as the main one, it makes no sense to allow insecure content, etc.<br>" +
                "— Error 429 (too many requests) no longer prevents the API from working.<br>" +
                "— If error 429, a button appears that allows you to request geolocation again after a while.<br>" +
                '<br>' +
                '<b>Local hotkeys.</b><br>' +
                "— If you hold <- for more than 5 seconds and release, the interlocutor will not be skipped.<br>" +
                '<br>' +
                '<b>Changelog.</b><br>' +
                "— You can now prevent the changelog from opening on every update.<br>" +
                '<br>' +
                '<b>Important:</b><br>' +
                `If you think something is broken, please write about it in <a style="text-decoration:none;" target="_blank" href="https://discord.gg/9jCuhYg55P">Discord</a> or directly to the <a style="text-decoration:none;" target="_blank" href="mailto:qrluke@proton.me">developer email</a>`,
            ru: '<b>Поддержка 46 сайтов-видеочатов, <a style="text-decoration:none;" target="_blank" href="https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/">Firefox</a>, <a style="text-decoration:none;" target="_blank" href="https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn">Edge</a> и TypeScript.</b>' +
                '<br>' +
                '<br>' +
                'Это очень большое и важное обновление: в нём была затронута каждая внутренняя шестеренка. Если вам кажется, что что-то сломалось, пожалуйста, напишите в <a style="text-decoration:none;" target="_blank" href="https://discord.gg/YZKnbKGWen">Discord</a> или прямо на <a style="text-decoration:none;" target="_blank" href="mailto:qrluke@proton.me">почту разработчика</a>.' +
                '<br>' +
                '<br>' +
                'Задачей этого обновления было <b>переписать расширение таким образом, чтобы вы этого не заметили</b>. Внешне почти ничего не изменилось, но внутри изменилось практически всё.' +
                '<br>' +
                '<br>' +
                'Чат Рулетное Расширение очень сильно выросло за последний год, но его техническое состояние всегда было удручающим. Это расширение никогда не планировалось публиковать и обеспечивать его работу для такой широкой аудитории, которую ему посчастливилось заполучить. Из-за этого с каждым немотивированным обновлением копился технический долг: снежный ком поспешных неудачных решений, который рано или поздно привёл бы к катастрофе.' +
                '<br>' +
                '<br>' +
                'В момент принятия этих решений они были оправданы: экономия времени (время - это самый ценный ресурс на планете), потеря интереса развивать связанные с рулеткой проекты, отсутствие мотивации углубляться в новые технологии в неинтересных мне сферах и всеобщая вселенская грусть - всё эти вещи казались мне серьёзными основаниями для того, чтобы забыть про серьёзное развитие и продвижение этого проекта.' +
                '<br>' +
                '<br>' +
                'Но сейчас, когда этот проект рискует стать моим самым успешным и популярным, а его состояние на момент v1.6.3 не оправдывает оказанного ему доверия, мне просто стыдно оставлять его в таком виде.' +
                '<br>' +
                '<br>' +
                'Из-за того, что дальнейшее развитие старой версии привело бы к ещё большей беде, пришлось потратить ~180 часов времени на переосмысление ключевых моментов перед тем, как двигаться дальше.' +
                '<br>' +
                '<br>' +
                'И хотя до конечной цели ещё очень далеко и есть ещё много моментов, которые я хотел бы переработать, это обновление является хорошим первым шагом на пути к возрождению активного работы над расширением.' +
                '<br>' +
                '<br>' +
                'На данный момент у меня есть мотивация для работы над проектом и новые идеи, среди которых есть: поддержка и развитие всего того, что уже работает, улучшение качества кода, новые функции, поддержка новых платформ видеочатов и некоторые запланированные эксперименты.' +
                '<br>' +
                '<br>' +
                '<b>При этом стоит отметить несколько важных моментов:</b>' +
                '<br>' +
                '<br>' +
                '1. Это расширение никогда не будет продано третьим лицам и никогда не будет монетизироваться вредоносными методами. ' +
                '<br>' +
                '<br>' +
                '2. Это расширение никогда не будет вмешиваться в функционал, критичный для функционирования видеочатов: я не буду противодействовать системе модерации, системам идентификации и блокировки пользователей, а так же реализовывать функционал, аналогичный платным функциям платформ-видеочатов (например, если видеочат предлагает фильтр полов за деньги - я не реализовываю аналогичный в расширении и так далее, возможны исключения, такие как: геолокация, блокировка рекламы, фильтр ботов и др.).' +
                '<br>' +
                '<br>' +
                '3. Это расширение никогда не будет сотрудничать с видеочатами в целях их продвижения среди аудитории расширения.' +
                '<br>' +
                '<br>' +
                '4. Я не планирую создавать свой видеочат и использовать расширение для его продвижения: у меня есть свой основной проект (не связанный с видеочатами), который отнимает большинство жизненной энергии и я не собираюсь ему изменять.' +
                '<br>' +
                '<br>' +
                '5. Это расширение и все его программные компоненты всегда будут распространятся под свободными лицензиями.' +
                '<br>' +
                '<br>' +
                'Если для развития и поддержки этого проекта мне понадобятся деньги, я создам Patreon/Boosty для его обеспечения за счёт заинтересованных пользователей. Предыдущие пять пунктов можно считать конституцией чат рулетного расширения со всеми вытекающими, это сильно ограничивает возможности для монетизации, но я считаю это единственно верным способом развивать расширение, избегая при этом конфликта интересов с поддерживаемыми видеочатами.' +
                '<br>' +
                '<br>' +
                '<b>Я воспринимаю этот проект как имиджевый и буду развивать его как таковой.</b>' +
                '<br>' +
                '<br>' +
                'На это обновление было потрачено больше времени, чем на все предыдущие вместе взятые, поэтому точный список изменений составить трудно, но вот приблизительный:' +
                '<br>' +
                '<br>' +
                '<b>TypeScript.</b><br>' +
                "— Расширение переписано практически с нуля с использованием TypeScript.<br>" +
                "— Исправлено бесчисленное количество багов, добавлены новые.<br>" +
                "— Этот процесс ещё не закончен, но расширение уже функционирует с полным набором функций предыдущей версии.<br>" +
                '<br>' +
                '<b>Поддержка 46 сайтов-видеочатов.</b><br>' +
                "— Расширение теперь поддерживает все известные зеркала сайтов платформ Chatruletka, ome.tv, minichat, chatrulez.<br>" +
                "— Реализована базовая поддержка Omegle, аналогичная минималистичному режиму, за исключением тёмной темы.<br>" +
                "— Реализована поддержка альтернативного интерфейса чат рулетки, такого как, например, на <a href='https://ome.chat' target='_blank' style='text-decoration: none!important;'>ome.chat</a>." +
                '<br><br>' +
                '<b>- Поддержка платформы Omegle.</b><br>' +
                '— Функции: геолокация IP и тёмная тема.<br>' +
                '— Добавлена базовая поддержка omegle.com<br>' +
                '— Добавлена базовая поддержка omegle.tv' +
                '<br><br>' +
                '<b>- Расширение поддержки платформы Chatruletka.</b><br>' +
                '— Добавлена поддержка chatruletka.com<br>' +
                '— Добавлена поддержка chatruletka.ua<br>' +
                '— Добавлена поддержка ruletka.chat<br>' +
                '— Добавлена поддержка videochatar.com<br>' +
                '— Добавлена поддержка videochatau.com<br>' +
                '— Добавлена поддержка videochatbr.com<br>' +
                '— Добавлена поддержка brvideochat.com<br>' +
                '— Добавлена поддержка videochatca.com<br>' +
                '— Добавлена поддержка videochatde.com<br>' +
                '— Добавлена поддержка videochatfr.com<br>' +
                '— Добавлена поддержка frvideochat.com<br>' +
                '— Добавлена поддержка roulettefrancais.com<br>' +
                '— Добавлена поддержка videochatit.com<br>' +
                '— Добавлена поддержка videochatjp.com<br>' +
                '— Добавлена поддержка videochatmx.com<br>' +
                '— Добавлена поддержка videochatnl.com<br>' +
                '— Добавлена поддержка videochatpl.com<br>' +
                '— Добавлена поддержка videochatpt.com<br>' +
                '— Добавлена поддержка videochatuk.com<br>' +
                '— Добавлена поддержка videochatus.com<br>' +
                '— Добавлена поддержка roulette-espanol.com<br>' +
                '— Добавлена поддержка ruletaespanol.com<br>' +
                '— Добавлена поддержка ruletkavideochat.com<br>' +
                '— Добавлена поддержка turkishvideochat.com' +
                '<br><br>' +
                '<b>- Расширение поддержки платформы ome.tv</b><br>' +
                '— Добавлена поддержка ome.chat<br>' +
                '— Добавлена поддержка camki.com<br>' +
                '— Добавлена поддержка chatalternative.com<br>' +
                '— Добавлена поддержка chatrooms.chat<br>' +
                '— Добавлена поддержка chat-brasil.com<br>' +
                '— Добавлена поддержка chat-de.com<br>' +
                '— Добавлена поддержка chat-fr.com<br>' +
                '— Добавлена поддержка chat-nl.com<br>' +
                '— Добавлена поддержка chat-pl.com<br>' +
                '— Добавлена поддержка chat-pt.com<br>' +
                '— Добавлена поддержка prostochat.com<br>' +
                '— Добавлена поддержка stickam.chat<br>' +
                '— Добавлена поддержка ukr.chat<br>' +
                '— Добавлена поддержка cafeclub.ua' +
                '<br><br>' +
                '<b>- Поддержка платформы Minichat</b><br>' +
                '— Добавлена поддержка minichat.com' +
                '<br><br>' +
                '<b>- Поддержка платформы Chatrulez</b><br>' +
                '— Добавлена поддержка chatrulez.ru<br>' +
                '— Добавлена поддержка videochatruletka.com<br>' +
                '— Добавлена поддержка videochatruletka.ru' +
                '<br><br>' +
                '<br>' +
                '<b>Поддержка Firefox.</b><br>' +
                "— Проделана колоссальная работа по анализу всех проблем и обеспечению совместимости с Firefox последних версий.<br>" +
                "— Расширение было добавлено в <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/\">магазин расширений браузера Firefox</a>.<br>" +
                "— Всё ещё есть некоторые проблемы: не работают система сбора ошибок, хоткей переключения между чатом и последней вкладкой, звуки-уведомления и режим стримера, но весь основной функионал работает и будущий будет реализовываться с поддержкой Firefox.<br>" +
                '<br>' +
                '<b>Поддержка Edge.</b><br>' +
                "— Расширение было добавлено в <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn\">магазин расширений браузера Edge</a>.<br>" +
                '<br>' +
                '<b>Изменено название.</b><br>' +
                "— Англоязычная версия расширения переименована в <b>Videochat Extension</b>.<br>" +
                "— Это случилось из-за того, что англоязычные пользователи (которых большинство) понятия не имеют о том, что такое Chatruletka, в то время как в русскоязычном сегменте интернета это уже нарицательное имя для любого случайного видеочата." +
                '<br>' +
                '<br>' +
                '<b>Изменена лицензия.</b><br>' +
                "— Лицензия изменена с MIT на BSD-4.<br>" +
                "— Это произошло из-за того, что я начал более серьёзно относится к этому проекту и не хочу видеть переиспользование своей работы в работах возможных конкурентах без соблюдения условий лицензии BSD-4." +
                '<br>' +
                '<br>' +
                '<b>Изменена иконка расширения.</b><br>' +
                "— Была изменена иконка расширения и его описание.<br>" +
                "— Для старых пользователей по умолчанию активирована старая иконка.<br>" +
                "— Для новых пользователей по умолчанию иконка устанавливается на иконку последнего видеочата и на неё накладывается текст 'ext'." +
                '<br>' +
                '<br>' +
                '<b>Система платформ и динамических разрешений.</b><br>' +
                "— Реализована система динамических разрешений, позволяющая добавлять поддержку новых видеочатов без отключения расширения.<br>" +
                "— Если вы откроете чат, к которому ещё не дали разрешение, расширение попросит у вас предоставить доступ к этому чату (можно отключить).<br>" +
                "— Реализована система локальных настроек под каждую платформу (в одной платформе может быть несколько сайтов).<br>" +
                "— При обновлении с v1.6.3 расширение постарается перенести ваши старые настройки.<br>" +
                "— Ваша статистика использования видеочата будет перенесена в ту платформу (Chatruletka или ome.tv), которой вы пользовались последней.<br>" +
                "— Чёрный список не переносится, он общий для всех платформ.<br>" +
                '<br>' +
                '<b>Окно после установки.</b><br>' +
                '— После установки расширения открывается страница с информацией о расширении, которое позволяет узнать больше о расширении, либо пойти сразу в чат.<br>' +
                '<br>' +
                '<b>Окно при первом открытии платформы.</b><br>' +
                '— Переработано приветственное окно, теперь там только три страницы: краткая информация о видеочате, поддерживаемые расширением функции и лицензия расширения.<br>' +
                '<br>' +
                '<b>Popup.</b><br>' +
                "— По клику на расширение теперь открывается не последний видеочат, а специальное меню.<br>" +
                "— В меню есть списки любимых, недавних и поддерживаемых видеочатов, глобальные настройки и ссылки.<br>" +
                "— Меню позволяет исправить возможные проблемы с отсутствующими разрешениями.<br>" +
                "— Меню позволяет включить/выключить работу расширения для конкретных видеочатов.<br>" +
                "— Меню позволяет устанавливать звездочку любимым видеочатам, чтобы они были в самом вверху списка.<br>" +
                "— При первой установке расширение проверяет открытые вкладки в браузере и если находит поддерживаемые видеочаты, то добавляет их в список любимых.<br>" +
                "— Если расширение не нашло видеочатов, videochatru.com и ome.tv добавляются в избранное.<br>" +
                "— Расширение предлагает просканировать историю и добавить в избранное видеочаты на странице, открываемой после установки.<br>" +
                "— Платформы видеочатов в списке поддерживаемых указаны в порядке появления этой самой поддержки.<br>" +
                '<br>' +
                '<b>Простой режим</b><br>' +
                '— Изменена логика работы простого режима и формат отображения данных.<br>' +
                '— Для России и Украины отображаются данные для мобильного интернета.' +
                '<br>' +
                '<br>' +
                '<b>Геолокация.</b><br>' +
                "— Резервный способ запроса принят как основной, больше нет смысла разрешать небезопасный контент и тп.<br>" +
                "— При ошибке 429 (слишком много запросов) больше не прекращается работа API.<br>" +
                "— При ошибке 429 появляется кнопка, позволяющая запросить геолокацию ещё раз через какое-то время.<br>" +
                '<br>' +
                '<b>Локальные горячие клавиши.</b><br>' +
                "— Если держать <- больше 5 секунд и отпустить, то собеседник не будет пропущен.<br>" +
                '<br>' +
                '<b>История изменений.</b><br>' +
                "— Теперь вы можете запретить журналу изменений открываться после каждого обновления.<br>" +
                '<br>' +
                '<b>Важно:</b><br>' +
                `Если вам кажется, что что-то сломалось, пожалуйста, напишите в <a style="text-decoration:none;" target="_blank" href="https://discord.gg/YZKnbKGWen">Discord</a> или прямо на <a style="text-decoration:none;" target="_blank" href="mailto:qrluke@proton.me">почту разработчика</a>`
        }
    },
    {
        version: "1.7.1",
        date: "2023-03-19",
        description: {
            en: '<b>Minor improvements for Chatruletka.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— Improved the look and feel of the API health check by adding information on how to fix common errors.<br>' +
                '— Smoother transition from the API \'check ongoing\' state to the result of this check.<br>' +
                '— Added Badge \'leave review in...\' for firefox and edge versions of the extension.<br>' +
                '— Badge should now only be loaded once.<br>' +
                '— Badge for Edge uses the star rating of the Chrome version because there\'s no other way.<br>' +
                '— Fixed the name of the current site not being displayed after pressing the \'Stop\' button.<br>' +
                '— Shortened the reminder that the extension is not affiliated with any video chats.<br><br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— The list of local hotkeys is now hidden if local hotkeys are disabled.<br>' +
                '— Added a mention in the tooltip that the user can cancel the activation of the hotkey if it is held for more than 5 seconds (for example, you accidentally pressed the arrow to skip and do not want to skip the interlocutor).<br><br>' +
                '<b>- Section \'Info\'.</b><br>' +
                '— Changed the short description of the extension (added information that more video chats are supported).<br>' +
                '— Added badges table for all published extensions.<br><br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Incorrect determination of the size of the control panel of the extension has been fixed if the container with the video player occupies all the free space in width.<br>' +
                '— Fixed broken discord links in different places of the extension.<br>' +
                '— Added links to extensions published in Edge and Firefox stores in changelog v1.7.0.<br>' +
                '— Fixed incorrect pictures in Russian localization in the post-installation window.',
            ru: '<b>Мелкие улучшения для Chatruletka.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Улучшен внешний вид проверки работоспособности API: добавлена информация о том, как можно исправить частые ошибки.<br>' +
                '— Более плавный переход от состояния проверки API к результату этой проверки.<br>' +
                '— Добавлен Badge \'оставьте отзыв в\' для firefox и edge версий расширения.<br>' +
                '— Badge теперь должен прогружаться только один раз.<br>' +
                '— Badge для Edge использует рейтинг из звездочек версии для Chrome, потому что по-другому никак.<br>' +
                '— Исправлено название текущего сайта, не отображающееся после нажатия на кнопку \'Стоп\'.<br>' +
                '— Укорочено напоминание о том, что расширение развивается не связано с администрацией видеочатов.<br><br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Список локальных хоткеев теперь скрывается, если локальные хоткеи отключены.<br>' +
                '— Добавлено упоминание в tooltip о том, что пользователь может отменить активацию горячей клавиши, если будет её держать больше 5-ти секунд (например, вы случайно нажали стрелочку для пропуска и не хотите пропускать собеседника).<br><br>' +
                '<b>- Раздел \'Инфо\'.</b><br>' +
                '— Изменено краткое описание расширения (добавлена информация что поддерживается больше видеочатов).<br>' +
                '— Добавлена таблица badges для всех опубликованных расширений.<br><br>' +
                '<b>- Разное.</b><br>' +
                '— Исправлено некорректное определение размера контрольной панели расширения в случае, если контейнер с видеоплеером занимает всё свободное пространство по ширине.<br>' +
                '— Исправлены некорректные ссылки на discord в разных местах расширения.<br>' +
                '— В changelog v1.7.0 добавлены ссылки на опубликованные в магазинах Edge и Firefox расширения.<br>' +
                '— Исправлены некорректные картинки в русской локализации в послеустановочном окне.'
        }
    },
    {
        version: "1.7.2",
        date: "2023-03-20",
        description: {
            en: '<b>Bug fixes and minor improvements.</b><br>' +
                '<br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— If \'skip wrong country\' is enabled in automation settings, IP geolocation will not be requested until the country is confirmed to be correct.<br>' +
                '— Fixed unnecessary activation of api check when emulating a click on the stop button by the extension in Firefox.<br><br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— Fixed incorrect activation of local hotkeys: arrow-up and arrow-right.<br><br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Replaced the picture of the minimalistic mode in the English localization (in the switch mode window).',
            ru: '<b>Исправление ошибок.</b><br>' +
                '<br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Если включен \'пропуск неверной страны\' в настройках автоматизации, геолокация IP не будет запрашиваться пока не подтвердится, что страна правильная.<br>' +
                '— Исправлена ненужная активация проверки API при эмуляции нажатия \'стоп\' расширением в Firefox.<br><br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— Исправлена некорректная активация локальных хоткеев: стрелка вверх и стрелка вправо.<br><br>' +
                '<b>- Разное.</b><br>' +
                '— Заменена картинка-пример минималистичного режима в английской локализации (окно смены режима).'
        }
    },
    {
        version: "1.7.3",
        date: "2023-03-XX",
        description: {
            en: '<b>New mirrors for ome.tv, basic Coomeet Free support, minor improvements.</b><br>' +
                '<br>' +
                '<b>- Support for ome.tv platform (extension).</b><br>' +
                '— Added support for webcamchatta.com.<br>' +
                '— Added support for indiavideochat.com.<br>' +
                '— Added support for chatrooms.pro.<br>' +
                '— Added support for chatgenerator.com.<br>' +
                '— Added support for chatbizar.com.' +
                '<br><br>' +
                '<b>- Added basic support for the Coomeet Free platform.</b><br>' +
                '— Features: bot recognition and the ability to automatically hide their video / audio feeds, interface tweaks: shows what country the stranger is from, shows the country in which the service thinks you live and which countries the service should connect you with.<br>' +
                '— Added basic support for free.coomeet.com.<br>' +
                '— Added basic support for rusvideochat.ru.<br>' +
                '— Added basic support for video-roulette24.ru.<br>' +
                '— Added basic support for chatroulette.msk.ru.' +
                '<br><br>' +
                '<b>- Section \'IP\'.</b><br>' +
                '— If mobile IP city/region display is disabled (this is by default), now you can hover over LOCATION HIDDEN to see which city and region have been determined for the stanger. Once again, it is worth recalling that the accuracy of geolocation of IP addresses of mobile operators is very, very low.' +
                '<br><br>' +
                '<b>- Section \'Settings\'.</b><br>' +
                '— An option (enabled by default) has been added to the control panel section to prohibit changing the font size of control panel elements. Extension supports a lot of sites and some of them have promotional materials with very large fonts that can affect the control panel leading to a very ugly result.' +
                '<br><br>' +
                '<b>- Dark Mode.</b><br>' +
                '— Added filter for social media buttons to emulate dark theme.<br>' +
                '— Reduced Omegle header shadow highlighting when dark theme is enabled.' +
                '<br><br>' +
                '<b>- Minimalism mode & Omegle.</b><br>' +
                '— Changed the display format of geolocation data of mobile IP addresses.' +
                '<br><br>' +
                '<b>- Miscellaneous.</b><br>' +
                '— Added post-uninstall Google Form.',
            ru: '<b>Новые зеркала для ome.tv, базовая поддержка Coomeet Free, мелкие улучшения.</b><br>' +
                '<br>' +
                '<b>- Расширение поддержки платформы ome.tv</b><br>' +
                '— Добавлена поддержка webcamchatta.com.<br>' +
                '— Добавлена поддержка indiavideochat.com.<br>' +
                '— Добавлена поддержка chatrooms.pro.<br>' +
                '— Добавлена поддержка chatgenerator.com.<br>' +
                '— Добавлена поддержка chatbizar.com.' +
                '<br><br>' +
                '<b>- Добавлена базовая поддержка платформы Coomeet Free.</b><br>' +
                '— Функции: распознавание ботов и возможность автоматически скрывать их видео/аудио, улучшения интерфейса: показывает из какой страны ваш собеседник, какая страна определилась у вас и с какими странами сервис должен вас соединять.<br>' +
                '— Добавлена базовая поддержка free.coomeet.com.<br>' +
                '— Добавлена базовая поддержка rusvideochat.ru.<br>' +
                '— Добавлена базовая поддержка video-roulette24.ru.<br>' +
                '— Добавлена базовая поддержка chatroulette.msk.ru.' +
                '<br><br>' +
                '<b>- Раздел \'IP\'.</b><br>' +
                '— Если отображение мобильных городов скрыто, то теперь можно навести мышку на ЛОКАЦИЯ СКРЫТА, чтобы посмотреть какой город и регион определились для собеседника. В очередной раз стоит напомнить, что точность геолокации IP адресов мобильных операторов ОЧЕНЬ НИЗКАЯ.' +
                '<br><br>' +
                '<b>- Раздел \'Настройки\'.</b><br>' +
                '— В раздел панели управления добавлена опция (по умолчанию включена), запрещающая изменение размера шрифта элементов панели управления. Расширение поддерживает множество сайтов и на некоторых из них есть промотекст с очень крупным шрифтом, что может очень неприятно повлиять на панель управления.' +
                '<br><br>' +
                '<b>- Тёмная тема.</b><br>' +
                '— Добавлен фильтр для кнопок социальных сетей, чтобы эмулировать тёмную тему.<br>' +
                '— Уменьшено выделение тени заголовка Omegle при активированной тёмной теме.' +
                '<br><br>' +
                '<b>- Простой режим и Omegle.</b><br>' +
                '— Изменен формат отображения данных геолокации мобильных IP адресов.' +
                '<br><br>' +
                '<b>- Разное.</b><br>' +
                '— Добавлена Google Form при удалении расширения.'
        }
    }
]


export class ContentSwalChangelog extends SwalWithSteps {
    private static instanceRef: ContentSwalChangelog;

    // TODO: this is awful, please rework
    protected didOpen = () => {
        document.removeEventListener('keyup', this.arrowHotkeys)
        document.addEventListener('keyup', this.arrowHotkeys)
        chrome.storage.sync.get({'allowShowChangelog': true}, (res) => {
            (<HTMLInputElement>document.getElementById('allowShowChangelogCheck')).checked = res.allowShowChangelog
        })
    }

    private constructor() {
        super();

        this.steps = []
        changelog.forEach((log) => {
            this.steps.push(log.version)
        })

        this.titles = []
        changelog.forEach((log) => {
            this.titles.push(this.getGitHub(`v${log.version}`, `(${log.date})`))
        })

        this.swalQueueStep = this.swalQueueStep.mixin({
            showCancelButton: true,
            allowEscapeKey: true,
            progressSteps: this.steps,
            progressStepsDistance: "4%",
            // TODO: this changes platform settings, but need to change global
            footer: ControlsTabSettings.createSettingsCheckbox(true, 'span', 'allowShowChangelog', chrome.i18n.getMessage('showChangelogToggle'), chrome.i18n.getMessage("tooltipShowChangelogToggle"))
        })
    }

    static getInstance(): ContentSwalChangelog {
        if (ContentSwalChangelog.instanceRef === undefined) {
            ContentSwalChangelog.instanceRef = new ContentSwalChangelog();
        }

        return ContentSwalChangelog.instanceRef;
    }

    public showFromVersion = async (version: string) => {
        if (version === "") {
            version = chrome.runtime.getManifest().version
        }
        let index = this.steps.indexOf(version)
        if (this.steps.indexOf(version) + 1 < this.steps.length) {
            index++
        }

        this.currentStep = index

        return await this.show()
    }

    protected getHTML = () => {
        return `<div style="text-align: left; min-height: 300px; max-height: 300px">${this.getValue()}</div>`
    }

    protected getValue: () => string = () => {
        let lang = chrome.i18n.getMessage('lang')
        if (lang == "en" || lang === "ru") {
            return changelog[this.currentStep].description[lang]
        } else {
            return changelog[this.currentStep].description.en
        }
    }

    private getGitHub = (tag: string, date: string) => {
        return `<a href="https://github.com/qrlk/videochatru-extension/releases/tag/${tag}" style=\"text-decoration: none!important;\" target=\"_blank\">${tag} ${date}</a>`
    }
}
