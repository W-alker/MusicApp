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

    <dragon-balls></dragon-balls>

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
        duration='.15'
    >
      <search-ui></search-ui>
    </van-popup>

    <foot-playbar ref="FootPlaybar" :isSlideDown="isShowPLD" />
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

import NewAlbumsList from "./childComps/NewAlbumsList.vue";
import PersonalizedPlaylist from "./childComps/PersonalizedPlaylist";
import HighqualityPlaylist from "./childComps/HighqualityPlaylist.vue";

import { getHomePageContent, getBanner, getLoginStatus } from "network/home";
import { getDefaultSearchKeyword } from "network/search";

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
    userAccount() {
      return this.$store.state.ua.account;
    },
    userProfile() {
      return this.$store.state.ua.profile;
    },
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
  },
  created() {
    this.INIT_CONTENT();
    // 初始化信息
    // this.$store.dispatch("INIT_INFO");
    // const record = await getUserRecord(this.userAccount.id)
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  color: aliceblue;
  font-size: 14px;
  padding-bottom: var(--bottomBarHeight);
}
.top {
  position: absolute;
  top: 0;
  width: 100%;
}
.sec-tit {
  font-size: 15px;
  margin-bottom: 14px;
}
/* .profile {
  height: 5vh;
  display: flex;
  justify-content: space-between;
  line-height: 5vh;
  .nickname {
    font-size: 19px;
    font-weight: 400;
  }
  .avatar {
    width: 5vh;
    height: 5vh;
    background: #ffffff;
    border-radius: 50%;
    position: relative;
    .badge {
      display: inline-block;
      position: absolute;
      top: -0.5vh;
      right: -0.5vh;
      width: 2vh;
      height: 2vh;
      background: #0e0b20;
      border: 1px solid #ef019f;
      border-radius: 50%;
      color: #fff;
      line-height: 2vh;
      text-align: center;
      font-size: 0.12rem;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
} */

.input-search {
  width: 100%;
  height: 30px;
  position: relative;
  font-size: 14px;
  line-height: 30px;
  .fa {
    margin: 0 16px;
  }
  input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 35px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
  }
}

.recommend {
  margin-top: 20px;
}

.van-popup {
  background-color: unset;
}
</style>
