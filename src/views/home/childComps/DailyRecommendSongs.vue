<template>
  <section class="daily-rcmd-songs hideScroll" @touchmove="scroll($event)">
    <div class="tp">
      <h3>每日推荐</h3>
    </div>
    <div
      class="head"
      :style="{ backgroundImage: 'url(' + list[0].al.picUrl + ')' }"
      ref="head"
    >
      <h4>{{ new Date().getMonth() + 1 }} / {{ new Date().getDate() }}</h4>
    </div>
    <div class="list-container">
      <div class="ctrlBtns left">
        <div class="btn btn-playAll" @click="playStart(0)">
          <van-icon name="play-circle" />
          播放全部（{{ list.length }}）
        </div>
        <div class="right">
          <i class="icon icon-xiazai1 btn btn-dwon"></i>
          <van-icon name="ellipsis" class="btn btn-listEdit" />
        </div>
      </div>
      <ul class="list">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="playStart(index)"
          :class="[{ active: curSongId === item.id }]"
        >
          <div
            class="cover"
            :style="{ backgroundImage: 'url(' + item.al.picUrl + ')' }"
          ></div>
          <div class="songInfo">
            <h4 class="songName textover-eclipse">
              {{ item.name }}
              <span style="opacity: 0.8" v-show="item.alia.length"
                >({{ item.alia[0] }})</span
              >
            </h4>
            <h4 class="arName textover-eclipse">
              {{ songArToStr(item.ar) }}
              <span> - {{ item.al.name }}</span>
            </h4>
          </div>
          <van-icon name="tv-o" class="btn" v-show="item.mv !== 0" />
          <i class="icon icon-icon btn"></i>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { songArToStr, playcountComputed } from "assets/js/util.js";

export default {
  name: "DailyRecommendSongs",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  computed: {
    curSongId() {
      return this.$store.state.ac.songInfo.id;
    },
    offsetTop() {
      return this.$refs.head.offsetTop;
    },
  },
  data() {
    return {
      headCover: "",
    };
  },
  methods: {
    songArToStr(ars) {
      return songArToStr(ars);
    },
    playcountComputed(cnt) {
      return playcountComputed(cnt);
    },
    playStart(index = 0) {
      // 如果是第一次使用该列表，(虽然updatePIL方法已经有处理)
      if (this.$store.state.pl.playingList[0].id !== this.list[0].id)
        this.$store.dispatch("updatePIL", { list: this.list, index });
      // 如果不是则直接更改歌曲就行
      else this.$store.dispatch("changeSong", index);
    },
    scroll(e) {},
  },
  created() {},
  mounted() {},
};
</script>

<style scoped lang='scss'>
.daily-rcmd-songs {
  background-color: var(--footplaybarBgc);
  position: relative;
  height: 100%;
  width: 100%;
}
.tp {
  position: sticky;
  top: 0;
  width: 100%;
  height: 0.55rem;
  z-index: 20;
  background-color: var(--footplaybarBgc);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.16rem;
  color: var(--silveryWhite);
  h3 {
  }
}
.head {
  height: 2rem;
  background-position: center center;
  background-size: cover;
  position: relative;
  h4 {
    position: absolute;
    bottom: 0.2rem;
    left: 0.2rem;
    color: var(--silveryWhite);
    font-size: 0.24rem;
  }
}
.list-container {
  position: relative;
  margin-top: 0.16rem;
  padding-bottom: var(--footplaybarHeight);

  background-color: var(--footplaybarBgc);
  color: var(--silveryWhite);

  .ctrlBtns {
    padding: 0 0.16rem;

    position: sticky;
    top: 0.55rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.4rem;
    z-index: 30;
    background-color: var(--footplaybarBgc);

    .btn {
      cursor: pointer;
    }
    .btn-playAll {
      height: 0.4rem;
      line-height: 0.4rem;
      font-weight: bold;
      flex-grow: 1;
      .van-icon {
        margin-right: 0.06rem;
        font-size: 0.26rem;
        vertical-align: middle;
        color: var(--auroraRed);
      }
      &:hover {
        background-color: var(--footbarBgc);
      }
    }
    .right {
      display: flex;
      align-items: center;
      .btn {
        display: inline-block;
        margin-left: 0.1rem;
        width: 0.3rem;
        height: 0.3rem;
        font-size: 0.2rem;
        line-height: 0.3rem;
        text-align: center;
      }
    }
  }
  .list {
    $li-h: 0.55rem;
    font-size: 0.15rem;
    li {
      padding: 0 0.16rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: $li-h;
      transition: all ease 0.2s;
      &.active {
        background-color: var(--footbarBgc);
      }
      &.nocopyright {
        .songInfo {
          opacity: 0.4;
        }
      }
      &:hover {
        background-color: var(--footbarBgc);
      }
      .cover {
        width: 0.42rem;
        height: 0.42rem;
        background-size: 100% 100%;
        border-radius: px;
      }
      .songInfo {
        width: 60%;
        flex-grow: 1;
        padding: 0 0.12rem;
        .songName {
          font-weight: normal;
          line-height: 0.18rem;
          margin-bottom: 0.04rem;
          font-size: 0.14rem;
        }
        .arName {
          font-weight: normal;
          font-size: smaller;
          line-height: 0.15rem;
          opacity: 0.7;
          font-size: 0.1rem;
        }
      }
      .btn {
        display: inline-block;
        width: 0.3rem;
        height: $li-h;
        line-height: $li-h;
        font-size: 0.2rem;
        text-align: center;
      }
    }
  }
}
</style>