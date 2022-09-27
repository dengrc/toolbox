<template>
  <div>Internet
    <textarea v-model="subscribeText" @change="onChangeSubscribeText"></textarea>
    <div class="protocol-config">{{subscribeTextDecode}}</div>
    <textarea v-model="protocolText" @change="onChangeProtocolText"></textarea>
    <div class="protocol-config">{{protocolTextDecode}}</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ss from "@/protocols/ss";
import ssr from "@/protocols/ssr";
import v2ray from "@/protocols/v2ray";
const splitReg = /(vmess|ssr|ss):\/\//;
const protocols = new Set(["vmess", "ssr", "ss"]);
//ss://ss://method:password@server:port#remark
//ssr://server:port:protocol:method:obfs:password_base64/?params_base64
//params_base64 -> obfsparam=obfsparam_base64&protoparam=protoparam_base64&remarks=remarks_base64&group=group_base64
@Component
export default class Internet extends Vue {
  subscribeText = "";
  protocolText = "";
  subscribeTextDecode = "";
  protocolTextDecode = "";
  onChangeSubscribeText() {
    debugger;
    this.subscribeTextDecode = this.deSubscribe(this.subscribeText).join("\n");
  }
  onChangeProtocolText() {
    this.protocolTextDecode = JSON.stringify(this.deProtocol(this.protocolText));
  }
  deSubscribe(content: string) {
    const ary = atob(content)
      .split(splitReg)
      .filter(s => {
        return s.trim();
      });
    const result = [];
    let i = 0;
    while (i < ary.length) {
      if (protocols.has(ary[i])) {
        result.push(`${ary[i]}://${ary[i + 1]}`);
        i += 2;
      } else {
        i++;
      }
    }
    return result;
  }
  enSubscribe(ary: Array<string>) {}
  deProtocol(protocol: string) {
    if (protocol.startsWith("vmess://")) {
      return v2ray.decode(protocol);
    } else if (protocol.startsWith("ss://")) {
      return ss.decode(protocol);
    } else if (protocol.startsWith("ssr://")) {
      return ssr.decode(protocol);
    }
    return null;
  }
  enProtocol(protocol: any, value: string) {
    if (protocol === "vmess") {
      return v2ray.encode(protocol);
    } else if (protocol === "ss") {
      return ss.encode(protocol);
    } else if (protocol === "ssr") {
      return ssr.encode(protocol);
    }
    return "";
  }
}
</script>
<style>
.protocol-config {
  font-size: 12px;
  max-height: 220px;
  overflow: auto;
}
</style>