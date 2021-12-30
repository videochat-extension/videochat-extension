function createTabApi() {
    return createElement('div', {
        className: "tabs__content active row",
        id: "apiInfoContent",
        style: "height:100%;"
    }, [
        createElement('div', {
            id: "remoteFace",
        }),
        createElement('div', {
            id: "streamerStatus",
            // style: "display: none;"
        }),
        createElement('div', {
            id: "nsfwInfo",
            style: "display: none;"
        }),
        createElement('div', {
            id: "remoteInfo",
            style: "overflow-y: auto;margin-top: 3px"
        })
    ])
}
