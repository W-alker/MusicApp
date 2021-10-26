<template>
  <section class="playlist-detail">
    <h2>歌单</h2>
  </section>
</template>

<script>
export default {
  name: "PlaylistDetail",
  props: {
    list: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>

<style scoped lang='scss'>
.playlist-detail {
  width: 100vw;
  height: 100vh;
  background-color: var(--commonPageBgc);
  padding: 16px;
}
</style>