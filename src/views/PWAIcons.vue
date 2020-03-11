<template>
  <v-card>
    <v-app-bar app elevate-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title>PWA 图标生成</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-file-input hide-details accept="image/*" label="File input" @change="onFileChange"></v-file-input>
      <v-btn icon :disabled="!this.hasFile" @click="uploadIcon">
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>
      <v-btn icon color="primary" :disabled="!this.hasFile" @click="downloadIcons">
        <v-icon>mdi-download-multiple</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <p>
        图标方案
      </p>
      <v-btn-toggle v-model="iconScheme" mandatory>
        <v-btn>
          Vue
        </v-btn>
        <v-btn>
          自定义
        </v-btn>
      </v-btn-toggle>
      <ol>
        <li v-for="item in imageList" :key="item.src">
          <div>{{item.src}}</div>
          <a :href="item.url" :download="item.src">
            <img width="100" :src="item.url" />
          </a>
        </li>
      </ol>
    </v-content>
  </v-card>
</template>
<script lang="ts">
// fetch("https://apis.leping.fun/gen-image/?size=" + a, {
//                                 method: "POST",
//                                 body: t
//                             }).then((function(e) {
//                                 return e.clone().blob()
//                             }
//                             )).then((function(a) {
//                                 var t = URL.createObjectURL(a)
//                                   , i = e.state.downList;
//                                 i[n].loading = !1,
//                                 i[n].url = t,
//                                 e.setState({
//                                     downList: i
//                                 })
//                             }
//                             ))

import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { VUEIcons } from "@/data";
import { ObjectURL } from "@/utils";

@Component
export default class PWAIconsClass extends Vue {
  iconScheme: number = 1;
  file: File | any = null;
  imageList: Array<any> = [];
  get hasFile() {
    return !!this.file;
  }

  onFileChange(e: File) {
    //const input = e.target as HTMLInputElement;
    this.file = e;
    //input.value = "";
  }

  uploadIcon() {
    interface IResponseImage {
      size: string;
      response: Response;
    }
    const iconSizeMap = new Map();
    const fetchArray: any = [];
    var img: any = this.file;
    const formData = new FormData();
    formData.append("img", img);
    VUEIcons.forEach(item => {
      const itemSizeType = item.size + item.type;
      if (iconSizeMap.has(itemSizeType)) {
        iconSizeMap.get(itemSizeType).push(item);
        return;
      }
      const param: any = {
        method: "POST",
        data: formData
      };
      iconSizeMap.set(itemSizeType, [item]);
      fetchArray.push(
        fetch(
          `https://apis.leping.fun/gen-image/?type=${item.type
            .split("/")
            .pop()}&size=${item.size}`,
          param
        ).then((e: Response) => {
          return { size: itemSizeType, response: e.blob() };
        })
      );
    });
    Promise.all(fetchArray).then(e => {
      const array: any = [];
      (e as Array<{
        size: string;
        response: Response;
      }>).forEach(({ size, response }) => {
        const items = iconSizeMap.get(size);
        const url = ObjectURL.create(response);
        items.forEach((item: any) => {
          item.url = url;
          array.push(item);
        });
      });
      this.imageList = array;
    });
  }

  downloadIcons() {}

  deactivated() {
    ObjectURL.revokeAll();
  }

  beforeDestroy() {
    ObjectURL.revokeAll();
  }
}
</script>