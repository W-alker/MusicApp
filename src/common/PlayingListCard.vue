<template>
  <section class="playing-list-card--fixed  hideScroll">
    <h3>当前播放</h3>
    <div class="row actions"></div>
    <ul class="list">
      <li
        v-for="(item, index) in list"
        :key="index"
        @click="changeSong(index)"
        :class="[{ active: item.id === curSongId }]"
      >
        <p class="textover-eclipse">
          <span class="songName">{{ item.al.name }}</span>
          -
          {{ songArToStr(item.ar) }}
        </p>
        <van-icon name="close" />
      </li>
    </ul>
  </section>
</template>

<script>
import { getSongUrl } from "network/song";
import { songArToStr } from "assets/js/util";

export default {
  name: "PlayingListCard",
  computed: {
    songName() {
      return this.$store.state.ac.songInfo.al.name;
    },
    arName() {
      return this.$store.state.ac.songInfo.arName;
    },
    list() {
      return this.$store.state.pl.playingList;
    },
    curSongId() {
      return this.$store.state.ac.songInfo.id;
    },
  },
  data() {
    return {
      songArToStr(ars) {
        return songArToStr(ars);
      },
      async changeSong(index) {
        this.$store.dispatch("changeSong", index);
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.playing-list-card--fixed {
  width: 3.36rem;
  height: 4.46rem;
  margin: 0.19rem;
  background-color: #fff;
  border-radius: 0.16rem;
  padding: 0.16rem;
  overflow: auto;
  color: var(--black);
}
.list {
  margin-top: 20px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    &.active {
      background-color: red;
    }
    p {
      font-size: 11px;
      width: 60%;
      span {
        font-size: 14px;
        margin-right: 8px;
      }
    }
    .van-icon {
      display: inline-block;
    }
  }
}
</style>