<template>
  <div>
    <section class="input-tel-box" v-if="!codeAlready">
      <h3>手机号登录</h3>
      <p>
        登录体验更多精彩<br />
        <span>未注册手机号登录后将自动创建账号(当前尚未开放)</span>
      </p>
      <label for="">
        <span>+86</span>
        <input
          type="text"
          v-model="phoneNumber"
          autofocus
          placeholder="请输入手机号"
        />
      </label>
      <van-button
        round
        block
        type="danger"
        native-type="submit"
        @click="nextStep"
        >下一步</van-button
      >
    </section>
    <section class="input-code-box" v-if="codeAlready">
      <h3>手机号登录</h3>
      <p>登录体验更多精彩<br /></p>
      <label for="">
        <input
          type="text"
          v-model="code"
          autofocus
          placeholder="请输入验证码"
        />
      </label>
      <van-button round block type="danger" native-type="submit" @click="submit"
        >登录</van-button
      >
    </section>
  </div>
</template>

<script>
import { useVerifyCode, usePhone } from "network/login";
import { Toast } from "vant";

export default {
  name: "UseVerifycodeBox",
  data() {
    return {
      phoneNumber: "",
      codeAlready: false,
      code: "",
    };
  },
  methods: {
    async nextStep() {
      // 文本提示
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "正在发送...",
        forbidClick: true,
        loadingType: "spinner",
      });

      let res = await useVerifyCode.getCaptcha(this.phoneNumber);
      if (res.code === 200) {
        Toast.clear();
        Toast({
          message: "验证码已发送",
          icon: "passed",
        });
        this.codeAlready = true;
      } else {
        Toast({
          message: res.message,
          icon: "warning-o",
        });
      }
    },
    async submit() {
      let res = await useVerifyCode.verifyCaptcha(this.phoneNumber, this.code);
      if (res.code === 200 && res.data) {
        // 验证码正确，调用登录接口
        const sign = await usePhone.login(this.phoneNumber, 0, this.code);
        if (sign.code !== 200) return Toast.fail("验证码有误！");
        else this.$emit("loginOk", true);
      } else
        Toast({
          message: "验证码错误",
          icon: "warning-o",
        });
    },
  },
};
</script>

<style scoped lang='scss'>
.popup {
  position: relative;
  color: azure;
}
section {
  position: absolute;
  padding: 0.2rem;
  width: 100%;
  height: 100%;
}

h3 {
  font-size: 0.2rem;
  float: right;
  margin-right: 50px;
  line-height: 0.16rem;
  color: azure;
}
p {
  margin-top: 8vh;
  line-height: 0.3rem;
  color: azure;

  span {
    opacity: 0.5;
    font-size: small;
  }
}
label {
  margin: 6vh 0;
  display: block;
  height: 5vh;
  border-bottom: 1px solid rgba(85, 85, 85, 1);
  color: azure;

  span {
    display: inline-block;
    width: 20%;
    text-align: center;
    opacity: 0.8;
  }
  input {
    height: 80%;
    width: 80%;
    padding-left: 0.1rem;
  }
}
.input-code-box label input {
  letter-spacing: 0.1em;
  font-size: larger;
}
</style>