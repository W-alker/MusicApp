<template>
  <main class="home hideScroll">
    <!--     <section class="profile">
      <h2 class="nickname">{{ userProfile.nickname }}</h2>
      <div class="avatar">
        <img :src="userProfile.avatarUrl" alt="" />
        <span class="badge">2</span>
      </div>
    </section> -->

    <top>
      <label
        for="input-search"
        class="input-search"
        slot="center"
        @click="showSearchUi"
      >
        <i class="fa fa-search" aria-hidden="true"></i>
        <input
          type="text"
          name="input-search"
          :placeholder="defaultSearchKeyword"
        />
      </label>
    </top>

    <banner :banners="banners" />

    <dragon-balls @showDailyList="showDailyList"></dragon-balls>

    <block-rcmd-playlists
      :data="blocks[1]"
      @showPLD="showPLD"
      v-if="blocks.length !== 0"
    ></block-rcmd-playlists>

    <!-- <today-recommend :userProfile="userProfile" /> -->

    <personalized-playlist @showPLD="showPLD" />

    <!-- <new-albums-list></new-albums-list> -->

    <!-- <highquality-playlist></highquality-playlist> -->

    <van-popup
      v-model="isShowPLD"
      :overlay="true"
      position="bottom"
      duration="0.3"
      closeable
      close-icon=" icon icon-xiajiantou"
      close-icon-position="top-left"
      get-container="#app"
    >
      <playlist-detail :pl="curPL" :key="compUpdateTimer" />
    </van-popup>

    <van-popup
      v-model="isShowSearchUi"
      position="bottom"
      closeable
      close-icon-position="top-left"
      close-icon=" icon icon-xiajiantou"
      :overlay="false"
      get-container="#app"
      style="width: 100%; height: 100%"
      duration=".15"
    >
      <search-ui :key="Date.now()"></search-ui>
    </van-popup>

    <foot-playbar
      ref="FootPlaybar"
      :isSlideDown="isShowPLD || isShowSearchUi || isShowDailyList"
    />
    <foot-bar :activeIndex="0" />
  </main>
</template>

<script>
import Top from "common/Top.vue";
import Banner from "./childComps/Banner.vue";
import DragonBalls from "./childComps/DragonBalls";
import BlockRcmdPlaylists from "./childComps/BlockRcmdPlaylists";
import SearchUi from "common/SearchUi";

import PlaylistDetail from "common/PlaylistDetail";

import FootPlaybar from "common/FootPlaybar";
import FootBar from "common/FootBar";

import PersonalizedPlaylist from "./childComps/PersonalizedPlaylist";
import HighqualityPlaylist from "./childComps/HighqualityPlaylist.vue";

import { getHomePageContent, getBanner } from "network/home";
import { getDefaultSearchKeyword } from "network/search";
import { loginStatus } from "network/login";
import { Toast } from "vant";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    Top,
    Banner,
    DragonBalls,
    BlockRcmdPlaylists,

    PersonalizedPlaylist,

    FootBar,
    FootPlaybar,

    PlaylistDetail,
    SearchUi,
  },
  computed: {
    ...mapState({
      userAccount: (state) => state.ua.account,
      userProfile: (state) => state.ua.profile,
    }),
  },
  data() {
    return {
      homePageContent: {},
      banners: [],
      blocks: [],
      defaultSearchKeyword: "",

      userInfo: {},
      curPL: [], // 当前歌单详情

      isShowPLD: false, //是否显示歌单详情页
      compUpdateTimer: 0,
      isShowSearchUi: false,
      isShowDailyList: false,
    };
  },
  methods: {
    async INIT_CONTENT() {
      const res = await getHomePageContent.Blocks();
      this.blocks = res.data.blocks;
      // 获取banner
      getBanner().then((res) => {
        this.banners = res.banners;
      });
      // 获取默认搜索词
      const res2 = await getDefaultSearchKeyword();
      this.defaultSearchKeyword = res2.data.showKeyword;
    },
    // 显示歌单
    showPLD(pl) {
      this.compUpdateTimer = new Date().getTime();
      this.curPL = pl;
      this.isShowPLD = true;
    },
    showSearchUi() {
      this.isShowSearchUi = true;
    },
    showDailyList(v) {
      this.isShowDailyList = v;
    },
  },
  created() {
    loginStatus.refresh();
    // 判断登录状
    loginStatus.check().then((res) => {
      console.log('进入首页',res);
      if (res.code === 200 && res.account) {
        if (!Object.keys(this.userAccount).length) {
          this.$store.dispatch("INIT_INFO");
        }
      } else {
        Toast.fail("登录状态验证失败，请重新登录!");
        setTimeout(() => {
          this.$router.push("/login");
        }, 300);
      }
    });
    // 恢复上次的信息
    if (!this.$store.state.init.recovered)
      this.$store.dispatch("recover_lastStatus");
    this.INIT_CONTENT();
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  color: aliceblue;
  font-size: 0.14rem;
  padding-bottom: var(--bottomBarHeight);
}
.top {
  position: absolute;
  top: 0;
  width: 100%;
}
.sec-tit {
  font-size: 0.15rem;
  margin-bottom: 0.14rem;
}

.input-search {
  width: 100%;
  height: 0.3rem;
  position: relative;
  font-size: 0.14rem;
  line-height: 0.3rem;
  .fa {
    font-size: 0.14rem !important;
    margin: 0 0.16rem;
    opacity: .7;
  }
  input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 0.35rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.15rem;
  }
}

.recommend {
  margin-top: 0.2rem;
}

.van-popup {
  background-color: unset;
}
</style>
