<template>
  <section class="playlist-detail">
    <div class="intro">
      <h2>歌单</h2>

      <div class="pl-info">
        <div
          class="cover"
          :style="{ backgroundImage: 'url(' + pl.coverImgUrl + ')' }"
        >
          <span class="playcount">
            <i class="icon icon-bofang1"></i>
            {{ playcountComputed(pl.playCount) }}
          </span>
        </div>
        <div class="info">
          <h3 class="listName">{{ pl.name }}</h3>
          <h3 class="author">
            <img :src="pl.creator.avatarUrl" alt="" class="avatar-thumb" />
            <span>{{ pl.creator.nickname }}</span>
          </h3>
          <p class="editBtn textover-eclipse">
            {{ pl.description ? pl.description : "编辑信息" }}
            <i class="icon icon-zuojiantou1"></i>
          </p>
        </div>
      </div>
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
          <span class="serialNumber">{{ index + 1 }}</span>
          <div class="songInfo">
            <h4 class="songName textover-eclipse">{{ item.al.name }}</h4>
            <h4 class="arName textover-eclipse">{{ songArToStr(item.ar) }}</h4>
          </div>
          <van-icon name="tv-o" class="btn" />
          <i class="icon icon-icon btn"></i>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { songArToStr, playcountComputed } from "assets/js/util.js";

export default {
  name: "PlaylistDetail",
  props: {
    pl: {
      type: Object,
      required: true,
    },
  },
  computed: {
    list() {
      return this.pl.tracks;
    },
    curSongId() {
      return this.$store.state.ac.songInfo.id;
    },
  },
  data() {
    return {};
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
  },
  created() {},
  mounted() {},
};
</script>

<style scoped lang='scss'>
.playlist-detail {
  width: 100vw;
  height: 100vh;
  background-color: var(--commonPageBgc);
  color: var(--silveryWhite);
}
.intro {
  padding: 16px;
}
.pl-info {
  margin-top: 30px;
  display: flex;
  .cover {
    width: 120px;
    height: 120px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 16px;
    background-size: 100% 100%;
    position: relative;
    .playcount {
      position: absolute;
      right: 4px;
      top: 4px;
      display: inline-block;
      padding: 4px;
      font-size: 11px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      .icon {
        font-size: smaller;
        vertical-align: middle;
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: calc(100% - 120px - 16px);
    .listName {
      font-size: 18px;
    }
    .author {
      font-size: 14px;
      font-weight: normal;
      .avatar-thumb {
        width: 25px;
        height: 25px;
        vertical-align: middle;
        border-radius: 50%;
      }
      span {
        margin-left: 10px;
        opacity: 0.8;
      }
    }
    .editBtn {
      font-size: 12px;
      opacity: 0.8;
      padding-right: 2em;
      position: relative;
      .icon {
        position: absolute;
        right: 0;
      }
    }
  }
}
.list-container {
  margin-top: 30px;
  padding: 16px;
  background-color: var(--silveryWhite);
  color: var(--black);
  .ctrlBtns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    position: sticky;
    top: 0;
    background-color: var(--silveryWhite);
    z-index: 30;
    .btn {
      cursor: pointer;
    }
    .btn-playAll {
      height: 25px;
      line-height: 25px;
      font-weight: bold;
      .van-icon {
        margin-right: 6px;
        font-size: x-large;
        vertical-align: middle;
        color: var(--auroraRed);
      }
    }
    .right {
      .btn {
        display: inline-block;
        margin-left: 10px;
        width: 25px;
        height: 25px;
        font-size: 20px;
        line-height: 25px;
        text-align: center;
      }
    }
  }
  .list {
    $li-h: 48px;
    li {
      display: flex;
      justify-content: space-between;
      height: $li-h;
      transition: all ease 0.2s;
      &.active {
        background-color: red;
      }
      .serialNumber {
        display: inline-block;
        width: 6%;
        height: $li-h;
        line-height: $li-h;
        text-align: center;
      }
      .songInfo {
        width: 64%;
        line-height: $li-h / 2;
        .songName {
          font-weight: normal;
        }
        .arName {
          font-weight: normal;
          font-size: smaller;
        }
      }
      .btn {
        display: inline-block;
        width: 28px;
        height: $li-h;
        line-height: $li-h;
        font-size: 20px;
        text-align: center;
      }
    }
  }
}
</style>