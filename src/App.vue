<template>
  <main id="app">
    <router-view />
    <audio :src="audioUrl" style="" id="audio" controls></audio>
  </main>
</template>

<script>
export default {
  name: "App",
  computed: {
    audioUrl() {
      return this.$store.state.ac.songInfo.url
    }
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
  width: 100%;
  audio {
    position: fixed;
    z-index: 999999;
  }
}
</style>
