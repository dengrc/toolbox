const objectUrlMap = new Map();
const urlObjectMap = new Map();
export const ObjectURL = {
    create: function (object: any): string {
        if (objectUrlMap.has(object)) {
            return objectUrlMap.get(object)
        }
        const url = URL.createObjectURL(object);
        objectUrlMap.set(object, url)
        urlObjectMap.set(url, object)
        return url
    },
    revoke: function (url: string) {
        URL.revokeObjectURL(url);
        if (!urlObjectMap.has(url)) {
            return
        }
        objectUrlMap.delete(urlObjectMap.get(url))
        urlObjectMap.delete(url)
    },
    revokeAll: function () {
        for (let url of urlObjectMap.keys()) {
            URL.revokeObjectURL(url)
        }
        urlObjectMap.clear();
        objectUrlMap.clear()
    }
}