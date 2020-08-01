<template>
  <section>
    <pre><code>{{ uuid }}</code></pre>
    <button @click="generate">生成</button>
    <button @click="copy">{{copied?'已复制':'复制'}}</button>
  </section>
</template>
<!--TODO: intergrate with vuepress theme-->
<style scoped>
button {
  outline: none;
  border: none;
  width: 10rem;
  text-align: center;
  padding: 0.5rem;
  margin-right: 1rem;
  background-color: #ea0880;
  border-radius: 4px;
  color: #fff;
}
</style>
<script>
const { v4: uuidv4 } = require("uuid");
export default {
  methods: {
    generate() {
      this.uuid = uuidv4();
      this.copied = false;
    },
    copy() {
      navigator.clipboard.writeText(this.uuid).then(this.copySuccess);
    },

    copySuccess() {
      this.copied = true;
      this.copyTime = new Date().getTime();
      setTimeout(this.copySuccessDelay, 2000);
    },

    copySuccessDelay() {
      const now = new Date().getTime();
      if (now - this.copyTime < 1900) return;
      this.copied = false;
    },
  },
  data: function () {
    return {
      uuid: uuidv4(),
      copied: false,
      copyTime: 0,
    };
  },
};
</script>
