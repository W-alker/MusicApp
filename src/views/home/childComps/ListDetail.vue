<template>
  <main>
    <section class="profile clearfix">
      <img :src="listDetail.coverImgUrl" alt="" />
      <h2>{{ listDetail.name }}</h2>
    </section>

    <van-row class="btn-group">
      <van-col span="2" class="btn-playAll" @click="addLists">
        <van-icon class-prefix="icon" name="bofang" />
      </van-col>
      <van-col span="7" offset="1" @click="addLists">播放全部</van-col>
      <van-col offset="12" span="2" @click="close">
        <van-icon class-prefix="icon" name="zuojiantou1" />
      </van-col>
    </van-row>

    <section class="tracks_list">
      <section
        v-for="(item, index) in listDetail.tracks"
        :key="index"
        class="song_sec clearfix"
        @click="playSong(item)"
      >
        <span class="song_num">{{ index + 1 }}</span>
        <!-- <img :src="item.al.picUrl" alt="" class="cover_pic" /> -->
        <p class="song_name">{{ item.name }}</p>
        <p class="song_artists">
          <span v-for="(ar, index) in item.ar" :key="index">
            {{ ar.name }}
            <span v-if="index === 0 && item.ar.length > 1">/</span>
          </span>
          <span> - {{ item.al.name }}</span>
        </p>

        <div class="btn">
          <van-icon class-prefix="icon" name="icon" />
        </div>
      </section>
    </section>
  </main>
</template>

<script>

export default {
  name: "ListDetail",
  components: {},
  props: {
    listDetail: Object,
  },
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit("close_listDetail");
    },
    playSong(item) {
      //发送事件
      this.$emit("update_songUrl",item);
    },
    //加入歌单
    addLists() {
      //开始播放
      this.$emit('startPlay')
    }
  },
  created() {
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
@mixin neumorphism {
  border-radius: 10px;
  background: #46464c;
  box-shadow: -5px 5px 10px #353539, 5px -5px 10px #58585f;
}

main {
  padding: 30px 20px;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-image: linear-gradient(
    rgb(52, 53, 60),
    rgb(42, 43, 48),
    rgb(28, 29, 32)
  );
}

.profile {
  img {
    width: 88px;
    height: 88px;
    float: left;
    margin-right: 20px;
  }
}

.btn-group {
  margin: 20px 10px;
  .btn-playAll {
    width: 26px;
    height: 26px;
    background-color: rgba(255, 55, 55, 0.8);
    text-align: center;
    line-height: 26px;
    border-radius: 50%;
    font-size: smaller;
  }
}

.tracks_list {
  margin-top: 30px;
  //   padding: 10px 0;
  //   @include neumorphism;
  .song_sec {
    height: 60px;
    margin: 7px 0;
    padding: 5px 10px;
    position: relative;
    &:hover {
      background-color: rgb(80, 80, 80);
    }
  }
  .song_num {
    float: left;
    display: block;
    width: 50px;
    height: 100%;
    line-height: 50px;
    text-align: center;
    margin-right: 10px;
  }
  .song_name {
    width: calc(100% - 110px);
    height: 25px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .song_artists {
    @extend .song_name;
    font-size: small;
    opacity: 0.8;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 50px;
    height: 100%;
    text-align: center;
    line-height: 60px;
    &:hover {
      background-color: rgb(80, 80, 80);
    }
  }
  .cover_pic {
    width: 40px;
    height: 40px;
  }
}
</style>