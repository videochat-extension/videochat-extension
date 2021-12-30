function createStyle() {
    return createElement('style', {
        textContent: `.tabs__content {
                display: none;
                padding-left: 5px;
                padding-right: 5px;
              }
              
              .tabs__content.active {
                display: block;
              }
              
              .tabs {
                position: relative;
                word-break: break-word;
                user-select: text;
              }
              
              .tabs__caption {
                display: flex;
                flex-wrap: wrap;
                list-style-type: none;
                bottom: 0px;
                background: #f8f8f8;
                margin: 0;
                position: absolute;
                width: 100%;
                border-bottom: 1px solid lightgray;
              }
              
              .tabs__caption li {
                padding: 0.2rem 0.5rem;
                text-decoration: none;
                color: black;
                text-align: center;
                flex-shrink: 0;
                flex-grow: 1;
              }
      
              .tabs__caption li:not(.active) {
                cursor: pointer;
              }
              
              .tabs__caption .active {
                font-weight: bold;
              }
              
              .row:after {
                content: "";
                display: table;
                box-sizing: border-box;
                clear: both;
              }
              
              dd {
                margin-inline-start: 20px!important;
              }
              
              input {
                margin-left: 5px!important;
              }
              
              p {
                display: inline-block;
              }
              `
    })
}

function createTabs() {
    return createElement('ul', {
        className: "tabs__caption"
    }, [
        createElement('li', {
            className: "active",
            innerText: chrome.i18n.getMessage("tab1"),
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tab2"),
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tabBans")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tabStats")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tab3")
        }),
        createElement('li', {
            innerText: chrome.i18n.getMessage("tab4")
        })
    ])
}

function createControls() {
    return createElement('div', {
        className: 'chat',
        id: 'controls',
        style: "width:350px; margin-right: calc(100vh / 768 * 10);"
    }, [
        createElement('div', {
            className: "tabs chat"
        }, [
            createStyle(),
            createElement('p', {
                id: "remoteIP",
                style: "display: none;"
            }),
            createElement('div', {
                id: "remoteIPInfo",
                style: "display: none;"
            }),
            createElement('div', {
                id: "localStage",
                style: "display: none"
            }),
            createHeader(),
            createTabs(),
            createTabApi(),
            createTabMap(),
            createTabBans(),
            createTabStats(),
            createTabSettings(),
            createTabAbout(),
        ])
    ])
}
