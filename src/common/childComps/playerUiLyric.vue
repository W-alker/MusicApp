<template>
  <div class="lyric-container" @click="showMain">
    <div class="inner" v-show="!nolyric" ref="inner">
      <p
        v-for="(item, index) in lyric"
        :class="{
          active: isActiveLyricIndex(index),
        }"
        ref="lrc"
      >
        {{ item.lrc }} <br />
        <span>{{ item.tlrc }}</span>
      </p>
    </div>
    <div class="inner inner-empty" v-if="nolyric">
      <p>该歌曲暂无歌词</p>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { mapState } from "vuex";
import iScroll from "assets/js/iscroll";

export default {
  name: "playerUiLyric",
  computed: {
    ...mapState({
      currentTime: (state) => state.ac.currentTime,
    }),
    // 对应时间的歌词,加翻译
    lyric() {
      const res = [];
      const len = this.lyric_withTime.length;
      for (let i = 0; i < len; i++) {
        const obj = {
          time: this.lyric_withTime[i].split("]")[0].slice(1),
          lrc: this.lyric_withTime[i].split("]")[1],
          tlrc: "",
        };

        if (obj.lrc) res.push(obj); // 确保没有空歌词
      }
      if (this.tlyric_withTime) {
        const len = this.tlyric_withTime.length;
        const len2 = res.length;
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len2; j++) {
            if (this.tlyric_withTime[i].split("]")[0].slice(1) == res[j].time) {
              res[j].tlrc = this.tlyric_withTime[i].split("]")[1];
              break;
            }
          }
        }
      }
      return res;
    },
  },
  props: {
    songName: {
      type: String,
    },
    lyric_withTime: {
      type: Array,
      required: true,
    },
    tlyric_withTime: {
      type: Array,
      required: true,
    },
    nolyric: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lyricHeightArr: [],
      activeLyricIndex: 0,
      activelyricHeightArr: 0,
      translateY: 0,
      iscroll: {},
      panMoveY: 0,
    };
  },
  watch: {
    activeLyricIndex() {
      this.translateY = this.moveTranslateY(this.activeLyricIndex);
      // console.log(this.$refs.lrc[this.activeLyricIndex].innerText);
        // this.iscroll.scrollToElement(this.$refs.lrc[this.activeLyricIndex],100)
        this.iscroll = new iScroll(".lyric-container", {
          mouseWheel: true,
          bounce: true,
          scrollbars: true,
        });
        this.iscroll.scrollTo(0, -this.translateY);
    },
    translateY() {},
  },
  mounted() {},
  updated() {
    let arr = [];
    for (let i = 0; i < this.$refs.lrc.length; i++) {
      arr.push(this.$refs.lrc[i].clientHeight + 15);
    }
    this.lyricHeightArr = arr;
    this.init_scroll();
  },
  created() {},
  methods: {
    init_scroll() {
      // 如果需要手动计算高度
      /* let innerHeight = 0;
      const len = this.lyricHeightArr.length;
      for (let i = 0; i < len; i++) {
        innerHeight += this.lyricHeightArr[i];
      }
      this.$refs.inner.style.height = innerHeight;
      this.BScroll = new BScroll(".lyric-container", {
        disableMouse: false,
        disableTouch: false
      }) */
      this.iscroll = new iScroll(".lyric-container", {
        mouseWheel: true,
        bounce: true,
        scrollbars: true,
      });
    },
    lyricTimeToSeconds(time) {
      return (
        parseInt(time.split(":")[0]) * 60000 +
        parseInt(time.split(":")[1] * 1000 + parseInt(time.split(".")[1]))
      );
    },
    isActiveLyricIndex(index) {
      // 最后一句的话直接返回，防止越界报错
      if (
        this.currentTime * 1000 >=
          this.lyricTimeToSeconds(this.lyric[index].time) &&
        index === this.lyric.length - 1
      ) {
        this.activeLyricIndex = index;
        return true;
      }

      if (
        this.currentTime * 1000 >=
          this.lyricTimeToSeconds(this.lyric[index].time) &&
        this.currentTime * 1000 <
          this.lyricTimeToSeconds(this.lyric[index + 1].time)
      ) {
        this.activeLyricIndex = index;
        return true;
      }
    },
    moveTranslateY(index) {
      let y = 0;
      for (let i = 0; i < index; i++) {
        y += this.lyricHeightArr[i];
      }
      return y;
    },
    showMain() {
      this.$emit("showMain");
    },
  },
};
</script>

<style scoped lang='scss'>
.lyric-container {
  overflow: hidden;
}
.inner {
  p {
    transition: all linear 0.3s;
    font-size: 14px;
    margin: 15px 0;
    line-height: 20px;
    color: var(--silveryWhite);
    opacity: 0.6;
    text-align: center;
    &.active {
      font-size: 16px;
      opacity: 1;
    }
  }
  &-empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>