let platforms
let lang = chrome.i18n.getMessage('lang') || "en"

function toObject(from, to) {
    for (let key in from) {
        let value = from[key]

        if (typeof value === 'object' && value && !Array.isArray(value)) {
            toObject(value, from[key])
            continue
        }

        to[key] = value
    }
}

function createElement(tagName, options, childs) {
    const element = document.createElement(tagName)

    toObject(options, element)

    for (let child of childs)
        element.appendChild(child)

    return element
}

const showSwalChangelog = async function () {
    const steps = ['1', '2']

    platforms = await (await fetch(chrome.runtime.getURL('platforms.json'))).json()
    let countAllSites = platforms.map(pl => pl.sites.length).reduce((partialSum, a) => partialSum + a, 0)

    const simple =
        [
            chrome.i18n.getMessage("welcomeContent1", [typeof browser === "undefined" ? chrome.runtime.getURL('welcome/img/chromium_en.png') : chrome.runtime.getURL('welcome/img/firefox_en.png'), countAllSites]),
            chrome.i18n.getMessage("welcomeContent2")
        ]


    let index = 0

    let currentStep = index

    const swalQueueStep = Swal.mixin({
        // disable animation
        showClass: {popup: 'swal2-noanimation', backdrop: 'swal2-noanimation'},
        hideClass: {backdrop: 'swal2-noanimation'},
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "->",
        denyButtonText: chrome.i18n.getMessage("welcomeDenyButtonText"),
        cancelButtonText: '<-',
        heightAuto: false,
        reverseButtons: true,
        progressSteps: steps
    })

    const selectStep = function (step) {
        swalQueueStep.update({
            title: "Videochat Extension",
            html: `<div id="container" style="text-align: left; min-height: 460px; display: flex; align-items: center;"><div>${simple[currentStep]}</div></div>`,
            currentProgressStep: currentStep
        })
        document.getElementById('container').scrollIntoView()
        if (document.getElementById('sentryCheck')) {
            chrome.storage.sync.get({"sentry": false}, (res) => {
                document.getElementById('sentryCheck').checked = res["sentry"]
            })
            document.getElementById('sentryCheck').addEventListener('change', (el) => {
                chrome.storage.sync.set({"sentry": el.target.checked})
            })
        }
    }

    const arrowHotkeys = function (e) {
        switch (e.key) {
            case "ArrowLeft":
                Swal.getCancelButton().click()
                break;

            case "ArrowUp":
                Swal.getDenyButton().click()
                break;

            case "ArrowRight":
                Swal.getConfirmButton().click()
                break;
        }
        e.preventDefault()
    }

    const result = await swalQueueStep.fire(
        {
            title: "Videochat Extension",
            html: `<div id="container" style="text-align: left; min-height: 460px;display: flex;align-items: center;"><div>${simple[currentStep]}</div></div>`,
            currentProgressStep: currentStep,

            willOpen: (e) => {
                e.querySelector('.swal2-cancel').onclick = (e) => {
                    if (currentStep - 1 >= 0) {
                        currentStep = currentStep - 1
                        selectStep(currentStep)
                    } else {
                        // Swal.close()
                    }
                }
                e.querySelector('.swal2-confirm').onclick = async (e) => {
                    if (currentStep + 1 < steps.length) {
                        currentStep = currentStep + 1
                        selectStep(currentStep)
                    } else {
                        await fixPermissions()
                    }
                }
                e.querySelector('.swal2-deny').onclick = async (e) => {
                    await fixPermissions()
                }
            },
            didOpen: () => {
                document.removeEventListener('keyup', arrowHotkeys)
                document.addEventListener('keyup', arrowHotkeys)
            },
            didRender: () => {
                let progressSteps = $(".swal2-progress-step")
                progressSteps.css({
                    "user-select": "none",
                    'cursor': 'pointer'
                })
                progressSteps.click(function (el) {
                    currentStep = steps.indexOf(el.target.innerText)
                    selectStep(currentStep)
                })
            },
            willClose: () => {
                document.removeEventListener('keyup', arrowHotkeys)
            }
        }
    )
    return result
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

function extractHost(url) {
    return new URL(url.replace(/(\*\.)|(www\.)/g, '')).hostname;
}

async function fixPermissions() {
    let origins = []
    let block = []
    let contentScripts = chrome.runtime.getManifest().content_scripts
    if (contentScripts) {
        for (const script of contentScripts) {
            for (const match of script.matches) {
                let domain = extractHost(match)
                if (domain) {
                    let site = getSiteByDomain(domain, platforms)
                    if (site && site.site && site.site.id) {
                        block.push(site.site.id)
                    }
                }
            }
        }
    }
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (!block.includes(site.id)) {
                origins.push(site.origin)
            }
        }
    }
    console.dir(origins)

    // firefox does not let use await here :(
    let shouldWait = true
    chrome.permissions.contains({
        permissions: ["scripting"],
        origins: origins
    }).then((res) => {
        if (!res) {
            Swal.fire({
                title: chrome.i18n.getMessage('welcomeSwalPermissionTitle'),
                html: chrome.i18n.getMessage('welcomeSwalPermissionContent'),
                icon: 'warning',
            })
        } else {
            shouldWait = false
        }
    })

    // might break if not called inside a user gesture
    try {
        chrome.permissions.request({
            permissions: ["scripting"],
            origins: origins
        }).then(() => {
            if (!shouldWait) {
                location.href = chrome.runtime.getURL('popup/popup.html?scanHistory')
            } else {
                // background service worker needs some time to register content scripts on new origins
                let timerInterval
                Swal.fire({
                    html: chrome.i18n.getMessage('welcomeSwalTimerText'),
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    location.href = chrome.runtime.getURL('popup/popup.html?scanHistory')
                })
            }
        })
    } catch (el) {
        // TODO: should collect this error
        console.dir(el)
        location.href = chrome.runtime.getURL('popup/popup.html?scanHistory')
    }
}

document.title = chrome.i18n.getMessage('welcomeTitle')

console.dir(showSwalChangelog())