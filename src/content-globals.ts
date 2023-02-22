export {}

declare global {
    var api: number;
    var settings: any
    var local: any
    var curIps: any[]
}

globalThis.api = 1
globalThis.settings = {}
globalThis.local = {ips: ["-"]}
globalThis.curIps = []