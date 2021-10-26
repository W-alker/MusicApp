<template>
  <section class="playing-list-card--fixed">
    <h3>当前播放</h3>
    <div class="row actions"></div>
    <ul class="list">
      <li>
        <p class="textover-eclipse">
          <span class="songName">{{ songName }}</span>
          -
          {{ arName }}
        </p>
        <van-icon name="close" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "PlayingListCard",
  computed: {
    songName() {
      return this.$store.state.ac.songInfo.al.name;
    },
    arName() {
      return this.$store.state.ac.songInfo.arName;
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.playing-list-card--fixed {
  width: 3.36rem;
  height: 4.46rem;
  margin: 0.19rem;
  background-color: #fff;
  border-radius: 0.16rem;
  padding: 0.16rem;
}
.list {
  margin-top: 20px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    p {
      font-size: 11px;
      width: 60%;
      span {
        font-size: 14px;
        margin-right: 8px;
      }
    }
    .van-icon {
        display: inline-block;

    }
  }
}
</style>