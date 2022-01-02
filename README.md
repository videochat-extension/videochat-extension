[<sup>Подробнее о Google Chrome расширении для Чат Рулетки на русском языке можно прочитать по этой ссылке</sup>](README_RU.md)  
<h1 align="center">Чат Рулетное Расширение (Chatruletka Extension)</h1>

<p align="center">
<a href = "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi"><img src="https://img.shields.io/chrome-web-store/users/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20users"></a> 
<a href = "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi/reviews"><img src="https://img.shields.io/chrome-web-store/rating/alchldmijhnnapijdmchpkdeikibjgoi?label=chrome%20rating"></a>
<a href = "https://discord.gg/YZKnbKGWen"><img src="https://img.shields.io/discord/925632108150530108?label=support&amp;logo=discord"></a> 
<a href = "https://buymeacoffee.com/qrlk"><img src="https://img.shields.io/static/v1?label=buymeacoffee%20&message=donate&color=red&logo=kofi"></a> 
<img src="https://img.shields.io/github/license/qrlk/videochatru-extension" >
<img src="https://img.shields.io/date/1632816617?label=released" >
<br>
<a href = "https://t.me/videochatru_extension_ru"><img src="https://img.shields.io/badge/dynamic/json?label=News%20RU&amp;query=result&amp;suffix=%20Subscribers&amp;logo=telegram&amp;url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_extension_ru"></a>
<a href = "https://t.me/videochatru_chat_ru"><img src="https://img.shields.io/badge/dynamic/json?label=Chat%20RU&amp;query=result&amp;suffix=%20Members&amp;logo=telegram&amp;url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_chat_ru"></a>
<a href = "https://t.me/videochatru_extension"><img src="https://img.shields.io/badge/dynamic/json?label=News&query=result&suffix=%20Subscribers&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_extension"></a> 
<a href = "https://t.me/videochatru_chat"><img src="https://img.shields.io/badge/dynamic/json?label=Chat&query=result&suffix=%20Members&logo=telegram&url=https%3A%2F%2Fapi.telegram.org%2Fbot5041993583%3AAAFGRQXy-mstURIBCaoA4IFczRrMeUNrVRc%2FgetChatMemberCount%3Fchat_id%3D%40videochatru_chat"></a>
</p>

