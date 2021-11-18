<template>
  <div
    class="foot-playbar"
    id="foot-playbar"
    :style="[
      { bottom: isSlideDown ? '0' : 'var(--footbarHeight)' },
      { zIndex: isSlideDown ? '3060' : '1070' },
      { display: isShowPI ? 'none' : 'block' },
      { opacity: isHideFootPlayBar ? '0' : '1' },
    ]"
  >
    <div class="foot-playbar--fixed" @click="showPI($event)">
      <div class="cover-thumb">
        <img :src="songPicUrl" alt="" />
      </div>
      <p class="songInfo textover-eclipse">
        <span>{{ songName }}</span> - {{ arName }}
      </p>
      <div class="ctrlBtns">
        <div class="playBtn btn" @click.stop="playCtrl">
          <van-icon :name="!isPause ? 'pause-circle-o' : 'play-circle-o'" />
        </div>
        <div class="playinglistBtn btn" @click.stop="showPL">
          <i class="icon icon-bofangliebiao"></i>
        </div>
      </div>

      <van-popup
        v-model="isShowPI"
        position="bottom"
        closeable
        close-icon-position="top-left"
        close-icon=" icon icon-xiajiantou"
        :overlay="false"
        get-container="#app"
        style="width: 100%; height: 100%"
      >
        <player-ui :key="compUpdateTimer" @updateComp="updateComp"></player-ui>
      </van-popup>

      <van-popup
        v-model="isShowPL"
        position="bottom"
        overlay
        duration=".15"
        @click.stop="0"
      >
        <playing-list-card style="z-index: 3080"></playing-list-card>
      </van-popup>
    </div>
  </div>
</template>

<script>
import PlayerUi from "common/PlayerUi";
import PlayingListCard from "common/PlayingListCard";
import { mapState } from "vuex";

export default {
  name: "FootPlaybar",
  props: {
    isSlideDown: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PlayerUi,
    PlayingListCard,
  },
  data() {
    return {
      isShowPI: false,
      isShowPL: false,
      compUpdateTimer: 0,
    };
  },
  computed: {
    ...mapState({
      isHideFootPlayBar: (state) => state.ui.isHideFootPlayBar,
      songPicUrl: (state) => state.ac.songInfo.al.picUrl,
      songName: (state) => state.ac.songInfo.name,
      arName: (state) => state.ac.songInfo.arName,
      isPause: (state) => state.ac.isPause,
    }),
  },
  methods: {
    updateComp(num) {
      this.compUpdateTimer =num;
    },
    playCtrl() {
      this.$store.commit("playOrPause");
    },
    showPI(e) {
      if (e.target.classList[0] !== "van-overlay")
        //防止点击播放列表卡片弹出层遮罩触发事件，弹出层本身已做防冒泡处理
        this.isShowPI = true;
    },
    showPL(e) {
      this.isShowPL = true;
    },
  },
};
</script>

<style scoped lang='scss'>
.foot-playbar {
  position: fixed;
  height: 0.48rem;
  left: 0;
  bottom: var(--footbarHeight);
  width: 100%;
  background-color: var(--footbarBgc);
  color: var(--silveryWhite);

  z-index: 1070;
  transition: all ease 0.3s;
}
.foot-playbar--fixed {
  position: relative;
  background-color: var(--footplaybarBgc);
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
    width: 50%;
    max-width: 50%;
    margin-left: 0.1rem;
    font-size: 0.1rem;
    line-height: 0.13rem;

    span {
      font-size: 0.13rem;
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

.van-popup {
  background-color: transparent;
}
.van-popup__close-icon--top-left {
  left: 20px !important;
}
.van-popup--bottom {
  width: unset;
}
</style>