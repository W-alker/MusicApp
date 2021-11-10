<template>
  <div class="ctrlBtns">
    <div class="ctrlBtns-container row">
      <i :class="['icon', playMode_icon]" @click="change_playMode"></i>
      <i class="icon icon-shangyishou" @click="prevSong"></i>
      <i
        :class="[
          'icon',
          { 'icon-zanting': !isPause },
          { 'icon-play': isPause },
          'pauseBtn',
        ]"
        @click="pauseCtrl"
      ></i>
      <i class="icon icon-xiayishou" @click="nextSong"></i>
      <i class="icon icon-bofangliebiao" @click="showPL"></i>
    </div>

    <van-popup
      v-model="isShowPL"
      position="bottom"
      overlay
      get-container="#app"
      duration=".15"
    >
      <playing-list-card></playing-list-card>
    </van-popup>
  </div>
</template>

<script>
import PlayingListCard from "common/PlayingListCard";

export default {
  name: "CtrlBtns",
  components: {
    PlayingListCard,
  },
  computed: {
    // 播放控制
    playMode() {
      return this.$store.state.pl.playMode;
    },
    playMode_icon() {
      switch (this.playMode) {
        case 0:
          return "icon-shunxubofang";
        case 1:
          return "icon-suijibofang";
        case 2:
          return "icon-danquxunhuan";
      }
    },
    isPause() {
      return this.$store.state.ac.isPause;
    },
  },
  data() {
    return {
      isShowPL: false,
    };
  },
  methods: {
    pauseCtrl() {
      this.$store.commit("playOrPause");
    },
    nextSong() {
      this.$store.dispatch("nextSong");
    },
    prevSong() {
      this.$store.dispatch("prevSong");
    },
    showPL() {
      this.isShowPL = true;
    },

    change_playMode() {
      this.$store.commit("change_playMode");
    },
  },
};
</script>

<style scoped lang='scss'>
.ctrlBtns-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15%;
    height: 80%;
    font-size: 24px;
    cursor: pointer;
  }
  .pauseBtn {
    width: 80px;
    height: 80px;
    // background: #ef019f;
    font-size: 80px;
    line-height: 80px;
    color: #ff2313;
  }
}
</style>