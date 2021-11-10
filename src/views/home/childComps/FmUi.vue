<template>
  <div class="fm-ui">
    <div class="top">
      <h3>私人FM</h3>
      <i class="icon icon-gengduo"></i>
    </div>
    <div class="center flex-center">
      <div class="cover">
        <img :src="coverUrl" alt="" />
      </div>
      <h4 class="textover-eclipse songName">{{ songName }}</h4>
      <h5 class="textover-eclipse arName">{{ arName }}</h5>
    </div>

    <player-ui-progress></player-ui-progress>

    <div class="ctrlBtns">
        <ctrl-btns></ctrl-btns>
    </div>
  </div>
</template>

<script>
import PlayerUiProgress from "common/childComps/PlayerUiProgress";
import CtrlBtns from "common/childComps/CtrlBtns.vue";


export default {
  name: "FmUi",
  components: {
    PlayerUiProgress,
    CtrlBtns
  },
  computed: {
    // 信息相关
    sid() {
      return this.$store.state.ac.songInfo.id;
    },
    songName() {
      return this.$store.state.ac.songInfo.al.name;
    },
    arName() {
      return this.$store.state.ac.songInfo.arName;
    },
    isPause() {
      return this.$store.state.ac.isPause;
    },
    coverUrl() {
      return this.$store.state.ac.songInfo.al.picUrl;
    },
    audioUrl() {
      return this.$store.state.ac.songInfo.url;
    },
    isLikeSong() {
      return this.$store.state.ua.likeList.has(this.sid);
    },

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
  },
  data() {
    return {
      isShowPL: false,
      isShowLyric: true,
      nolyric: false,
      lyric_withTime: [],
      tlyric_withTime: [],
    };
  },
  watch: {
    sid() {
      this.CHANGE();
    },
  },
  methods: {
    async init_lyric() {
      const res = await Lyric.get(this.sid);
      console.log(res);
      if (res.lrc) {
        this.nolyric = false;
        this.lyric_withTime = res.lrc.lyric.split("\n");
      } else {
        this.nolyric = true;
      }

      if (res.tlyric) {
        this.nolyric = false;
        this.tlyric_withTime = res.tlyric.lyric.split("\n");
      } else this.tlyric_withTime = [];
    },

    CHANGE() {
      this.init_lyric();
      this.panMoveX = 0;
      this.activeLyricIndex = 0;
    },
  },
  created() {
    // this.init_mlog();
    this.CHANGE();
  },
};
</script>

<style scoped lang='scss'>
.fm-ui {
  width: 100%;
  height: 100%;
  background-color: var(--themeBgc);
  padding: 25px;
  padding-top: 10px;
  color: var(--silveryWhite);

  .top {
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      flex-grow: 1;
      text-align: center;
    }
    i {
      display: inline-block;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
    }
  }
  .center {
    margin-top: 80px;
    margin-bottom: 100px;
    flex-direction: column;
    .cover {
      img {
        width: 325px;
        height: 325px;
        border-radius: 8px;
      }
    }
    .songName {
      margin-top: 26px;
      font-size: 18px;
    }
    .arName {
      margin-top: 10px;
    }
  }
}
</style>