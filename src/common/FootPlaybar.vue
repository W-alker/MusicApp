<template>
  <div class="foot-playbar--fixed">
    <div class="cover-thumb">
      <img src="" alt="" />
    </div>
    <p class="songInfo"><span>测试文本</span> - 测试文本测文本</p>
    <div class="ctrlBtns">
      <div class="playBtn btn">
        <van-icon name="pause-circle-o" />
      </div>
      <div class="playinglistBtn btn">
        <i class="icon icon-bofangliebiao"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FootPlaybar",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.foot-playbar--fixed {
  position: fixed;
  bottom: 6.5vh;
  left: 5%;
  width: 90%;
  height: 6vh;
  background-color: var(--footplaybarBgc);
  border-radius: 2vh;
  z-index: 99999;
  display: flex;
  align-items: center;
  .cover-thumb {
    width: 6vh;
    height: 6vh;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .songInfo {
    font-size: 11px;
    line-height: 14px;
    width: 50%;
    max-width: 50%;
    margin-left: 10px;
    span {
      font-size: 14px;
    }
  }

  .ctrlBtns {
    position: absolute;
    right: 0;
    display: flex;
    font-size: 4vh;
    .btn {
      margin-right: 5vw;
    }
    .playBtn {
      width: 3vh;
      line-height: 6vh;
    }
  }
}
</style>