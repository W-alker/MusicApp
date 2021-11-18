<template>
  <section class="Top Topbar">
    <i class="icon icon-caidan" @click="isShowMenu = true"></i>

    <div class="center">
      <slot name="center"></slot>
    </div>

    <div class="right">
      <slot name="right"></slot>
    </div>

    <van-popup
      v-model="isShowMenu"
      position="left"
      get-container="#app"
      overlay-class="asidemenu-overylay"
    >
      <aside-menu></aside-menu>
    </van-popup>
  </section>
</template>

<script>
import AsideMenu from "./AsideMenu.vue";
// document.querySelector('.asidemenu-overylay').addEventListener('click')

export default {
  components: { AsideMenu },
  name: "Top",
  computed: {},
  data() {
    return {
      isShowMenu: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.Topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1060;
  padding: 12px 16px 12px 16px;
  background-color: var(--themeBgc);

  display: flex;
  // justify-content: space-between;
  align-items: center;
  height: var(--topBarHeight);

  .van-icon,
  .icon {
    display: inline-block;
    height: 0.24rem;
    width: 0.24rem;
    font-size: 0.22rem;
    line-height: 0.24rem;
  }
  .center {
    flex-grow: 1;
    margin: 0 10px;
  }
  .right {
    height: 0.24rem;
    width: 0.24rem;
  }
}
.van-popup {
  height: 100%;
}
</style>