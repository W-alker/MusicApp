<template>
  <section class="player-ui">
    <div class="row top" v-show="!isFM_Mode">
      <div class="name">
        <h4 v-text="songName" class="textover-eclipse"></h4>
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div>
      <i class="icon icon-gengduo"></i>
    </div>

    <div class="top" v-show="isFM_Mode">
      <h3>私人FM</h3>
      <i class="icon icon-gengduo"></i>
    </div>

    <main class="center-container">
      <div class="center">
        <!-- 主界面 -->
        <div class="main part" :class="{ active: !isShowLyric }">
          <div class="cover" @click="isShowLyric = true">
            <img :src="coverUrl" alt="" />
          </div>
          <div class="name" v-show="isFM_Mode">
            <h4 v-text="songName" class="textover-eclipse"></h4>
            <h5 v-text="arName" class="textover-eclipse"></h5>
          </div>
        </div>
        <!-- 歌词界面 -->
        <div
          class="lyric part"
          :class="{ active: isShowLyric }"
        >
          <player-ui-lyric
            :lyric_withTime="lyric_withTime"
            :tlyric_withTime="tlyric_withTime"
            :nolyric="false"
            :songName="songName"
            :key='sid'
            @showMain='isShowLyric=false'
            v-if='lyric_withTime.length'
          ></player-ui-lyric>
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <action-btns v-show="!isFM_Mode && !isShowLyric" :key='sid'></action-btns>
        <player-ui-progress></player-ui-progress>
        <ctrl-btns :isFMUI="isFM_Mode"></ctrl-btns>
      </div>
    </main>
  </section>
</template>

<script>
import PlayerUiProgress from "common/childComps/PlayerUiProgress";
import playerUiLyric from "./childComps/playerUiLyric.vue";
import ActionBtns from "./childComps/ActionBtns.vue";
import CtrlBtns from "./childComps/CtrlBtns.vue";
import { getSongLyric, Lyric, Mlog } from "network/song";
import { getStyle } from "assets/js/util";

import { mapState } from "vuex";

export default {
  name: "PlayerUi",
  components: {
    PlayerUiProgress,
    playerUiLyric,
    ActionBtns,
    CtrlBtns,
  },
  computed: {
    // 信息相关
    ...mapState({
      sid: (state) => state.ac.songInfo.id,
      songName: (state) => state.ac.songInfo.name,
      arName: (state) => state.ac.songInfo.arName,
      isPause: (state) => state.ac.isPause,
      coverUrl: (state) => state.ac.songInfo.al.picUrl,
      isFM_Mode: (state) => state.fm.isFM_Mode,
    }),
  },
  data() {
    return {
      isShowPL: false,
      isShowLyric: false,
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

    change_playMode() {
      this.$store.commit("change_playMode");
    },
    CHANGE() {},
  },
  mounted() {},
  watch: {
    sid() {
      this.$emit("updateComp", this.sid);
      this.init_lyric()
    },
  },
  created() {
    // this.init_mlog();
    this.init_lyric();
  },
};
</script>

<style scoped lang='scss'>
.icon-xihuan-xuanzhong {
  color: red;
}
.player-ui {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.16rem 0.24rem;
  background: var(--commonPageBgc);
  color: #f1f0ed;
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .top {
    display: flex;
    position: relative;
    width: 100%;
    height: 0.4rem;
    justify-content: center;
    align-items: center;
    h3 {
      flex-grow: 1;
      text-align: center;
      margin: 0 0.16rem;
      margin-left: 0.4rem;
      line-height: 0.3rem;
    }
    i {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      text-align: center;
      line-height: 0.3rem;
    }
    .name {
      flex-grow: 1;
      text-align: center;
      margin: 0 0.16rem;
      margin-left: 0.4rem;
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
        font-size: 0.16rem;
        transition: all ease 8s;
        text-align: center;
      }
      .arName {
        font-size: 0.13rem;
        opacity: 0.6;
      }
    }
  }

  main {
    height: calc(100% - 34px);
    display: flex;
    flex-direction: column;
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
        height: 100%;
        padding: 0.3rem 0;
        .lyric-container {
          height: 100%;
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
    .center {
      flex-grow: 1;
      position: relative;
      height: 5.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .main {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .cover {
          width: 3.27rem;
          height: 3.27rem;
          border-radius: 0.16rem;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          width: 100%;
          margin-top: 0.3rem;
          h4,
          h5 {
            width: 100%;
            text-align: center;
          }
          h4 {
            font-size: larger;
          }
          h5 {
            margin-top: 0.08rem;
          }
        }
      }
    }
    .bottom {
      width: 100%;
    }
  }

  .player-ui-progress {
    height: 0.7rem;
  }
}
</style>