<template>
  <main class="home">
    <van-row class="profile">
      <van-col span="4" class="avatar">
        <img :src="userInfo.avatarUrl" alt="" />
      </van-col>
      <van-col span="19" offset="1" class="nickname">
        <h2>{{ userInfo.nickname }}</h2>
      </van-col>
    </van-row>

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
        @pause='pause'
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

    <van-row @click="showPopup_playInterface" class="footBar">
      <foot-bar
        :audioUrl="audioUrl"
        :isAutoplay="true"
        :isPause="is_Pause"
        @nextSong="nextSong"
      ></foot-bar>
    </van-row>
  </main>
</template>

<script>
import PlayInterface from "./childComps/PlayInterface";
import ListDetail from "./childComps/ListDetail";
import FootBar from "./childComps/FootBar";

import {
  getLoginStatus,
  getUserPlaylist,
  getListDetail,
  getSongUrl,
  getSongDetail,
} from "network/home";

export default {
  name: "Home",
  components: {
    PlayInterface,
    ListDetail,
    FootBar,
  },
  data() {
    return {
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
      this.$refs.PlayInterface.is_pause=false
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
      this.$refs.PlayInterface.is_pause=false
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
        const m = this.playSongList.length-1;
        const rd = parseInt(Math.random()*m,10);
        this.songId = this.playSongList[rd].id;
        this.init_songData(this.songId)
      }
      //更新播放列表
      else {
        this.$store.commit("nextSong");
        //获取播放列表第一首歌曲id
        this.songId = this.$store.state.playSongList[0].id;
        this.init_songData(this.songId)
      }
      this.$refs.PlayInterface.is_pause=false
    },
    //上一首
    preSong() {
      //更新播放列表
      this.$store.commit("preSong");
      this.songId = this.$store.state.playSongList[0].id;
      this.init_songData(this.songId)
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
  created() {
    //初始化用户信息和歌单
    getLoginStatus()
      .then((res) => {
        // console.log(res.data.profile);
        this.$store.state.userInfo = res.data.profile;
        this.userInfo = this.$store.state.userInfo;
      })
      .then(() => {
        getUserPlaylist(this.userInfo.userId).then((res) => {
          // console.log(res.playlist);
          this.playlist = res.playlist;
        });
      });
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  color: aliceblue;
  background-image: linear-gradient(
    rgb(52, 53, 60),
    rgb(42, 43, 48),
    rgb(28, 29, 32)
  );
}
.profile {
  height: 10%;
  .avatar {
    img {
      width: 68px;
      height: 68px;
      border-radius: 50%;
    }
  }
  .nickname {
  }
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
