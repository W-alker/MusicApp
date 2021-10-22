<template>
  <section>
    <h3 class="sec-tit">你的私荐歌单</h3>
    <div class="inner">
      <ul>
        <li>
          <div class="cover"></div>
          <p class="list-name textover-eclipsis-2">
            测试文本测试文本测试文本测试文本测试文本测试文本测试文本
          </p>
        </li>
        <li>
          <div class="cover"></div>
          <p class="list-name"></p>
        </li>
        <li>
          <div class="cover"></div>
          <p class="list-name"></p>
        </li>
        <li>
          <div class="cover"></div>
          <p class="list-name"></p>
        </li>
        <li>
          <div class="cover"></div>
          <p class="list-name"></p>
        </li>
        <li>
          <div class="cover"></div>
          <p class="list-name"></p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "RecommendPlaylist",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
section {
  margin-top: 20px;
}
.inner {
  overflow: auto;
  ul {
    width: 168vw;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 25vw;
      flex-shrink: 0;
      margin: 0 3vw 0 0;

      .cover {
        width: 100%;
        height: 25vw;
        background-color: #fff;
        border-radius: 10px;
      }
      .list-name {
          margin-top: 5px;
          font-size: 12px;
      }
    }
  }
}
</style>