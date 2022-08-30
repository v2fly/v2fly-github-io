<template>
  <section>
    <div class="language-">
      <pre><code>{{ uuid }}</code></pre>
    </div>
    <button @mousedown.left="startRoll" @mouseup.left="stopRoll" @mouseleave="stopRoll">生成</button>
    <button @click="copy" @mouseleave="copySuccessDelay">{{copied?'已复制':'复制'}}</button>
  </section>
</template>
<style scoped>
button {
  outline: none;
  border: none;
  width: 10rem;
  text-align: center;
  padding: 0.5rem;
  margin-right: 1rem;
  background-color: var(--c-brand);
  border-radius: 4px;
  color: #fff;
  transition: background-color .1s ease;
}
button:hover {
  background-color: var(--c-brand-light);
}
button:active {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
</style>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  methods: {
    startRoll() {
      this.timerHandles.push(setInterval(this.generate, 50));
    },
    stopRoll() {
      for (let currTimer = this.timerHandles.shift(); currTimer !== undefined; currTimer = this.timerHandles.shift()) {
        clearInterval(currTimer);
      }
    },
    generate() {
      this.uuid = uuidv4();
    },
    copy() {
      navigator.clipboard.writeText(this.uuid).then(this.copySuccess);
    },
    copySuccess() {
      this.copied = true;
    },
    copySuccessDelay() {
      this.copied = false;
    },
  },
  data: function () {
    return {
      uuid: uuidv4(),
      timerHandles: [],
      copied: false,
    };
  },
  beforeDestroy() {
    this.stopRoll();
  }
};
</script>
