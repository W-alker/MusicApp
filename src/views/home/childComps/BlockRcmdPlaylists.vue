<template>
  <section class="block-rcmd-playlists block">
    <h3 v-cloak class="tit">
      {{ data.uiElement.subTitle.title }}

      <button class="block-top-btn more">
        更多 <i class="fa fa-angle-right"></i>
      </button>
    </h3>

    <div class="wrapper playlists-show-wrapper hideScroll">
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
    return {};
  },
  methods: {
    palycount(v) {
      return playcountComputed(v);
    },
    async showPLD(pid) {
      console.log(pid);
      const res = await getPlaylistDetail(pid);
      this.$emit('showPLD',res.playlist)
    },
  },
};
</script>

<style scoped lang='scss'>
.block-rcmd-playlists {
  margin-top: 10px;
  background-color: var(--anlanzi);
  .tit {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .block-top-btn {
      padding: 2px 10px;
      background-color: transparent;
      border: 1px solid var(--shenhui);
      border-radius: 20px;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>