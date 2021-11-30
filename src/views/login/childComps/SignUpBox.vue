<template>
  <div>
    <section>
      <h3>新号注册 / 密码修改</h3>
      <p>
        个人信息请在之后个人信息界面修改 <br />（已注册的账号会默认修改密码）
      </p>
      <form>
        <label for="">
          <van-icon name="phone-circle-o" />
          <input
            type="text"
            name="cellPhone"
            v-model="signUpInfo.phone"
            placeholder="请输入手机号(必填)"
          />
        </label>

        <label for="">
          <van-icon name="user-circle-o" />
          <input
            type="text"
            name="nickname"
            v-model="signUpInfo.nickname"
            placeholder="请输入昵称"
          />
        </label>

        <label for="" class="input-pwd">
          <i class="icon icon-mima van-icon"></i>
          <input
            :type="input_pwd_type"
            name="pwd"
            v-model="signUpInfo.pwd"
            placeholder="请输入密码(必填)"
            autocomplete="false"
          />
          <van-icon
            :name="input_pwd_type === 'text' ? 'eye-o' : 'closed-eye'"
            @click="change_pwd_type"
            style="left: unset; right: 0.2em"
          />
        </label>

        <label for="" class="input-code">
          <i class="icon icon-yanzhengma1"></i>
          <input
            type="text"
            placeholder="请输入验证码(必填)"
            v-model="signUpInfo.captcha"
          />
          <button
            onclick="return false"
            @click="getCaptcha"
            :disabled="captchaAlready"
          >
            <span v-if="!captchaAlready">发送验证码</span>
            <span v-if="captchaAlready" class="alreadyHint">
              <van-icon name="passed" /> 已发送</span
            >
          </button>
        </label>

        <van-button
          type="primary"
          round
          class="submit"
          onclick="return false"
          @click="submit"
          >提交注册</van-button
        >
      </form>
    </section>
  </div>
</template>

<script>
import { useVerifyCode, signUp, usePhone } from "network/login";
import { Dialog } from "vant";
import { isPoneAvailable } from "assets/js/util.js";
import { Toast } from "vant";

export default {
  name: "SignUpBox",
  data() {
    return {
      signUpInfo: {
        phone: "",
        pwd: "",
        captcha: "",
        nickname: "",
      },
      input_pwd_type: "password",
      captchaAlready: false,
      isPhoneExist: false,
    };
  },
  watch: {},
  methods: {
    change_pwd_type() {
      this.input_pwd_type =
        this.input_pwd_type === "password" ? "text" : "password";
    },
    async getCaptcha() {
      // 检测手机号是否已经注册
      let isPhoneExistCheck = await usePhone.isPhoneExist(
        this.signUpInfo.phone
      );
      isPhoneExistCheck
        ? (this.isPhoneExist = true)
        : (this.isPhoneExist = false);
      // 输入验证
      if (!this.signUpInfo.phone || !isPoneAvailable(this.signUpInfo.phone))
        return Toast({
          message: "手机号码输入有误",
          icon: "warning-o",
        });
      // 发送验证码
      let res = await useVerifyCode.getCaptcha(this.signUpInfo.phone);
      if (res.code === 200) {
        Toast({
          message: "验证码已发送，注意查收",
          icon: "passed",
        });
        this.captchaAlready = true;
      } else {
        Toast({
          message: res.message,
          icon: "warning-o",
        });
      }
    },
    async signUp() {
      try {
        // 开始注册
        let res = await signUp(this.signUpInfo);
        if (res.code !== 200)
          return Toast({
            message: res.message,
            icon: "warning-o",
          });
        Toast({
          message: res.message || "注册成功",
          icon: "passed",
        });
        this.$emit("popupClose");
      } catch (err) {
        return Toast({
          message: "未知错误。",
          icon: "warning-o",
        });
      }
    },
    async submit() {
      // 输入验证
      if (!this.signUpInfo.phone || !this.signUpInfo.captcha)
        return Toast({
          message: "请输入验证码！",
          icon: "warning-o",
        });
      if (!this.signUpInfo.pwd)
        return Toast({
          message: "请输入密码！",
          icon: "warning-o",
        });

      try {
        // 验证码验证
        let captchaCheck = await useVerifyCode.verifyCaptcha(
          this.signUpInfo.phone,
          this.signUpInfo.captcha
        );
        if (captchaCheck.code !== 200)
          return Toast({
            message: captchaCheck.message,
            icon: "warning-o",
          });
      } catch (err) {
        return Toast({
          message: "未知错误。可能是验证码有误",
          icon: "warning-o",
        });
      }

      // 手机号已注册提示
      if (this.isPhoneExist) {
        Dialog.confirm({
          title: "密码修改确认",
          message: "检测到您的手机号已经注册，继续执行将修改密码。是否确认？",
        })
          .then(() => this.signUp())
          .catch(() => {
            return Toast({
              message: "操作取消",
              icon: "info-o",
            });
          });
      } else {
        this.signUp()
      }
    },
  },
};
</script>

<style scoped lang='scss'>
div {
  padding: 0.2rem;
}
section {
  color: var(--white);
}
h3 {
  margin-top: 5vh;
  text-align: center;
  line-height: 0.2rem;
}
p {
  margin-top: 1vh;
  text-align: center;
  opacity: 0.5;
  font-size: smaller;
}
form {
  margin-top: 6vh;
  label {
    display: block;
    width: 100%;
    height: 6vh;
    margin-top: 2.5vh;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      padding-left: 2em;
      border-bottom: 1px solid #838383;
    }
    .van-icon,
    .icon {
      position: absolute;
      top: 1.5vh;
      left: 0.2em;
      font-size: 20px;
    }
  }
  .input-code {
    button {
      position: absolute;
      top: 0.5vh;
      right: 0;
      display: inline-block;
      width: 6em;
      height: 4vh;
      background-color: var(--blue);
      border-radius: 0.05rem;
      line-height: 4vh;
      text-align: center;
      cursor: pointer;
      &:disabled {
        opacity: 0.6;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--white);
      }
      span.alreadyHint {
        padding-left: 1.2em;
        .van-icon {
          transform: translate(0.2em, -0.6vh);
        }
      }
    }
  }
  .submit {
    width: 100%;
    margin-top: 6vh;
  }
}
</style> 