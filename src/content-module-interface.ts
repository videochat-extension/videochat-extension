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

export function createDarkMode() {
    globalThis.dark = document.createElement('link');
    globalThis.dark.rel = "stylesheet";
    globalThis.dark.id = "darkMode"

    if (location.href.includes('videochatru')) {
        chrome.storage.sync.set({lastInstanceOpened: "https://videochatru.com/embed/"})
    } else if (location.href.includes('ome.tv')) {
        chrome.storage.sync.set({lastInstanceOpened: "https://ome.tv/embed/"})
    }
}

export function injectDarkMode() {
    if (globalThis.settings.darkMode)
        (document.body || document.documentElement).appendChild(globalThis.dark);
}


