import {ControlsTabApi, ControlsTabMap, GeolocationModule} from "../chatruletka/content-module-geolocation";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {OmegleDriver} from "../content-driver-omegle";

export class GeolocationModuleOmegle extends GeolocationModule {
    public constructor(driver: ChatruletkaDriver | OmegleDriver) {
        super(driver);

        document.unbindArrive("#reviewImageContainer")
        document.unbindArrive("#discordImageContainer")

        this.tabs[0] = new ControlsTabApiOmegle(this.driver, this)
    }
}

export class ControlsTabApiOmegle extends ControlsTabApi {
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
        ]
    }
    public hints = this.genHintsArray()
}