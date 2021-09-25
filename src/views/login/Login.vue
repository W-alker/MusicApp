<template>
  <div class="login">
    <h2>login</h2>
    <button @click="getQr">获取二维码</button>
    <div class="qr">
      <img :src="qrSrc" alt="" />
      <p>{{ qrStatus }}</p>
    </div>
  </div>
</template>

<script>
import { getKey, getQr, qrStatus } from "network/login";

export default {
  name: "Login",
  data() {
    return {
      qrSrc: "",
      uniKey: "",
      interval: {},
      qrStatus: "",
    };
  },
  methods: {
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
          this.$router.push("/home");
        }
      });
    },
  },
  created() {},
  mounted() {
  },
};
</script>

<style scoped>
</style>