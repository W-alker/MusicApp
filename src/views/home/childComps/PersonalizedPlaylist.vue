<template>
  <section>
    <h3 class="sec-tit">你的每日私荐歌单</h3>
    <div class="inner hideScroll playlists-show-wrapper" ref="wrapper">
      <ul ref="content" class="playlists-show-list">
        <li v-for="(item, index) in recommnedPlaylists" @click="showPLD(item)">
          <div
            class="cover"
            :style="{ backgroundImage: 'url(' + item.picUrl + ')' }"
          >
            <span class="playcount">
              <i class="icon icon-bofang"></i>
              {{ playcountComputed(item.playcount) }}</span
            >
          </div>
          <p class="list-name textover-eclipsis-2">{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { getTodayPlaylist } from "network/recommend";
import { playcountComputed } from "assets/js/util";

import { getPlaylistDetail } from "network/playlist.js";

// import BScroll from "@better-scroll/core";

export default {
  name: "PersonalizedPlaylist",
  data() {
    return {
      recommnedPlaylists: [],
      scroll: {},
      contentWidth: 0,
    };
  },
  methods: {
    async getTodayPlaylist() {
      const res = await getTodayPlaylist();
      this.recommnedPlaylists = res.recommend;
      setTimeout(() => {
        this.contentWidth = this.$refs.content.clientWidth;
      }, 200);
    },
    playcountComputed(cnt) {
      return playcountComputed(cnt);
    },
    async showPLD(pl) {
      // 查询当前歌单详情(包括歌曲列表)
      const res = await getPlaylistDetail(pl.id);
      this.$emit("showPLD", res.playlist);
    },
    /*     init_scroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
      });
    }, */
  },
  watch: {
    contentWidth() {
      // this.init_scroll();
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  async created() {
    this.getTodayPlaylist();
  },
};
</script>

<style lang='scss' scoped>
section {
  margin-top: 20px;
}

</style>