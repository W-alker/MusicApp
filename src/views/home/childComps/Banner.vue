<template>
  <section>
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item
        v-for="(item, index) in banners"
        :key="index"
        :style="{ 'background-image': 'url(' + item.pic + ')' }"
        @click="playSong(item.song)"
      >
        <span
          class="typeTitle"
          v-text="item.typeTitle"
          :style="{ 'background-color': item.titleColor }"
        ></span>
      </van-swipe-item>
    </van-swipe>
  </section>
</template>

<script>
export default {
  name: "Banner",
  props: {
    banners: Array,
  },
  data() {
    return {};
  },
  methods: {
    playSong(song) {
      this.$emit("banner_playSong", song);
    },
  },
};
</script>

<style scoped lang='scss'>
section {
  margin: 0.2rem 0;
  width: 100%;
  height: 16.5vh;
}
.van-swipe {
  border-radius: 0.1rem;
  height: 100%;
  .van-swipe-item {
    background-color: rgb(89, 67, 67);
    background-size: 100% 100%;
    position: relative;
    background-repeat: no-repeat;
    .typeTitle {
      position: absolute;
      bottom: 0;
      right: 0;
      display: inline-block;
      padding: 0 0.1rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background-color: #fff;
      border-top-left-radius: 0.06rem;
      color: #fff;
      font-size: 0.12rem;
    }
  }
}
</style>