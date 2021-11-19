<template>
  <div class="lyric-container" @click="showMain" ref="lyric_container">
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
import IScroll from "assets/js/iscroll-probe";

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
    /*     lyricHeightArr() {
      let arr = [];
      for (let i = 0; i < this.$refs.lrc.length; i++) {
        arr.push(this.$refs.lrc[i].clientHeight + 15);
      }
      return arr;
    }, */
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
      activeLyricIndex: 0,
      activelyricHeightArr: 0,
      // translateY: 0,
      iscroll: {},
      panMoveY: 0,
      lyric_container_height: 0, // 计算容器高度，让歌词居中
    };
  },
  watch: {
    currentTime() {},
    activeLyricIndex() {
      // this.translateY = this.moveTranslateY(this.activeLyricIndex);
      if (this.iscroll.scroller)
        this.iscroll.scrollToElement(
          this.$refs.lrc[this.activeLyricIndex],
          500,
          0,
          -(this.lyric_container_height / 2)
        );
      // this.iscroll.scrollTo(0, -this.translateY + 230,500);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.lyric_container_height = this.$refs.lyric_container.clientHeight;
      this.$refs.inner.style.padding = this.lyric_container_height / 2 + "px 0";  // 计算外部容器高度，给内部容器设置上下padding以居中
      this.init_scroll();
    });
  },
  updated() {},
  created() {},
  methods: {
    init_scroll() {
      // 如果需要手动计算高度
      /* let innerHeight = 0;
      const len = this.lyricHeightArr.length;
      for (let i = 0; i < len; i++) {
        innerHeight += this.lyricHeightArr[i];
      }
      this.$refs.inner.style.height = innerHeight; */
      this.iscroll = new IScroll(this.$refs.lyric_container, {
        mouseWheel: true,
        // scrollbars: true,
        // 解决拖拽卡顿问题
        scrollX: false,
        scrollY: true,
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
    /*     moveTranslateY(index) {
      let y = 0;
      for (let i = 0; i < index; i++) {
        y += this.lyricHeightArr[i];
      }
      return y;
    }, */
    showMain() {
      this.$emit("showMain");
    },
  },
};
</script>

<style scoped lang='scss'>
.lyric-container {
  overflow: hidden;
  touch-action: none;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    display: block;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 10;
    background: linear-gradient(rgba(14, 11, 32, 1), rgba(14, 11, 32, 0));
  }
  &::after {
    position: absolute;
    content: "";
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 10;
    background: linear-gradient(rgba(14, 11, 32, 0), rgba(14, 11, 32, 1));
  }
}
.inner {
  box-sizing: content-box;
  padding: 250px 0;
  p {
    transition: all linear 0.5s;
    font-size: 14px;
    margin: 15px 0;
    line-height: 20px;
    color: var(--silveryWhite);
    opacity: 0.6;
    text-align: center;
    &.active {
      opacity: 1;
      color: white;
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