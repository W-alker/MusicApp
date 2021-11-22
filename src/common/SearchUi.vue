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
        <i class="icon icon-shanchu btn"></i>
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
      <van-tabs v-model="searchRes_activeTabIndex">
        <van-tab title="单曲">
          <div class="searchRes_songs hideScroll">
            <ul>
              <li v-for="(item, idx) in search_res.songs">
                  <h5 class="songName">{{item.name}}</h5>
                  <p class="info">{{item.ar[0].name}} - {{item.al.name}}</p> 
                  <p v-show="item.alia" class="alia">{{item.alia[0]}}</p>
              </li>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
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

export default {
  name: "SearchUi",
  data() {
    return {
      defaultSearchKeyword: "",
      hotSearch: [],
      search_input: "",
      search_history: ["ddd", "cccc", "wewqewew", "ewrewrer", "erewrwerewr"],
      search_suggests: [],
      search_res: {},
      searchRes_activeTabIndex: 0,
    };
  },
  methods: {
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
      if (!text) text = this.search_input || this.defaultSearchKeyword;
      const res = await getSearchRes(text, 1, 0);
      this.search_res = res.result;
    },
  },
  created() {
    this.INIT_INFO();
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

  padding: 20px 16px;
  input {
    width: calc(100% - 60px);
    margin: 0 16px 0 40px;
    padding: 0 8px 8px 8px;
    border-bottom: 1px solid var(--qianhui);
  }

  .wrapper {
      height: calc(100% - 30px);
  }

  .historySearch {
    margin-top: 16px;
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
    ul {
      margin-top: 14px;
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

  .searchRes_songs {
      height: 100%;
      ul {
          li {
              display: flex;
              flex-direction: column;
              justify-content: center;

              font-size: 11px;
              opacity: .8;
              .songName {
                  color: var(--White);
                  font-size: 14px;
                  opacity: 1;
              }
              .info,.alia {
              color: var(--silveryWhite);
                  opacity: 0.9;
              }
          }
      }
  }
}
.van-tabs {
    height: 100%;
    color: var(--white);
    .van-tabs__content,.van-tab__pane {
        height: calc(100% - 30px);
    }
}
</style>