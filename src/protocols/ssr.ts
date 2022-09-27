import { IJson, Iprotocol } from "./interfaces"

class ssr implements Iprotocol {
    decode(protocol: string): IJson {
        let [value, params_base64] = protocol
            .replace("ssr://", "")
            .split("_")
            .map(atob);
        if (!params_base64) {
            [value, params_base64] = value.split("/?");
        }
        const [
            server,
            port,
            portocol,
            method,
            obfs,
            password_base64
        ] = value.split(":");
        const password = atob(password_base64);
        const result: IJson = {};
        params_base64.split('&').forEach((param) => {
            const [name, value] = param.split('=')
            result[name] = decodeURIComponent(escape(atob(value)))
        })
        return Object.assign(result, {
            server,
            port,
            portocol,
            method,
            obfs,
            password
        });
    }
    encode(config: IJson): string {
        const server = `${config.server}:${config.port}:${config.portocol}:${config.method}:${config.obfs}:${btoa(config.password)}:`;
        ['server', 'port', 'portocol', 'method', 'obfs', 'password'].forEach((name) => {
            Reflect.deleteProperty(config, name)
        })
        const params = Object.entries(config).map(([name, value]) => {
            return `${name}=${btoa(unescape(encodeURIComponent(value)))}`
        }).join('&')
        return `ssr://${btoa(`${server}/?${params}`)}`
    }
}

export default new ssr()