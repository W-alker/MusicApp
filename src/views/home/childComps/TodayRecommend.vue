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
          :style="{ backgroundImage: 'url(' + dailysongDetail.al.picUrl + ')' }"
        ></div>
        <p class="item-name textover-eclipse">今日推荐</p>
      </div>
      <div></div>
    </div>
  </section>
</template>

<script>
import { getPersonalFM, getTodaySongs } from "network/recommend";

import { getSongDetail } from "network/song";

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
      dailysongDetail: {
        al: {
          picUrl: "",
        },
        ar: [
          {
            name: "",
          },
        ],
      },
      hello: {
        time() {
          const hour = new Date().getHours();
          if (hour >= 0 && hour < 5) return "凌晨了";
          if (hour >= 5 && hour < 11) return "早上好";
          if (hour >= 11 && hour < 12) return "中午好";
          if (hour >= 12 && hour < 15) return "下午好";
          if (hour >= 15 && hour < 0) return "晚上好";
          return 'Hi'
        },
        speech() {
          const hour = new Date().getHours();
          if (hour >= 0 && hour < 5) return "夜深了，早点休息吧";
          if (hour >= 5 && hour < 11) return "欢迎光临，请随意听听~";
          if (hour >= 11 && hour < 12) return "来点歌曲放松吧~";
          if (hour >= 12 && hour < 15) return "听点宝藏歌曲提提神";
          if (hour >= 15 && hour < 0) return "晚上好";
          return ''
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
      this.dailysongDetail = res.data.dailySongs[0];
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
  margin-bottom: 10px;
  .avatar {
    width: 10vw;
    height: 10vw;
    border-radius: 50%;
  }
  .nickname {
    margin: 0 12px;
  }
}
.inner {
  display: flex;
  .item {
    margin-right: 10px;
    cursor: pointer;
    .container {
      border-radius: 8px;
      height: 12vh;
      background-color: rgb(138, 138, 138);
    }
    .item-name {
      margin-top: 6px;
      font-size: 12px;
    }
  }
  .personal_fm {
    width: 55vw;
    .container {
      background: linear-gradient(#8fb2c9, #baccd9);
      border-radius: 8px;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;

      p {
        font-size: 9px;
        span {
          font-size: 12px;
        }
      }
      .cover {
        position: absolute;
        right: 12px;
        width: calc(12vh - 28px);
        height: calc(12vh - 28px);
        background-color: rgb(138, 132, 132);
        border-radius: 8px;
        background-size: 100% 100%;

        .van-icon {
          position: absolute;
          bottom: 6px;
          left: 6px;
          font-size: 20px;
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