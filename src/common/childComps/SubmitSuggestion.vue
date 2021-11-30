<template>
  <div class="submit-suggestion flex-center">
    <label for="">写下你的建议（请尽量精简）:</label>
    <textarea name="" id="" cols="30" rows="5" v-model="text"></textarea>

    <!--     <label for="">留个昵称吧：</label>
    <input v-model='nickname'></input> -->

    <button @click="submit">提交</button>
  </div>
</template>

<script>
import axios from "axios";
import { Axios } from "network/DIYApi";
import { Toast } from "vant";

export default {
  name: "SubmitSuggestion",
  data() {
    return {
      text: "",
    };
  },
  methods: {
    async submit() {
      if (!this.text) return Toast.fail("请填写您的建议！");
      else if (this.text.length > 30) return Toast.fail("请尽量精简!");
      const formdata = new FormData();
      formdata.set("text", this.text);
      formdata.set("nickname", this.$store.state.ua.profile.nickname);
      formdata.set("avatarUrl", this.$store.state.ua.profile.avatarUrl);
      formdata.set("time", `${new Date().getMonth()+1}.${new Date().getDate()}`);

      const res = await Axios({
        url: "/suggest/submit",
        method: "post",
        data: formdata,
      });
      if (res.code === 200) {
        this.text = "";
        Toast.success(res.msg);
        this.$emit('suggestSubmitOK')
      } else Toast.fail(res.msg);
    },
  },
};
</script>

<style scoped lang='scss'>
.submit-suggestion {
  width: 70vw;
  // height: 40vh;
  padding: 0 0.16rem;
  background-color: var(--silveryWhite);
  border-radius: 0.12rem;
  flex-direction: column;
  font-size: 0.14rem;

  label {
    width: 100%;
    text-align: start;
    margin: 0.14rem 0;
  }
  textarea {
    width: 100%;
    padding: 0.12rem;
    background-color: var(--qianhui);
  }
  input {
    width: 100%;
    background-color: var(--qianhui);
    margin-bottom: 0.1rem;
    padding: 0.12rem;
  }
  button {
    width: 100%;
    padding: 0.08rem;
    background-color: var(--blue);
    border-radius: 0.08rem;
    margin: 0.14rem 0;
  }
}
</style>