<template>
  <section class="playing-list-card playing-list-card--fixed">
    <div class="head--fixed" v-show="!isFM_Mode">
      <h3>
        当前播放
        <span style="font-size: small; opacity: 0.8">({{ list.length }})</span>
      </h3>
      <div class="row action-btns" v-cloak>
        <div class="action-btn btn1" @click="change_playMode">
          <i :class="['icon', playMode_icon]"></i>
          {{ playmode_text }}
        </div>
        <div class="action-btn">
          <i
            class="icon icon-shanchu btn"
            style="margin-right: 0"
            @click="deleteFromPIL_All"
          ></i>
        </div>
      </div>
    </div>

    <div class="container" v-show="!isFM_Mode" ref="playing_list_card">
      <ul class="list">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="changeSong(index)"
          :class="[{ list_item_active: item.id === curSongId }, 'list_item']"
        >
          <p class="textover-eclipse name">
            <span class="songName">{{ item.name }}</span>
            -
            {{ songArToStr(item.ar) }}
          </p>
          <i class="icon icon-cuowu btn" @click="deleteFromPIL(item.id)"></i>
        </li>
      </ul>
    </div>
    <div class="container fm-mode flex-center" v-show="isFM_Mode">
      <p>当前播放: 私人FM</p>
      <p class="name" v-cloak>
        {{ songName }} <span>- {{ arName }}</span>
      </p>
    </div>
  </section>
</template>

<script>
import { getSongUrl } from "network/song";
import { songArToStr } from "assets/js/util";

import { mapState } from "vuex";
import { ontouchActive } from "assets/js/util";
import { Toast } from "vant";
import IScroll from "assets/js/iscroll-probe";

export default {
  name: "PlayingListCard",
  computed: {
    ...mapState({
      songName: (state) => state.ac.songInfo.al.name,
      arName: (state) => state.ac.songInfo.arName,
      list: (state) => state.pl.playingList,
      curSongId: (state) => state.ac.songInfo.id,
      playMode: (state) => state.pl.playMode,

      isFM_Mode: (state) => state.fm.isFM_Mode,
    }),

    playMode_icon() {
      switch (this.playMode) {
        case 0:
          return "icon-shunxubofang";
        case 1:
          return "icon-suijibofang";
        case 2:
          return "icon-danquxunhuan";
      }
    },
    playmode_text() {
      switch (this.playMode) {
        case 0:
          return "顺序播放";
        case 1:
          return "随机播放";
        case 2:
          return "单曲循环";
      }
    },
  },
  data() {
    return {
      iscroll: {},
    };
  },
  methods: {
    songArToStr(ars) {
      return songArToStr(ars);
    },
    async changeSong(index) {
      this.$store.dispatch("changeSong", index);
    },
    change_playMode() {
      this.$store.commit("change_playMode");
    },
    deleteFromPIL(sid) {
      console.log(sid);
      this.$store.commit("deleteFromPIL", sid);
    },
    deleteFromPIL_All() {
      return Toast("暂不支持");
    },
  },
  mounted() {
    ontouchActive(
      document.querySelector(".playing-list-card").querySelectorAll(".btn")
    );
    this.$nextTick(() => {
      this.iscroll = new IScroll(this.$refs.playing_list_card, {
        scrollY: true,
      });
      this.iscroll.scrollToElement(
        document.querySelector(".list_item_active").previousSibling ||
          // 防止已经是顶部元素
          document.querySelector(".list_item_active"),
        1
      );
    });
  },
};
</script>

<style scoped lang='scss'>
.playing-list-card--fixed {
  width: 3.36rem;
  height: 4.7rem;
  margin: 0.19rem;
  background-color: var(--themeBgc);
  border-radius: 0.16rem;
  // overflow: auto;
  overflow: hidden;
  color: var(--qianhui);
  position: relative;
  .head--fixed {
    position: sticky;
    padding: 0.16rem 0 0.12rem 0;
    top: 0;
    background-color: var(--themeBgc);
    z-index: 20;
  }
  h3,
  .action-btns {
    padding: 0 0.16rem;
  }
}
.container {
  height: 100%;
  padding: 0.16rem 0;

  .btn {
    display: inline-block;
    width: 0.28rem;
    height: 0.28rem;
    text-align: center;
    line-height: 0.28rem;
    opacity: 0.8;
    &.active {
      background-color: var(--footbarBgc);
    }
  }
}
.action-btns {
  margin-top: 0.06rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.14rem;
  height: 0.28rem;
  line-height: 0.28rem;

  .btn1 {
    display: flex;
    i {
      margin-right: 0.08rem;
    }
  }
}
.list {
  margin-top: -0.2rem;
  touch-action: none;
  box-sizing: content-box;
  padding-top: 0.2rem;
  padding-bottom: 0.95rem;
  li {
    padding: 0.16rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.44rem;
    &.list_item_active {
      background-color: var(--footbarBgc);
      p.name {
        color: var(--qiuhaitanghong);
      }
    }
    p {
      font-size: 0.11rem;
      width: 80%;
      span {
        font-size: 0.14rem;
      }
    }
  }
}
.fm-mode {
  flex-direction: column;
  font-size: 0.16rem;
  p {
    &:first-child {
      font-size: larger;
      margin-bottom: 0.1rem;
    }
  }
  .name {
    text-align: center;
    color: var(--qiuhaitanghong);
    span {
      font-size: small;
    }
  }
}
</style>