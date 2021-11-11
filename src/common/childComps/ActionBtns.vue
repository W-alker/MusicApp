<template>
  <div class="row action-btns">
    <a :href="audioUrl" download>
      <i class="icon icon-xiazai1"></i>
    </a>
    <i
      :class="[
        'icon',
        { 'icon-xihuan-xianxing': !isLikeSong },
        { 'icon-xihuan1': isLikeSong },
      ]"
      @click="likeSong"
      style="font-size: 22px"
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
      audioUrl: (state) => state.ac.songInfo.url,
      likeList: (state) => state.ua.likeList,
    }),
  },
  watch: {},
  data() {
    return {
      isLikeSong: false,
    };
  },
  methods: {
    likeSong() {
      this.$store.dispatch("likeSong", this.sid);
      this.isLikeSong = this.likeList.has(this.sid);
    },
  },
  updated() {
    this.isLikeSong = this.likeList.has(this.sid);
  },
  created() {
    this.isLikeSong = this.likeList.has(this.sid);
  },
};
</script>

<style scoped lang='scss'>
.action-btns {
  height: 30px;
  padding: 0 20px;
  .icon {
    display: inline-block;
    font-size: 20px;
    &.icon-xihuan1 {
      color: var(--darkRed);
    }
  }
}
</style>