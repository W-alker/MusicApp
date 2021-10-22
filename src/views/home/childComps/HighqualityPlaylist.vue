<template>
  <section>
    <h3 class="sec-tit">精品歌单分类</h3>
    <div class="inner">
      <ul>
        <li>
          <div class="cover"></div>
          <p class="list-name textover-eclipsis-2">
              华语
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
  name: "HighqualityPlaylist",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
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
      width: 22vw;
      flex-shrink: 0;
      margin: 0 3vw 3vw 0;

      .cover {
        width: 100%;
        height: 20vw;
        background-color: #fff;
        border-radius: 10px;
      }
      .list-name {
          text-align: center;
          margin-top: 5px;
          font-size: 12px;
      }
    }
  }
}
</style>