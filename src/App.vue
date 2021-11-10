<template>
  <div id="app">
    <router-view />
    <audio
      :src="audioUrl"
      style="display:none"
      id="audio"
      controls
      @ended="autoNext"
      @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
import { throttle } from "assets/js/util.js";

export default {
  name: "App",
  data() {
    return {
      throttle,
    };
  },
  computed: {
    audioUrl() {
      return this.$store.state.ac.songInfo.url;
    },
  },
  methods: {
    autoNext() {
      this.$store.dispatch("nextSong");
    },
    timeUpdate(e) {
      const audio = document.getElementById('audio');
      this.$store.commit("timeUpdate", Math.round(audio.currentTime));
    },
  },
  created() {
    // 恢复上次的信息
    this.$store.dispatch("recover_lastStatus");
  },
  // 销毁之前将本次信息储存到本地以下次恢复
  /*   beforeDestroy() {
    localStorage.setItem(
      "songInfo",
      JSON.stringify(this.$store.state.ac.songInfo)
    );
    localStorage.setItem(
      "playingList",
      JSON.stringify(this.$store.state.pl.playingList)
    );
  }, */
};
</script>

<style lang='scss'>
#app {
  height: 100%;
  padding: var(--topBarHeight) 16px 0 16px;
  background: var(--themeBgc);

  audio {
    position: fixed;
    z-index: 999999;
  }
}
</style>
