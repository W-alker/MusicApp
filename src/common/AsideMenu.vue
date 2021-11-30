<template>
  <div class="aside-menu hideScroll">
    <div class="profile">
      <img class="avatar" :src='profile.avatarUrl'></img>
      <h2 v-cloak class="nickname"> {{profile.nickname}} <i class="icon icon-youjiantou"></i></h2>
    </div>

    <ul class="ul1">
      <li @click='showMsg'>
        <i class="fa fa-envelope-o" aria-hidden="true"></i>
        我的消息
        <i class="icon icon-youjiantou"></i>
      </li>
      <li @click="yunbeiSign">
        <i class="icon icon-yunbeiguanli"></i>
        云贝签到（点击一键签到）
        <i class="icon icon-youjiantou"></i>
      </li>
    </ul>

      <ul class="ul2">
        <h3 class="tit">其他</h3>
        <li>
          <i class="fa fa-cog" aria-hidden="true"></i>
          设置
          <i class="icon icon-youjiantou"></i>
        </li>
        <li @click="isShowAbout=true">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
          关于
          <i class="icon icon-youjiantou"></i>
        </li>
        <li @click='showSuggestion'>
          <i class="fa fa-paper-plane" aria-hidden="true" style="font-size:13px"></i>
          提交反馈
          <i class="icon icon-youjiantou"></i>
        </li>
        <li @click='signOut'>
          <i class="fa fa-sign-out" aria-hidden="true"></i>
          退出登录
          <i class="icon icon-youjiantou"></i>
        </li>
      </ul>

      <div class="ul3">
        <h4 class="tit">最新建议（只显示最近三十条）：</h4>
        <ul>
           <div class="container hideScroll" v-if="suggests.length!==0">
             <li v-for="(item,index) in suggests">
               <img :src="item.avatarUrl" alt="" class="avatar">
               <div class="info">
                  <p v-cloak>{{item.nickname}} <span class="userAgent">来自 {{item.userAgent}} - </span></p>
                  <p class="text textover-eclipse" v-cloak>{{item.time}}: {{item.text}}</p>
               </div>
             </li>
           </div>
           <li v-if="suggests.length===0">暂无反馈</li>
        </ul>
      </div>

      <div class="bottom">
        <h4>项目源码：</h4>
        <div class="links">
          <a href="https://gitee.com/W-alker/music-app" target="_blank">
            <i class="fa fa-git-square" aria-hidden="true"></i>
          </a>
          <a href="https://gitlab.com/W_alker/MusicApp" target="_blank">
            <i class="fa fa-gitlab" aria-hidden="true"></i>
          </a>
<!--           <a href="https://githab.com/W_alker/MusicApp" target="_blank">
            <i class="fa fa-github" aria-hidden="true"></i>
          </a> -->
      </div>

      </div>

      <van-popup v-model="isShowAbout" get-container='#app'>
          <div class="introduction">
            <h4>关于该网站</h4> 
            <p>该网站为本人毕设作品，采用 <strong>Vue2 + Vant </strong> 开发，模仿网易云移动端App，简单实现一般音乐网站的主要功能。<br/>
              数据接口来自
              <a href="https://binaryify.github.io/NeteaseCloudMusicApi/" target="_blank">网易云音乐API</a>。<br/>
               <br/>
              网站尚在开发，现在仅仅是一个初稿或者说雏形，还有很多问题，为促进网站网站开发和完善，欢迎大家提交建议和bug反馈。<br/>
              有git账号的可以直接在仓库提交issue；或者你也可以使用下方的 “提交反馈”。<br/>
              欢迎各位参与。<br/>
              <br/>
              【<strong>注意</strong>：服务器比较垃圾，因此会出现数据没及时返回的情况，因此尽量不要频繁操作。】<br/>
              【<strong>声明</strong>：该网站仅作学习之用，开源（虽然写的很烂）。本网站不会窃取任何用户相关信息及侵犯隐私。】
              </p>
          </div>
      </van-popup>

      <van-popup v-model="isShowMsg" get-container='#app'  closeable  close-icon-position="top-left">
        <notice-msg :msgs='noticeMsgs'></notice-msg>
      </van-popup>

      <van-popup v-model='isShowSuggestion' get-container='#app'>
        <submit-suggestion @suggestSubmitOK='suggestSubmitOK'></submit-suggestion>
      </van-popup>
  </div>
</template>

<script>
import { ontouchActive } from "assets/js/util.js";
import { personalAbout, Msg } from "network/user";
import { logout } from "network/login";
import { Toast, Dialog } from "vant";

import NoticeMsg from "./childComps/NoticeMsg.vue";
import SubmitSuggestion from "./childComps/SubmitSuggestion.vue";

import { Axios } from "network/DIYApi";

