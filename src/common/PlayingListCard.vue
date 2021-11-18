<template>
  <section class="playing-list-card playing-list-card--fixed hideScroll" >
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

    <div class="container" v-show="!isFM_Mode">
      <ul class="list">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="changeSong(index)"
          :class="[{ active: item.id === curSongId }, 'list_item']"
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
      songArToStr(ars) {
        return songArToStr(ars);
      },
      async changeSong(index) {
        this.$store.dispatch("changeSong", index);
      },
    };
  },
  methods: {
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
  },
};
</script>

<style scoped lang='scss'>
.playing-list-card--fixed {
  width: 336px;
  height: 470px;
  margin: 19px;
  background-color: var(--themeBgc);
  border-radius: 16px;
  overflow: auto;
  color: var(--qianhui);
  position: relative;
  .head--fixed {
    position: sticky;
    padding: 16px 0 12px 0;
    top: 0;
    background-color:var(--themeBgc);
    z-index: 20;
  }
  h3,
  .action-btns {
    padding: 0 16px;
  }
}
.container {
  height: 100%;
  padding: 16px 0;

  .btn {
    display: inline-block;
    width: 28px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    opacity: 0.8;
    &.active {
      background-color: var(--footbarBgc);
    }
  }
}
.action-btns {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 28px;
  line-height: 28px;

  .btn1 {
    display: flex;
    i {
      margin-right: 8px;
    }
  }
}
.list {
  margin-top: -20px;
  li {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    &.active {
      background-color: var(--footbarBgc);
      p.name {
        color: var(--qiuhaitanghong);
      }
    }
    p {
      font-size: 11px;
      width: 80%;
      span {
        font-size: 14px;
      }
    }
  }
}
.fm-mode {
  flex-direction: column;
  font-size: 16px;
  p {
    &:first-child {
      font-size: larger;
      margin-bottom: 10px;
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