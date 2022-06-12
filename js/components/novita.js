
class Novita extends HTMLElement {
  #template = null;

  #getTemplate() {
    if (!this.#template) {
      this.#template = document.createElement('template');
      this.#template.innerHTML = `
        <style>
          @import "css/components/novita.css";
        </style>

        <div id="container">
          <img src="./resources/tonno.png" alt="">
          <p id="azienda">${this.hasAttribute('azienda') ? this.getAttribute('azienda') : '-'}</p>
          <p id="prodotto">${this.hasAttribute('prodotto') ? this.getAttribute('prodotto') : '-'}</p>
        </div>
      `;
    }
    return this.#template;
  }

  constructor(azienda, prodotto) {
    super();

    azienda && this.setAttribute('azienda', azienda);
    prodotto && this.setAttribute('prodotto', prodotto);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.#getTemplate().content.cloneNode(true));
  }
}

window.customElements.define('novita-el', Novita);