<template>
  <section class="player-ui">
    <div class="row top">
      <!-- <i class="icon icon-zuojiantou"></i> -->
      <!--       <div class="name">
        <h4 class="songName textover-eclipse">{{ songName }}</h4>
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div> -->
    </div>

    <div class="center">
      <div class="cover">
        <img :src="coverUrl" alt="" />
      </div>
    </div>

    <div class="row info">
      <div class="name">
        <h4 class="songName textover-eclipsis-2">{{ songName }}</h4>
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div>
    </div>

    <div class="row actions">
      <i class="icon icon-xiazai1"></i>
      <i class="icon icon-xihuan-tianjia"></i>
      <i class="icon icon-renwuzhongxin-huodepinglun"></i>
      <i class="icon icon-icon"></i>
    </div>

    <div class="progress">
      <!-- <van-progress :percentage="50" /> -->
      <div class="track">
        <div class="pivot" :style="{ left: playingCourse }"></div>
      </div>

      <p class="timeShow">
        <span>{{ time }}</span
        ><span>{{ duration_MS }}</span>
      </p>
    </div>

    <div class="ctrlBtns row">
      <i class="icon icon-shunxubofang"></i>
      <i class="icon icon-next" @click="prevSong"></i>
      <i
        :class="[
          'icon',
          { 'icon-zantingtingzhi': !isPause },
          { 'icon-bofang1': isPause },
          'pauseBtn',
        ]"
        @click="pauseCtrl"
      ></i>
      <i class="icon icon-next" @click="nextSong"></i>
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
  </section>
</template>

<script>
import PlayingListCard from "common/PlayingListCard";
import { getSongLyric, Lyric, Mlog } from "network/song";

export default {
  name: "PlayerUi",
  components: {
    PlayingListCard,
  },
  computed: {
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
    playingCourse() {
      return "-" + (100 - (this.time / this.duration) * 100) + "%";
    },
    duration_MS() {
      return this.$store.state.ac.duration / 60;
    },
  },
  data() {
    return {
      isShowPL: false,
      duration: 0,
      time: 0,
      interval: setInterval(() => {
        this.time++;
      }, 1000),
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
    },
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

    change() {
      const audio = document.getElementById("audio");
      this.init_lyric();

      this.duration = audio.duration;
      this.time = 0;
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.time++;
      }, 1000);
    },
  },
  mounted() {},
  watch: {
    sid() {

      this.change();
    },
  },
  created() {
    // this.init_mlog();
    this.change();
  },
};
</script>

<style scoped lang='scss'>
.player-ui {
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: var(--commonPageBgc);
  color: #f1f0ed;
  padding: 2em;
  display: flex;
  flex-direction: column;
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
      width: 30%;
      height: 100%;
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
  .info {
    height: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .songName {
      font-size: 18px;
    }
    .arName {
      margin-top: 1vh;
      font-size: 14px;
      opacity: 0.6;
    }
  }
  .actions {
    height: 7%;
    .icon {
      display: inline-block;
      font-size: 20px;
    }
  }
  .progress {
    height: 9%;
    .track {
      height: 10px;
      background-color: #fff;
      position: relative;
      overflow: hidden;
      .pivot {
        position: absolute;
        left: -100%;
        width: 100%;
        height: 100%;
        background-color: rgb(99, 65, 65);
        // animation: rate linear 20s;
      }
    }
    .timeShow {
      display: flex;
      justify-content: space-between;
    }
  }
  .ctrlBtns {
    height: 10%;
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
      width: 69px;
      height: 69px;
      background: #ef019f;
      border-radius: 50%;
    }
  }
}
</style>