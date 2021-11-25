<template>
  <section class="search-ui">
    <input
      type="text"
      :placeholder="defaultSearchKeyword"
      v-model="search_input"
      @input="getSearchSuggets"
      @keypress="isEnter($event)"
      autofocus
    />

    <div
      class="wrapper"
      v-show="!search_input && !Object.keys(search_res).length"
    >
      <div class="historySearch">
        <span style="font-weight: bold">历史</span>
        <div class="container hideScroll">
          <span
            class="tag"
            v-for="(val, idx) in search_history"
            @click="search(val,false)"
            >{{ val }}</span
          >
        </div>
        <i class="icon icon-shanchu btn" @click.stop="clear_searchHistory"></i>
      </div>

      <div class="hotSearch">
        <h4>热搜榜</h4>
        <div class="container">
          <ul>
            <li
              v-for="(item, idx) in hotSearch"
              :class="['textover-eclipse', { important: idx <= 2 }]"
              @click="search(item.searchWord)"
            >
              <span class="serialNumber">{{ idx + 1 }}</span>
              {{ item.searchWord }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      class="wrapper searchSuggests hideScroll"
      v-show="search_input && !Object.keys(search_res).length"
    >
      <ul>
        <li v-for="item in search_suggests" @click="search(item.keyword)">
          <i class="fa fa-search"></i>
          {{ item.keyword }}
        </li>
      </ul>
    </div>

    <div class="wrapper searchRes" v-show="Object.keys(search_res).length">
      <div class="searchRes_songs searchRes_inner">
        <h4 class="searchRes_title">单曲</h4>
        <div class="searchRes_list" ref="searchRes_list">
          <ul>
            <li v-for="(item, idx) in search_res.songs" @click="playSong(item)">
              <div class="info">
                <h5 class="songName" v-html="highLightKw(item.name)"></h5>
                <p
                  class="ar"
                  v-html="
                    highLightKw(item.ar[0].name) +
                    '-' +
                    highLightKw(item.al.name)
                  "
                ></p>
                <p
                  v-show="item.alia"
                  class="alia"
                  v-html="highLightKw(item.alia[0])"
                ></p>
              </div>
              <i class="icon icon-icon"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
 
<script>
import {
  getDefaultSearchKeyword,
  getHotSearchDetail,
  getSearchSuggests,
  getSearchRes,
} from "network/search";
import IScroll from "assets/js/iscroll-probe";
import { ontouchActive } from "assets/js/util";
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";

export default {
  name: "SearchUi",
  data() {
    return {
      defaultSearchKeyword: "",
      hotSearch: [],
      search_input: "",
      search_history: [],
      search_suggests: [],
      search_res: {},
      searchRes_activeTabIndex: 0,
      iscroll: {},
    };
  },
  watch: {
    search_input() {
      if (!this.search_input) this.search_res = {};
    },
  },
  computed: {
    ...mapState({
      sid: (state) => state.ac.songInfo.id,
    }),
  },
  methods: {
    highLightKw(str) {
      if (str)
        return str.replace(
          this.search_input,
          `<span class='highLight' style='color:var(--qinlan)'>${this.search_input}</span>`
        );
      return "";
    },
    playSong(s) {
      this.$store.commit("addToPIL", s);
      this.$store.dispatch("init_song", s);
    },
    clear_searchHistory() {
      Dialog.confirm({
        message: "清空搜索历史？",
      })
        .then(() => {
          this.search_history = [];
          localStorage.setItem(
            "search_history",
            JSON.stringify(this.search_history)
          );
          Toast("清空搜索历史");
        })
        .catch(() => {});
    },
    async INIT_INFO() {
      const res = await getDefaultSearchKeyword();
      this.defaultSearchKeyword = res.data.showKeyword;
      const res2 = await getHotSearchDetail();
      this.hotSearch = res2.data;
    },
    isEnter(e) {
      if (e.keyCode === 13) this.search();
    },
    async getSearchSuggets() {
      if (!this.search_input) return (this.search_suggests = []);
      const res = await getSearchSuggests(this.search_input);
      this.search_suggests = res.result.allMatch;
    },
    async search(text, remember = true) {
      this.search_input = this.search_input.trim();
      this.search_input =
        text || this.search_input || this.defaultSearchKeyword;

      const res = await getSearchRes(this.search_input, 1, 0);
      this.search_res = res.result;

      setTimeout(() => {
        this.iscroll = new IScroll(this.$refs.searchRes_list, {
          scrollY: true,
        });
      }, 20);

      // 成功后记录历史
      if (remember) {
        this.search_history.push(this.search_input);
        localStorage.setItem(
          "search_history",
          JSON.stringify(this.search_history)
        );
      }
    },
  },
  created() {
    this.INIT_INFO();
    // 恢复搜索历史
    if (localStorage.getItem("search_history"))
      this.search_history = JSON.parse(localStorage.getItem("search_history"));
  },
};
</script>

<style scoped lang='scss'>
.search-ui {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--commonPageBgc);
  color: var(--silveryWhite);
  padding: 0.2rem 0;

  input {
    width: calc(100% - 0.88rem);
    margin: 0 0.32rem 0 0.56rem;
    padding: 0 0.08rem 0.08rem 0.08rem;
    border-bottom: 0.01rem solid var(--qianhui);
    font-size: 0.14rem;
  }

  .wrapper {
    margin-top: 0.16rem;
    height: calc(100% - 0.3rem);
  }

  .historySearch {
    margin-top: 0.16rem;
    padding: 0 0.16rem;

    display: flex;
    align-items: center;
    font-size: 0.14rem;
    height: 0.3rem;
    line-height: 0.3rem;
    .container {
      flex: 1;
      margin: 0 0.16rem;
      display: flex;
      .tag {
        margin-right: 0.08rem;
        display: inline-block;
        height: 0.25rem;
        padding: 0 0.12rem;
        background-color: var(--anlongdanzi);
        border-radius: 0.16rem;
        line-height: 0.25rem;
      }
    }
    .icon.btn {
      font-size: 0.14rem;
      width: 0.3rem;
      height: 0.3rem;
      text-align: center;
    }
  }
  .hotSearch {
    margin-top: 0.16rem;
    font-size: 0.14rem;
    padding: 0 0.16rem;

    h4 {
      margin-bottom: 0.1rem;
    }
    .container {
      ul {
        display: flex;
        flex-wrap: wrap;
        border-radius: 0.26rem;
        background: linear-gradient(145deg, #110f20, #141227);
        box-shadow: 0.07rem 0.07rem 0.14rem #0c0b16;
        padding: 0.12rem;
        li {
          height: 0.35rem;
          width: 50%;
          line-height: 0.35rem;
          padding-left: 0.04rem;
          .serialNumber {
            display: inline-block;
            height: 100%;
            width: 0.2rem;
            opacity: 0.7;
          }
          &:hover {
            background-color: var(--anlongdanzi);
          }
          &.important {
            font-weight: bold;
            .serialNumber {
              color: var(--qiuhaitanghong);
            }
          }
        }
      }
    }
  }

  .searchSuggests {
    padding: 0 0.16rem;

    ul {
      li {
        margin-left: 0.24rem;
        color: var(--sliveryWhite);
        height: 0.4rem;
        line-height: 0.4rem;
        padding-bottom: 0.06rem;
        border-bottom: 0.01rem solid rgba(255, 255, 255, 0.2);
        position: relative;
        i {
          display: inline-block;
          position: absolute;
          left: -0.24rem;
          opacity: 0.7;
          line-height: 0.4rem;
        }
        &:hover {
          background-color: rgba(153, 153, 153, 0.1);
        }
      }
    }
  }

  .searchRes {
    padding-bottom: 20px;
    overflow: hidden;
    .searchRes_inner {
      overflow: hidden;
    }
    .searchRes_title {
      margin-bottom: 0.16rem;
      padding: 0 0.16rem;
    }
    .searchRes_list {
      overflow: hidden;
      height: calc(100% - 0.4rem);
      box-shadow: 0 0 0.05rem 0.05rem var(--anlongdanzi);
      padding: 0.16rem 0;
      ul {
        padding-bottom: var(--footbarHeight);
      }
    }
  }

  .searchRes_songs {
    height: 100%;
    ul {
      li {
        display: flex;
        font-size: 0.11rem;
        padding: 0.08rem 0.16rem;
        &:hover {
          background-color: var(--anlongdanzi);
        }
        &.active {
          background-color: var(--anlongdanzi);
        }
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .songName {
            color: var(--White);
            font-size: 0.14rem;
            opacity: 1;
            font-weight: normal;
            line-height: 0.2rem;
          }
          .ar,
          .alia {
            color: var(--silveryWhite);
            opacity: 0.9;
            line-height: 0.18rem;
          }
          .alia {
            font-size: 0.1rem;
          }
        }
        i {
          display: flex;
          width: 0.3rem;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>