export function addStyle(styleString: string) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

export function tryCatch(func: any, ...args: any) {
    try {
        return func(...args)
    } catch (e) {
        console.dir(e)
    }
}

export function toObject(from: any, to: any) {
    for (let key in from) {
        let value = from[key]

        if (typeof value === 'object' && value && !Array.isArray(value)) {
            toObject(value, from[key])
            continue
        }

        if (key === "data-tooltip")
            to.setAttribute(key, value)
        else
            to[key] = value
    }
}

export function createElement(tagName: string = '', options: any = {}, childs: HTMLElement[] = []): HTMLElement {
// TODO: Fix types (options: Partial<HTMLElement> = {} failes with style) rework everything?
    const element = document.createElement(tagName)

    toObject(options, element)

    for (let child of childs)
        element.appendChild(child)

    return element
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function downloadImage(data: string): void {
    let a = document.createElement('a');
    a.href = data;

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;

    a.download = dateTime;
    document.body.appendChild(a);
    a.click();
}

export function secondsToHms(d: number): string {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var Display = h > 0 ? h + (h === 1 ? "H, " : "H, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? "H, " : "H, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? "M, " : "M, ") : "";
    var sDisplay = (m === 0 && s === 0) ? "" : (s + "S");
    return hDisplay + mDisplay + sDisplay;
}

export function isDevMode(): boolean {
    return !('update_url' in chrome.runtime.getManifest());
}

export function getUserBrowser(): string {
    let manifest = chrome.runtime.getManifest()
    if (manifest.browser_specific_settings) {
        return "firefox"
    } else {
        if (manifest.update_url) {
            if (manifest.update_url.includes('microsoft') || manifest.update_url.includes('edge')) {
                return "edge"
            } else if (manifest.update_url.includes('google')) {
                return "chrome"
            }
        } else {
            return Math.round(Math.random()) ? "edge" : "chrome"
        }
    }
    return "chrome"
}

export function getPlatformByHost(platforms: any[], host: string) {
    for (const platform of platforms) {
        for (const site of platform.sites) {
            if (site.origin.includes(host)) {
                return {site: site, platform: platform}
            }
        }
    }
}

export function extractDomain(url: string) {
    return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1");
}