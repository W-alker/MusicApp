<template>
  <div class="login-con">
    <div class="logo">
      <img
        src="https://bizaladdin-image.baidu.com/0/pic/67edf360ac5f88826e3d757a5e407579.jpg"
      />
    </div>

    <main>
      <van-form>
        <label for="id">
          <van-icon name="user-o"></van-icon>
          <input type="text" v-model="id" placeholder="手机号/邮箱" name="id" />
        </label>
        <label for="pwd">
          <i class="icon icon-mima van-icon"></i>
          <input
            :type="input_pwd_type"
            v-model="pwd"
            placeholder="密码"
            name="pwd"
          />
          <van-icon
            :name="input_pwd_type === 'text' ? 'eye-o' : 'closed-eye'"
            @click="change_pwd_type"
          />
        </label>
        <span @click="popup_signUp_show = true">忘记密码?</span>
        <span style="float: right" @click="verifycode_login">用验证码登录</span>

        <van-button
          round
          block
          type="info"
          native-type="submit"
          class="signUp-btn"
          @click="login($event)"
          >登录</van-button
        >
        <van-button
          round
          block
          type="info"
          native-type="submit"
          class="signUp-btn"
          @click="popup_signUp_show = true"
          >注册</van-button
        >
      </van-form>
    </main>

    <!-- 注册弹出层 -->
    <van-popup
      v-model="popup_signUp_show"
      closeable
      close-icon-position="top-right"
      position="bottom"
      :close-on-popstate="true"
      :style="{ height: '100%', background: 'var(--black)' }"
    >
      <sign-up-box @popupClose="popup_signUp_show = false"></sign-up-box>
    </van-popup>

    <!-- 验证码登录弹出层 -->
    <van-popup
      v-model="popup_useVerifycode_show"
      closeable
      close-icon-position="top-right"
      position="bottom"
      :close-on-popstate="true"
      :style="{ height: '100%', background: 'var(--black)' }"
    >
      <use-verifycode-box @loginOk="loginOK = true"></use-verifycode-box>
    </van-popup>

    <footer>
      <h3><span>其他登录方式</span></h3>
      <div class="cont" @click="bottom_hint">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-QQ"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-weixin1"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-weibo1"></use>
        </svg>
      </div>
    </footer>
    <!--     <h2>login</h2>
    <button @click="getQr">获取二维码</button>
    <div class="qr">
      <img :src="qrSrc" alt="" />
      <p>{{ qrStatus }}</p>
    </div> -->
  </div>
</template>

<script>
import {
  usePhone,
  useEmail,
  useVerifyCode,
  loginStatus,
  getKey,
  getQr,
  qrStatus,
} from "network/login";
import {
  isPoneAvailable,
  isEmailAvailable,
  isNeteaseEmail,
} from "assets/js/util.js";
import { Dialog, Notify, Toast } from "vant";
import UseVerifycodeBox from "./childComps/UseVerifycodeBox.vue";
import SignUpBox from "./childComps/SignUpBox.vue";

