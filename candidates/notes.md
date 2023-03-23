# chatruletka, ometv, minichat, chatrulez
* was born in the russian internet as an alternative to chatroulette.com
* operated/owned by ukrainians
* grown worldwide, lots of localised websites and apps, ability to select country
* good and stable platform overall, but there were some service disruptions / vulnerabilities in the past
* developed mobile apps
* different layout on some websites
* impossible to reach through contact form / email
* strong AI moderation, but lots of wrong bans
* real human moderation exists
* paid unbans
* p2p connection
* ios minichat app reveals names/city of people's social medias connected to chatruletka platform

# omegle
* english-speaking videochat, there are no country filter?
* Should prioritise support because of overall popularity and lots of lower quality options.
* Should be careful around automated actions and text chat, omegle looks like more text-based, so there should be some automated spam prevention.
* p2p connection => low costs, geolocation is possible
* no native mobile apps => most people should be PC users
  * ios app existed in the past 
  * website is still mobile friendly
* enormous popularity among english-speaking influences and pedophiles
* mostly US users
* no human moderation?
* possible AI moderation
* no authorization/registration means possible IP bans/filters
  * there is an option to use a university email to chat only with students
* UI feels very old, do users want to alter it? is the platform ok with extensions messing with the well-known UI?
* lots of chrome/firefox extensions on the market, expect heavy competition
    * **Omegle Ip Locator (bjlelflfdakmhpenaoodokchfhehacmh)**
        * **<= 2020-12-27 -> <=2023-02-10**
        * Similar to chatruletka extension's minimalism mode: only ip geolocation to the chat
        * Had ~276k by the time it was removed
        * Removed on 2023-02-10 because of obfuscated content script.
  * **Chromegle (gcbbaikjfjmidabapdnebofcmconhdbn)**
    * **<= 2021-07-22**
    * biggest possible competitor, 0.5-1.5% of people online use Chromegle, is growing fast
    * GPL-3
    * Features
      * ip geolocation
      * ip blacklist
      * adblock
      * auto-accepting TOS (lol why)
      * screenshot interlocutor's camera
      * interlocutor's video blocker
      * css themes
      * ban html
      * logo changer
      * microphone mute
      * chat filters
    * published 2 months earlier than Chatruletka Extension, but this repository's inital commit is 3 months older
      * don't remember if my repository was public, but I saw no sign of using my code in the first commits
    * APIs code is public, but no license present there
      * geolocation just proxies maxmind geolite external api call
      * caches end user's ip and reveals if he uses chromegle
        * this could be used to check if the interlocutor uses chromegle 
      * prometheus metrics, possible self-hosted tracking/analytics
    * brilliant naming
      * concatenation of 2 related well-known US trademarks in one word is impossible to counter
    * big discord community
    * author mentioned on discord possible paid subscription with additional features proceeds from which supposed to combat pedophiles (martsinkevich foundation???)
    * author is young, probably has a lot of energy to compete
  * **Omegless**
    * **<= 2019-09-03**
    * reworked ui with big stranger's camera
    * record/screenshot camera
    * autoskip simlulated cams
    * adblock
    * chat sounds
    * fullscreen
    * darkmode
    * greeting message
    * very low user count, why?
  * **Omegle Anti-Spam and Dark Mode (cgefmcnibjiomgjkngndppnidjifgobl)**
    * **<= 2020-06-14**
    * filter for text chat
    * chrome/firefox versions
    * auto reconnect
  * **Cock Blocker For Omegle (acogoebfegcdkabddmpomnhafncmehkd)**
    * **<= 2020-06-10**
    * nsfwjs image blur/skip
    * IKWYD integration
  * **Omegler (epchdnfkjgpfglhodnhpllbehmjmelgc)**
    * **<= 2017-10-09**
    * lots of users, but no visible growth
    * settable auto-greeting
    * pausable auto-reconnect
  * **OmegleCover (jigdmkehflkdflmnbpfhddlkmlpelmna)**
    * **<= 2014-12-28**
    * Covered user's own camera
    * Lots of users, but does not seem to work at all
  * **Omegle Location Finder (firefox)**
    * **<= 2021-05-21**
    * simple geolocation + leaflet map
    * low user count, low growth
  * **Omegle Automator (cjnledbijckhccgkhiamlpnpehfhcmkg)**
    * **<= 2022-11-23**
    * auto-fill for interests
    * flooder (???)
    * low user count
  * **Omegle Shortcut Messages (okbmccnmgfhccbhjajnngneeimeelajl)**
    * **<= 2019-02-27**
    * shortcuts for text chat
    * low user count
  * **Omegle Warning (hhfnbpedfkcibdggdolbfnamcmdhliij)**
    * **<= 2021-04-03**
    * every minute shows alert() that omegle contains bad content
    * low user count
    * lots of userscripts with relatively low downloads count
# Chatroulette
* russian answer to omegle which was destroyed by ukrainian chatruletka, it is unknown to me if it's still alive, but should check
# Camsurf
* builtwith showed that it is linked with chatruletka in the past
* relatively easy to support IP geolocation, seams to be connecting to people with residential IPS
* not sure if there are a lot of people using this chat, I met like 5 people in 10 minutes
* not sure if I should support this videochat
* I am quite sure that camsurf is not connected to the chatruletka user base
# Chatrandom
* random chat from Google
# camloo
* random chat from Google
# only2chat
* random chat from Google
# roulette.chat
* random chat from Google
# vonline
* russian chatruletka alternative, provides women with opportunity to chat with men for money (??????)
# coomeet free
* lots of bots who are mixed with real people, but real people still exist due to a wide network of partner sites
* to chat only with women you need to pay, videochat detects women in free chats and sells them to men?
* are bots used to detect user's gender?
* bots say hello and show penis/breasts/vagina from time to time, which can hurt streamers a lot (who thought that it is a good idea?)
* server that broadcasts bots is not the same that connects to the real people, possible to use it to filter bots?
* no p2p connection, meaning that conversations might be recorded? do they really make bots out of the real people's conversations?
# nekto.me
* russian audio chat roulette, site exists since 2011
* no p2p connection => no ip geolocation
* no idea if I can bring anything useful to this site