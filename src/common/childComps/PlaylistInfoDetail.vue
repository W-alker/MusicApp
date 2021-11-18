<template>
  <div class="container hideScroll" @click='close'>
      <img class="cover" :src='pl.coverImgUrl'></img>
      <h3 class="title textover-eclipse" v-text="pl.name"></h3>

      <p class="tags">
          标签:
          <span class="tag" v-for='item in pl.tags'>{{item}}</span>
      </p>
      
      <p class="description" v-html="description"></p>

<div class="top-overlay"></div>
      <div class="bottom-overlay"></div>
  </div>
</template>

<script>
export default {
  name: "PlaylistInfoDetail",
  props: {
    pl: {
      required: true,
      type: Object,
    },
  },
  computed: {
    description() {
      if (!this.pl.description) return "暂无信息";
      const des = this.pl.description;
      return des.replace(/\n/g, "<br/>");
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("closeInfoDetail");
    },
  },
};
</script>

<style scoped lang='scss'>
.container {
  height: 100%;
  padding: 80px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--silveryWhite);
  background-color: var(--anlanzi);
  .top-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    content: "";
    display: block;
    height: 80px;
    background: linear-gradient(var(--themeBgc), rgba(0, 0, 0, 0));
  }
  .bottom-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: var(--themeBgc);
    &::after {
      position: absolute;
      top: -60px;
      left: 0;
      right: 0;
      content: "";
      display: block;
      height: 60px;
      background: linear-gradient(rgba(0, 0, 0, 0), var(--themeBgc));
    }
  }
}
.cover {
  width: 220px;
  height: 220px;
  border-radius: 20px;
}
.title {
  width: 100%;
  margin: 20px 0 40px 0;
  font-size: 16px;
  text-align: center;
}
.tags {
  width: 100%;
  font-size: 14px;
  .tag {
    font-size: 12px;
    margin-left: 10px;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0 8px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
  }
}
.description {
  width: 100%;
  opacity: 0.8;
  margin-top: 20px;
  font-size: 14px;
}
</style>