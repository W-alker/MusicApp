<template>
  <van-row class="foot">
    <audio controls :autoplay="isAutoplay" :key="audioUrl" @ended="next">
      <source :src="audioUrl" />
    </audio>
  </van-row>
</template>

<script>
// import {getSongUrl} from 'network/home'

export default {
  name: "FootBar",
  props: {
    audioUrl: String,
    isAutoplay: Boolean,
    isPause: Boolean,
  },
  data() {
    return {
      songId: 0
    }
  },
  computed: {},
  methods: {
    //暂停和播放
    bf() {
      const audio = document.querySelector("audio");
      if (audio !== null) {
        if (this.isPause===false) audio.play();
        else audio.pause();
      }
    },
    //下一首
    next() {
      this.$emit('nextSong')
    }
  },
  watch: {
    isPause: {
      handler() {
        this.bf();
      },
    },
    audioUrl:{
      handler(){
        const audio = document.querySelector("audio");
        console.log(audio.duration)
      }
    }
  },
  updated() {
  },
};
</script>

<style lang="scss" scoped>
.foot {
  width: 100%;
  height: 100%;
  background-color: rgb(60, 60, 60);
}
</style>