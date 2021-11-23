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
          <span class="tag" v-for="(val, idx) in search_history">{{
            val
          }}</span>
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
          this.search_history=[];
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
    async search(text) {
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
      this.search_history.push(this.search_input);
      localStorage.setItem(
        "search_history",
        JSON.stringify(this.search_history)
      );
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
  padding: 20px 0;

  input {
    width: calc(100% - 88px);
    margin: 0 32px 0 56px;
    padding: 0 8px 8px 8px;
    border-bottom: 1px solid var(--qianhui);
    font-size: 14px;
  }

  .wrapper {
    margin-top: 16px;
    height: calc(100% - 30px);
  }

  .historySearch {
    margin-top: 16px;
    padding: 0 16px;

    display: flex;
    align-items: center;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    .container {
      flex: 1;
      margin: 0 16px;
      display: flex;
      .tag {
        margin-right: 8px;
        display: inline-block;
        height: 25px;
        padding: 0 12px;
        background-color: var(--anlongdanzi);
        border-radius: 16px;
        line-height: 25px;
      }
    }
    .icon.btn {
      font-size: 14px;
      width: 30px;
      height: 30px;
      text-align: center;
    }
  }
  .hotSearch {
    margin-top: 16px;
    font-size: 14px;
    padding: 0 16px;

    h4 {
      margin-bottom: 10px;
    }
    .container {
      ul {
        display: flex;
        flex-wrap: wrap;
        border-radius: 26px;
        background: linear-gradient(145deg, #110f20, #141227);
        box-shadow: 7px 7px 14px #0c0b16;
        padding: 12px;
        li {
          height: 35px;
          width: 50%;
          line-height: 35px;
          padding-left: 4px;
          .serialNumber {
            display: inline-block;
            height: 100%;
            width: 20px;
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
    padding: 0 16px;

    ul {
      li {
        margin-left: 24px;
        color: var(--sliveryWhite);
        height: 40px;
        line-height: 40px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        i {
          display: inline-block;
          position: absolute;
          left: -24px;
          opacity: 0.7;
          line-height: 40px;
        }
        &:hover {
          background-color: rgba(153, 153, 153, 0.1);
        }
      }
    }
  }

  .searchRes {
    padding-bottom: 0.2rem;
    overflow: hidden;
    .searchRes_inner {
      overflow: hidden;
    }
    .searchRes_title {
      margin-bottom: 16px;
      padding: 0 16px;
    }
    .searchRes_list {
      overflow: hidden;
      height: calc(100% - 40px);
      box-shadow: 0 0 5px 5px var(--anlongdanzi);
      padding: 16px 0;
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
        font-size: 11px;
        padding: 8px 16px;
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
            font-size: 14px;
            opacity: 1;
            font-weight: normal;
            line-height: 20px;
          }
          .ar,
          .alia {
            color: var(--silveryWhite);
            opacity: 0.9;
            line-height: 18px;
          }
          .alia {
            font-size: 10px;
          }
        }
        i {
          display: flex;
          width: 30px;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>