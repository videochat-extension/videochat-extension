// bi-star-fill
// bi-star
// bi-box-arrow-up-right
// bi-check-circle-fill
// bi-x-circle-fill
// bi-exclamation-triangle-fill

// FAIR WARNING: this popup is a performance mess
// it is based on a heavily modified https://github.com/chniter/bstreeview
// dev speed was a priority, in the future this should be rewritten / optimized
document.title = chrome.i18n.getMessage('popupTitle')

let content = ["vendor.js", "content_script.js"]
let params = new URLSearchParams(window.location.search);
let API = 'https://ve-api.starbase.wiki'
let OAUTH_ID = 'hqFg3ttNGk4A85vFiQZGrl2bzNG6vJ6mwPnyaLiW'

console.time("show tree")
$(async function () {

    if (!params.has('missingPermission') && !params.has('scanHistory')) {
        console.time("cache grab")
        let cached = (await chrome.storage.local.get({'popupCachedContent': ''}))
        let cachedHTML = cached.popupCachedContent

        if (cachedHTML !== "") {
            cachedHTML = cachedHTML.replaceAll('id="tree', 'id="cached_tree')
            // ALLOW_UNKNOWN_PROTOCOLS allows to keep chrome://.. image src
            let sanitizedCachedHTML = DOMPurify.sanitize(cachedHTML, {ALLOW_UNKNOWN_PROTOCOLS: true})
            document.getElementById('cached').innerHTML = sanitizedCachedHTML;
        }
        console.timeEnd("cache grab")
    }

    async function updCache() {
        await chrome.storage.local.set({
            'popupCachedContent': document.getElementById('container').innerHTML,
            'popupCachedOffsetHeight': document.getElementById('container').offsetHeight
        })
    }

    console.time("get platforms dict")
    let platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
    console.timeEnd("get platforms dict")

    console.time("get favorites")
    let favorites = (await chrome.storage.sync.get({'favorites': []}))["favorites"]
    console.timeEnd("get favorites")

    let forced_content = {
        ids: [],
        origins: []
    }

    function extractHost(url) {
        return new URL(url.replace(/(\*\.)|(www\.)/g, '')).hostname;
    }

    let contentScripts = chrome.runtime.getManifest().content_scripts
    if (contentScripts) {
        for (const script of contentScripts) {
            for (const match of script.matches) {
                let domain = extractHost(match)
                if (domain) {
                    let site = getSiteByDomain(domain, platforms)
                    if (site && site.site && site.site.id) {
                        forced_content.ids.push(site.site.id)
                        forced_content.origins.push(site.site.origin)
                    }
                }
            }
        }
    }

    console.time("get startPermissions")
    let startPermissions = (await chrome.permissions.getAll()).origins
    console.timeEnd("get startPermissions")
    console.time("get registered scripts")
    let startScripts = await getRegisteredScripts()
    console.timeEnd("get registered scripts")
    let t = []
    console.time("enrich sites")
    for (const platform of platforms) {
        for (const site of platform.sites) {
            t.push(site.origin)
            site.icon = 'bi-chat'
            site.favorite = favorites.includes(site.id)
            site.access = await hasPermision(site.origin, true)
            site.reg = await isRegistered(site.id, true)
            site.forcedByManifest = forced_content.ids.includes(site.id)
        }
    }
    console.dir(t)
    console.timeEnd("enrich sites")

    async function getRegisteredScripts() {
        if (chrome.scripting) {
            const scripts = await chrome.scripting.getRegisteredContentScripts();
            const siteIds = scripts.map(script => script.id);
            return siteIds
        } else {
            return []
        }
    }

    async function hasPermision(origin, initial) {
        if (forced_content.origins.includes(origin)) {
            return true
        } else {
            if (initial) {
                return startPermissions.includes(origin)
            } else {
                return await chrome.permissions.contains({
                    origins: [origin]
                })
            }
        }
    }

    async function isRegistered(siteId, initial) {
        if (forced_content.ids.includes(siteId)) {
            return !(await isLegacyPrevented(siteId));
        } else if (chrome.scripting) {
            if (initial) {
                return startScripts.includes(siteId)
            } else {
                const scripts = await chrome.scripting.getRegisteredContentScripts();
                const siteIds = scripts.map(script => script.id);
                return (siteIds.includes(siteId))
            }
        } else {
            return false
        }
    }


    async function unreg(siteId) {
        if (await isRegistered(siteId)) {
            await chrome.scripting.unregisterContentScripts({ids: [siteId]})
        }
    }

    async function reg(siteId, origin, content) {
        await chrome.scripting.registerContentScripts([{
            allFrames: true,
            id: siteId,
            js: content,
            matches: [origin],
            persistAcrossSessions: true,
            runAt: "document_idle"
        }])
    }

    async function enableReg(siteId, origin, content) {
        await unreg(siteId)
        await reg(siteId, origin, content)
        await updScriptStatus(siteId, true)
    }

    async function disableReg(siteId) {
        await unreg(siteId)
        await updScriptStatus(siteId, false)
    }

    async function requestOrigin(origin) {
        return await chrome.permissions.request({
            permissions: ["scripting"],
            origins: [origin]
        })
    }


    function getTitleByIconClass(newIconClass) {
        switch (newIconClass) {
            case "bi-check-circle-fill":
                return chrome.i18n.getMessage("popupSiteEnabled")

            case "bi-x-circle-fill":
                return chrome.i18n.getMessage("popupSiteDisabled")

            case "bi-exclamation-triangle-fill":
                return chrome.i18n.getMessage("popupSiteMissingPermission")
        }
    }

    function dumbUpdStatus() {
        console.time("updStatus")
        $(`[type="status"]`).each(async (i, v) => {
            let access = await hasPermision(v.getAttribute("origin"))
            let reg = await isRegistered(v.getAttribute("siteId"))
            v.children[0].className = access ? (reg ? "bi-check-circle-fill" : "bi-x-circle-fill") : "bi-exclamation-triangle-fill"
            v.title = getTitleByIconClass(v.children[0].className)
        })
        console.timeEnd("updStatus")
    }

    async function handlePermission() {
        let siteId = this.getAttribute('siteId')
        let origin = this.getAttribute('origin')

        let icon = $(this.firstChild)
        let newIconClass

        if (icon.hasClass("bi-check-circle-fill")) {
            if (forced_content.ids.includes(siteId)) {
                return true
            } else {
                await disableReg(siteId)
                newIconClass = 'bi-x-circle-fill'
            }
        } else if (icon.hasClass('bi-x-circle-fill')) {
            await enableReg(siteId, origin, content)
            newIconClass = 'bi-check-circle-fill'
        } else {
            const result = await requestOrigin(origin)
            if (result) {
                // setTimeout(dumbUpdStatus, 300)
                newIconClass = 'bi-x-circle-fill'
            } else {
                newIconClass = 'bi-exclamation-triangle-fill'
            }
        }

        let buttons = $(`[type="status"][siteId="${siteId}"]`)
        buttons.children().attr('class', newIconClass)
        buttons.attr('title', getTitleByIconClass(newIconClass))
    }

    async function isLegacyPrevented(id) {
        let legacyPrevent = (await chrome.storage.sync.get({
                "legacyPrevent": {
                    "7fef97eb-a5cc-4caa-8d19-75dab7407b6b": false,
                    "98ea82db-9d50-4951-935e-2405d9fe892e": false
                }
            }
        )).legacyPrevent
        return legacyPrevent[id]
    }

    async function updPreventLegacy(id, bool) {
        let legacyPrevent = (await chrome.storage.sync.get({
                "legacyPrevent": {
                    "7fef97eb-a5cc-4caa-8d19-75dab7407b6b": false,
                    "98ea82db-9d50-4951-935e-2405d9fe892e": false
                }
            }
        )).legacyPrevent
        legacyPrevent[id] = bool
        await chrome.storage.sync.set({"legacyPrevent": legacyPrevent})
    }

    async function updScriptStatus(siteId, bool) {
        let scripts = (await chrome.storage.sync.get({
            "scripts": {}
        })).scripts;
        if (scripts[siteId] !== bool) {
            scripts[siteId] = bool
            await chrome.storage.sync.set({"scripts": scripts})
        }
    }

    async function handleManifestPermission() {
        let siteId = this.getAttribute('siteId')
        let origin = this.getAttribute('origin')

        let icon = $(this.firstChild)
        let newIconClass

        if (icon.hasClass("bi-check-circle-fill")) {
            await updPreventLegacy(siteId, true)
            newIconClass = 'bi-x-circle-fill'
        } else if (icon.hasClass('bi-x-circle-fill')) {
            await updPreventLegacy(siteId, false)
            newIconClass = 'bi-check-circle-fill'
        }

        let buttons = $(`[type="status"][siteId="${siteId}"]`)
        buttons.children().attr('class', newIconClass)
        buttons.attr('title', getTitleByIconClass(newIconClass))
    }

    function handleStar() {
        let icon = $(this.firstChild)
        let siteId = this.getAttribute('siteId')
        let newIconClass

        if (icon.hasClass('bi-star')) {
            newIconClass = 'bi-star-fill'
            if ($(this.parentElement.parentElement).attr('favorite')) {
                this.parentElement.parentElement.remove()
            } else {
                let cur = document.getElementById("tree-item-0")
                let newFav = $(this.parentElement.parentElement).clone(true)
                newFav.attr('aria-level', 2)
                newFav.attr('favorite', true)
                newFav[0].style.paddingLeft = "2.5rem"
                cur.append(newFav[0])
            }
        } else {
            icon.removeClass()
            icon.addClass('bi-star')
            if ($(this.parentElement.parentElement).attr('favorite')) {
                this.parentElement.parentElement.remove()
                newIconClass = 'bi-star'
            } else {
                let children = document.getElementById('tree-item-0').children
                let findAndDestroy = this.parentElement.parentElement.getAttribute('text')
                let destroyArray = []
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    if (findAndDestroy === child.getAttribute('text')) {
                        destroyArray.push(child)
                    }
                }
                destroyArray.forEach((el) => {
                    el.remove()
                })
                newIconClass = 'bi-star'
            }
        }

        switch (newIconClass) {
            case 'bi-star': {
                let index = favorites.indexOf(siteId);
                if (index !== -1) {
                    favorites.splice(index, 1);
                }
                break;
            }
            case "bi-star-fill": {
                favorites.push(siteId)
                break;
            }
        }
        chrome.storage.sync.set({favorites: favorites})

        $(`[type="star"][siteId="${siteId}"]`).children().attr('class', newIconClass)
        toggleFavoritesVisibility()
    }

    function handleLink() {
        window.open($(this).attr('link'), "_blank")
    }

    async function handlePatreon() {
        let patreon = (await chrome.storage.sync.get({
            "patreonIsPatron": false,
            "patreonLoggedIn": false,
            "patreonAccessToken": "",
            "patreonRefreshToken": "",
            "patreonTokenExpires": -1,
            "patreonSettingWired": false,
            "patreonSettingCellural": false
        }))
        if (patreon.patreonLoggedIn && patreon.patreonAccessToken !== "") {
            fetch(`${API}/whoami`, {
                headers: {
                    "Authorization": `Bearer ${patreon.patreonAccessToken}`
                },
            }).then(async (response) => {
                if (response.ok) {
                    let user = await response.json()
                    let logout = $("#patreonLogOut")
                    logout.removeClass('d-none')
                    logout.addClass('d-flex')
                    logout[0].children[0].children[0].innerText = `${user.username}`
                    logout[0].children[0].children[0].title = `patreon id: ${user.uid}`
                    document.getElementById('quotaText').innerText = `: ${user.api_usage_patreon_quota}/${user.plan_limit}`

                    let login = $("#patreonLogIn")
                    login.removeClass('d-flex')
                    login.addClass('d-none')

                    if (patreon.patreonIsPatron) {
                        document.getElementById('becomePatronButton').style.display = 'none'
                    }

                    if (user.allow_wired) {
                        document.getElementById('patreonSettingWired').disabled = false
                    }

                    if (user.active) {
                        document.getElementById('becomePatronButton').className = "btn btn-success btn-sm"
                        document.getElementById('becomePatronButton').innerText = chrome.i18n.getMessage("popupTreePatreonPatronThanks")
                    }

                    if (user.allow_mobile) {
                        document.getElementById('patreonSettingCellural').disabled = false
                    }
                } else {
                    if (response.status === 401) {
                        chrome.storage.sync.set({
                            "patreonIsPatron": false,
                            "patreonLoggedIn": false,
                            "patreonAccessToken": "",
                            "patreonRefreshToken": "",
                            "patreonTokenExpires": -1,
                            "patreonSettingWired": false,
                            "patreonSettingCellural": false
                        }).then(handlePatreon)
                    }
                    alert(response.status + response.statusText)
                }
            }).catch((error) => {
                let logout = $("#patreonLogOut")
                logout.removeClass('d-none')
                logout.addClass('d-flex')
                alert(error)
            })
        } else {
            let logout = $("#patreonLogOut")
            logout.addClass('d-none')
            logout.removeClass('d-flex')

            let login = $("#patreonLogIn")
            login.removeClass('d-none')
            login.addClass('d-flex')

            document.getElementById('becomePatronButton').className = "btn btn-danger btn-sm"
            document.getElementById('becomePatronButton').innerText = "BECOME A PATRON"

            login[0].children[0].children[0].innerText = chrome.i18n.getMessage("popupTreePatreonAccountLogInPlease")
        }
    }

    function toggleFavoritesVisibility() {
        let cur = document.getElementById("tree-item-0")
        let fav = $("#favorites")
        if (cur) {
            if (cur.childElementCount === 0) {
                fav.removeClass('d-flex')
                fav.addClass('d-none')
            } else {
                fav.removeClass('d-none')
                fav.addClass('d-flex')
            }
        }
    }

    function createNode(site, favorite) {
        return {
            text: site.text,
            href: site.href,
            favorite: favorite,
            favicon: chrome.runtime.getURL(`popup/icons/${site.favicon}`),
            buttons: [{
                type: "status",
                icon: site.access ? (site.reg ? "bi-check-circle-fill" : "bi-x-circle-fill") : "bi-exclamation-triangle-fill",
                title: getTitleByIconClass(site.access ? (site.reg ? "bi-check-circle-fill" : "bi-x-circle-fill") : "bi-exclamation-triangle-fill"),
                origin: site.origin,
                siteId: site.id,
                onclick: site.forcedByManifest ? handleManifestPermission : handlePermission
            }, {
                type: "star",
                siteId: site.id,
                icon: site.favorite ? "bi-star-fill" : "bi-star",
                onclick: handleStar
            }, {
                type: "link",
                icon: site.support === "full" ? "bi-box-arrow-up-right" : "bi-box-arrow-in-up-right",
                title: chrome.i18n.getMessage(site.supportDesc),
                link: site.href,
                onclick: handleLink
            }],
            icon: site.icon
        }
    }

    function createFavorites() {
        let favsNodes = []
        let favs = []
        platforms.forEach((platform) => {
            platform.sites.forEach((site) => {
                if (site.favorite) {
                    favs.push(site)
                }
            })
        })
        console.dir(favs)
        favs.sort(function (x, y) {
            let xt = recentDict[x.id] | 0
            let yt = recentDict[y.id] | 0
            console.dir(xt)
            if (xt > yt) {
                return -1;
            }
            if (xt < yt) {
                return 1;
            }
            return 0;
        });
        console.dir(favs)
        favs.forEach(site => {
            favsNodes.push(createNode(site, true))
        })

        return favsNodes
    }

    function createPlatform(text, nodes) {
        return [{
            text: text,
            badge: nodes.length,
            nodes: nodes
        }]
    }

    function createNodesFromPlatformList() {
        let nodes = []
        platforms.forEach((platform) => {
            let sitesNodes = []
            platform.sites.forEach((site) => {
                sitesNodes.push(createNode(site))
            })
            nodes = nodes.concat(createPlatform(platform.name, sitesNodes))
        })
        return nodes
    }

    function getArrayToFix(platforms) {
        let arrayToFix = []
        platforms.forEach((platform) => {
            platform.sites.forEach((site) => {
                if (!site.access) {
                    arrayToFix.push(site)
                }
            })
        })
        return arrayToFix
    }

    let recentDict = (await chrome.storage.sync.get({"recentDict": {}})).recentDict


    function getSiteById(id, platforms) {
        for (const platform of platforms) {
            for (const site of platform.sites) {
                if (site.id === id) {
                    return {site: site, platform: platform.id}
                }
            }
        }
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

    async function createSetting(id, text, disabled, onchange, title) {
        return {
            switch: {
                id: id,
                text: text,
                disabled: disabled,
                title: title,
                checked: (await chrome.storage.sync.get({[id]: true}))[id],
                onchange: async function () {
                    chrome.storage.sync.set({[id]: this.checked})
                    if (onchange) {
                        onchange(this.checked)
                    }
                }
            }
        }
    }

    async function createSettings() {
        return [
            await createSetting('legacyIcon', chrome.i18n.getMessage("popupSettingLegacyIcon"), false, (bool) => {
                document.getElementById('allowSetLastIcon').disabled = bool
                document.getElementById('allowSetBadgeText').disabled = bool
            }),
            await createSetting('allowSetLastIcon', chrome.i18n.getMessage("popupSettingAllowSetLastIcon"), (await chrome.storage.sync.get({["legacyIcon"]: false}))["legacyIcon"]),
            await createSetting('allowSetBadgeText', chrome.i18n.getMessage("popupSettingAllowSetBadgeText"), (await chrome.storage.sync.get({["legacyIcon"]: false}))["legacyIcon"]),
            await createSetting('sentry', chrome.i18n.getMessage("popupSettingSentry"), false),
            await createSetting('allowShowChangelog', chrome.i18n.getMessage("popupSettingAllowShowChangelog"), false),
            await createSetting('missingPermissionCheck', chrome.i18n.getMessage("popupSettingMissingPermissionCheck"), false)
        ]
    }


    function createRecents(recents) {
        let recNodes = []
        console.dir(recents)
        let recArray = []
        for (const [key, value] of Object.entries(recents)) {
            recArray.push({id: key, timestamp: value})
        }
        recArray.sort(function (x, y) {
            if (x.timestamp > y.timestamp) {
                return -1;
            }
            if (x.timestamp < y.timestamp) {
                return 1;
            }
            return 0;
        });
        recArray = recArray.slice(0, 3)

        for (const site of recArray) {
            let s = getSiteById(site.id, platforms)
            if (s) {
                recNodes.push(createNode(s.site, false))
            }
        }

        return recNodes
    }


    async function createAbout() {
        return [
            {
                text: chrome.i18n.getMessage("popupTreeLinksContentCannyRequest"),
                href: chrome.i18n.getMessage("popupTreeLinksContentCannyRequestHref"),
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: chrome.i18n.getMessage("popupTreeLinksContentCannyRequestHref"),
                    onclick: handleLink
                }],
                icon: "bi-stars"
            },
            {
                text: chrome.i18n.getMessage("popupTreeLinksContentGFFeatureRequest"),
                href: chrome.i18n.getMessage("popupTreeLinksContentGFFeatureRequestHref"),
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: chrome.i18n.getMessage("popupTreeLinksContentGFFeatureRequestHref"),
                    onclick: handleLink
                }],
                icon: "bi-rocket-fill"
            },
            {
                text: chrome.i18n.getMessage("popupTreeLinksContentGFBugReport"),
                href: chrome.i18n.getMessage("popupTreeLinksContentGFBugReportHref"),
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: chrome.i18n.getMessage("popupTreeLinksContentGFBugReportHref"),
                    onclick: handleLink
                }],
                icon: "bi-bug-fill"
            },
            {
                text: chrome.i18n.getMessage("popupTreeLinksContentAbout"),
                href: chrome.runtime.getURL("welcome/welcome.html"),
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: chrome.runtime.getURL("welcome/welcome.html"),
                    onclick: handleLink
                }],
                icon: "bi-info-circle-fill"
            },
            {
                text: chrome.i18n.getMessage("popupTreeLinksContentWebsite"),
                href: chrome.i18n.getMessage("popupTreeLinksContentWebsiteHref"),
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: chrome.i18n.getMessage("popupTreeLinksContentWebsiteHref"),
                    onclick: handleLink
                }],
                icon: "bi-info-circle-fill"
            },
            {
                text: "discord support server",
                href: "https://discord.gg/7DYWu5RF7Y",
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: "https://discord.gg/7DYWu5RF7Y",
                    onclick: handleLink
                }],
                icon: "bi-discord"
            },
            {
                text: "github",
                href: "https://github.com/qrlk/videochat-extension",
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: "https://github.com/qrlk/videochat-extension",
                    onclick: handleLink
                }],
                icon: "bi-github"
            },
            {
                text: "chrome extension",
                href: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi",
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: "https://chrome.google.com/webstore/detail/alchldmijhnnapijdmchpkdeikibjgoi",
                    onclick: handleLink
                }],
                icon: "bi-browser-chrome"
            },
            {
                text: "edge add-on",
                href: "https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn",
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: "https://microsoftedge.microsoft.com/addons/detail/jdpiggacibaaecfbegkhakcmgaafjajn",
                    onclick: handleLink
                }],
                icon: "bi-browser-edge"
            },
            {
                text: "firefox add-on",
                href: "https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/",
                buttons: [{
                    type: "link",
                    icon: "bi-box-arrow-up-right",
                    link: "https://addons.mozilla.org/firefox/addon/videochat-extension-ip-locator/",
                    onclick: handleLink
                }],
                icon: "bi-browser-firefox"
            }
        ]
    }

    async function fixAll(e) {
        let obj = getArrayToFix(platforms)
        await chrome.permissions.request({
            permissions: ["scripting"],
            origins: obj.map(site => site.origin)
        }, async (res) => {
            if (res) {
                // setTimeout(dumbUpdStatus, 300)
                e.target.style.display = "none"
            } else {
                e.target.style.display = ""
            }
        })
    }

    async function scanHistory(e) {
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
                location.href = location.href.replace("&scanHistory", "")
            }
        }
    }

    let patreonBlockedTZs = [
        "Asia/Anadyr",
        "Asia/Barnaul",
        "Asia/Chita",
        "Asia/Irkutsk",
        "Asia/Kamchatka",
        "Asia/Khandyga",
        "Asia/Krasnoyarsk",
        "Asia/Magadan",
        "Asia/Novokuznetsk",
        "Asia/Novosibirsk",
        "Asia/Omsk",
        "Asia/Sakhalin",
        "Asia/Srednekolymsk",
        "Asia/Tomsk",
        "Asia/Ust-Nera",
        "Asia/Vladivostok",
        "Asia/Yakutsk",
        "Asia/Yekaterinburg",
        "Europe/Astrakhan",
        "Europe/Kaliningrad",
        "Europe/Kirov",
        "Europe/Minsk",
        "Europe/Moscow",
        "Europe/Samara",
        "Europe/Saratov",
        "Europe/Ulyanovsk",
        "Europe/Volgograd"
    ]

    function isPatreonBlocked() {
        return patreonBlockedTZs.includes(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }


    let json = [{
        text: chrome.i18n.getMessage("popupTreeFavoritesTitle"),
        expanded: !params.has('recent') && !params.has("patreon"),
        id: "favorites",
        hide: favorites.length === 0,

        bigFixButton: {
            text: chrome.i18n.getMessage("popupTreeFavoritesContentScanHistoryButtonText"),
            display: function () {
                return params.has('scanHistory') ? "" : "none"
            }(),
            class: "btn btn-primary btn-sm",
            onclick: scanHistory
        },
        nodes: createFavorites()
    },
        {
            text: chrome.i18n.getMessage("popupTreeRecentTitle"),
            id: "recents",
            expanded: (params.has('recent') || favorites.length === 0) && !params.has("patreon"),
            hide: Object.keys(recentDict).length === 0,
            nodes: createRecents(recentDict)
        },
        {
            text: chrome.i18n.getMessage("popupTreeSupportedTitle"),
            bigFixButton: {
                text: chrome.i18n.getMessage("popupTreeSupportedContentFixPermissionsButtonText"),
                display: function () {
                    let arrayToFix = getArrayToFix(platforms)
                    return arrayToFix.length > 0 ? "" : "none"
                }(),
                class: "btn btn-danger btn-sm",
                onclick: fixAll
            },
            nodes: createNodesFromPlatformList()
        },

        {
            text: chrome.i18n.getMessage("popupTreePatreonTitle"),
            id: "patreon",
            expanded: params.has("patreon"),
            nodes: [
                {
                    text: chrome.i18n.getMessage("popupTreePatreonIronCurtainTitle"),
                    hide: !isPatreonBlocked(),
                    nodes: [
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonIronCurtainText1")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonIronCurtainText2")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonIronCurtainText3")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonIronCurtainText4")
                        }
                    ]
                },
                {
                    text: chrome.i18n.getMessage("popupTreePatreonPerksTitle"),
                    nodes: [
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonPerksAccuracyTitle"),
                            nodes: [
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksAccuracyText1")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksAccuracyText2")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksAccuracyText3")
                                }
                            ]
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonPerksSupportTitle"),
                            nodes: [
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText1")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText2")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText3")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText4")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText5")
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonPerksSupportText6")
                                }
                            ]
                        },
                    ]
                },
                {
                    text: chrome.i18n.getMessage("popupTreePatreonGuideTitle"),
                    hide: false,
                    nodes: [
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText1")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText2")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText3")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText4")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText5")
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonGuideText6")
                        }
                    ]
                },
                {
                    text: chrome.i18n.getMessage("popupTreePatreonAccountTitle"),
                    expanded: params.has('patreon'),
                    // badge: "text",
                    bigFixButton: {
                        text: "BECOME A PATRON",
                        id: "becomePatronButton",
                        class: "btn btn-danger btn-sm",
                        onclick: () => {
                            window.open("https://www.patreon.com/videochat_extension", "_blank")
                        }
                    },
                    nodes: [
                        {
                            id: "patreonLogIn",
                            text: chrome.i18n.getMessage("popupTreePatreonAccountChecking"),
                            bigFixButton: {
                                text: chrome.i18n.getMessage("popupTreePatreonAccountLogIn"),
                                class: "btn btn-danger btn-sm",
                                onclick: async () => {

                                    let res = await chrome.permissions.request({
                                        permissions: ["identity"]
                                    })
                                    if (res) {
                                        // GENERATING CODE VERIFIER
                                        function dec2hex(dec) {
                                            return ("0" + dec.toString(16)).substr(-2);
                                        }

                                        function generateCodeVerifier() {
                                            var array = new Uint32Array(56 / 2);
                                            window.crypto.getRandomValues(array);
                                            return Array.from(array, dec2hex).join("");
                                        }

                                        function sha256(plain) {
                                            // returns promise ArrayBuffer
                                            const encoder = new TextEncoder();
                                            const data = encoder.encode(plain);
                                            return window.crypto.subtle.digest("SHA-256", data);
                                        }

                                        function base64urlencode(a) {
                                            var str = "";
                                            var bytes = new Uint8Array(a);
                                            var len = bytes.byteLength;
                                            for (var i = 0; i < len; i++) {
                                                str += String.fromCharCode(bytes[i]);
                                            }
                                            return btoa(str)
                                                .replace(/\+/g, "-")
                                                .replace(/\//g, "_")
                                                .replace(/=+$/, "");
                                        }

                                        async function generateCodeChallengeFromVerifier(v) {
                                            var hashed = await sha256(v);
                                            var base64encoded = base64urlencode(hashed);
                                            return base64encoded;
                                        }

                                        function exchangeCodeForToken(code) {
                                            fetch(`${API}/o/token/`, {
                                                body: `client_id=${OAUTH_ID}&code=${code}&code_verifier=${verifier}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=authorization_code&scope=read%20write`,
                                                headers: {
                                                    "Content-Type": "application/x-www-form-urlencoded"
                                                },
                                                method: "POST"
                                            }).then(async (res) => {
                                                let data = await res.json()
                                                await chrome.storage.sync.set({
                                                    "patreonLoggedIn": true,
                                                    "patreonAccessToken": data.access_token,
                                                    "patreonRefreshToken": data.refresh_token,
                                                    "patreonTokenExpires": Math.floor(Date.now() / 1000) + data.expires_in
                                                })
                                                handlePatreon()
                                            })
                                        }

                                        let verifier

                                        async function getToken() {
                                            redirectUri = chrome.identity.getRedirectURL('login');
                                            console.dir(redirectUri)
                                            verifier = generateCodeVerifier()
                                            let challenge = await generateCodeChallengeFromVerifier(verifier)

                                            var options = {
                                                'interactive': true,
                                                'url': `${API}/o/authorize/?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=${OAUTH_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`
                                            }
                                            console.dir(options)
                                            let queryString = new URLSearchParams(redirectUri)

                                            chrome.identity.launchWebAuthFlow(options, function (redirectUri) {
                                                console.log('launchWebAuthFlow completed', chrome.runtime.lastError, redirectUri);

                                                let paramString = redirectUri.split('?')[1];
                                                let queryString = new URLSearchParams(paramString);

                                                if (queryString.has('code'))
                                                    exchangeCodeForToken(queryString.get('code'));
                                                else
                                                    callback(new Error('Invalid redirect URI'));
                                            });
                                        }

                                        getToken()
                                    }
                                }
                            },
                        },

                        {
                            id: "patreonLogOut",
                            text: "User Name",
                            hide: true,
                            bigFixButton: {
                                text: chrome.i18n.getMessage("popupTreePatreonAccountLogOut"),
                                class: "btn btn-danger btn-sm",
                                onclick: async () => {
                                    let res = await chrome.permissions.request({
                                        permissions: ["identity"]
                                    })
                                    if (res) {
                                        chrome.identity.launchWebAuthFlow({
                                            'url': `${API}/accounts/logout`,
                                            'interactive': true,
                                        }).catch((e) => {
                                            // alert(e)
                                        }).finally(() => {
                                            if (!chrome.runtime.getManifest().browser_specific_settings) {
                                                chrome.identity.launchWebAuthFlow({
                                                    'url': `https://patreon.com/logout`,
                                                    'interactive': true,
                                                }).catch((e) => {
                                                    // alert(e)
                                                })
                                            }
                                        })
                                    }

                                    chrome.storage.sync.get({"patreonRefreshToken": ""}, (res) => {
                                        fetch(`${API}/o/revoke_token/`, {
                                            body: `token=${res.patreonRefreshToken}&client_id=${OAUTH_ID}`,
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            method: "POST"
                                        }).finally(() => {
                                            chrome.storage.sync.set({
                                                "patreonIsPatron": false,
                                                "patreonLoggedIn": false,
                                                "patreonAccessToken": "",
                                                "patreonRefreshToken": "",
                                                "patreonTokenExpires": -1,
                                                "patreonSettingWired": false,
                                                "patreonSettingCellural": false
                                            }).then(handlePatreon)
                                        })
                                    })

                                }
                            },
                        },
                        {
                            html: `${chrome.i18n.getMessage("popupTreePatreonAccountQuotaTitle")}<span id='quotaText'></span>`,
                            nodes: [
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText1"),
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText2"),
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText3"),
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText4"),
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText5"),
                                },
                                {
                                    text: chrome.i18n.getMessage("popupTreePatreonAccountQuotaText6"),
                                },
                            ]
                        },
                        {
                            text: chrome.i18n.getMessage("popupTreePatreonAccountSettingsTitle"),
                            nodes: [
                                await createSetting('patreonSettingWired', chrome.i18n.getMessage("popupTreePatreonAccountSettingsWiredEnabled"), true, (bool) => {

                                }, chrome.i18n.getMessage("popupTreePatreonAccountSettingsWiredEnabledTitle")),
                                await createSetting('patreonSettingCellural', chrome.i18n.getMessage("popupTreePatreonAccountSettingsCelluralEnabled"), true, (bool) => {

                                }, chrome.i18n.getMessage("popupTreePatreonAccountSettingsCelluralEnabledTitle")),
                            ]
                        }
                    ]
                }
            ]
        },

        {
            text: chrome.i18n.getMessage("popupTreeSettingsTitle"),
            id: "settings",
            nodes: await createSettings()
        },

        {
            text: chrome.i18n.getMessage("popupTreeLinksTitle"),
            id: "about",
            bigFixButton: {
                text: "ROADMAP",
                class: "btn btn-primary btn-sm",
                onclick: () => {
                    window.open("https://videochat-extension.canny.io", "_blank")
                }
            },
            nodes: await createAbout()
        },
    ];

    console.time("start tree")

    $('#tree').bstreeview({
        data: json,
        expandIcon: 'bi-caret-down',
        collapseIcon: 'bi-caret-right',
        indent: 1.25,
        parentsMarginLeft: '1.25rem',
        openNodeLinkOnNewTab: true
    });

    $('#cached').remove();
    document.body.style.minHeight = null

    if (!params.has('missingPermission') && !params.has('scanHistory') && !params.has('patreon')) {
        await updCache();
    }

    chrome.runtime.onMessage.addListener(
        (request) => {
            if (request.updateStatus) {
                let buttons = $(`[type="status"][siteId="${request.updateStatus.siteId}"]`)
                let newIconClass
                if (request.updateStatus.bool) {
                    newIconClass = 'bi-check-circle-fill'
                } else {
                    newIconClass = 'bi-x-circle-fill'
                }
                buttons.children().attr('class', newIconClass)
                buttons.attr('title', getTitleByIconClass(newIconClass))
            }
        }
    )

    console.timeEnd("start tree")
    // toggleFavoritesVisibility()
    console.timeEnd("show tree")
    handlePatreon()
    // document.getElementById('container').style.display=""

    if (params.has('zoom')) {
        document.body.style.zoom = params.get('zoom') + "%"
    }
    if (params.has('missingPermission')) {
        let site = getSiteByDomain(params.get("missingPermission"), platforms)
        let countAll = platforms.map(pl => pl.sites.length).reduce((partialSum, a) => partialSum + a, 0)
        Swal.fire({
            title: chrome.i18n.getMessage("popupMissingPermissionSwalTitle"),
            html: chrome.i18n.getMessage("popupMissingPermissionSwalText", [site.site.text, countAll, getArrayToFix(platforms).length, countAll]),
            icon: 'warning',
            showDenyButton: true,
            showConfirmButton: false,
            didRender: () => {
                document.getElementById('optButton').onclick = async () => {
                    await requestOrigin(site.site.origin)
                    if (await hasPermision(site.site.origin)) {
                        setTimeout(() => {
                            chrome.tabs.update(parseInt(params.get('fromTabId')), {active: true}, () => {
                                chrome.tabs.reload(parseInt(params.get('fromTabId')), null, () => {
                                    window.close()
                                })
                            })
                        }, 1000)
                    }
                }
                document.getElementById('allButton').onclick = fixAll
            },
            denyButtonText: chrome.i18n.getMessage("popupMissingPermissionSwalDenyButtonText"),
        }).then(async (result) => {
            if (result.isDenied) {
                await chrome.storage.sync.set({"missingPermissionCheck": false})
                Swal.fire({
                    title: chrome.i18n.getMessage("popupMissingPermissionCheckDisableSwalTitle"),
                    text: chrome.i18n.getMessage("popupMissingPermissionCheckDisableSwalText"),
                    confirmButtonText: chrome.i18n.getMessage("popupMissingPermissionCheckDisableSwalConfirmButtonText"),
                    icon: 'info'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        if (params.has('fromTabId')) {
                            chrome.tabs.update(parseInt(params.get('fromTabId')), {active: true}, () => {
                                window.close()
                            })
                        } else {
                            window.close()
                        }
                    }
                })
            }
        })
    }
});

