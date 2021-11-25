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
  padding: 0.8rem 0.3rem;
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
    height: 0.8rem;
    background: linear-gradient(var(--themeBgc), rgba(0, 0, 0, 0));
  }
  .bottom-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.6rem;
    background-color: var(--themeBgc);
    &::after {
      position: absolute;
      top: -0.6rem;
      left: 0;
      right: 0;
      content: "";
      display: block;
      height: 0.6rem;
      background: linear-gradient(rgba(0, 0, 0, 0), var(--themeBgc));
    }
  }
}
.cover {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.2rem;
}
.title {
  width: 100%;
  margin: 0.2rem 0 0.4rem 0;
  font-size: 0.16rem;
  text-align: center;
}
.tags {
  width: 100%;
  font-size: 0.14rem;
  .tag {
    font-size: 0.12rem;
    margin-left: 0.1rem;
    display: inline-block;
    height: 0.22rem;
    line-height: 0.22rem;
    padding: 0 0.08rem;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 0.12rem;
  }
}
.description {
  width: 100%;
  opacity: 0.8;
  margin-top: 0.2rem;
  font-size: 0.14rem;
}
</style>