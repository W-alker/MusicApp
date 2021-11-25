<template>
  <div class="progress player-ui-progress">
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
</template>

<script>
import { secondsToMS, getStyle, throttle } from "assets/js/util";
import "hammerjs";

export default {
  name: "PlayerUiProgress",
  computed: {
    // 进度相关
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
      panMoveX: 0, // 进度条移动过程中，上一次的偏移量
      trackWidth: 0,
    };
  },
  methods: {
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
.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  $track-h: 4;
  .track {
    width: 100%;
    height: #{$track-h}px;
    background-color: #fff;
    position: relative;
    border-radius: 0.06rem;
    .pivot {
      position: absolute;
      height: 100%;
      background-color: rgb(99, 65, 65);
      border-radius: 0.06rem;
      .point {
        position: absolute;
        right: 0;
        top: -0.03rem;
        width: #{$track-h + 6}px;
        height: #{$track-h + 6}px;
        border-radius: 50%;
        background-color: saddlebrown;
        transform: translateX(50%);
      }
    }
  }
  .timeShow {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    font-size: 0.12rem;
  }
}
</style>