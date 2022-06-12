{
  const container = document.querySelector('#diagonals-container')
  const tonno = document.querySelector('#tonno')
  const asideTonno = document.querySelector('#aside-tonno')

  const imgMela = document.querySelector('#infog-mela')

  const skew1 = document.querySelector('#skew-panel-1')
  const skewTitle1 = document.querySelector('#skew-title-1')
  const skew2 = document.querySelector('#skew-panel-2')
  const skewTitle2 = document.querySelector('#skew-title-2')

  let pos1 = {
    left: 0,
    top: 0,
    titleLeft: 0,
    titleTop: 0,
  }

  let pos2 = {
    left: 0,
    top: 0,
    titleLeft: 0,
    titleTop: 0,
    titleShift: -1
  }

  function calculatePositions() {
    let contRect = container.getBoundingClientRect()
    let tonnoRect = tonno.getBoundingClientRect()

    let tonnoCenterX = tonnoRect.left + (tonnoRect.width / 2)
    let tonnoCenterY = tonnoRect.top + (tonnoRect.height / 2) - contRect.top

    // === skew 1 ===
    if (window.innerWidth > 470) { // tablet - desktop
      pos1.left = tonnoCenterX
      pos1.top = tonnoCenterY
      pos1.titleLeft = tonnoCenterX
      pos1.titleTop = tonnoCenterY
    } else { // mobile
      let melaRect = imgMela.getBoundingClientRect()

      pos1.left = melaRect.left + melaRect.width / 2
      pos1.top = melaRect.top - melaRect.height / 2 - contRect.top
    }

    if (window.innerWidth <= 700 && window.innerWidth > 470) { // tablet
      pos1.top += tonnoRect.height / 3
      pos1.titleTop += tonnoRect.height / 3
    }

    let title1AsideDelta =
      pos1.top -
      asideTonno.querySelector('.h5').getBoundingClientRect().bottom +
      contRect.top +
      skewTitle1.getBoundingClientRect().height / 4

    if (title1AsideDelta < 0) {
      // console.log("si incrociano", title1AsideDelta)
      pos1.titleLeft -= title1AsideDelta
      pos1.titleTop -= title1AsideDelta
    }

    // === skew 2 ===
    if (window.innerWidth > 470) { // tablet - desktop
      let asideRect = asideTonno.getBoundingClientRect()

      let asideTopOffset = asideRect.top - (asideRect.height / 2) - contRect.top
      let asideCenterX = -(contRect.right - asideRect.right + asideRect.width / 2)

      pos2.left = pos2.titleLeft = asideCenterX
      pos2.top = pos2.titleTop = asideTopOffset
    } else { // mobile
      const shift = 100 // altrimenti si vede il bordo superiore nello schermo
      pos2.left = -(contRect.right - tonnoRect.right + tonnoRect.width / 2) + shift
      pos2.top = tonnoCenterY + tonnoRect.height - shift
    }
  }

  function movePanels() {
    skew1.style.left = pos1.left + 'px'
    skew1.style.top = pos1.top + 'px'

    skew2.style.left = pos2.left + 'px'
    skew2.style.top = pos2.top + 'px'
  }

  function moveTitle1() {
    skewTitle1.style.left = pos1.titleLeft + 'px'
    skewTitle1.style.top = pos1.titleTop + 'px'
  }

  function moveTitle2() {
    skewTitle2.style.left = pos2.titleLeft + 'px'
    skewTitle2.style.top = pos2.titleTop + 'px'
  }

  function moveTitles() {
    moveTitle1()
    moveTitle2()
  }

  function resetPanels() {
    calculatePositions()
    movePanels()
    moveTitles()
  }

  function turnOnVisibility() {
    skew1.style.visibility = 'visible'
    skewTitle1.style.visibility = 'visible'
    skew2.style.visibility = 'visible'
    skewTitle2.style.visibility = 'visible'
  }

  function changeEllipseRadius() {
    const ellipse = document.querySelector('#main-bg-ellipse')
    if (window.scrollY < 20)
      ellipse.classList.remove('straight')
    else ellipse.classList.add('straight')
  }

  function main() {
    // window.addEventListener('scroll', changeEllipseRadius)
    window.addEventListener('resize', resetPanels)
    window.addEventListener('load', () => {
      changeEllipseRadius()
      resetPanels()
      turnOnVisibility()
    })

  }

  main()
}