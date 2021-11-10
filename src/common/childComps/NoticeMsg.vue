<template>
  <div class="notice-msg hideScroll">
      <div class="top"></div>
      <div class="container">
          <ul>
              <li></li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: "NoticeMsg",
  props:{
      msgs:Array
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.notice-msg {
    width: 100vw;
    height: 100vh;
    background-color: var(--themeBgc);
}
</style>