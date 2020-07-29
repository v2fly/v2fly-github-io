<template>
  <section>
    <h3>
      <a :href="url">{{ name }}</a>
      <span>
        <img
          v-for="platform in platforms"
          class="platform-logo"
          :src="platformToImagePath(platform)"
        />
      </span>
      <span>
        <img
          :src="`https://img.shields.io/github/commit-activity/m/${urlToRepo(
            url
          )}?color=informational&label=commits&style=social`"
        />
        <img
          :src="`https://img.shields.io/github/stars/${urlToRepo(
            url
          )}?style=social`"
        />
      </span>
    </h3>
    <p>{{ description }}</p>
  </section>
</template>

<script>
const ALL_PLATFORMS = ["win", "mac", "linux", "android", "ios"];

export default {
  methods: {
    platformToImagePath(p) {
      return {
        win: "/tools/win.svg",
        mac: "/tools/apple.svg",
        linux: "/tools/linux.svg",
        android: "/tools/android.svg",
        ios: "tools/ios.svg",
      }[p];
    },
    urlToRepo(u) {
      return u.replace("https://github.com/", "");
    },
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    platforms: {
      type: Array,
      required: true,
      validator: (ps) => {
        if (!ps) return false;
        if (!(ps instanceof Array)) return false;
        return !ps.some((p) => !ALL_PLATFORMS.indexOf(p) === -1);
      },
    },
  },
};
</script>

<style scoped>
img.platform-logo {
  width: 20px;
}
</style>
