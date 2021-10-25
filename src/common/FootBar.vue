<template>
  <van-tabbar v-model="activeIndex">
    <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    <!--     <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
    <van-tabbar-item icon="setting-o">标签</van-tabbar-item> -->
  </van-tabbar>
</template>

<script>
export default {
  name: "FootBar",
  prop: {
    activeIndex: Number,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.van-tabbar {
  height: 7vh;
  padding-top: 2.5vh;
  background-color: var(--footbarBgc);
  &:after {
    border-width: 0;
  }
  &-item {
    font-size: 11px;
    &--active {
      color: #f04b22;
      background-color: var(--footbarBgc);
    }
  }
}
</style>