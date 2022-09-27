import { IJson, Iprotocol } from "./interfaces"

class v2ray implements Iprotocol {
    decode(protocol: string): IJson {
        return JSON.parse(
            decodeURIComponent(escape(atob(protocol.replace("vmess://", ""))))
        )
    }
    encode(config: IJson): string {
        return `vmess://${btoa(unescape(encodeURIComponent(JSON.stringify(config))))}`
    }
}

export default new v2ray()