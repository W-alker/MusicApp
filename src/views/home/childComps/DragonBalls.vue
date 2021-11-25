<template>
  <div class="dragon-balls hideScroll">
    <ul>
      <li v-for="(item, index) in balls" ref="ball" class="ball">
        <a
          :href="!!item.url.match('orpheus:') ? 'javascript:;' : item.url"
          class="flex-center"
        >
          <div class="icon">
            <img :src="item.iconUrl" alt="" />
          </div>
          <p v-text="item.name"></p>
        </a>
      </li>
    </ul>

    <van-popup
      position="bottom"
      get-container="#app"
      v-model="isShowDaliyList"
      :overlay="false"
      closeable
    >
      <daily-recommend-songs :list="dailySongs"></daily-recommend-songs>
    </van-popup>

    <van-popup
      position="bottom"
      get-container="#app"
      v-model="isShowFM"
      :overlay="false"
      closeable
      close-icon-position="top-left"
      close-icon=" icon icon-xiajiantou"
    >
      <player-ui></player-ui>
    </van-popup>
  </div>
</template>

<script>
import { getHomePageContent } from "network/home";
import { getTodaySongs } from "network/recommend";
import DailyRecommendSongs from "./DailyRecommendSongs.vue";
import PlayerUi from "common/PlayerUi";

export default {
  name: "DragonBalls",
  components: {
    DailyRecommendSongs,
    PlayerUi,
  },
  data() {
    return {
      balls: [],
      isShowDaliyList: false,
      isShowFM: false,

      dailySongs: [],
      fmSong: {},
    };
  },
  watch:{
    isShowDaliyList() {
      this.isShowDaliyList?this.$emit('showDailyList',true):this.$emit('showDailyList',false)
    }
  },
  methods: {
    async INIT() {
      const res = await getHomePageContent.DragonBalls();
      this.balls = res.data;
    },
    async showDailySongs() {
      const res = await getTodaySongs();
      this.dailySongs = res.data.dailySongs;
      this.isShowDaliyList = true;
    },

    async showTodayRCMDSongs() {
      if(!this.$store.state.fm.isFM_Mode) this.$store.dispatch("INITFM");
      this.isShowFM = true;
    },
  },
  created() {
    this.INIT();
  },
  mounted() {
    /*     this.$refs.ball[0].onclick = () => {
      console.log(111);
    }; */
  },
  updated() {
    this.$refs.ball[0].onclick = () => this.showDailySongs();
    this.$refs.ball[1].onclick = () => this.showTodayRCMDSongs();
  },
};
</script>

<style scoped lang='scss'>
.dragon-balls {
  ul {
    display: flex;
    li {
      font-size: 0.12rem;
      margin-right: 0.05rem;
      a {
        width: 0.6rem;
        flex-direction: column;
        color: var(--silveryWhite);

        .icon {
          border-radius: 50%;
          width: 0.45rem;
          height: 0.45rem;
          background-color: var(--darkRed);
          img {
            width: 0.45rem;
            height: 0.45rem;
            // background-color: red;
          }
        }
        p {
          margin-top: 0.08rem;
          text-align: center;
        }
      }
    }
  }
}
.van-popup {
  width: 100%;
  height: 100%;
}
</style>