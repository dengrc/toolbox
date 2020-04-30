<template>
  <v-card>
    <v-app-bar app elevate-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title>PWA 图标生成</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field type="number" label="宽" v-model="width" suffix="px" @change="onSizeChanged"></v-text-field>
      <v-text-field type="number" label="高" v-model="height" suffix="px" @change="onSizeChanged"></v-text-field>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-textarea outlined name="options" label="options" v-model="options" @change="onOptionsChanged"></v-textarea>
          </v-col>
          <v-col>
            <div ref="chart" :style="{width:width+'px',height:height+'px'}"></div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// import { Prop, Watch } from "vue-property-decorator";
// import { VUEIcons } from "@/data";
// import { ObjectURL, download } from "@/utils";

import echarts, { ECharts } from "echarts";

@Component
export default class EChartSVGView extends Vue {
  width: number = 200;
  height: number = 200;
  options: string = "";
  echart!: ECharts;
  mounted() {
    this.initChart();
  }

  initChart() {
    this.echart?.dispose();
    this.echart = echarts.init(this.$refs.chart as HTMLDivElement, "", {
      renderer: "svg"
    })
  }

  onSizeChanged() {
    this.echart.resize();
  }

  onOptionsChanged() {
    var options;
    try {
      options = new Function(`return ${this.options}`)();
    } catch (error) {
      console.error(error);
    }
    this.initChart();
    //this.echart.clear();
    this.echart.setOption(options as any);
  }
}
</script>