<template>
  <section class="block-rcmd-playlists block">
    <h3 v-cloak class="tit">
      {{ data.uiElement.subTitle.title }}

      <button class="block-top-btn more">
        更多 <i class="fa fa-angle-right"></i>
      </button>
    </h3>

    <div class="wrapper playlists-show-wrapper" ref='wrapper1'>
      <ul ref="content" class="playlists-show-list">
        <li
          v-for="(item, index) in pls"
          @click="showPLD(item.resources[0].resourceId)"
        >
          <div
            class="cover"
            :style="{
              backgroundImage: 'url(' + item.uiElement.image.imageUrl + ')',
            }"
          >
            <span class="playcount">
              <i class="icon icon-bofang"></i>
              {{ palycount(item.resources[0].resourceExtInfo.playCount) }}</span
            >
          </div>
          <p class="list-name textover-eclipsis-2">
            {{ item.uiElement.mainTitle.title }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { playcountComputed } from "assets/js/util";
import { getPlaylistDetail } from "network/playlist";
import IScroll from "assets/js/iscroll-probe";

export default {
  name: "BlockRcmdPlaylists",
  props: {
    data: Object,
  },
  computed: {
    pls() {
      return this.data.creatives;
    },
  },
  data() {
    return {
      iscroll: {},
    };
  },
  methods: {
    palycount(v) {
      return playcountComputed(v);
    },
    async showPLD(pid) {
      console.log(pid);
      const res = await getPlaylistDetail(pid);
      this.$emit("showPLD", res.playlist);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.iscroll = new IScroll(
        this.$refs.wrapper1,
        {
          scrollX: true,
        }
      );
    });
  },
};
</script>

<style scoped lang='scss'>
.playlists-show-wrapper {
  overflow: hidden;
}
.block-rcmd-playlists {
  margin-top: 0.1rem;
  background-color: var(--anlanzi);
  .tit {
    height: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .block-top-btn {
      padding: 0.02rem 0.1rem;
      background-color: transparent;
      border: 0.01rem solid var(--shenhui);
      border-radius: 0.2rem;
      font-size: 0.12rem;
      text-align: center;
    }
  }
}
</style>