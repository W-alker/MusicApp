<template>
  <section class="recommend">
    <h3 class="sec-tit">
      Hi <span v-cloak> {{ userInfo.nickname }}</span> 今日为你推荐
    </h3>
    <div class="inner">
      <ul class="">
        <li>
          <div class="cover-box"></div>
          <p class="textover-eclipsis-2">
            测试文本测试文本测试文本测试文本测试文本
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "TodayRecommend",
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
p.hello {
  span {
    margin: 0 0.6em 0 0.2em;
  }
}
::-webkit-scrollbar {
  display: none;
}
.inner {
  margin: 14px 0;
  ul {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    li {
      flex-shrink: 0;
      width: 25vw;
      margin-right: 3vw;
      .cover-box {
        width: 100%;
        height: 25vw;
        background-color: #fff;
        border-radius: 10px;
      }
      p {
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
}
</style>