export default {
  name: "Login",
  data() {
    return {
      qrSrc: "",
      uniKey: "",
      interval: {},
      qrStatus: "",
      id: "18609664546",
      pwd: "walker314",
      input_pwd_type: "password",
      loginOK: false,
      popup_useVerifycode_show: false,
      popup_signUp_show: false,
    };
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Notify.Component.name]: Notify.Component,
    UseVerifycodeBox,
    SignUpBox,
  },
  watch: {
    loginOK() {
      if (this.loginOK) {
        // 刷新登录状态
        loginStatus.refresh();
        this.$store.dispatch("INIT_INFO");
        this.$router.push("/user");
      }
    },
  },
  methods: {
    // 更改密码框显示和隐藏
    change_pwd_type() {
      this.input_pwd_type =
        this.input_pwd_type === "password" ? "text" : "password";
    },
    async login(e) {
      // 更改点击状态
      e.target.className += " active";
      setTimeout(() => {
        e.target.className = e.target.className.replace("active", "");
      }, 200);

      // 判断手机号和邮箱
      if (isPoneAvailable(this.id)) {
        // 检验是否注册
        let isPhoneExist = await usePhone.isPhoneExist(this.id);
        if (isPhoneExist) {
          let res = await usePhone.login(this.id, this.pwd);
          if (res.code !== 200)
            return Notify({ type: "danger", message: res.message });
          this.loginOK = true;
        }
      } else if (isNeteaseEmail(this.id)) {
        let res = await useEmail.login(this.id, this.pwd);
        if (res.code !== 200)
          return Notify({ type: "danger", message: res.message });
        this.loginOK = true;
      } else Toast.fail("账号输入有误");
    },
    verifycode_login() {
      this.popup_useVerifycode_show = true;
    },
    getQr() {
      getKey().then((res) => {
        this.unikey = res.data.unikey;
        getQr(this.unikey).then((res) => {
          this.qrSrc = res.data.qrimg;
        });
      });
      this.interval = setInterval(this.getQrStatus, 4000);
    },
    getQrStatus() {
      qrStatus(this.unikey).then((res) => {
        this.qrStatus = res.message;
        if (res.code === 803) {
          alert("登录成功");
          clearInterval(this.interval);
          this.login = true;
        }
      });
    },
    bottom_hint() {
      Toast({
        message: "暂不支持该登录方式，请使用邮箱/手机号。",
        icon: "warning-o",
      });
    },
  },

  created() {
    loginStatus.check().then((res) => {
      console.log(res);
      if (res.code === 200 && res.account) {
        Toast.loading({
          duration: 0, // 持续展示 toast
          message: "检测到您已登录，正在为您自动跳转至主界面",
          forbidClick: true,
          loadingType: "spinner",
        });
        setTimeout(() => {
          this.loginOK = true;
          Toast.clear();
        }, 1000);
      }
    });
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.login-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 0.3rem;
  height: 100%;
}
.logo {
  margin-top: 12vh;
  height: 18vh;
  img {
    width: 25vw;
    height: 25vw;
    border-radius: 0.16rem;
  }
}
main {
  width: 100%;
  height: 55vh;
  display: flex;
  align-items: center;
}
form {
  width: 100%;
  color: #fff;
  label {
    display: block;
    margin-bottom: 3vh;
    height: 7vh;
    width: 100%;
    line-height: 7vh;
    position: relative;
    .van-icon {
      max-width: 26px;
      position: absolute;
      top: 1.8vh;
      font-size: 26px;
      color: rgba(255, 255, 255, 0.6);
      &:first-of-type {
        left: 0;
      }
      &:last-of-type {
        right: 0;
      }
    }
  }
  input {
    font-size: 2vh;
    width: 100%;
    height: 100%;
    padding-left: 0.4rem;
    background-color: transparent;
    border-bottom: 1px solid #838383;
    &::-webkit-input-placeholder {
      color: #fff;
    }
  }
  .van-button {
    margin-top: 4vh;
    margin-left: 5%;
    width: 90%;
    height: 5vh;
    background-color: transparent;
    border: 1px solid rgb(233, 233, 233);
    color: rgb(35, 97, 255);
    transition: all ease 0.2s;
    &.active {
      background-color: rgba(233, 233, 233, 0.3);
      border: none;
      color: #fff;
    }
  }
}
footer {
  width: 100%;
  height: 15vh;
  padding-top: 1vh;
  h3 {
    display: flex;
    align-items: center;
    @mixin line {
      content: "";
      display: inline-block;
      width: calc((100% - 1.2rem) / 2);
      height: 1px;
      background-color: #fff;
    }
    &::before,
    &::after {
      @include line;
    }
    span {
      width: 1.2rem;
      font-size: 0.16rem;
      color: #fff;
      text-align: center;
    }
  }
  .cont {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem;
    .icon {
      display: inline-block;
      width: 0.5rem;
      height: 0.35rem;
      cursor: pointer;
    }
  }
}
</style>