<template>
  <section class="playlists">
    <div class="tab">
      <div class="tab_navs">
        <div
          :class="['tab_nav', { active: showCreatePls }]"
          @click="showCreatePls = true"
        >
          <p>创建歌单</p>
        </div>
        <div
          :class="['tab_nav', { active: !showCreatePls }]"
          @click="showCreatePls = false"
        >
          <p>收藏歌单</p>
        </div>
      </div>

      <div class="tab_items">
        <div class="tab_item box" v-show="showCreatePls">
          <h4>
            <span v-cloak>创建歌单({{ createPlaylists.length }}个)</span>
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
              <i
                class="icon icon-gengduo"
                @touchstart.stop="
                  ($event) => $event.target.classList.add('active')
                "
                @touchend.stop="
                  ($event) => $event.target.classList.remove('active')
                "
                @click.stop="showActions(item)"
              ></i>
            </li>
          </ul>
        </div>
        <div class="tab_item box" v-show="!showCreatePls">
          <h4>
            <span v-cloak>收藏歌单({{ collectPlaylists.length }}个)</span>
            <i class="icon icon-gengduo"></i>
          </h4>
          <ul>
            <li
              v-for="(item, index) in collectPlaylists"
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
    <!-- <van-action-sheet v-model="show" :actions="actions" :description="actionSheetDes" @select="onSelect" /> -->
    <van-popup v-model="isShowActions" position="bottom">
      <h4 v-text="actionSheetTit"></h4>
      <ul>
        <li
          @touchstart.stop="($event) => $event.target.classList.add('active')"
          @touchend.stop="($event) => $event.target.classList.remove('active')"
          @click="editPLInfo(choosedPl)"
        >
          <i class="icon icon-bianji"></i>编辑歌单信息
        </li>
        <li
          @touchstart.stop="($event) => $event.target.classList.add('active')"
          @touchend.stop="($event) => $event.target.classList.remove('active')"
        >
          <van-icon name="delete-o" />删除
        </li>
      </ul>
    </van-popup>

    <edit-pl-info :show="isShowEPI" :pl="choosedPl"></edit-pl-info>
  </section>
</template>

<script>
import { getPlaylistDetail } from "network/playlist";
import EditPlInfo from "common/childComps/EditPlInfo";

export default {
  name: "AllPlaylists",
  props: {
    data: Array,
  },
  components: {
    EditPlInfo,
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
    collectPlaylists() {
      const userId = this.$store.state.ua.account.id;
      const res = [];
      for (let item of this.playlists) {
        if (item.userId !== userId) {
          res.push(item);
        }
      }
      return res;
    },
  },
  data() {
    return {
      isShowActions: false,
      actionSheetTit: "",
      choosedPl: {},
      isShowEPI: false,
      showCreatePls: true,
    };
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
    showActions(pl) {
      this.actionSheetTit = "歌单：" + pl.name;
      this.choosedPl = pl;
      this.isShowActions = true;
    },
    editPLInfo(pl) {
      this.isShowActions = false;
      return false;

      this.isShowEPI = true;
    },
    getSTop(node) {
      return node.scrollTop || node.pageYOffset;
    },
  },
};
</script>

<style scoped lang='scss'>
.box {
  background-color: var(--silveryWhite);
  border-radius: 0.1rem;
  // padding: 0.12rem 0.16rem;
  margin-top: 0.16rem;
  color: var(--black);
  font-size: 0.14rem;
}
$touchColor: rgba(0, 0, 0, 0.4);
.playlists {
  margin-top: 0.16rem;
  .tab {
    .tab_navs {
      display: flex;
      align-items: center;
      height: 0.3rem;
      .tab_nav {
        width: 50%;
        text-align: center;
        transition: all ease .3s;
        p {
          line-height: 0.12rem;
          opacity: 0.8;
        }
        &:first-child p {
          border-right: 0.01rem solid #999;
        }
        &.active p {
          position: relative;
          opacity: 1;
          display: flex;
          justify-content: center;
          transform-style: preserve-3d;
          &::before {
            position: absolute;
            bottom: -0.05rem;
            content: "";
            display: inline-block;
            height: 0.06rem;
            width: 4em;
            background-color: var(--darkRed);
            border-radius: 0.03rem;
            transform: translateZ(-0.01rem); // Z轴方向位移-0.01rem
          }
        }
      }
    }
    .tab_items {
      .tab_item {
        padding: 0.2rem 0 0.14rem 0;
        h4:first-child {
          padding: 0 0.16rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.12rem;
          color: var(--shenhui);
          font-weight: normal;
          margin-bottom: 0.06rem;
          .icon {
            display: inline-block;
            width: 0.28rem;
            text-align: center;
          }
        }
        ul {
          li {
            display: flex;
            align-items: center;
            position: relative;
            padding: 0.06rem 0.16rem;
            transition: all 0.5s ease;

            &.active {
              background-color: rgba(0, 0, 0, 0.4);
            }
            .cover {
              width: 0.48rem;
              height: 0.48rem;
              border-radius: 0.08rem;
              background-color: rgb(172, 172, 172);
              background-size: 100% 100%;
            }
            .info {
              margin-left: 0.1rem;
              font-size: 0.14rem;
              p {
                width: 2.2rem;
                max-width: 2.2rem;
              }
              span {
                font-size: smaller;
                opacity: 0.8;
              }
            }
            .icon {
              position: absolute;
              right: 0.16rem;
              top: 20%;
              width: 0.28rem;
              height: 60%;
              display: flex;
              justify-content: center;
              align-items: center;

              color: var(--xinhui);
              &.active {
                background-color: rgba(0, 0, 0, 0.4);
              }
            }
          }
        }
      }
    }
  }
}
.van-popup {
  border-top-left-radius: 0.16rem;
  border-top-right-radius: 0.16rem;
  background-color: var(--silveryWhite) !important;
  color: var(--anlongdanzi);
  font-size: 0.14rem;
  h4 {
    padding: 0.12rem;
    border-bottom: 0.01rem solid var(--qianhui);
    opacity: 0.8;
    font-size: small;
    font-weight: normal;
  }
  ul {
    margin-bottom: 0.1rem;
    li {
      padding: 0 0.12rem;
      height: 0.4rem;
      line-height: 0.4rem;
      .icon,
      .van-icon {
        margin-right: 0.12rem;
      }
      &.active {
        background-color: $touchColor;
      }
    }
  }
}
</style>