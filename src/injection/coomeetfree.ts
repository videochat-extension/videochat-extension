const jsonParseHandler = {
    apply(target: any, thisArg: any, args: any) {
        try {
            window.dispatchEvent(new CustomEvent("parsed json", {detail: {json: args[0]}}));
        } catch (e) {
            console.dir("ERROR: jsonParseHandler failed");
            console.dir(e)
        }
        return Reflect.apply(target, thisArg, args)
    },
}

JSON.parse = new Proxy(
    JSON.parse,
    jsonParseHandler
)
