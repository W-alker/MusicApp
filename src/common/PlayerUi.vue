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
  width: 100%;
  height: 100%;
  padding: 16px 24px;
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
    height: 40px;
    justify-content: center;
    align-items: center;
    h3 {
      flex-grow: 1;
      text-align: center;
      margin: 0 16px;
      margin-left: 40px;
      line-height: 30px;
    }
    i {
      display: inline-block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
    .name {
      flex-grow: 1;
      text-align: center;
      margin: 0 16px;
      margin-left: 40px;
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
        text-align: center;
      }
      .arName {
        font-size: 13px;
        opacity: 0.6;
      }
    }
  }

  main {
    height: 100%;
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
        padding: 30px 0;
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
      height: 550px;
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
          width: 327px;
          height: 327px;
          border-radius: 16px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          width: 100%;
          margin-top: 30px;
          h4,
          h5 {
            width: 100%;
            text-align: center;
          }
          h4 {
            font-size: larger;
          }
          h5 {
            margin-top: 8px;
          }
        }
      }
    }
    .bottom {
      width: 100%;
    }
  }

  .player-ui-progress {
    height: 70px;
  }
}
</style>