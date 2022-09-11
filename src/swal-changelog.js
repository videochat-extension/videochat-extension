const showSwalChangelog = async function (version) {
    if (version === "") {
        version = chrome.runtime.getManifest().version
    }

    const steps = [
        '0.1',
        '0.2',
        '0.3',
        '0.4',
        '0.5',
        '0.6',
        '0.7',
        '0.7.1',
        '1.0',
        '1.1',
        '1.1.1',
        '1.1.2',
        '1.1.3',
        '1.1.4',
        '1.2.0',
        '1.3.0',
        '1.3.1',
        '1.3.2',
        '1.3.3',
        '1.4.0',
        '1.4.1',
        '1.4.2',
        '1.5.0',
        '1.5.1',
        '1.5.2'
    ]

    const getGitHub = (tag, date) => {
        return `<a href="https://github.com/qrlk/videochatru-extension/releases/tag/${tag}" style=\"text-decoration: none!important;\" target=\"_blank\">${tag} ${date}</a>`
    }

    const titles = [
        getGitHub('v0.1', '(2021-09-27)'),
        getGitHub('v0.2', '(2021-10-01)'),
        getGitHub('v0.3', '(2021-10-13)'),
        getGitHub('v0.4', '(2021-11-01)'),
        getGitHub('v0.5', '(2021-12-27)'),
        getGitHub('v0.6', '(2021-12-31)'),
        getGitHub('v0.7', '(2022-01-03)'),
        getGitHub('v0.7.1', '(2022-01-07)'),
        getGitHub('v1.0', '(2022-05-24)'),
        getGitHub('v1.1', '(2022-05-27)'),
        getGitHub('v1.1.1', '(2022-08-04)'),
        getGitHub('v1.1.2', '(2022-08-04)'),
        getGitHub('v1.1.3', '(2022-08-04)'),
        getGitHub('v1.1.4', '(2022-08-05)'),
        getGitHub('v1.2.0', '(2022-08-05)'),
        getGitHub('v1.3.0', '(2022-08-07)'),
        getGitHub('v1.3.1', '(2022-08-07)'),
        getGitHub('v1.3.2', '(2022-08-09)'),
        getGitHub('v1.3.3', '(2022-08-12)'),
        getGitHub('v1.4.0', '(2022-09-01)'),
        getGitHub('v1.4.1', '(2022-09-02)'),
        getGitHub('v1.4.2', '(2022-09-02)'),
        getGitHub('v1.5.0', '(2022-09-05)'),
        getGitHub('v1.5.1', '(2022-09-08)'),
        getGitHub('v1.5.2', '(2022-09-11)'),
    ]

    const values = {
        "en": [
            // v0.1 (2021-09-27)
            '<b>The first known version for a mass audience.</b><br>' +
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

            // v0.2 (2021-10-01)
            '<b>Skipping interlocutors by gender, changing the map provider.</b><br>' +
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

            // v0.3 (2021-10-13)
            '<b>Blacklist, statistics.</b><br>' +
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

            // v0.4 (2021-11-01)
            '<b>Extension name changed in English localization.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Added badges from shields.io .<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— \'Chat Roulette Extension\' renamed to \'Chatruletka Extension\'.<br>' +
            '— Minor fixes and improvements.',

            // v0.5 (2021-12-27)
            '<b>Sections in settings, ws hacks, experiments with nsfw blocking.</b><br>' +
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

            // v0.6 (2021-12-31)
            '<b>Streamer mode, search by city/region.</b><br>' +
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

            // v0.7 (2022-01-03)
            '<b>Dark mode.</b><br>' +
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

            // v0.7.1 (2022-01-07)
            '<b>Polling when deleting an extension.</b><br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added a Google form asking the user why he deleted the extension, the response is sent to the public channel in Discord.',

            // v1.0 (2022-05-24)
            '<b>Manifest v3 (will work in 2023+).</b><br>' +
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

            // v1.1 (2022-05-27)
            '<b>Error monitoring system.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Added the ability to hide the title (on by default).<br>' +
            '— Fixed crash when trying to hide a non-existent logo.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Added an error monitoring system to report errors in the extension code.<br>' +
            '— Added a scroll bar to the login window.<br>' +
            '— Increased the width of the control menu.<br>',

            // v1.1.1 (2022-08-04)
            '<b>Unsuccessful hotfix of the tab hanging issue.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Attempt to fix tab hanging with ws hacks enabled.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Limit the version string in the control panel to 3 characters',

            // v1.1.2 (2022-08-04)
            '<b>A successful hotfix of the tab hanging issue.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— The sending of "face data" is disabled, which was the reason for the tab to hang when ws hacks is enabled.',

            // v1.1.3 (2022-08-04)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Increased the delay before resizing after resizing the window.',

            // v1.1.4 (2022-08-05)
            '<b>Failed attempt to fix http error 429.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Failed attempt to replace the backup ip geolocation provider.',

            // v1.2.0 (2022-08-05)
            '<b>IP geolocation without any browser settings.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— IP geolocation should now work without the need to allow insecure content (but with a slightly longer delay).<br>' +
            '— The backup geolocation service was cut out because its limits policy applied to all users of the extension, and not just to a specific one, as I thought before.<br>' +
            '— The option to display additional IP information (tor vpn mobile) is now enabled by default.',

            // v1.3.0 (2022-08-07)
            '<b>Checking torrents and a welcome window.</b><br>' +
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


            // v1.3.1 (2022-08-07)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Dark theme adapted for the welcome window.',

            // v1.3.2 (2022-08-09)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— Fixed: \'buttonCheck torrents\' for UI locales other than en/ru.',

            // v1.3.3 (2022-08-12)
            '<b>Information about multiple IP addresses.</b><br>' +
            '<br>' +
            '<b>- Section \'IP\'.</b><br>' +
            '— The case is taken into account when the interlocutor revealed several IP addresses: information on all will be displayed.',

            // 1.4.0 (2022-09-01)
            '<b>Minimalism, ome.tv support, version history.</b><br>' +
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

            // 1.4.1 (2022-09-02)
            '<b>Minor fixes.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— The maximum height of the changelog container is limited.<br>' +
            '— Disabled closing by external click (changelog).<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Improved the method of resizing the control panel.',

            // 1.4.2 (2022-09-02)
            '<b>Minor fix.</b><br>' +
            '<br>' +
            '<b>- Section \'Info\'.</b><br>' +
            '— Now the version history displays the new version after update, not the one you used before.',

            // 1.5.0 (2022-09-05)
            '<b>Cosmetic improvements, a new option to prohibit camera cropping for mobile interlocutors.</b><br>' +
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

            // 1.5.1 (2022-09-08)
            '<b>A few changes to the \'streamer mode\'.<br><br>Ignore this update if you haven\'t used \'streamer mode\' before, this information is useless to you.</b><br><br>Streamer mode allows you to cover your interlocutor with your custom image/blur his picture by watching him through the picture-in-picture mode (which is in a separate window and not captured by OBS) to make sure that he does not have NSFW and remove the cover. Previously, the neural network was responsible for evaluating the interlocutor, but this functionality broke down and in order to fix it for good, I would need to rewrite the entire extension from scratch (which would take 20+ hours of work and a lot of energy, I don’t have all this), so you have to evaluate it manually each time, by toggling the cover with the \'right arrow\' key on the keyboard. The cover is activated by default every time the chat state changes (stop, search, found, play), if \'auto apply blur/cover\' is activated in the settings.<br>' +
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

            // 1.5.2 (2022-09-11)
            '<b>Removed link to instructions for bypassing the ban.</b><br>' +
            '<br>' +
            '<b>- Section \'Settings\'.</b><br>' +
            '— Target city/region search now works as expected if the interlocutor has multiple networks.<br>' +
            '<br>' +
            '<b>- Miscellaneous.</b><br>' +
            '— Replaced the boosty link with a window with information on how not to get banned by accident. Instructions for bypassing the ban are no longer available to the general public, even for money.<br>' +
            '— Improved the notification that is shown when the browser has updated the extension while you are at Chatruletka: it is now less intrusive.<br>'
        ],
        "ru": [
            // v0.1 (2021-09-27)
            '<b>Первая известная версия для массовой аудитории.</b><br>' +
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
            '— При клике на иконку расширения откроется версия рулетки без мусора (embed).',

            // v0.2 (2021-10-01)
            '<b>Пропуск собеседников по полу, смена провайдера карт.</b><br>' +
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
            '— Мелкие фиксы и улучшения.',

            // v0.3 (2021-10-13)
            '<b>Чёрный список, статистика.</b><br>' +
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
            '— Мелкие фиксы и улучшения.',

            // v0.4 (2021-11-01)
            '<b>Смена названия в английской локализации.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Добавлены бейджи с shields.io.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— \'Chat Roulette Extension\' переименовано в \'Chatruletka Extension\'.<br>' +
            '— Мелкие фиксы и улучшения.',

            // v0.5 (2021-12-27)
            '<b>Разделы в настройках, ws hacks, эксперименты с блокировкой nsfw.</b><br>' +
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
            '— Мелкие фиксы и улучшения.',

            // v0.6 (2021-12-31)
            '<b>Режим стримера, поиск по городу/региону.</b><br>' +
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
            '— Много внутренние архитектурных изменений.',

            // v0.7 (2022-01-03)
            '<b>Тёмный режим.</b><br>' +
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
            '— Переход с ko-fi на buymeacoffee.<br>',

            // v0.7.1 (2022-01-07)
            '<b>Опрос при удалении расширения.</b><br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлена форма Google, спрашивающая пользователя, почему он удалил расширение, ответ отправляется в публичный канал в Discord.',

            // v1.0 (2022-05-24)
            '<b>Manifest v3 (будет работать в 2023+).</b><br>' +
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
            '— Многие люди удаляли расширение, не понимая, почему они не могут использовать его на своём инстансе Чат Рулетки.<br>',

            // v1.1 (2022-05-27)
            '<b>Система мониторинга ошибок.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Добавлена возможность скрыть заголовок (по умолчанию вкл).<br>' +
            '— Исправлен вылет при попытке скрыть несуществующий логотип.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Добавлена система мониторинга ошибок для сообщения об ошибках в коде расширения.<br>' +
            '— Добавлена полоса прокрутки в окно входа.<br>' +
            '— Увеличена ширина меню управления.<br>',


            // v1.1.1 (2022-08-04)
            '<b>Неудачный хотфикс фризов.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Попытка исправить зависание вкладок с включенными ws hacks.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Ограничение строки версии в панели управления до 3 символов',

            // v1.1.2 (2022-08-04)
            '<b>Удачный хотфикс фризов.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Отключена отправка "данных лица", которая была причиной зависания вкладки при включенном ws hacks.',

            // v1.1.3 (2022-08-04)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Увеличена задержка перед изменением размера после изменения размера окна.',

            // v1.1.4 (2022-08-05)
            '<b>Неудачная попытка пофиксить http error 429.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Неудачная попытка заменить резервного провайдера ip геолокации.',

            // v1.2.0 (2022-08-05)
            '<b>Геолокация IP без настройки браузера.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— IP-геолокация теперь должна работать без необходимости разрешать небезопасный контент (но с немного большей задержкой).<br>' +
            '— Служба резервной геолокации вырезана, потому что ее политика лимитов распространялась на всех пользователей расширения, а не только на конкретного, как я думал раньше.<br>' +
            '— Опция отображения дополнительной информации об IP (tor vpn mobile) теперь включена по умолчанию.',

            // v1.3.0 (2022-08-07)
            '<b>Проверка торрентов и приветственное окно.</b><br>' +
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
            '— Спрятал инструкцию по обходу бана за пейвол из-за достижения порога в 5000 пользователей.',


            // v1.3.1 (2022-08-07)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Тёмная тема адаптирована для приветственного окна.',

            // v1.3.2 (2022-08-09)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Исправлено: кнопка \'Проверить торренты\' для локалей пользовательского интерфейса, отличных от en/ru.',

            // v1.3.3 (2022-08-12)
            '<b>Информация о нескольких IP адресах.</b><br>' +
            '<br>' +
            '<b>- Раздел \'IP\'.</b><br>' +
            '— Учтён случай, когда собеседник раскрыл несколько IP адресов: будет отображаться информация по всем.',

            // 1.4.0 (2022-09-01)
            '<b>Минимализм, поддержка ome.tv, история версий.</b><br>' +
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
            '— ome.tv - это та же чатрулетка, просто другой инстанс, позиционируемый как альтернатива Omegle.<br>',


            // 1.4.1 (2022-09-02)
            '<b>Мелкие фиксы.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Ограничена максимальная высота контейнера changelog.<br>' +
            '— Отключено закрытие по внешнему клику (changelog).<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Улучшен метод изменения размера панели управления.',

            // 1.4.2 (2022-09-02)
            '<b>Мелкий фикс.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Инфо\'.</b><br>' +
            '— Теперь история версий отображает новую версию при обновлении, а не ту, которую вы использовали раньше.',

            // 1.5.0 (2022-09-05)
            '<b>Косметические улучшения, новая опция для запрета обрезания камеры у мобильных собеседников.</b><br>' +
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
            '— Больше нельзя выделять текст в верхней и нижней частях контрольной панели.',

            // 1.5.1 (2022-09-08)
            '<b>Несколько изменений для \'режима стримера\'.<br><br>Проигнорируйте это обновление, если вы не пользовались \'режимом стримера\' ранее, эта информация бесполезна для вас.</b><br><br>Режим стримера позволяет закрыть собеседника своей заглушкой/размыть его картинку, наблюдая за ним через режим "картинка в картинке" (который в отдельном окне и не захватывается OBS), чтобы убедиться, что у него нет NSFW и снять заглушку. Раньше за оценку собеседника отвечала нейросеть, но этот функционал сломался и чтобы его починить по хорошему нужно переписать всё расширение с нуля (на что нужно 20+ часов работы и много энергии, у меня всего этого нет), так что оценивать придётся каждый раз вручную, переключая заглушку с помощью клавиши правой стрелки на клавиатуре. При этом заглушка по умолчанию активируется каждый раз при смене состояния чата (поиск, превьюшка, разговор), если активировано \'авто активация блюра\' в настройках.<br>' +
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
            '— Удален опрос при удалении расширения.<br>',

            // 1.5.2 (2022-09-11)
            '<b>Удалена ссылка на инструкцию по обходу бана.</b><br>' +
            '<br>' +
            '<b>- Раздел \'Настройки\'.</b><br>' +
            '— Поиск целевого города/региона теперь работает корректно, если у собеседника несколько сетей.<br>' +
            '<br>' +
            '<b>- Разное.</b><br>' +
            '— Ссылка на boosty заменена на окно с информацией о том, как не получить бан по ошибке. Инструкции по обходу бана больше не доступны широкой публике, даже за деньги.<br>' +
            '— Улучшено уведомление, которое показывается когда браузер обновил расширение пока вы в рулетке: оно стало менее навязчивым.<br>'
        ],
    }


    let index = steps.indexOf(version)
    if (steps.indexOf(version) + 1 < steps.length) {
        index++
    }

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
        confirmButtonText: chrome.i18n.getMessage('confirmButtonText'),
        denyButtonText: chrome.i18n.getMessage('denyButtonText'),
        cancelButtonText: chrome.i18n.getMessage('cancelButtonText'),
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps,
        progressStepsDistance: "4%",
    })

    const selectStep = function (step) {
        swalQueueStep.update({
            title: titles[currentStep],
            html: `<div style="text-align: left; min-height: 300px; max-height: 300px">${values[chrome.i18n.getMessage('lang')][currentStep]}</div>`,
            currentProgressStep: currentStep
        })
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
            title: titles[currentStep],
            html: `<div style="text-align: left; min-height: 300px; max-height: 300px">${values[chrome.i18n.getMessage('lang')][currentStep]}</div>`,
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
                e.querySelector('.swal2-confirm').onclick = (e) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                    } else {
                        Swal.close()
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
// showSwalChangelog('0.0')