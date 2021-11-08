<template>
  <van-popup
    v-model="show"
    class="edit-pl-info"
    position="bottom"
    get-container="#app"
    :overlay="false"
    closeable
    close-icon-position="top-left"
  >
    <div>
      <h3>编辑歌单信息</h3>
      <ul>
        <li>
          <span>更换封面</span>
        </li>
      </ul>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "EditPlInfo",
  props: {
    show: Boolean,
    pl: Object,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
.edit-pl-info {
  width: 100%;
  height: 100%;
  background-color: var(--silveryWhite);
  padding: 16px;
  h3 {
    margin-left: 40px;
    line-height: 22px;
  }
}
</style>