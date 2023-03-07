export class PlatformSettings {
    private static instanceRef: PlatformSettings;
    public settings: any = {}
    public minDefaults = {
        askForMode: true,
        minimalism: false,
        swalInfoCompleted: false
    }
    private platform: string;

    private constructor(id: string) {
        this.platform = id

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "sync" && changes[this.platform]) {
                this.settings = changes[this.platform].newValue
                console.dir('changed')
                console.dir(this.settings)
            }
        });
    }

    public get(key: string) {
        return this.settings[key]
    }

    public async set(items: { [p: string]: any }): Promise<void> {
        Object.keys(items).forEach((it) => {
            this.settings[it] = items[it]
        })
        await this.sync()
    }

    public setBack(items: { [key: string]: any }, callback: () => void): void {
        Object.keys(items).forEach((it) => {
            this.settings[it] = items[it]
        })
        this.sync()
        return callback()
    }

    public async sync() {
        await chrome.storage.sync.set({[this.platform]: this.settings})
    }

    public async setup() {
        let res = await chrome.storage.sync.get({
            [this.platform]: this.minDefaults
        })
        this.settings = res[this.platform]
        await chrome.storage.sync.set(res)
    }

    public async setDriverDefaults(settings: { [key: string]: any }) {
        console.dir(settings)
        let res = await chrome.storage.sync.get({
            [this.platform]: settings
        })
        this.settings = res[this.platform]
        await chrome.storage.sync.set(res)
    }

    static initInstance(id: string): PlatformSettings {
        if (PlatformSettings.instanceRef === undefined) {
            PlatformSettings.instanceRef = new PlatformSettings(id);
        }

        return PlatformSettings.instanceRef;
    }
}