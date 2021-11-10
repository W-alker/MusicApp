<template>
  <section class="player-ui">
    <div class="row top">
      <div class="name">
        <van-notice-bar scrollable :text="songName" class="songName" />
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div>
    </div>

    <main class="container">
      <div class="main part" :class="{ active: !isShowLyric }">
        <div class="center">
          <div class="cover" @click="isShowLyric = true">
            <img :src="coverUrl" alt="" />
          </div>
        </div>

        <div class="row info"></div>

        <div class="row actions">
          <a :href="audioUrl" :download="songName">
            <i class="icon icon-xiazai1"></i>
          </a>
          <i
            :class="[
              'icon',
              { 'icon-xihuan-tianjia': !isLikeSong },
              { 'icon-xihuan-xuanzhong': isLikeSong },
            ]"
            @click="likeSong"
          ></i>
          <i class="icon icon-renwuzhongxin-huodepinglun"></i>
          <i class="icon icon-icon"></i>
        </div>

        <player-ui-progress></player-ui-progress>

        <ctrl-btns></ctrl-btns>
      </div>

      <div
        class="lyric part"
        :class="{ active: isShowLyric }"
        @click="isShowLyric = false"
      >
        <player-ui-lyric
          :lyric_withTime="lyric_withTime"
          :tlyric_withTime="tlyric_withTime"
          :nolyric="false"
          :songName="songName"
        ></player-ui-lyric>

        <div class="btns">
          <i
            :class="[
              'icon',
              { 'icon-zantingtingzhi': !isPause },
              { 'icon-bofang1': isPause },
              'pauseBtn',
            ]"
            @click="pauseCtrl"
          ></i>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import PlayerUiProgress from "common/childComps/PlayerUiProgress";
import playerUiLyric from "./childComps/playerUiLyric.vue";
import CtrlBtns from "./childComps/CtrlBtns.vue";
import { getSongLyric, Lyric, Mlog } from "network/song";
import { getStyle } from "assets/js/util";

export default {
  name: "PlayerUi",
  components: {
    PlayerUiProgress,
    playerUiLyric,
    CtrlBtns,
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
  methods: {
    async init_mlog() {
      const mlogs = await Mlog.get(this.sid);
      const url = await Mlog.getUrl(mlogs.data.feeds[0].id);
      console.log(url);
    },
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
    pauseCtrl() {
      this.$store.commit("playOrPause");
    },

    likeSong() {
      this.$store.dispatch("likeSong", this.sid);
    },

    change_playMode() {
      this.$store.commit("change_playMode");
    },
    CHANGE() {
      this.init_lyric();
      this.panMoveX = 0;
      this.activeLyricIndex = 0;
    },
  },
  mounted() {},
  watch: {
    sid() {
      this.CHANGE();
    },
  },
  created() {
    // this.init_mlog();
    this.CHANGE();
  },
};
</script>

<style scoped lang='scss'>
.icon-xihuan-xuanzhong {
  color: red;
}
.player-ui {
  width: 100%;
  height: 100%;
  padding: 32px;
  background: var(--commonPageBgc);
  color: #f1f0ed;
  display: flex;
  flex-direction: column;

  main {
    position: relative;
    height: 100%;
    .part {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      transition: all 0.3s ease;

      opacity: 0;
      // display: none;
      &.main {
        z-index: 90;
      }
      &.lyric {
        z-index: 80;
        .lyric-container {
          margin-top: 10%;
          height: 80%;
          transition: all linear 0.3s;
        }
        .btns {
          height: 10%;
          margin-top: 10%;
        }
      }
      &.active {
        // display: block;
        opacity: 1;
        z-index: 110;
      }
    }
  }

  .row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .top {
    height: 6%;
    justify-content: center;
    .name {
      text-align: center;
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .songName {
        width: 100%;
        height: 50%;
        background-color: unset;
        padding: 0;
        color: var(--white);
        font-size: 16px;
        transition: all ease 8s;
      }
      .arName {
        font-size: 13px;
        opacity: 0.6;
      }
    }
  }
  .center {
    height: 55%;
    display: flex;
    justify-content: center;
    align-items: center;
    .cover {
      width: calc(100vw - 4em);
      height: calc(100vw - 4em);
      border-radius: 16px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .actions {
    height: 7%;
    .icon {
      display: inline-block;
      font-size: 20px;
    }
  }

  .player-ui-progress {
    height: 9%;
  }
}
</style>