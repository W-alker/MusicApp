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
    >
      <fm-ui></fm-ui>
    </van-popup>
  </div>
</template>

<script>
import { getHomePageContent } from "network/home";
import {getTodaySongs} from 'network/recommend'
import DailyRecommendSongs from "./DailyRecommendSongs.vue";
import FmUi from './FmUi.vue'

export default {
  name: "DragonBalls",
  components: {
    DailyRecommendSongs,
    FmUi
  },
  data() {
    return {
      balls: [],
      isShowDaliyList: false,
      isShowFM:false,

      dailySongs: [],
      fmSong: {},
    };
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
      this.$store.dispatch('INITFM')
      this.isShowFM=true
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
      font-size: 12px;
      margin-right: 5px;
      a {
        width: 60px;
        flex-direction: column;
        color: var(--silveryWhite);

        .icon {
          border-radius: 50%;
          width: 45px;
          height: 45px;
          background-color: var(--darkRed);
          img {
            width: 45px;
            height: 45px;
            // background-color: red;
          }
        }
        p {
          margin-top: 8px;
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