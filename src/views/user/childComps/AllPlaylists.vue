<template>
  <section class="playlists">
    <div class="tab">
      <div class="tab_navs">
        <div class="tab_nav active">
          <p>创建歌单</p>
        </div>
        <div class="tab_nav">
          <p>收藏歌单</p>
        </div>
      </div>

      <div class="tab_items">
        <div class="tab_item box">
          <h4>
            <span v-cloak>创建歌单{{ createPlaylists.length }}个</span>
            <i class="icon icon-gengduo"></i>
          </h4>
          <ul>
            <li
              v-for="(item, index) in createPlaylists"
              @touchstart="addActive(index)"
              @touchend="showPLD(index, item)"
              ref="list_item"
            >
              <div
                class="cover"
                :style="{ backgroundImage: 'url(' + item.coverImgUrl + ')' }"
              ></div>
              <div class="info">
                <p class="textover-eclipse" v-text="item.name"></p>
                <span v-cloak>{{ item.trackCount }}首</span>
              </div>
              <i class="icon icon-gengduo"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getPlaylistDetail } from "network/playlist";

export default {
  name: "AllPlaylists",
  props: {
    data: Array,
  },
  computed: {
    playlists() {
      return this.data.slice(1, this.data.length);
    },
    createPlaylists() {
      const userId = this.$store.state.ua.account.id;
      const res = [];
      for (let item of this.playlists) {
        if (item.userId === userId) {
          res.push(item);
        }
      }
      return res;
    },
  },
  data() {
    return {};
  },
  methods: {
    addActive(index) {
      this.$refs.list_item[index].classList.add("active");
    },
    async showPLD(index, item) {
      this.$refs.list_item[index].classList.remove("active");
      const res = await getPlaylistDetail(item.id);
      this.$emit("showPLD", res.playlist);
    },
  },
};
</script>

<style scoped lang='scss'>
.box {
  background-color: var(--silveryWhite);
  border-radius: 10px;
  // padding: 12px 16px;
  margin-top: 16px;
  color: var(--black);
  font-size: 14px;
}
.playlists {
  margin-top: 16px;
  .tab {
    .tab_navs {
      display: flex;
      align-items: center;
      height: 30px;
      .tab_nav {
        width: 50%;
        text-align: center;
        p {
          line-height: 12px;
          opacity: 0.8;
        }
        &:first-child p {
          border-right: 1px solid #999;
        }
        &.active p {
          position: relative;
          opacity: 1;
          display: flex;
          justify-content: center;
          transform-style: preserve-3d;
          &::before {
            position: absolute;
            bottom: -5px;
            content: "";
            display: inline-block;
            height: 6px;
            width: 4em;
            background-color: var(--darkRed);
            border-radius: 3px;
            transform: translateZ(-1px); // Z轴方向位移-1px
          }
        }
      }
    }
    .tab_items {
      .tab_item {
        padding: 20px 0 14px 0;
        h4:first-child {
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--shenhui);
          font-weight: normal;
          margin-bottom: 6px;
          .icon {
            display: inline-block;
            width: 28px;
            text-align: center;
          }
        }
        ul {
          li {
            display: flex;
            align-items: center;
            position: relative;
            padding: 6px 16px;
            transition: all 0.5s ease;

            &.active {
              background-color: rgba(0, 0, 0, 0.4);
            }
            .cover {
              width: 48px;
              height: 48px;
              border-radius: 8px;
              background-color: rgb(172, 172, 172);
              background-size: 100% 100%;
            }
            .info {
              margin-left: 10px;
              font-size: 14px;
              p {
                width: 220px;
                max-width: 220px;
              }
              span {
                font-size: smaller;
                opacity: 0.8;
              }
            }
            .icon {
              position: absolute;
              right: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 28px;
              height: 100%;
              color: var(--xinhui);
            }
          }
        }
      }
    }
  }
}
</style>