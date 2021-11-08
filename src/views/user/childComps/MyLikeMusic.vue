<template>
  <section
    class="myLikeMusic box"
    ref="myLikeMusicBox"
    @click="showPLD"
    @touchstart="()=>this.$refs.myLikeMusicBox.classList.add('active')"
    @touchend="()=>this.$refs.myLikeMusicBox.classList.remove('active')"
  >
    <div
      class="cover"
      :style="{ backgroundImage: 'url(' + detail.coverImgUrl + ')' }"
    >
      <i class="icon icon-xihuan1"></i>
    </div>
    <div class="info">
      <p>我喜欢的音乐</p>
      <span v-cloak>{{ detail.trackCount }}首</span>
    </div>
    <div class="intelligencePlay_btn">
      <i class="icon icon-xindong"></i>
      心动模式
    </div>
  </section>
</template>

<script>
import { getPlaylistDetail } from "network/playlist";

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
    background-color: rgba(146, 146, 144,1);
  }
  .cover {
    width: 50px;
    height: 50px;

    background-size: 100% 100%;
    border-radius: 10px;
    overflow: hidden;
    .icon {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 48px;
      text-align: center;
      font-size: 26px;
      background-color: rgba(0, 0, 0, 0.4);
      color: var(--silveryWhite);
    }
  }
  .info {
    margin: 0 10px;
    span {
      font-size: smaller;
      color: var(--shenhui);
    }
  }
  .intelligencePlay_btn {
    height: 25px;
    line-height: 25px;
    padding: 0 8px;
    font-size: 11px;
    position: absolute;
    right: 16px;
    border-radius: 20px;
    border: 1px solid #999;
    i {
      vertical-align: middle;
    }
  }
}
</style>