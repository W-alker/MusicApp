<template>
  <div class="row action-btns">
    <a href="" download="" ref="downloadLink" target="_blank">
      <i class="icon icon-xiazai1"></i>
    </a>
    <i
      :class="[
        'icon',
        { 'icon-xihuan-xianxing': !isLikeSong },
        { 'icon-xihuan1': isLikeSong },
      ]"
      @click="likeSong"
      style="font-size: 0.22rem"
    ></i>
    <i class="icon icon-renwuzhongxin-huodepinglun"></i>
    <i class="icon icon-icon"></i>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ActionBtns",
  computed: {
    ...mapState({
      sid: (state) => state.ac.songInfo.id,
      sname: (state) => state.ac.songInfo.name,
      arName: (state) => state.ac.songInfo.arName,
      audioUrl: (state) => state.ac.songInfo.url,
      likeList: (state) => state.ua.likeList,
    }),
  },
  watch: {
    likeList: {
      hadler() {
        this.isLikeSong = this.likeList.has(this.sid);
      },
      deep: true,
    },
  },
  data() {
    return {
      isLikeSong: false,
      downUrl: "",
    };
  },
  methods: {
    async likeSong() {
      await this.$store.dispatch("likeSong", this.sid);
      this.isLikeSong = this.likeList.has(this.sid);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isLikeSong = this.likeList.has(this.sid);
      this.$refs.downloadLink.href = this.audioUrl;
      this.$refs.downloadLink.download = this.sname + " - " + this.arName;
    });
  },
  created() {},
};
</script>

<style scoped lang='scss'>
.action-btns {
  height: 0.3rem;
  padding: 0 0.2rem;
  .icon {
    display: inline-block;
    font-size: 0.2rem;
    &.icon-xihuan1 {
      color: var(--darkRed);
    }
  }
}
</style>