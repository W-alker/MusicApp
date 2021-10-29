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
      <div class="track" @click="change_playingCourse($event)">
        <div
          class="pivot"
          :style="{
            width:
              Math.min(curTimePercentage + panMove_curTimePercentage, 1) * 100 +
              '%',
          }"
        >
          <div class="point"></div>
        </div>
      </div>

      <p class="timeShow">
        <span>{{ time_MS }}</span
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
import { secondsToMS, getStyle, throttle } from "assets/js/util";
import "hammerjs";

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

    duration() {
      return this.$store.state.ac.duration;
    },
    curTime() {
      return this.$store.state.ac.currentTime;
    },
    curTimePercentage() {
      return this.curTime / this.duration;
    },
    duration_MS() {
      return secondsToMS(this.$store.state.ac.duration);
    },
    time_MS() {
      let sum = this.$store.state.ac.currentTime + this.panMove_curTime;
      sum < 0 ? (sum = 0) : sum;
      sum > this.duration ? (sum = this.duration) : sum;
      return secondsToMS(sum);
    },
    panMove_curTime() {
      let res = this.panMove_curTimePercentage * this.duration;
      return res;
    },
    // 拖拽进度条变化的额外进度
    panMove_curTimePercentage() {
      // 防止越界
      return this.panMoveX / this.trackWidth;
    },
  },
  data() {
    return {
      isShowPL: false,
      panMoveX: 0, // 进度条移动过程中，上一次的偏移量
      trackWidth: 0,
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
    change_playingCourse($event) {
      const click_clientX = $event.x; // 点击相对于屏幕的位置
      // 获取点击的当前进度
      const clientWidth =
        document.documentElement.clientWidth || document.body.clientWidth; // 屏幕宽
      const clickX = click_clientX - (clientWidth - this.trackWidth) / 2; // 计算获得在轨道上点击的位置
      const percentage = clickX / this.trackWidth; // 点击位置相对于轨道长度的百分比
      this.playingCourseToCurTime(percentage);
    },
    playingCourseToCurTime(percentage) {
      //将当前播放的百分比转化为对应时间节点并更改播放位置
      this.$store.commit("change_playingCourse", percentage * this.duration);
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

    CHANGE() {
      const audio = document.getElementById("audio");
      this.init_lyric();
      this.panMoveX = 0;
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
  mounted() {
    this.trackWidth = parseInt(
      getStyle(document.querySelector(".track"), "width")
    );

    // 给进度条添加拖拽事件
    const progress_point = document.querySelector(".progress .point");
    const progress_move = new Hammer(progress_point);
    progress_move.on("panmove", (ev) => {
      // 记录当前偏移量,同时会影响进度条，但是不触发变化事件
      // if (ev.isFinal) this.panMoveX = 0;
      this.panMoveX = ev.deltaX;
    });
    progress_move.on("panend", (ev) => {
      // 触发时间进度改变事件，传入需要改变的百分比
      let changePercentage =
        this.curTimePercentage + this.panMove_curTimePercentage;
      // 防止越界
      changePercentage < 0 ? (changePercentage = 0.0001) : changePercentage;
      changePercentage > 1 ? (changePercentage = 0.9999) : changePercentage;
      this.playingCourseToCurTime(changePercentage);
      this.panMoveX = 0;
    });
  },
};
</script>

<style scoped lang='scss'>
.player-ui {
  width: 100%;
  height: 100%;
  padding: 32px;
  z-index: 9999;
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
    $track-h: 4;
    .track {
      height: #{$track-h}px;
      background-color: #fff;
      position: relative;
      border-radius: 6px;
      .pivot {
        position: absolute;
        height: 100%;
        background-color: rgb(99, 65, 65);
        border-radius: 6px;
        .point {
          position: absolute;
          right: 0;
          top: -3px;
          width: #{$track-h + 6}px;
          height: #{$track-h + 6}px;
          border-radius: 50%;
          background-color: saddlebrown;
          transform: translateX(50%);
        }
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