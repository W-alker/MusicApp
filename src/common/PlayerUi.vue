<template>
  <section class="player-ui">
    <div class="row top">
      <!-- <i class="icon icon-zuojiantou"></i> -->
      <!--       <div class="name">
        <h4 class="songName textover-eclipse">{{ songName }}</h4>
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div> -->
    </div>

    <div class="center"></div>

    <div class="row info">
      <div class="name">
        <h4 class="songName textover-eclipse">{{ songName }}</h4>
        <h5 class="arName textover-eclipse">{{ arName }}</h5>
      </div>
    </div>

    <div class="row actions">
      <i class="icon icon-xiazai1"></i>
      <i class="icon icon-xihuan-tianjia"></i>
      <i class="icon icon-renwuzhongxin-huodepinglun"></i>
      <i class="icon icon-icon"></i>
    </div>

    <div class="progress row">
      <van-progress :percentage="50" />
    </div>

    <div class="ctrlBtns row">
      <i class="icon icon-shunxubofang"></i>
      <i class="icon icon-next"></i>
      <i
        :class="['icon', { 'icon-zantingtingzhi': !isPause },{'icon-bofang1':isPause},'pauseBtn']"
        @click="pauseCtrl"
      ></i>
      <i class="icon icon-next"></i>
      <i class="icon icon-bofangliebiao"></i>
    </div>
  </section>
</template>

<script>
export default {
  name: "PlayerUi",
  computed: {
    songName() {
      return this.$store.state.ac.songInfo.al.name;
    },
    arName() {
      return this.$store.state.ac.songInfo.arName;
    },
    isPause() {
      return this.$store.state.ac.isPause;
    },
  },
  data() {
    return {};
  },
  methods: {
    pauseCtrl() {
      this.$store.commit("playOrPause");
    },
  },
};
</script>

<style scoped lang='scss'>
.player-ui {
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: var(--commonPageBgc);
  color: #f1f0ed;
  padding: 2em;
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .top {
    height: 6%;
    justify-content: center;
    .name {
      text-align: center;
      width: 30%;
      height: 100%;
    }
  }
  .center {
    height: 55%;
  }
  .info {
    height: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .songName {
      font-size: 18px;
    }
    .arName {
      margin-top: 1vh;
      font-size: 14px;
      opacity: 0.6;
    }
  }
  .actions {
    height: 7%;
    .icon {
      display: inline-block;
      font-size: 20px;
    }
  }
  .progress {
    height: 9%;
  }
  .ctrlBtns {
    height: 10%;
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15%;
      height: 80%;
      font-size: 24px;
      cursor: pointer;
    }
    .pauseBtn {
      width: 69px;
      height: 69px;
      background: #ef019f;
      border-radius: 50%;
    }
  }
}
</style>