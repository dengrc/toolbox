<template>
  <div>
    <h1>。。。</h1>
    <p>
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <router-link to="/pwa_icons">PWA 图标生成</router-link>

    </p>
    <p>
      <router-link to="/vue_props">Vue props 生成</router-link>
    </p>
    <p>
      <router-link to="/echarts_svg">ECharts SVG 生成</router-link>
    </p>
     <p>
      <router-link to="/internet">互联网</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
