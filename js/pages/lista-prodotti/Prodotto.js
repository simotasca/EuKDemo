class Prodotto {
  constructor() {
    this.nome = null
    this.azienda = null
    this.codAzienda = null
    this.brand = null
    this.categoria = null
    this.codCategoria = null
    this.tipoProdotto = null
    this.codTipoProdotto = null
    this.livelloKasherut = null
    this.codLivelloKasherut = null
  }

  static fromRaw(raw) {
    const prodotto = new Prodotto()
    prodotto.nome = raw.Descrizione_ITA
    prodotto.azienda = raw.Azienda
    prodotto.codAzienda = raw.Cod_azienda
    prodotto.brand = raw.Brand
    prodotto.categoria = raw.Categoria
    prodotto.codCategoria = raw.Cod_categoria
    prodotto.tipoProdotto = raw.Tipo_prodotto
    prodotto.codTipoProdotto = raw.Cod_tipo_prodotto
    prodotto.livelloKasherut = raw.Livello_kashrut
    prodotto.codLivelloKasherut = raw.Cod_livello_kashrut
    return prodotto
  }
}