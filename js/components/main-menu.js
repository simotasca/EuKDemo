class MainMenu extends BaseComponent {
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

    // console.log("is locked", this.isAttribute('locked'))

    if (!this.isAttribute('locked')) {
      if (window.scrollY > this.lastScrollY) {
        element.style.transform = slot.clientHeight != 0 ? `translateY(calc(-100% + ${slot.clientHeight}px - 1px))` : 'translateY(-100%)'
        // conts.classList.add('scrolled')
      } else {
        element.style.transform = 'translateY(0)'
        // conts.classList.remove('scrolled')
      }

      if (window.scrollY > (document.body.clientHeight - 20)) {
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
        @import "css/components/main-menu.css";
      </style>

      <header id="main-menu" class="${this.hasAttribute('dark') && 'main-menu--dark'}">
        <div id="background"></div>
        <div class="navbar max-width-container">
          <img src="./resources/img/logo.svg" alt="" ${this.hasAttribute('noLogo') && 'style="visibility: hidden;"'}>
          <nav class="only-on-desktop">
            <a href="/">Homepage</a>
            <a href="/lista-prodotti.html">Lista prodotti</a>
            <a href="/come-certificarsi.html">Come Certificarsi</a>
            <a href="/">Dizionario kosher</a>
            <a href="/blog.html" id="menu-editoriale">Editoriale</a>
            <div id="menu-underline"></div>
          </nav>
          <img id="menu-hamb" class="hide-on-desktop" src="./resources/img/icons/hamburger.svg" alt="">
        </div>
        <div id="extra" class="max-width-container"><slot/></div>
      </header>`)

    this.lastScrollY = 0



    if (this.hasAttribute('noTransparent')) {
      this.qSelect('#main-menu').classList.add('scrolled')
      conts.classList.add('scrolled')
    }

    this.#onWindowScroll()
    window.addEventListener("scroll", this.#onWindowScroll.bind(this))
  }
}

window.customElements.define('main-menu', MainMenu)