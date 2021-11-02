<template>
  <div class="lyric-container">
    <div
      class="inner"
      :style="{
        transform: 'translateY(-' + translateY + 'px)',
      }"
      v-show="!nolyric"
    >
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
    <div class="inner inner-empty">
      <p v-show="nolyric">该歌曲暂无歌词</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "playerUiLyric",
  computed: {
    currentTime() {
      return this.$store.state.ac.currentTime;
    },
    // 对应时间的歌词
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
            } else j++;
          }
        }
      }
      return res;
    },
    lyricHeight() {
      let arr = [];
      for (let i = 0; i < this.$refs.lrc.length; i++) {
        arr.push(this.$refs.lrc[i].clientHeight + 15);
      }
      return arr;
    },
  },
  props: {
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
      activeLyricHeight: 0,
      translateY: 0,
    };
  },
  watch: {
    activeLyricIndex() {
      //   console.log(this.$refs.lrc[this.activeLyricIndex - 1].clientHeight);
      this.translateY = this.moveTranslateY(this.activeLyricIndex);
    },
  },
  mounted() {},
  created() {},
  methods: {
    lyricTimeToSeconds(time) {
      return (
        parseInt(time.split(":")[0]) * 60000 +
        parseInt(time.split(":")[1] * 1000 + parseInt(time.split(".")[1]))
      );
    },
    isActiveLyricIndex(index) {
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
        y += this.lyricHeight[i];
      }
      return y;
    },
  },
};
</script>

<style scoped lang='scss'>
.inner {
  margin-top: 70%;
  p {
    transition: all linear 0.3s;
    font-size: 14px;
    /*               white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis; */
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