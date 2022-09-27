import { IJson, Iprotocol } from "./interfaces"

class ss implements Iprotocol {
    decode(protocol: string): IJson {
        const [value, remark] = protocol.replace("ss://", "").split("#");
        const [[method, password], [server, port]] = atob(value)
            .split("@")
            .map(s => s.split(":"));
        return {
            method,
            password,
            server,
            port,
            remark: decodeURIComponent(remark)
        }
    }
    encode(config: IJson): string {
        return ['ss://', btoa(`${config.method}:${config.password}@${config.server}:${config.port}`), config.remark && `#${encodeURIComponent(config.remark)}`].join('')
    }
}

export default new ss()