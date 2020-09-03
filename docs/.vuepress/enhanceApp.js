export default () => {
  // https://github.com/vuejs/vuepress/issues/2562#issuecomment-686575512
  if (typeof document === 'undefined') return
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      const { hash } = location
      const decoded = decodeURIComponent(hash)
      if (hash !== decoded) {
        document.querySelector(decoded).scrollIntoView()
      }
    }
  }
}
