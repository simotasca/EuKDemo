
class DropdownItem {
  constructor(value, text) {
    this.value = value;
    this.text = text;
  }
}

class SearchDropdown extends BaseComponent {

  #initElements() {
    let dropdown = this.qSelect("#dropdown")
    dropdown.innerHTML = ""

    this.items?.forEach((item, idx) => {
      let p = document.createElement("p")
      let div = document.createElement("div")
      p.innerText = item.text
      p.dataset.idx = idx
      p.style.display = "none"
      div.addEventListener('click', () => {
        this.qSelect('input').value = p.innerText
        this.selected = this.items[p.dataset.idx]
      })
      div.appendChild(p)
      dropdown.appendChild(div)
    })
  }

  #filterElements() {
    let filter = this.qSelect("input").value.toUpperCase()
    this.qSelectAll("#dropdown p").forEach(element => {
      if (element.innerText.toUpperCase().indexOf(filter) > -1)
        element.style.display = "block"
      else
        element.style.display = "none"
    })
  }

  constructor() {
    super()

    this.setTemplate(`
      <style> @import "css/components/search-dropdown.css"; </style>
      <div id="container">
        <input type="text" class="text-input" placeholder="${this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : ''}">
        <div id="dropdown"></div>
      </div>
    `)

    this.selected = null
    this.items = null

    const input = this.qSelect("input")
    input.onkeyup = () => this.#filterElements()
    input.onfocus = () => {
      this.#filterElements()
      input.setSelectionRange(0, input.value.length)
    }
    input.addEventListener('focusout', () => {
      input.value = ''
      this.selected = null
    })
  }

  setItems(items) {
    this.items = items
    this.#initElements()
  }

  select(key) {
    let sel = this.items.find(item => item.value == key)
    if (sel) {
      this.selected = sel
      this.qSelect("input").value = sel.text
    }
  }
}

window.customElements.define('search-dropdown', SearchDropdown)