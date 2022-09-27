type IJson={[index:string]:string}

interface Iprotocol{
    decode(protocol:string):IJson
    encode(config:IJson):string
}

export {
    IJson,
    Iprotocol
}