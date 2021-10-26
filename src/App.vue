<template>
  <main id="app">
    <router-view />
    <audio src="" style="" id="audio" controls></audio>
  </main>
</template>

<script>
export default {
  name: "App",
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
