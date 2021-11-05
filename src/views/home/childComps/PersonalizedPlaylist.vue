<template>
  <section>
    <h3 class="sec-tit">你的每日私荐歌单</h3>
    <div class="inner hideScroll" ref="wrapper">
      <ul ref="content">
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
.inner {
  // overflow: hidden;

  ul {
    white-space: nowrap;
    display: inline-flex;
    // display: flex;
    // flex-wrap: wrap;
    li {
      float: left;
      width: 0.95rem;
      flex-shrink: 0;
      margin: 0 0.1rem 0 0;
      .cover {
        width: 100%;
        height: 0.95rem;
        background-color: #fff;
        border-radius: 0.08rem;
        background-size: contain;
        position: relative;
        overflow: hidden;

        .playcount {
          display: inline;
          position: absolute;
          right: 0.04rem;
          top: 0.04rem;
          padding: 0.04rem 0.06rem;
          background-color: rgba(0, 0, 0, 0.3);
          font-size: 0.11rem;
          line-height: 0.1rem;
          border-radius: 0.08rem;
          .icon {
            font-size: 0.11rem;
          }
        }
      }
      .list-name {
        margin-top: 0.05rem;
        font-size: 0.11rem;
      }
    }
  }
}
</style>