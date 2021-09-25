<template>
  <main>
    <van-row type="flex" class="btn-group">
      <van-col :span="4" @click="close"
        ><van-icon class-prefix="icon" name="zuojiantou1" class="btn"
      /></van-col>
      <van-col :span="16" class="title">
        <p>{{ songDetail.name }}</p>
        <p>
          <span v-for="(ar, i) in songDetail.ar" :key="i">
            {{ ar.name }}
            <span v-if="i === 0 && songDetail.ar.length > 1">/</span>
          </span>
        </p>
      </van-col>
      <van-col :span="4"
        ><van-icon class-prefix="icon" name="share" class="btn"
      /></van-col>
    </van-row>

    <van-row class="profile" type="flex" justify="center">
      <van-col>
        <img :src="songDetail.al.picUrl" alt="" />
      </van-col>
    </van-row>

    <van-row class="lyric">
      <div :key="curLyric[0].timesec">
        <!-- 动态刷新 -->
        <p v-for="(item, index) in curLyric" :key="index">{{ item.lrc }}</p>
      </div>
    </van-row>

    <van-row class="btn-group" type="flex" justify="space-around">
      <van-col
        ><van-icon class="btn" class-prefix="icon" name="20_xihuan"></van-icon
      ></van-col>
      <van-col
        ><van-icon class="btn" class-prefix="icon" name="xiazai1"></van-icon
      ></van-col>
      <van-col
        ><van-icon
          class="btn"
          class-prefix="icon"
          name="renwuzhongxin-huodepinglun"
        ></van-icon
      ></van-col>
      <van-col
        ><van-icon class="btn" class-prefix="icon" name="icon"></van-icon
      ></van-col>
    </van-row>

    <van-row class="progress">
      <van-progress
        :percentage="50"
        :stroke-width="7"
        pivot-text="."
        pivot-color="rgb(255,255,255)"
        color="linear-gradient(to right,rgb(142,142,142),rgb(250,250,250)"
        track-color="linear-gradient(rgb(45,45,45),rgb(67,78,72))"
      />
      <p class="progress-time">
        <span>{{ timeCount }}</span>
        <span>{{ endtime }}</span>
      </p>
    </van-row>

    <van-row class="btn-group playbtns">
      <van-col :span="6">
        <van-icon
          class-prefix="icon"
          :name="playmode"
          class="btn"
          @click="changePlaymode"
        />
      </van-col>
      <van-col :span="6">
        <van-icon class-prefix="icon" name="icon-" class="btn" />
      </van-col>
      <van-col :span="12">
        <van-icon
          class-prefix="icon"
          name="next"
          class="btn btn-previous"
          @click="previous"
        />
        <van-icon
          class-prefix="icon"
          :name="playOrpause"
          class="btn btn-play"
          @click="isPause"
        />
        <van-icon
          class-prefix="icon"
          name="next"
          class="btn btn-next"
          @click="next"
        />
      </van-col>
    </van-row>
  </main>
</template>

<script>
import { getSongLyric } from "network/home";

