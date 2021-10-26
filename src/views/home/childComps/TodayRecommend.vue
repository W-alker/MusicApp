<template>
  <section class="recommend">
    <h3>
      <img :src="userProfile.avatarUrl" alt="" class="avatar" />
      <span class="nickname">{{ userProfile.nickname }}</span>
    </h3>
    <div class="inner">
      <div class="item personal_fm">
        <div class="container">
          <h3>私人FM</h3>
          <p class="hello">
            <i class="icon icon"></i> <span>{{ hello.time() }}</span> <br />
            {{ hello.speech() }}
          </p>
          <div
            class="cover"
            :style="{ backgroundImage: 'url(' + fmsongDetail.al.picUrl + ')' }"
            @click="playSong"
          >
            <van-icon name="play-circle-o" />
          </div>
        </div>
        <p class="item-name textover-eclipse" v-cloak>
          {{ fmsongDetail.al.name }} - {{ fmsongDetail.ar[0].name }}
          <span v-if="fmsongDetail.ar.length > 2"
            >/{{ fmsongDetail.ar[2].name }}</span
          >
        </p>
      </div>
      <div class="item songs">
        <div
          class="container"
          :style="{ backgroundImage: 'url(' + dailySongs[0].al.picUrl + ')' }"
          @click="showList"
        ></div>
        <p class="item-name textover-eclipse">今日推荐</p>
      </div>
      <div></div>
    </div>
  </section>
</template>

<script>
import { getPersonalFM, getTodaySongs } from "network/recommend";

import { getSongDetail, getSongUrl } from "network/song";

export default {
  name: "TodayRecommend",
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      fm: {},
      fmSongs: [],
      fmsongDetail: {
        al: {
          picUrl: "",
        },
        ar: [
          {
            name: "",
          },
        ],
      },
      dailySongs: [
        {
          al: {
            picUrl: "",
          },
          ar: [
            {
              name: "",
            },
          ],
        },
      ],
      hello: {
        time() {
          const hour = new Date().getHours();
          if (hour >= 0 && hour < 5) return "凌晨了";
          if (hour >= 5 && hour < 11) return "早上好";
          if (hour >= 11 && hour < 12) return "中午好";
          if (hour >= 12 && hour < 15) return "下午好";
          if (hour >= 15 && hour < 0) return "晚上好";
          return "Hi";
        },
        speech() {
          const hour = new Date().getHours();
          if (hour >= 0 && hour < 5) return "夜深了，早点休息吧";
          if (hour >= 5 && hour < 11) return "欢迎光临，请随意听听~";
          if (hour >= 11 && hour < 12) return "来点歌曲放松吧~";
          if (hour >= 12 && hour < 15) return "听点宝藏歌曲提提神";
          if (hour >= 15 && hour < 0) return "晚上好";
          return "";
        },
      },
    };
  },
  methods: {
    async initPersonalFM() {
      const fm = await getPersonalFM();
      this.fm = fm.data;
      const song = await getSongDetail(this.fm[0].id);
      this.fmsongDetail = song.songs[0];
    },
    async initTodaySongs() {
      const res = await getTodaySongs();
      this.dailySongs = res.data.dailySongs;
    },
    async playSong() {
      // 判断是否首次加载
      if (!this.$store.state.ac.songInfo.url) {
        // 查询播放链接并拼接到一起
        const res = await getSongUrl(this.fmsongDetail.id);
        this.fmsongDetail.url = res.data[0].url;
        // 触发公共事件
        this.$store.commit("init", this.fmsongDetail);
      }
      // 如果不是则只执行暂停或播放
      this.$store.commit("playOrPause");
    },
    showList() {
      this.$emit("showDailyPL", this.dailySongs);
    },
  },
  created() {
    this.initPersonalFM();
    this.initTodaySongs();
  },
};
</script>

<style scoped lang='scss'>
::-webkit-scrollbar {
  display: none;
}
h3 {
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
  .avatar {
    width: 10vw;
    height: 10vw;
    border-radius: 50%;
  }
  .nickname {
    margin: 0 0.12rem;
  }
}
.inner {
  display: flex;
  .item {
    margin-right: 0.1rem;
    cursor: pointer;
    .container {
      border-radius: 0.08rem;
      height: 12vh;
      background-color: rgb(138, 138, 138);
    }
    .item-name {
      margin-top: 0.06rem;
      font-size: 0.12rem;
    }
  }
  .personal_fm {
    width: 55vw;
    .container {
      background: linear-gradient(#8fb2c9, #baccd9);
      border-radius: 0.08rem;
      padding: 0.14rem 0.12rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;

      p {
        font-size: 0.09rem;
        span {
          font-size: 0.12rem;
        }
      }
      .cover {
        position: absolute;
        right: 0.12rem;
        width: calc(12vh - 0.28rem);
        height: calc(12vh - 0.28rem);
        background-color: rgb(138, 132, 132);
        border-radius: 0.08rem;
        background-size: 100% 100%;

        .van-icon {
          position: absolute;
          bottom: 0.06rem;
          left: 0.06rem;
          font-size: 0.2rem;
        }
      }
    }
  }
  .songs {
    width: 12vh;
    .container {
      background-size: 100% 100%;
    }
  }
}
</style>