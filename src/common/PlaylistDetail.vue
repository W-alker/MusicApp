<template>
  <section class="playlist-detail hideScroll">
    <h3 class="top-head">
      <span class="title">歌单</span>
      <i class="fa fa-search" @click='searchInPL'></i>
      <i class="icon icon-icon"></i>
    </h3>
    <div class="intro">
      <div class="pl-info">
        <div
          class="cover"
          :style="{ backgroundImage: 'url(' + pl.coverImgUrl + ')' }"
          @click="isShowInfoDetail = true"
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
          <p class="editBtn textover-eclipse" @click="isShowInfoDetail = true">
            {{ pl.description ? pl.description : "编辑信息" }}
            <i class="icon icon-youjiantou"></i>
          </p>
        </div>
      </div>
    </div>

    <div class="list-container">
      <div class="actionBtns">
        <div
          class="btn-collectPL btn"
          @click="subscribePL"
          :style="{ opacity: pl.userId === uid ? '.4' : '1' }"
        >
          <i
            :class="[
              'fa',
              { 'fa-plus-square-o': !isSubscribePL },
              { 'fa-check-square-o': isSubscribePL },
            ]"
          ></i>
          {{
            pl.subscribedCount ? playcountComputed(pl.subscribedCount) : "收藏"
          }}
        </div>
        <div class="btn-comment btn">
          <i class="fa fa-commenting-o"></i>
          {{ pl.commentCount ? playcountComputed(pl.commentCount) : "评论" }}
        </div>
        <div class="btn-share btn">
          <i class="fa fa-share-alt" aria-hidden="true"></i>
          {{ pl.shareCount ? playcountComputed(pl.shareCount) : "分享" }}
        </div>
      </div>
      <div class="ctrlBtns left">
        <div class="btn btn-playAll" @click="playStart(0)">
          <van-icon name="play-circle" />
          播放全部<span style="font-size: small; opacity: 0.7"
            >（{{ list.length }}）</span
          >
        </div>
        <div class="right">
          <i class="icon icon-xiazai1 btn btn-dwon"></i>
          <van-icon name="ellipsis" class="btn btn-listEdit" />
        </div>
      </div>
      <ul class="list">
          <!-- 版权判断的数据返回有问题 -->
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="playStart(index)"
          :class="[
            { active: curSongId === item.id },
            { nocopyright: 0 && !item.copyright },
          ]"
        >
          <span class="serialNumber">{{ index + 1 }}</span>
          <div class="songInfo">
            <h4 class="songName textover-eclipse">
              {{ item.name }}
              <span style="opacity: 0.7" v-show="item.alia.length > 0"
                >({{ item.alia[0] }})</span
              >
              <span style="opacity: 0.7" v-if="item.tns"
                >({{ item.tns[0] }})</span
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

    <van-popup v-model="isShowInfoDetail" closeable get-container="#app">
      <playlist-info-detail
        :pl="pl"
        @closeInfoDetail="isShowInfoDetail = false"
      ></playlist-info-detail>
    </van-popup>
  </section>
</template>

<script>
import { songArToStr, playcountComputed } from "assets/js/util.js";
import { mapState } from "vuex";
import PlaylistInfoDetail from "./childComps/PlaylistInfoDetail";

export default {
  name: "PlaylistDetail",
  components: {
    PlaylistInfoDetail,
  },
  props: {
    pl: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      uid: (state) => state.ua.account.id,
      curSongId: (state) => state.ac.songInfo.id,
      playlists: (state) => state.ua.playlists,
    }),
    list() {
      return this.pl.tracks;
    },
    pid() {
      return this.pl.id;
    },
    isSubscribePL() {
      for (let i = 0; i < this.playlists.length; i++) {
        if (this.playlists[i].id === this.pid) {
          return true;
        }
      }
      return false;
    },
  },
  data() {
    return {
      isShowInfoDetail: false,
    };
  },
  watch: {
    isShowInfoDetail() {
      if (this.isShowInfoDetail) return this.$store.commit("hideFootPlayBar");
      else if (!this.isShowInfoDetail)
        return this.$store.commit("showFootPlayBar");
    },
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
      this.$store.dispatch("updatePIL", { list: this.list, index,pid:this.pid });
    },
    subscribePL() {
      if (this.pl.userId === this.uid) return 0;
      this.$store.dispatch("subscribePL", this.pl);
    },
    //搜索歌单
    searchInPL() {
      
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {});
  },
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
  padding: 0.16rem;
  position: relative;
}
.top-head {
  position: absolute;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  padding-left: 0.6rem;
  width: 100%;
  height: 0.55rem;
  background-color: var(--themeBgc);
  .title {
    flex-grow: 1;
  }
  i {
    display: block;
    width: 0.4rem;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    border-radius: 50%;
    &:hover {
      background-color: var(--shenhui);
    }
  }
}
.pl-info {
  margin-top: 0.6rem;
  display: flex;
  .cover {
    width: 1.2rem;
    height: 1.2rem;
    background-color: #fff;
    border-radius: 0.08rem;
    overflow: hidden;
    margin-right: 0.16rem;
    background-size: 100% 100%;
    position: relative;
    .playcount {
      position: absolute;
      right: 0.04rem;
      top: 0.04rem;
      display: inline-block;
      padding: 0.04rem;
      font-size: 0.11rem;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0.06rem;
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
    max-width: calc(100% - 1.2rem - 0.16rem);
    .listName {
      display: block;
      font-size: 0.18rem;
      flex-grow: 1;
    }
    .author {
      margin-bottom: 0.16rem;
      font-size: 0.12rem;
      font-weight: normal;
      .avatar-thumb {
        width: 0.22rem;
        height: 0.22rem;
        vertical-align: middle;
        border-radius: 50%;
      }
      span {
        margin-left: 0.1rem;
        opacity: 0.8;
      }
    }
    .editBtn {
      font-size: 0.11rem;
      opacity: 0.8;
      padding-right: 2em;
      position: relative;
      line-height: 0.15rem;
      .icon {
        position: absolute;
        right: 0;
      }
    }
  }
}
.list-container {
  position: relative;
  margin-top: 0.3rem;
  padding: 0.3rem 0;
  padding-bottom: var(--footplaybarHeight);

  background-color: var(--footplaybarBgc);
  color: var(--silveryWhite);
  .actionBtns {
    position: absolute;
    top: -0.2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 0.16rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 2.8rem;
    height: 0.4rem;
    background-color: var(--footbarBgc);
    border-radius: 0.2rem;
    .btn {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      border-right: 0.01rem solid var(--silveryWhite);
      font-size: 0.14rem;
      height: 0.2rem;
      line-height: 0.2rem;
      i {
        line-height: 0.2rem;
        margin-right: 0.06rem;
        font-size: 0.16rem;
      }
      &:last-child {
        border-right: none;
      }
      &:hover {
        color: #fff;
      }
    }
  }
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
      .serialNumber {
        display: inline-block;
        width: 0.26rem;
        height: $li-h;
        line-height: $li-h;
        text-align: center;
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
          font-size: 0.11rem;
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

.van-popup {
  width: 100%;
  height: 100%;
}
</style>