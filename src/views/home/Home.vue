<template>
  <main class="home">
    <section class="profile">
      <h2 class="nickname">{{ userProfile.nickname }}</h2>
      <div class="avatar">
        <img :src="userProfile.avatarUrl" alt="" />
        <span class="badge">2</span>
      </div>
    </section>

    <section class="search">
      <label for="input-search" class="input-search">
        <van-icon name="search" />
        <input
          type="text"
          name="input-search"
          placeholder="Where should we go?"
        />
      </label>
    </section>

    <banner :banners="banners" />

    <today-recommend :userProfile="userProfile" @showDailyPL="showDailyPL" />

    <personalized-playlist @showPLD="showPLD" />

    <!-- <new-albums-list></new-albums-list> -->

    <!-- <highquality-playlist></highquality-playlist> -->

    <van-popup
      v-model="isShowPLD"
      :overlay="true"
      position="bottom"
      closeable
      get-container="#app"
    >
      <playlist-detail :pl="curPL" />
    </van-popup>

    <foot-playbar />
    <foot-bar :activeIndex="0" />
  </main>
</template>

<script>
import Banner from "./childComps/Banner.vue";

import PlaylistDetail from "common/PlaylistDetail";

import FootPlaybar from "common/FootPlaybar";
import FootBar from "common/FootBar";

import NewAlbumsList from "./childComps/NewAlbumsList.vue";
import TodayRecommend from "./childComps/TodayRecommend.vue";
import PersonalizedPlaylist from "./childComps/PersonalizedPlaylist";
import HighqualityPlaylist from "./childComps/HighqualityPlaylist.vue";

import { getBanner, getLoginStatus } from "network/home";
import { getSongUrl, getSongDetail } from "network/song";
import { getUserRecord,getUserInfo, getUserAccount } from "network/user";

export default {
  name: "Home",
  components: {
    Banner,

    TodayRecommend,
    PersonalizedPlaylist,

    FootBar,
    FootPlaybar,

    PlaylistDetail,
  },
  data() {
    return {
      banners: [],
      userAccount: {},
      userProfile: {},
      userInfo: {},
      curPL: [], // 当前歌单详情

      isShowPLD: false, //是否显示歌单详情页
    };
  },
  methods: {
    // 显示日推歌单
    showDailyPL(list) {
      this.curPL = list;
      this.showPLD(); // 展开歌单
    },
    // 显示歌单
    showPLD(pl) {
      this.curPL = pl;
      this.isShowPLD = true;
    },
  },
  async created() {
    // 获取banner
    getBanner().then((res) => {
      this.banners = res.banners;
    });
    //初始化用户信息
    const loginInfo = await getLoginStatus();
    this.userAccount = loginInfo.data.account;
    this.userProfile = loginInfo.data.profile;

    // const record = await getUserRecord(this.userAccount.id)
  },


};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: calc(100vh - 60px);
  padding: 1em;
  color: aliceblue;
  background: var(--themeBgc);
  font-size: 14px;
}
.sec-tit {
  font-size: 15px;
  margin-bottom: 14px;
}
.profile {
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
}
.search {
  margin-top: 20px;

  .input-search {
    width: 100%;
    height: 37px;
    position: relative;
    font-size: 14px;
    line-height: 37px;
    .van-icon {
      margin: 0 16px;
    }
    input {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      padding-left: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
  }
}
.recommend {
  margin-top: 20px;
}

.van-popup {
  background-color: unset;
}
</style>
