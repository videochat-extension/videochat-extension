import $ from "jquery";

export function tweakLoginWindow() {
    try {
        let new_el = $(document.createElement("div"))

        new_el[0].innerHTML = chrome.i18n.getMessage("loginWindow")

        new_el[0].style.marginTop = "15px"
        new_el[0].style.marginBottom = "15px"

        new_el.insertAfter(document.querySelector('[data-tr="sign_in_to"]') as HTMLElement)
        $(".login-popup__item.right")[0].style.overflowY = "auto"
    } catch (e) {
        console.dir(e)
    }
}

export function interfaceModuleTweaks() {
    if (globalThis.settings.hideLogo) {
        try {
            document.getElementById("logo-link")!.style.display = "none"
        } catch (e) {
            console.dir(e)
        }
    }

    if (globalThis.settings.hideHeader) {
        $("#header").hide();
        document.getElementById("app")!.style.height = "100%"
        window.dispatchEvent(new Event('resize'));
    }

    if (globalThis.settings.hideWatermark) {
        try {
            (document.getElementsByClassName("remote-video__watermark")[0] as HTMLElement).style.display = "none"
        } catch (e) {
            console.dir(e)
        }
    }

    if (globalThis.settings.hideBanner) {
        try {
            (document.getElementsByClassName("caption remote-video__info")[0] as HTMLElement).style.display = "none"
        } catch (e) {
            console.dir(e)
        }
    }

    if (globalThis.settings.doNotReflect) {
        $("#local-video").removeClass("video-container-local-video")
    }

    if (globalThis.settings.doNotCover) {
        $("#remote-video").css({"object-fit": "contain"})
        // $(".preview").css({"background-size": "contain"})
    }

    if (globalThis.settings.hideCamera) {
        $("#local-video-wrapper")[0].style.display = "none"
    }

    createDarkMode()
}

export function createDarkMode() {
    globalThis.dark = document.createElement('link');
    globalThis.dark.rel = "stylesheet";
    globalThis.dark.id = "darkMode"
    if (location.href.includes('videochatru')) {
        dark.href = chrome.runtime.getURL("resources/dark-mode.css");
    } else if (location.href.includes('ome.tv')) {
        dark.href = chrome.runtime.getURL("resources/dark-mode-ometv.css");
    }
}

export function injectDarkMode() {
    if (globalThis.settings.darkMode)
        (document.body || document.documentElement).appendChild(globalThis.dark);
}


