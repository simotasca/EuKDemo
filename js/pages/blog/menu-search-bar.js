window.addEventListener('scroll', () => {
  let menuBar = document.querySelector("#menu-search-container")

  if (window.scrollY > window.innerHeight / 2) {
    menuBar.classList.add('visible')
  } else {
    menuBar.classList.remove('visible')
  }
})