export default {
  name: "PlayInterface",
  props: {
    songDetail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      playmodeId: 0, //0代表顺序播放；1代表随机播放；2代表单曲循环
      lyricData: "",
      timeCount: 0,
      is_pause: false,
      bc_lyric: [],
      countInterval: setInterval(() => {
          //判断歌词刷新,间隔100ms
          if (this.bc_lyric.length === 0) this.bc_lyric = this.lyric;
          if (this.timeCount === this.bc_lyric[0].timesec) {
            // this.curLyric = this.lyric.slice(i, 6);
            this.bc_lyric.shift(1);
          }
          this.timeCount += 1;
        }, 100)
    };
  },
  watch: {
    songDetail: {
      handler() {
        //获取歌词
        getSongLyric(this.songDetail.id).then((res) => {
          this.lyricData = res.lrc.lyric;
          console.log(this.lyric);
          //备份歌词
          this.bc_lyric = this.lyric;
        });
        //开始计数
        this.timeCount = 0;
        clearInterval(this.countInterval);
        this.countInterval;
      },
    },
  },
  computed: {
    songDt() {
      return this.songDetail.dt; //歌曲长度的毫秒数
    },
    /*     curtime() {
      let miu = this.timeCount / 60;
      return `${parseInt(miu)}:${Math.ceil(
        Math.ceil(miu.toFixed(4) * 600).toFixed(2)
      )}`;
    }, */
    endtime() {
      let miu = this.songDt / 60000;
      return `${parseInt(miu)}:${Math.ceil(Math.ceil(miu.toFixed(2) * 6))}`;
    },
    lyric() {
      const data = this.lyricData.split("\n");
      let arr = [];
      for (const i in data) {
        //处理时间格式，以毫秒计数
        const time = data[i].split("]")[0].slice(1); //原始格式
        const timesec =
          parseInt(time.split(":")[0]) * 600 +
          parseInt(time.split(":")[1]) * 10;
        arr[i] = {
          time,
          timesec,
          lrc: data[i].split("]")[1],
        };
      }
      return arr;
    },
    curLyric() {
      return this.bc_lyric.slice(0, 6);
    },
    playmode() {
      if (this.playmodeId === 1) return "suijibofang";
      else if (this.playmodeId === 2) return "danquxunhuan";
      return "shunxubofang";
    },
    playOrpause() {
      if (this.is_pause === false) return "zantingtingzhi";
      return "bofang";
    },
  },
  methods: {
    close() {
      this.$emit("close_playInterface");
    },
    isPause() {
      this.is_pause = !this.is_pause;
      this.$emit("pause", this.is_pause);
    },
    next() {
      this.$emit("nextSong");
      //重置播放暂停按钮
      this.is_pause = false;
      this.$emit("isPause", this.is_pause);
    },
    previous() {
      this.$emit("preSong");
      //重置播放暂停按钮
      this.is_pause = false;
      this.$emit("isPause", this.is_pause);
    },
    changePlaymode() {
      //更改模式图标
      if (this.playmodeId === 0) this.playmodeId = 1;
      else if (this.playmodeId === 1) this.playmodeId = 2;
      else this.playmodeId = 0;
      //传给home播放模式
      this.$emit("changePlaymode", this.playmodeId);
    },
  },
  created() {
    //获取歌词
    getSongLyric(this.songDetail.id).then((res) => {
      this.lyricData = res.lrc.lyric;
      console.log(this.lyric);
      //备份歌词
      this.bc_lyric = this.lyric;
    });
  },
  updated() {},
};
</script>

<style lang="scss" scoped>
@mixin neumorphism {
  border-radius: 50%;
  background: linear-gradient(145deg, rgb(85, 86, 92), rgb(48, 48, 53));
  box-shadow: 4px 4px 8px #1e1f23, -4px -4px 8px #4a4b55;
}

main {
  padding: 30px 20px;
  color: aliceblue;
  background-image: linear-gradient(
    rgb(52, 53, 60),
    rgb(42, 43, 48),
    rgb(28, 29, 32)
  );
}
.btn {
  display: inline-block;
  width: 36px;
  height: 36px;
  background-color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 36px;
  font-size: larger;
  @include neumorphism;
}
.btn-group {
  height: 12%;
  align-items: center;
  &:first-child {
    margin-top: 0;
  }
  .title {
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 223px;
    p:first-child {
      font-size: larger;
      font-weight: bold;
      letter-spacing: 1px;
    }
  }
  .van-col {
    text-align: center;
  }
}
.profile {
  width: 100%;
  height: 34%;
  align-items: center;
  .van-col {
    max-width: 220px;
    max-height: 220px;
    width: 60%;
    height: 100%;
    border: 4px solid rgb(78, 78, 84);
    border-radius: 50%;
    background: linear-gradient(145deg, #4b4b51, #3f3f44);
    box-shadow: 10px 10px 20px #252528, -10px -10px 20px #676770;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: rotate 15s infinite linear;
      transform-origin: center;
      vertical-align: middle;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes translate {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

.lyric {
  position: relative;
  margin: 20px 0 10px 0;
  height: 20%;
  max-height: calc(20% - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: smaller;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-align: center;
  /*   div {
    animation: translate 60s infinite linear;
  } */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0.8;
    background-image: linear-gradient(
      rgb(43, 44, 49),
      transparent,
      rgb(38, 39, 43)
    );
  }
}

.progress {
  height: 10%;
  padding-top: 10px;
  .progress-time {
    margin-top: 6px;
    font-size: x-small;
    opacity: 0.8;
    span {
      &:last-child {
        float: right;
      }
    }
  }
}

.playbtns {
  text-align: center;
  .van-col:last-child {
    font-size: smaller;
    transform: translateY(-6px);
    .btn-previous {
      transform: translate(-6px, -10px);
      position: relative;
    }
    .btn-next {
      transform: translate(6px, -10px) rotate(180deg);
      background: linear-gradient(145deg, rgb(48, 48, 53), rgb(85, 86, 92));
      box-shadow: 4px 4px 8px #4a4b55, -4px -4px 8px #1e1f23;
    }
    .btn-play {
      width: 60px;
      height: 60px;
      transform: translateY(-10px);
      line-height: 60px;
      font-size: 24px;
      text-indent: 0.2em;
      position: relative;
    }
  }
}
</style>
