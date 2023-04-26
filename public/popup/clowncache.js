(chrome.storage.local.get({'popupCachedOffsetHeight': 200})).then((res) => {
    document.body.style.minHeight = res.popupCachedOffsetHeight + 'px'
})