export default () => {
  if (typeof document === 'undefined') {
    return
  }

  // Auto scroll to hash
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      document.querySelector(decodeURIComponent(location.hash)).scrollIntoView()
    }
  }
}
