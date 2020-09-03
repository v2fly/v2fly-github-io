export default () => {
  // https://github.com/vuejs/vuepress/issues/2562
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      document.querySelector(decodeURIComponent(location.hash)).scrollIntoView()
    }
  }
}