**This is a browser extension that adds a bunch of cool stuff to the [Chatruletka website](https://videochatru.com).**  

**It can be installed from [Chrome Web Store](https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi). English and Russian locales are available.**

![2021-12-31_10-50](https://user-images.githubusercontent.com/40423143/147810908-d3f5e56b-ae6c-45dc-aade-d6d2da5eaac6.png)

[<sup>more screens</sup>](screens.md)  
### As for now, "Chat Roulette Extension" can do following for you:
* Determine the location of the interlocutor by his/her/their IP address.
* Streamer mode
    * hotkey to mute your interlocutor 
  * **special features to combat NSFW on live broadcasts**
    * hotkey to blur image from the interlocutor's camera
    * ability to output the interlocutor's camera to PiP, which is not captured by OBS
    * enable blur protection at the beginning of each new conversation
    * use your own picture/gif as a cover instead of a blur
    * nsfwjs integration to automate moderation/counter surprise attacks
    * advanced settings that allow you to achieve the desired effect
* Dark Mode.
* Auto-skip skip people who are not from city/region you choose.
* Determine the current time of the interlocutor's location.
* Determine whether the interlocutor uses VPN/TOR to fake his location.
* Determine the gender of the interlocutor and skip it automatically if the gender does not meet your expectations.
* Block the ip of the interlocutor in order not to meet with him again.
* Count various stats.
* Play sound when your interlocutor breaks the connection with you.
* Enable Picture-in-Picture mode.
* Enable mirror mode. It's useful [if you don't have a physical camera but still want to chat](https://github.com/qrlk/videochatru-extension/wiki/No-Physical-Cam).
* Show a map of the interlocutor's city.
* Take a full screenshot of the interlocutor's camera or your own.
* Hide the video chat watermark / banner.
* Auto-skip the interlocutor if he/she is not from the country you are looking for.
* Auto-skip people who take too long to connect to.
* Automatically close the window "are you there?".
* Сancel local camera reflection.
* Hide your camera to make the conversation more natural.
* Open the clean site version by clicking on the extension icon.
* Help you with advice if you accidentally got banned.
* Convenient keyboard shortcuts for the most popular buttons.
* Hotkey to switch between the active tab and the chat tab.
* Countless minor improvements.

## Please note
* This extension is intended for real users who come to chat without destructive / hostile intentions.  
* There is an unfinished **[videochatru-mitm](https://github.com/qrlk/videochatru-mitm)** which is focused on the needs of YouTubers.
* All PRs with functionality that can harm users of the platform, such as bypassing the ban on virtual cameras to scare people with screamers, will be rejected.

## Settings

There are 40+ settings in total, each of which is responsible for some functionality.  
They are all divided into sections, each has a tooltip that explains what it does.

<details>
   <summary>Tooltip example</summary>
   
   ![image](https://user-images.githubusercontent.com/40423143/147811348-095c9991-0ebc-48c7-b10e-a7c49f525583.png)

</details>

<details>
   <summary>All settings</summary>
   
   ![2021-12-31_10-56](https://user-images.githubusercontent.com/40423143/147810937-37012aa9-500a-43fa-818f-58424bdbe3ff.png)
   
</details>

## What is Chat Roulette?
**By 'Chat Roulette' I mean a global platform consisting of mobile apps and many websites sharing the same userbase.**

The goal of the 'platform' is to allow users to find a random interlocutor at the touch of a button.  

The connection between users is established directly through webrtc, while the service takes over the functions of a moderator and earns money with paid unbans.

**The mobile part of the 'platform' includes:**
* [**Чат Рулетка**](https://play.google.com/store/apps/details?id=com.chat.ruletka) (10M+ users)
* [**Ome.tv**](https://play.google.com/store/apps/details?id=omegle.tv) (50M+ users)
* [**Minichat**](https://apps.apple.com/ua/app/minichat-video-chat-texting/id1506912979)

**Web part of the 'platform' includes 40+ sites:**

* **https://videochatru.com**
* **https://ome.tv**
* **https://brvideochat.com**
* **https://camki.com**
* **https://chatbizar.com**
* **https://chat-fr.com**
* **https://chatgenerator.com**
* **https://chat-nl.com**
* **https://chat-pl.com**
* **https://chatrooms.pro**
* **https://chatruletka.ua**
* **https://frvideochat.com**
* **https://indiavideochat.com**
* **https://ome.chat**
* **https://roulette-espanol.com**
* **https://roulettefrancais.com**
* **https://ruletkavideochat.com**
* **https://stickam.chat**
* **https://turkishvideochat.com**
* **https://ukr.chat**
* **https://videochatau.com**
* **https://videochatbr.com**
* **https://videochatca.com**
* **https://videochatde.com**
* **https://videochatfr.com**
* **https://videochatit.com**
* **https://videochatjp.com**
* **https://videochatmx.com**
* **https://videochatpt.com**
* **https://videochatruletka.com**
* **https://videochatus.com**
* **https://webcamchatta.com**
* **https://videochatru.com**
* **https://chatruletka.com**
* **https://ruletka.chat**
* **https://chatrulez.ru**
* **https://chatalternative.com**
* **https://chat-de.com**
* **https://chat-pt.com**
* **https://videochatnl.com**
* **https://ruletaespanol.com**
* **https://videochatpl.com**
* **https://videochatuk.com**
* **https://chat-brasil.com**

[Relationships proofs.](https://builtwith.com/relationships/videochatru.com)

There is also some evidence that camsurf ([web](https://camsurf.com), [iOS](https://apps.apple.com/us/app/camsurf/id1491535834), [Android](https://play.google.com/store/apps/details?id=camsurf.com&hl=en)) is also associated with this platform, but I'm not sure if they have a shared user base.

## Contribution
If you have a desire to contribute, [here is a small instruction](CONTRIBUTING.md).  


### some ideas:
* Integration of the facial recognition API, services such as findclone.ru.
* Button to clear cookies on ban popup.
* Avoid fingerprinting.
