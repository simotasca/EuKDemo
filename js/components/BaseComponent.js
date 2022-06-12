class BaseComponent extends HTMLElement {
  #template = null

  #pageCssString() {
    let pageLinkTags = document.querySelectorAll('link')
    let pageCssString = ""
    pageLinkTags.forEach(link => {
      if (link.hasAttribute('rel') && link.getAttribute('rel') == 'stylesheet') {
        pageCssString += `<link rel="stylesheet" href="${link.getAttribute('href')}">`
      }
    })
    return pageCssString
  }

  #createTemplate(templateString) {
    this.#template = document.createElement('template')
    this.#template.innerHTML = this.#pageCssString() + templateString
  }

  constructor() {
    super()
  }

  setTemplate(templateString) {
    this.#createTemplate(templateString)

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(this.#template.content.cloneNode(true))
  }

  qSelect(selector) {
    return this.shadowRoot.querySelector(selector)
  }

  qSelectAll(selector) {
    return this.shadowRoot.querySelectorAll(selector)
  }

  isAttribute(attribute) {
    // il valore vuoto non devono contare come false
    // così gli attributi possono essere settati da html senza scrivere "= true"

    // es:
    // <element attribute></element> considera attribute come true
    // <element attribute=0></element> considera attribute come false

    let checkEmpty = this.getAttribute(attribute) == '' || this.getAttribute(attribute)
    return this.hasAttribute(attribute) && checkEmpty
      
  }
}