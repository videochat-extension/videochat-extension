import {ControlsTabApi, ControlsTabMap, GeolocationModule} from "../chatruletka/content-module-geolocation";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {OmegleDriver} from "../content-driver-omegle";

export class GeolocationModuleOmegle extends GeolocationModule {
    public mainDisclaimerKey = "main2"
    public constructor(driver: ChatruletkaDriver | OmegleDriver) {
        super(driver);

        document.unbindArrive("#reviewImageContainer")
        document.unbindArrive("#discordImageContainer")

        this.tabs[0] = new ControlsTabApiOmegle(this.driver, this)
    }
}

export class ControlsTabApiOmegle extends ControlsTabApi {
    //TODO: need to address DRY issue
    protected hintsDict = {
        "en": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `The extension community is hosted on <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">Discord</a>.<br><br>On <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">our Discord server</a> you can subscribe to project updates, report a bug, suggest an idea, get technical help and discuss the extension with the developer and other users!`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 6,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `You have 'target search' enabled.<br><br>The extension will now skip everyone until it finds you someone from a country/region/city that you specified in the list in the settings.<br><br>You can disable this feature in the geolocation settings.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: `We can turn on the dark mode for you: <input type="checkbox" onchange="document.getElementById('darkModeCheck').click()">`
            },
        ],
        "ru": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `Сообщество расширения размещено в <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">Discord</a>.<br><br>На <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">нашем Discord сервере</a> вы можете следить за новостями проекта, сообщить об ошибке, предложить функцию, получить техническую помощь и обсудить расширение с разработчиком и другими пользователями!`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 6,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `У вас включен таргетированный поиск.<br><br>Расширение будет пропускать всех ваших собеседников, пока не найдет кого-нибудь из списка стран/регионов/городов, который вы задали в настройках<br><br>Вы можете отключить эту функцию в настройках геолокации.'.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: `Расширение может включить тёмную тему: <input type="checkbox" onchange="document.getElementById('darkModeCheck').click()">`
            },
        ]
    }
    public hints = this.genHintsArray()
}