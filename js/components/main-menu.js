class MainMenu extends BaseComponent {

  lastScrollY
  isOpen = false

  #onWindowScroll() {
    const element = this.qSelect('#main-menu')
    // const conts = document.querySelector('#contatti-container')

    if (!this.hasAttribute('noTransparent')) {
      if (window.scrollY > 20) {
        !element.classList.contains("scrolled") && element.classList.add('scrolled')
        // !conts.classList.contains("scrolled") && conts.classList.add('scrolled')
      } else {
        element.classList.remove('scrolled')
        // conts.classList.remove('scrolled')
      }
    }

    const slot = this.qSelect('#extra')


    if (!this.isAttribute('locked')) {
      if (window.scrollY > this.lastScrollY) {
        element.style.transform = slot.clientHeight != 0 ? `translateY(calc(-100% + ${slot.clientHeight}px - 1px))` : 'translateY(-100%)'
        // conts.classList.add('scrolled')
      } else {
        element.style.transform = 'translateY(0)'
        // conts.classList.remove('scrolled')
      }
    }

    this.lastScrollY = window.scrollY
  }

  constructor() {
    super()

    this.setTemplate(`
      <style>
        @import "/css/components/main-menu.css";
      </style>

      <header id="main-menu" class="${this.hasAttribute('dark') && 'main-menu--dark'}">
        <div id="background"></div>
        <div class="navbar max-width-container">
        <a href="/" ${this.hasAttribute('noLogo') && 'style="visibility: hidden;"'}>
          <img src="/resources/img/logo.svg" alt="">
        </a>
          <nav class="only-on-desktop">
            <a href="/">Home</a>
            <a href="/lista-prodotti.html">Lista prodotti</a>
            <a href="/come-certificarsi.html">Come Certificarsi</a>
            <a href="/blog.html" id="menu-editoriale">Area riservata</a>
            <div id="menu-underline"></div>
          </nav>
          <div id="menu-hamb" class="hide-on-desktop pointer">
            <object type="image/svg+xml" data="/resources/img/icons/hamburger.svg"></object>
          </div>
        </div>
        <div id="extra" class="max-width-container"><slot/></div>
      </header>
      <div id="mobile-panel" class="${this.hasAttribute('dark') ? 'bg-dark light' : 'bg-light dark'}">
        <ul>
          <li class="h4"><a href="/">Home</a></li>
          <li class="h4"><a href="/lista-prodotti.html">Lista prodotti</a></li>
          <li class="h4"><a href="/come-certificarsi.html">Come Certificarsi</a></li>
          <li class="h4"><a href="/blog.html" id="menu-editoriale">Area riservata</a></li>
          <li class="social-icons">
            <div class="social-icons">
              <a href="https://www.facebook.com/Eurokosher-100197019424819" target="_blank">
                <img class="mb-05" src="/resources/img/social/fb.svg" alt="ig">
              </a>
              <a href="https://www.instagram.com/eurokosher/" target="_blank">
                <img src="/resources/img/social/ig.svg" alt="fb">
              </a>
            </div>
          </li>
        </ul>
      </div>
      `)

    this.lastScrollY = 0

    if (this.hasAttribute('noTransparent')) {
      this.qSelect('#main-menu').classList.add('scrolled')
      // conts.classList.add('scrolled')
    }

    this.#onWindowScroll()
    window.addEventListener("scroll", this.#onWindowScroll.bind(this))
    this.qSelect('#menu-hamb').addEventListener('click', this.hambClick.bind(this))

    window.addEventListener('resize', (e) => {
      if (this.isOpen) {
        this.close()
      }
    })
  }

  close() {
    let svgDoc = this.qSelect("#menu-hamb > object").contentDocument
    let line1 = svgDoc.getElementById('line-1')
    let line2 = svgDoc.getElementById('line-2')
    let line3 = svgDoc.getElementById('line-3')
    line1.classList.remove('line-1--open')
    line2.classList.remove('line-2--open')
    line3.classList.remove('line-3--open')
    line1.classList.add('line-1--close')
    line2.classList.add('line-2--close')
    line3.classList.add('line-3--close')
    this.qSelect('#mobile-panel').classList.remove("open")
    this.qSelect('#mobile-panel').classList.add("close")
    document.body.style.overflowY = null
    this.isOpen = false
  }

  hambClick() {
    let svgDoc = this.qSelect("#menu-hamb > object").contentDocument
    let line1 = svgDoc.getElementById('line-1')
    let line2 = svgDoc.getElementById('line-2')
    let line3 = svgDoc.getElementById('line-3')
    if (!this.isOpen) {
      line1.classList.remove('line-1--close')
      line2.classList.remove('line-2--close')
      line3.classList.remove('line-3--close')
      line1.classList.add('line-1--open')
      line2.classList.add('line-2--open')
      line3.classList.add('line-3--open')
      this.qSelect('#mobile-panel').classList.add("open")
      this.qSelect('#mobile-panel').classList.remove("close")
      document.body.style.overflowY = "hidden"
      this.isOpen = true
    } else {
      this.close()
    }
  }
}

window.customElements.define('main-menu', MainMenu)