<template>
  <div class="ctrlBtns">
    <div class="ctrlBtns-container row" v-show="!isFMUI">
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

    <div class="ctrlBtns-container row" v-show="isFMUI">
      <i
        class="icon icon-ziyuan174"
        style="font-size: 21px"
        @click="fm_trash"
      ></i>
      <i
        :class="[
          'icon',
          { 'icon-xihuan-xianxing': !isLikeSong },
          { 'icon-xihuan1': isLikeSong },
        ]"
        @click="likeSong"
      ></i>
      <i
        :class="[
          'icon',
          { 'icon-zanting': !isPause },
          { 'icon-play': isPause },
          'pauseBtn',
        ]"
        @click="pauseCtrl"
      ></i>
      <i class="icon icon-xiayishou" @click="nextFM"></i>
      <i class="fa fa-comments-o" aria-hidden="true"></i>
    </div>

    <van-popup
      v-model="isShowPL"
      position="bottom"
      overlay
      get-container="#app"
      duration=".15"
    >
      <playing-list-card :key="compUpdateTimer"></playing-list-card>
    </van-popup>
  </div>
</template>

<script>
import PlayingListCard from "common/PlayingListCard";

import { mapState } from "vuex";

export default {
  name: "CtrlBtns",
  props: {
    isFMUI: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PlayingListCard,
  },
  computed: {
    // 播放控制
    ...mapState({
      sid: (state) => state.ac.songInfo.id,
      likeList: (state) => state.ua.likeList,
      playMode: (state) => state.pl.playMode,
      isPause: (state) => state.ac.isPause,
    }),
    playMode_icon() {
      switch (this.playMode) {
        case 0:
          return "icon-shunxubofang";
        case 1:
          return "icon-suijibofang";
        case 2:
          return "icon-danquxunhuan";
        case 3:
          return "icon-xindong";
      }
      return "icon-shunxubofang";
    },
  },
  data() {
    return {
      compUpdateTimer: 0,
      isShowPL: false,
      isLikeSong: false,
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
      this.compUpdateTimer = Date.now();
      this.isShowPL = true;
    },

    likeSong() {
      this.$store.dispatch("likeSong", this.$store.state.ac.songInfo.id);
      this.isLikeSong = this.likeList.has(this.sid);
    },

    change_playMode() {
      this.$store.dispatch("change_playMode");
      if (this.isLikePL && this.playMode === 3) {
        this.$store.dispatch("changeIntelligencePIL", {
          id: this.curSongId,
          pid: 0,
          sid: this.sid,
        });
        this.$store.dispatch("init_song", this.list[0]);
      } else if (this.isLikePL && this.playMode !== 3) {
        // 如果是新推荐的歌曲，取消心动模式的话播放列表是找不到这首歌会出问题，自动切到第一首防止报错
        if (this.curSongInfo.recommended) {
          this.$store.dispatch("init_song", this.list[0]);
        }
      }
    },

    fm_trash() {
      this.$store.dispatch("FM_TRASH");
    },
    nextFM() {
      this.$store.dispatch("NEXT_FM");
    },
  },
  updated() {
    this.isLikeSong = this.likeList.has(this.sid);
  },
  created() {},
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
    font-size: 0.24rem;
    cursor: pointer;
  }
  .pauseBtn {
    width: 0.8rem;
    height: 0.8rem;
    // background: #ef019f;
    font-size: 0.8rem;
    line-height: 0.8rem;
    color: #ff2313;
  }
  .icon-xihuan1 {
    color: var(--darkRed);
  }
}
</style>