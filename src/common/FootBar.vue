<template>
  <div class="footbar">
    <van-tabbar v-model="index">
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "FootBar",
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {},
  data() {
    return {
      index: this.activeIndex,
    };
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.footbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--footbarHeight);
  padding-top: 0.05rem;
  background-color: var(--footbarBgc);
}
.van-tabbar {
  z-index: 1060;
  background-color: var(--footbarBgc);

  color: var(--silveryWhite);
  &:after {
    border-width: 0;
  }
  &-item {
    font-size: 0.11rem;
    color: var(--silveryWhite);

    &--active {
      color: #f04b22;
      background-color: var(--footbarBgc);
    }
  }
}
</style>