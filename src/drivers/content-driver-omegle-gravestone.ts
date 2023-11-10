import {createElement} from "../utils/utils";
import Swal from "sweetalert2";


export function insertOmegleDeathAnnouncement() {
    let sadMusic = new Audio('https://ve-api.starbase.wiki/static/\'Undertow\'%20by%20Scott%20Buckley%20-%20released%20under%20CC-BY%204.0.%20www.scottbuckley.com.au.mp3')
    document.body.append(sadMusic)
    sadMusic.volume = 0.5
    sadMusic.loop = true

    let done = false
    document.addEventListener("click", (e) => {
        if (!done && e.isTrusted) {
            sadMusic.load()
            sadMusic.play()
            done = true
        }
    })

    let timeout: NodeJS.Timeout | undefined;

    let swalButton = createElement('button',
        {
            innerText: 'open the videochat extension\'s announcement',
            onclick: () => {
                Swal.fire({
                    title: "<a href=\"https://videochat-extension.starbase.wiki\" style=\"text-decoration: none!important;\" target=\"_blank\">Videochat Extension</a>",
                    html: '<div style="min-height: 325px; max-height: 325px">' +
                        "<b>Omegle is officially dead.</b><br><br>We ourselves are still in shock, but it is pointless to deny reality. At the moment omegle is dead and there is nothing we can do to bring it back.<br>" +
                        "<br>" +
                        "<b>Join our <a id='needToFocus' style=\"text-decoration:none;\" target=\"_blank\" href=\"https://patreon.com/videochat_extension\">free Patreon community</a> to stay in touch and keep up with the news about the extension.</b><br>" +
                        "<br>" +
                        "While nothing will ever replace omegle, we will keep an eye on what will try to fill the void and add support for new video chat sites in the future.<br>" +
                        "<br>" +
                        "<b>For now, we recommend <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://ome.tv\">ome.tv</a> as the most suitable alternative to omegle</b>.<br><br>It is one of dozens of Omegle-inspired sites that are still going strong.<br><br>Ome.tv has very good moderation, established mobile apps, a huge number of users in different countries, and the big plus is that it has been around since 2010. This message has not been sponsored and is in fact our unbiased opinion.<br>" +
                        "<br>" +
                        "<b>To help you transition to ome, we've published a <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://www.patreon.com/posts/92577234\">post on Patreon</a> with important information for long-term omegle users.</b>" +
                        "<br>" +
                        "<br>" +
                        "The extension was originally built for that platform, so we support all of our features there (including geolocation, blacklist, gender recognition, and more).<br>" +
                        "<br>" +
                        "We will try to add more features to the extension to ease the transition for long-term omegle users.<br>" +
                        "<br>" +
                        "<b>Join our <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://patreon.com/videochat_extension\">free Patreon community</a> or <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://discord.gg/7DYWu5RF7Y\">Discord server</a> to stay in touch and keep up with the news.</b><br>" +
                        "<br>" +
                        "Omegle, thank you for everything you've been to us and everything you've inspired to create." +
                        "<br>" +
                        "<br>" +
                        "<small>music: 'Undertow' by Scott Buckley - released under CC-BY 4.0. www.scottbuckley.com.au</small>" +
                        "</div>",
                    footer: "<span>This message was created by <a style=\"text-decoration:none;\" target=\"_blank\" href=\"https://videochat-extension.starbase.wiki\">Videochat Extension</a>.</span>",
                    allowOutsideClick: false,
                    confirmButtonText: "Close",
                    icon: "info",
                    didOpen() {
                        if (timeout)
                            clearTimeout(timeout);
                        let increaseVolume = () => {
                            if (sadMusic.volume < 0.5) {
                                sadMusic.volume = sadMusic.volume + 0.01
                            }
                            timeout = setTimeout(increaseVolume, 250)
                        }
                        setTimeout(increaseVolume, 100);
                        (document.querySelector('#needToFocus') as HTMLElement).focus()
                    },
                    didClose() {
                        if (timeout)
                            clearTimeout(timeout);

                        let reduceVolume = () => {
                            if (sadMusic.volume > 0.35) {
                                sadMusic.volume = sadMusic.volume - 0.01
                            }
                            timeout = setTimeout(reduceVolume, 250)
                        }
                        setTimeout(reduceVolume, 100)
                    }
                })
            }
        }
    )

    let turnOffMusicButton = createElement('button', {
        innerText: 'turn off the music',
        onclick: () => {
            sadMusic.pause()
        }
    })

    let intrusion = createElement('center', {
        style: "padding-top:1em; padding-bottom: 1em;"
    }, [
        swalButton,
        createElement('br'),
        turnOffMusicButton
    ])

    document.querySelector('body > p:nth-child(3)')!.append(intrusion)

    swalButton.click()
}