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

export function download(filename: string, url: string) {
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 下载内容转变成blob地址
    eleLink.href = url;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}