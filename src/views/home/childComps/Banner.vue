<template>
  <section>
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
      :height="130"
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
  margin: 20px 0;
  width: 100%;
  height: 120px;
}
.van-swipe {
  border-radius: 10px;
  .van-swipe-item {
    background-color: rgb(89, 67, 67);
    background-size: contain;
    position: relative;
    .typeTitle {
      position: absolute;
      bottom: 0;
      right: 0;
      display: inline-block;
      padding: 0 10px;
      height: 20px;
      line-height: 20px;
      background-color: #fff;
      border-top-left-radius: 6px;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>