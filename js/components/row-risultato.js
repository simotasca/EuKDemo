class CategoriaRisultati extends HTMLElement {
  constructor(nome, codice) {
    super()

    this.nome = nome
    this.codice = codice

    this.innerHTML = `
      <h3 class="blue">${this.nome}</h3>
      <img src="./resources/categorie-prodotti/caffe.png" alt="" class="only-on-desktop">
    `
  }
}

class RowRisultato extends HTMLElement {

  #template = null;

  #getTemplate() {
    if (!this.#template) {
      this.#template = document.createElement('template');
      this.#template.innerHTML = `
        <div id="brand" class="cell">${this.prodotto.brand}</div>
        <div id="prodotto" class="cell">${this.prodotto.nome}</div>
        
        <div class="collapse">
          <img class="arrow hide-on-desktop" src="./resources/arrow-d.svg" alt="">
            <div class="collapse__content">
              <div class="inline-container">
                <div class="cell blue"><b>${this.prodotto.categoria}</b></div>
                <div id="tipologia" class="cell">${this.prodotto.tipoProdotto}</div>
              </div>
              <div id="kasherut" class="cell">${this.prodotto.livelloKasherut.replace('Kosher', '')}</div>
            </div>
        </div>
      `;
    }
    return this.#template;
  }

  constructor(prodotto) {
    super()

    this.prodotto = prodotto

    this.appendChild(this.#getTemplate().content.cloneNode(true))

    this.addEventListener('click', () => {
      this.classList.toggle('row-risultato--active')
    })
  }
}

const rowSpacer = () => {
  const spacer = document.createElement('div')
  spacer.classList.add('row-spacer')
  spacer.classList.add('only-on-desktop')
  return spacer
}


window.customElements.define('row-risultato', RowRisultato)
window.customElements.define('categoria-risultati', CategoriaRisultati)