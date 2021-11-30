<template>
  <main class="hideScroll">
    <top>
      <van-icon name="search" slot="right" @click="isShowSearchUi = true" />
    </top>

    <section class="profile">
      <div class="avatar"><img :src="userProfile.avatarUrl" alt="" /></div>
      <div class="info">
        <h2 class="nickname" v-text="userProfile.nickname"></h2>
      </div>
      <i class="icon icon-youjiantou"></i>
    </section>

    <section class="column box">
      <ul>
        <li>
          <i class="icon icon-play"></i>
          <p>最近播放</p>
        </li>
        <li>
          <i class="icon icon-musicAlbums"></i>
          <p>本地/下载</p>
        </li>
        <li>
          <i class="icon icon-shangchuanyunpan"></i>
          <p>云盘</p>
        </li>
        <li>
          <i class="icon icon-yigou1"></i>
          <p>已购</p>
        </li>
        <li>
          <i class="icon icon-haoyou"></i>
          <p>我的好友</p>
        </li>
        <li>
          <i class="icon icon-shoucang1"></i>
          <p>收藏和赞</p>
        </li>
        <li>
          <i class="icon icon-boke1"></i>
          <p>我的播客</p>
        </li>
        <li>
          <i class="icon icon-tianjia1"></i>
          <p>音乐应用</p>
        </li>
      </ul>
    </section>

    <my-like-music
      :data="playlists[0]"
      v-if="playlists.length !== 0"
      @showPLD="showPLD"
    ></my-like-music>

    <all-playlists :data="playlists" @showPLD="showPLD"></all-playlists>

    <van-popup
      v-model="isShowPLD"
      :overlay="false"
      position="bottom"
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

    <foot-playbar ref="FootPlaybar" :isSlideDown="isShowPLD || isShowSearchUi" />
    <foot-bar :activeIndex="1" />
  </main>
</template>

<script>
import MyLikeMusic from "./childComps/MyLikeMusic";
import AllPlaylists from "./childComps/AllPlaylists.vue";
import PlaylistDetail from "common/PlaylistDetail";

import FootPlaybar from "common/FootPlaybar";
import FootBar from "common/FootBar";
import Top from "common/Top.vue";
import SearchUi from "common/SearchUi";

import { loginStatus } from "network/login";
import { Toast } from "vant";
import { mapState } from "vuex";

export default {
  name: "User",
  components: {
    MyLikeMusic,
    AllPlaylists,
    SearchUi,

    PlaylistDetail,
    FootBar,
    FootPlaybar,
    Top,
  },
  computed: {
    ...mapState({
      userAccount: (state) => state.ua.account,
      userProfile: (state) => state.ua.profile,
      playlists: (state) => state.ua.playlists,
    }),
  },
  data() {
    return {
      isShowPLD: false, //是否显示歌单详情页
      isShowSearchUi: false,
      compUpdateTimer: 0,
      curPL: {}, //当前歌单详情
    };
  },
  methods: {
    showPLD(data) {
      this.compUpdateTimer = new Date().getTime();
      this.curPL = data;
      this.isShowPLD = true;
    },
  },
  created() {
    // 判断登录状
    loginStatus.refresh();
    loginStatus.check().then((res) => {
      console.log("进入用户界面", res);
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
  },
  mounted() {},
};
</script>

<style scoped lang='scss'>
main {
  color: var(--silveryWhite);
  padding-bottom: var(--bottomBarHeight);
  height: 100%;
  overflow: auto;
}

.profile {
  display: flex;
  height: 0.45rem;
  margin: 0.2rem 0.15rem;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .avatar {
    width: 0.45rem;
    height: 0.45rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .info {
    margin-left: 1em;
    .nickname {
      font-size: 0.16rem;
    }
  }
  .icon {
    position: absolute;
    right: 0;
    font-size: 0.24rem;
  }
}

.box {
  background-color: var(--silveryWhite);
  border-radius: 0.1rem;
  padding: 0.12rem 0.16rem;
  margin-top: 0.16rem;
  color: var(--black);
  font-size: 0.14rem;
}
.column {
  padding: 0.2rem 0.1rem;
  ul {
    display: flex;
    flex-wrap: wrap;
    color: var(--shuiniuhui);
    font-size: 0.12rem;

    li {
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 0.2rem;
      &:nth-of-type(-n + 4) {
        margin-top: 0;
      }
      .icon {
        font-size: 0.3rem;
        color: var(--themeRed);
      }
    }
  }
}
</style>