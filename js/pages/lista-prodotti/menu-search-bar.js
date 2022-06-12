window.addEventListener('scroll', () => {
  let mainBar = document.querySelector("#main-search-bar")
  let menuBar = document.querySelector("#menu-search-container")

  if (mainBar.getBoundingClientRect().top < -30) {
    menuBar.classList.add('visible')
  } else {
    menuBar.classList.remove('visible')
  }
})

function openPanelFiltri() {
  document.querySelector('#panel-filtri').classList.toggle('visible')
}