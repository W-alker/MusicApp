<template>
  <section>
    <h3 class="sec-tit">你的每日私荐歌单</h3>
    <div class="inner">
      <ul>
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

export default {
  name: "PersonalizedPlaylist",
  data() {
    return {
      recommnedPlaylists: [],
    };
  },
  methods: {
    async getTodayPlaylist() {
      const res = await getTodayPlaylist();
      this.recommnedPlaylists = res.recommend;
    },
    playcountComputed(cnt) {
      return playcountComputed(cnt);
    },
    async showPLD(pl) {
      // 查询当前歌单详情(包括歌曲列表)
      const res = await getPlaylistDetail(pl.id);
      this.$emit("showPLD", res.playlist);
    },
  },
  created() {
    this.getTodayPlaylist();
  },
};
</script>

<style lang='scss' scoped>
section {
  margin-top: 20px;
}
.inner {
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -webkit-overflow-scrolling: touch;
  ul {
    // width: 168vw;
    display: flex;
    // flex-wrap: wrap;
    li {
      width: 25vw;
      flex-shrink: 0;
      margin: 0 3vw 0 0;
      .cover {
        width: 100%;
        height: 25vw;
        background-color: #fff;
        border-radius: 8px;
        background-size: contain;
        position: relative;
        overflow: hidden;

        .playcount {
          display: inline;
          position: absolute;
          right: 4px;
          top: 4px;
          padding: 4px 6px;
          background-color: rgba(0, 0, 0, 0.3);
          font-size: 11px;
          line-height: 10px;
          border-radius: 8px;
          .icon {
            font-size: 11px;
          }
        }
      }
      .list-name {
        margin-top: 5px;
        font-size: 11px;
      }
    }
  }
}
</style>