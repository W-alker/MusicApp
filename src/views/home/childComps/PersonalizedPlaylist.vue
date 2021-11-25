<template>
  <section class="personalized-playlist">
    <h3 class="sec-tit">你的每日私荐歌单</h3>
    <div class="inner playlists-show-wrapper" ref="wrapper2">
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
import IScroll from "assets/js/iscroll-probe";

// import BScroll from "@better-scroll/core";

export default {
  name: "PersonalizedPlaylist",
  data() {
    return {
      recommnedPlaylists: [],
      iscroll: {},
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
    init_scroll() {
      this.iscroll = new IScroll(this.$refs.wrapper2, {
        scrollX: true,
      });
    },
  },
  watch: {
    contentWidth() {
      this.init_scroll();
    },
  },
  mounted() {
    this.$nextTick(() => {
    });
  },
  created() {
    this.getTodayPlaylist();
  },
};
</script>

<style lang='scss' scoped>
.playlists-show-wrapper {
  overflow: hidden;
}
section {
  margin-top: 0.2rem;
}
</style>