<template>
  <section
    class="myLikeMusic box"
    ref="myLikeMusicBox"
    @click="showPLD"
    @touchstart="() => this.$refs.myLikeMusicBox.classList.add('active')"
    @touchend="() => this.$refs.myLikeMusicBox.classList.remove('active')"
  >
    <div
      class="cover"
      :style="{ backgroundImage: 'url(' + detail.coverImgUrl + ')' }"
    >
    </div>
    <div class="info">
      <p>我喜欢的音乐</p>
      <span v-cloak>{{ detail.trackCount }}首</span>
    </div>
    <div class="intelligencePlay_btn" @click.stop="intelligenceMode">
      <i class="icon icon-xindong"></i>
      心动模式
    </div>
  </section>
</template>

<script>
import { getPlaylistDetail } from "network/playlist";
import { Toast } from "vant";

export default {
  name: "MyLikeMusic",
  props: {
    data: Object,
  },
  data() {
    return {
      detail: {},
    };
  },
  methods: {
    showPLD() {
      this.$emit("showPLD", this.detail);
    },
    intelligenceMode() {
      return Toast({
        message: "存在bug，暂不开放",
        icon: "info-o",
      });
      /* this.$store.dispatch("changeIntelligencePIL", {
        id: this.detail.tracks[parseInt(Math.random() * this.detail.trackCount)]
          .id,
        pid: this.detail.id,
      }); */
      // this.$store.dispatch('init_song',this.$store.state.pl.playingList[0])
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const res = await getPlaylistDetail(this.data.id);
      this.detail = res.playlist;
    });
  },
  created() {},
};
</script>

<style scoped lang='scss'>
.myLikeMusic {
  display: flex;
  align-items: center;
  position: relative;
  transition: all ease 0.3s;
  background-color: var(--silveryWhite);
  &.active {
    background-color: rgba(146, 146, 144, 1);
  }
  .cover {
    width: 0.5rem;
    height: 0.5rem;

    background-size: 100% 100%;
    border-radius: 0.1rem;
    overflow: hidden;
  }
  .info {
    margin: 0 0.1rem;
    span {
      font-size: smaller;
      color: var(--shenhui);
    }
  }
  .intelligencePlay_btn {
    height: 0.25rem;
    line-height: 0.25rem;
    padding: 0 0.08rem;
    font-size: 0.11rem;
    position: absolute;
    right: 0.16rem;
    border-radius: 0.2rem;
    border: 0.01rem solid #999;
    i {
      vertical-align: middle;
    }
  }
}
</style>