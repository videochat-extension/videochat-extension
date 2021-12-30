function createTabMap() {
    return createElement('div', {
        className: "tabs__content",
        id: "faceapiContent",
        style: "height:100%;"
    }, [
        createElement('div', {
            id: "mapid",
            style: "width: 100%; margin-top: 1px;"
        })
    ])
}
