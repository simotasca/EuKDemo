const API_PRODOTTI = 'http://www.eurokosher.it/api/EUK_API_prodotti.asp'
const API_TIPOLOGIE = 'http://www.eurokosher.it/api/EUK_API_codici_nomi_tipi_di_prodotto.asp'
const API_CATEGORIE = 'http://www.eurokosher.it/api/EUK_API_codici_nomi_categorie.asp'
const API_LIVELLI_KASHRUT = 'http://www.eurokosher.it/api/EUK_API_codici_nomi_livelli_kashrut.asp'

const LOCAL_PRODOTTI = './resources/json/prodotti.json'
const LOCAL_TIPOLOGIE = './resources/json/tipologie.json'
const LOCAL_CATEGORIE = './resources/json/categorie.json'
const LOCAL_LIVELLI_KASHRUT = './resources/json/livelli_kashrut.json'

const table = document.querySelector("#table-risultati")

let risultati = []

const isMobile = () => window.innerWidth <= 470

async function decodeData(res) {
  const decoder = new TextDecoder("iso-8859-1")
  const decoded = decoder.decode(await res.arrayBuffer())
  return eval(decoded);
}

async function mapProdotti(data) {
  return data.map(raw => Prodotto.fromRaw(raw))
}

function groupBy(arr, property) {
  var grouped = {}
  for (var i = 0; i < arr.length; i++) {
    var p = arr[i][property]
    if (!grouped[p]) { grouped[p] = [] }
    grouped[p].push(arr[i])
  }
  return grouped
}

function fillTable(data) {
  table.innerHTML = ''
  data.forEach(prodotto => table.appendChild(new RowRisultato(prodotto)))
}

function fillTableGroupBy(data, column) {
  table.innerHTML = ''

  let grouped = groupBy(data, column)
  let categorie = Object.keys(grouped)

  categorie.forEach(categoria => {
    table.appendChild(new CategoriaRisultati(categoria, grouped[categoria][0].codCategoria))
    grouped[categoria].forEach(prodotto => table.appendChild(new RowRisultato(prodotto)))
    grouped[categoria].length < 2 && table.appendChild(rowSpacer())
    grouped[categoria].length < 3 && table.appendChild(rowSpacer())
  })
}

/**
 * Client side routing interno ad una singola pagina.
 * Non causa refresh.
 * @param {string} pathname target di navigazione.
 */
function hashNavigation(pathname) {
  let current = window.location.href
  window.location.href = current.replace(/#(.*)$/, '') + '#' + pathname
}

/**
 * Crea la querystring locale.
 * In seguito verrà autilizzata per creare la querystring per la fetch.
 * @param   {string} searchString   la stringa della ricerca.
 * @param   {Object} filters        i filtri da applicare.
 * @returns {string}                la stringa da utilizzare come hash.
 */
function buildHashQueryString(searchString, filters) {
  let route = "" + searchString?.replace(/\s/g, '%20')

  if (!filters) return route

  let stringFilters = []
  for (let [key, value] of Object.entries(filters)) {
    if (value) {
      stringFilters.push(`${key}=${value}`)
    }
  }
  route += '?' + stringFilters.join('&')

  return route
}

/**
 * Crea la querystring per la fetch sulla base dell'hash della pagina.
 */
function buildQueryString() {
  let hash = window.location.hash.substring(1)
  let clean = hash.match(/\?(.*)/)
  let queryString = clean ? clean[1] : ''
  return API_PRODOTTI + '?' + queryString;
}

/**
 * Una fetch che converte i risultati in oggetti Prodotto.
 * @param {string} url url della fetch.
 * @returns Promise<Array<Prodotto>>
 */
async function fetchProdotti(url) {
  return await fetch(url).then(res => decodeData(res)).then(data => mapProdotti(data))
}

/**
 * Ottiene i dati dati dal server in base all'hash della pagina e popola la tabella.
 */
async function updateTable() {
  let url = buildQueryString()
  table.innerHTML = ''
  document.querySelector('#loading-spinner').classList.add('visible')
  await fetchProdotti(url).then(prods => {
    fillTable(prods)
    risultati = prods
    document.querySelector('#nessun-risultato').classList.remove('visible')
  }).catch((error) => {
    fillTable([])
    document.querySelector('#nessun-risultato').classList.add('visible')
    console.error('Error:', error);
  }).finally(() => {
    document.querySelector('#loading-spinner').classList.remove('visible')
  })
}

function initMainCategorie(data) {
  let main = document.querySelector('#main-categorie')
  data.forEach(d => {
    let div = document.createElement('span')
    div.classList.add('categoria')
    div.classList.add('h5')
    div.innerText = d['Categoria']
    main.appendChild(div)
    main.appendChild(document.createTextNode(" "))
  })
}

async function initFiltroCategoria() {
  let select = document.querySelector('#filtro-categoria')
  let selectMobile = document.querySelector('#filtro-categoria-mobile')
  await fetch(API_CATEGORIE).then(res => decodeData(res)).then(data => {
    let mapped = data.map(d => new DropdownItem(d['Cod_categoria'], d['Categoria']))
    // initMainCategorie(data)
    select.setItems(mapped)
    selectMobile.setItems(mapped)
  })
}

/**
 * Popola le dropdown dei filtri.
 */
async function initFiltriRicerca() {
  await initFiltroCategoria()
}

/**
 * Setta i valori selezionati nei filtri in base all'hash della pagina.
 */
function setFiltri() {
  let hash = window.location.hash.substring(1)
  let clean = hash.match(/\?(.*)/)
  let queryString = clean ? clean[1] : ''
  queryString.split('&').forEach(param => {
    [key, val] = param.split('=')
    switch (key) {
      case 'Cod_categoria':
        document.querySelector('#filtro-categoria').select(val)
        document.querySelector('#filtro-categoria-mobile').select(val)
        break
      case 'Brand':
        document.querySelector('#filtro-brand').select(val)
        break
    }
  })
}

/**
 * Aggiorna l'hash della pagina in base ai filtri selezionati.
 */
function filtra() {
  console.log(isMobile())
  let categoria = document.querySelector('#filtro-categoria').selected

    console.log(categoria)

  let filters = {}
  if (categoria) filters.Cod_categoria = categoria.value


  hashNavigation(buildHashQueryString(null, filters))
}

window.addEventListener('hashchange', () => {
  setFiltri()
  updateTable()
})

updateTable()
initFiltriRicerca().then(() => setFiltri())