export default {
  name: "AsideMenu",
  components: {
    NoticeMsg,
    SubmitSuggestion,
  },
  computed: {
    profile() {
      return this.$store.state.ua.profile;
    },
  },
  data() {
    return {
      isShowAbout: false,
      isShowMsg: false,
      isShowSuggestion: false,
      noticeMsgs: {},

      suggests: [],
    };
  },
  methods: {
    async yunbeiSign() {
      try {
        const res = await personalAbout.yunbeiSign();
        console.log(res);
        Toast.success("签到成功！");
      } catch (e) {
        Toast.fail("签到失败或重复签到");
      }
    },
    async showMsg() {
      return Toast("后续开放");
      const res = await Msg.getPrivateLetter();
      if (res.code !== 200) return Toast.fail("消息列表获取失败！");
      this.noticeMsgs = res.msgs;
      this.isShowMsg = true;
    },
    showSuggestion() {
      this.isShowSuggestion = true;
    },
    async getSuggests() {
      this.suggests.length=0
      const res = await Axios({
        url: "/suggest/get",
        method: "get",
      });
      if (res.code === 200) {
        let data = res.suggests;
        data.reverse();
        for (let i = 0; i < Math.min(data.length, 30); i++) {
          this.suggests.push(JSON.parse(data[i]));
        }
      } else Toast.fail("获取失败！");
    },
    suggestSubmitOK() {
      this.getSuggests();
      this.isShowSuggestion = false;
    },
    async signOut() {
      Dialog.confirm({
        message: "确定要退出登录吗？",
      })
        .then(async () => {
          const res = await logout();
          localStorage.clear();
          Toast({
            message: "退出登录",
          });
          this.$router.push("/login");
        })
        .catch(() => {
          return;
        });
    },
  },
  mounted() {
    const nodes = document.querySelector(".aside-menu").querySelectorAll("li");
    ontouchActive(nodes);
  },
  created() {
    this.getSuggests();
  },
};
</script>

<style scoped lang='scss'>
.aside-menu {
  width: 82vw;
  height: 100%;
  background-color: var(--themeBgc);
  padding: 0.16rem;
  color: var(--qianhui);
  position: relative;

  .profile {
    display: flex;
    align-items: center;
    .avatar {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
    }
    .nickname {
      margin-left: 0.1rem;
      font-size: 0.16rem;
      font-weight: normal;
      .icon {
        vertical-align: middle;
      }
    }
  }
  ul {
    margin-top: 0.14rem;
    background-color: var(--xinhui);
    border-radius: 0.1rem;
    font-size: 0.14rem;
    overflow: hidden;
    .tit {
      padding: 0 0.12rem;
      height: 0.36rem;
      line-height: 0.36rem;
      font-size: 0.12rem;
      font-weight: normal;
      border-bottom: 0.01rem solid var(--qianhui);
    }
    li {
      padding: 0 0.12rem;
      height: 0.43rem;
      line-height: 0.43rem;
      transition: all ease 0.3s;
      &.active {
        background-color: rgba(0, 0, 0, 0.4);
      }
      i {
        font-size: 0.16rem;
        line-height: 0.43rem;
        float: left;
        margin-right: 0.16rem;
      }
      .icon:last-child {
        float: right;
        margin-right: 0;
      }
    }
  }
  .ul1 {
    li {
      border-bottom: 0.01rem solid var(--qianhui);
      &:last-child {
        border-bottom: none;
      }
    }
  }

  // 建议栏
  .ul3 {
    margin-top: 0.25rem;
    // max-height: 3.6rem;
    padding-bottom: 0.2rem;
    .tit {
      margin-bottom: 0.06rem;
      color: var(--brightRed);
      font-size: 0.14rem;
    }
    .container {
      max-height: 3rem;
    }
    ul {
      margin-top: 0;
      padding: .06rem 0;
    }
    li {
      height: 0.45rem;
      font-size: 0.12rem;
      display: flex;
      align-items: center;
      .avatar {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        margin-right: 0.12rem;
      }
      .info {
        display: flex;
        flex-direction: column;
        p {
          line-height: 0.2rem;
          &:first-child {
            .userAgent {
              font-size: 0.1rem;
            }
          }
        }
        .text {
          max-width: 2.08rem;
          font-size: 0.11rem;
        }
      }
    }
  }

  .bottom {
/*     position: fixed;
    left: 0;
    right: 0;
    bottom: 0; */
    // padding: 0.12rem;
    background-color: var(--themeBgc);
    display: flex;
    align-items: center;

    h4 {
      margin-right: 0.1rem;
      font-size: 0.12rem;
      font-weight: normal;
    }
    .links {
      display: flex;
      a {
        display: inline-block;
        margin-right: 0.14rem;
        width: 0.35rem;
        font-size: 0.24rem;
      }
    }
  }
}

.introduction {
  margin-top: 0.16rem;
  padding: 0.1rem;
  width: 70vw;
  font-size: 0.13rem;
  background-color: var(--elegrance-black);
  color: var(--black);
  border-radius: 0.1rem;
  // color: var(--silveryWhite);
  h4 {
    height: 0.25rem;
    line-height: 0.25rem;
    margin-bottom: 0.1rem;
    border-bottom: 0.01rem solid #000;
  }
}
</style>