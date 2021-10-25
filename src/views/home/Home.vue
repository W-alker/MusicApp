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

    <banner :banners="banners" :banner_playSong="banner_playSong"></banner>

    <today-recommend :userProfile="userProfile"></today-recommend>

    <personalized-playlist></personalized-playlist>

    <!-- <new-albums-list></new-albums-list> -->

    <!-- <highquality-playlist></highquality-playlist> -->

    <section class="playlists">
      <section
        v-for="(item, index) in playlist"
        :key="index"
        class="clearfix"
        @click="getListDetail(item.id)"
      >
        <img :src="item.coverImgUrl" alt="" class="cover" />
        <p>{{ item.name }}</p>
        <p>{{ item.trackCount }}首</p>
      </section>
    </section>

    <van-popup
      v-model="show_playInterface"
      position="bottom"
      style="width: 100%; height: 100%"
    >
      <play-interface
        class="playInterface"
        :songDetail="songDetail"
        @close_playInterface="closePopup_playInterface"
        @nextSong="nextSong"
        @preSong="preSong"
        @changePlaymode="changePlaymode"
        @pause="pause"
        ref="PlayInterface"
      >
      </play-interface>
    </van-popup>

    <van-popup
      v-model="show_listDetail"
      position="left"
      style="width: 100%; height: 100%"
    >
      <list-detail
        class="listDetail"
        :listDetail="listDetail"
        @close_listDetail="closePopup_listDetail"
        @show_playInterface="showPopup_playInterface"
        @update_songUrl="playSong"
        @startPlay="playAll"
      >
      </list-detail>
    </van-popup>

    <foot-playbar></foot-playbar>
    <foot-bar
      :activeIndex="0"
      :audioUrl="audioUrl"
      :isAutoplay="true"
      :isPause="is_Pause"
      @nextSong="nextSong"
    ></foot-bar>
  </main>
</template>

<script>
import Banner from "./childComps/Banner.vue";

import FootPlaybar from "common/FootPlaybar";
import FootBar from "common/FootBar";

import PlayInterface from "./childComps/PlayInterface";
import ListDetail from "./childComps/ListDetail";
import NewAlbumsList from "./childComps/NewAlbumsList.vue";
import TodayRecommend from "./childComps/TodayRecommend.vue";
import PersonalizedPlaylist from "./childComps/PersonalizedPlaylist";
import HighqualityPlaylist from "./childComps/HighqualityPlaylist.vue";

import {
  getBanner,
  getLoginStatus,
  getUserPlaylist,
  getListDetail,
} from "network/home";
import { getSongUrl, getSongDetail } from "network/song";
import { getUserInfo, getUserAccount } from "network/user";

export default {
  name: "Home",
  components: {
    PlayInterface,
    ListDetail,
    NewAlbumsList,
    TodayRecommend,
    PersonalizedPlaylist,
    HighqualityPlaylist,
    Banner,
    FootBar,
    FootPlaybar,
  },
  data() {
    return {
      banners: [],
      userAccount: {},
      userProfile: {},
      userInfo: {},
      playlist: [], //歌单
      listDetail: {}, //歌单详情
      show_listDetail: false,
      show_playInterface: false,
      audioUrl: "", //音乐链接
      songId: "", //音乐id
      songDetail: {}, //歌曲详情
      is_Pause: false, //是否暂停
      playSongList: [], //播放列表（用户能看到的）
      playmodeId: 0, //播放模式：0顺序播放；1随机播放；2单曲循环
    };
  },
  methods: {
    banner_playSong(song) {
      this.playSong(song);
    },
    getListDetail(id) {
      getListDetail(id).then((res) => {
        this.show_listDetail = true;
        this.listDetail = res.playlist;
      });
    },
    //初始化歌曲链接和详情
    init_songData(id) {
      getSongUrl(id).then((res) => {
        this.audioUrl = res.data[0].url;
      });
      getSongDetail(id).then((res) => {
        this.songDetail = res.songs[0];
      });
    },
    //加入歌单
    addToPlaySongList(arr) {
      for (const item of arr) this.playSongList.push(item);
    },
    //选中歌曲
    playSong(item) {
      //item:歌曲详情
      getSongUrl(item.id).then((res) => {
        this.audioUrl = res.data[0].url; //更改歌曲链接
      });
      this.$store.commit("addSong", item); //加入播放列表
      this.addToPlaySongList([item]); //加入播放列表（用户可见）
      this.songDetail = item; //更改歌曲详情
      this.$refs.PlayInterface.is_pause = false;
    },
    //播放全部
    playAll() {
      //加入播放列表
      this.addToPlaySongList(this.listDetail.trackIds);
      this.$store.commit("updateLists", this.listDetail.trackIds);
      //更改歌单列表id
      this.$store.commit("changePlaylistId", this.listDetail.id);
      //获取当前歌曲id和歌单id
      const songId = this.$store.state.playSongList[0].id;
      const playlistId = this.$store.state.currentPlaylistId;
      //更新歌曲链接
      getSongUrl(songId).then((res) => {
        this.audioUrl = res.data[0].url;
      });
      //重新获取歌曲详情
      getListDetail(playlistId).then((res) => {
        // console.log(res)
        this.songDetail = res.playlist.tracks[0];
      });
      this.$refs.PlayInterface.is_pause = false;
    },
    //暂停
    pause(bol) {
      this.is_Pause = bol;
    },
    //下一首
    nextSong() {
      //如果是随机播放,使用home中的播放列表
      if (this.playmodeId === 1) {
        //生成一个在0到播放列表最大长度-1之间的数
        const m = this.playSongList.length - 1;
        const rd = parseInt(Math.random() * m, 10);
        this.songId = this.playSongList[rd].id;
        this.init_songData(this.songId);
      }
      //更新播放列表
      else {
        this.$store.commit("nextSong");
        //获取播放列表第一首歌曲id
        this.songId = this.$store.state.playSongList[0].id;
        this.init_songData(this.songId);
      }
      this.$refs.PlayInterface.is_pause = false;
    },
    //上一首
    preSong() {
      //更新播放列表
      this.$store.commit("preSong");
      this.songId = this.$store.state.playSongList[0].id;
      this.init_songData(this.songId);
    },
    //更改播放模式
    changePlaymode(mode) {
      this.playmodeId = mode;
    },
    showPopup_listDetail() {
      this.show_listDetail = true;
    },
    closePopup_listDetail() {
      this.show_listDetail = false;
    },
    showPopup_playInterface() {
      this.show_playInterface = true;
    },
    closePopup_playInterface() {
      this.show_playInterface = false;
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

    getUserPlaylist(this.userInfo.userId).then((res) => {
      // console.log(res.playlist);
      this.playlist = res.playlist;
    });
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: calc(100vh - 60px);
  padding: 16px;
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

.playlists {
  margin-top: 20px;
  section {
    margin: 10px 0;
    padding: 8px;
    &:hover {
      background-color: rgb(80, 80, 80);
    }
    .cover {
      width: 68px;
      margin-right: 16px;
      float: left;
      border-radius: 8px;
    }
    p {
      padding-top: 12px;
      &:last-child {
        opacity: 0.6;
        font-size: smaller;
        padding-top: 6px;
      }
    }
  }
}
.playInterface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.listDetail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.footBar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1060;
}
</style>
