const queryaziende = "http://www.eurokosher.it/api/EUK_API_codici_nomi_aziende.asp";
const queryregioni = "http://www.eurokosher.it/api/EUK_API_codici_nomi_regioni.asp";
const queryauditors = "http://www.eurokosher.it/api/EUK_API_codici_nomi_auditors.asp";
const queryaudits = "http://www.eurokosher.it/api/EUK_API_audits.asp";
const queryviewaudit = "http://www.eurokosher.it/api/EUK_API_leggi_scheda_audit.asp";
const query_edit = "http://www.eurokosher.it/api/EUK_API_scrivi_scheda_audit.asp";

function popolaRegioni(select) {
  fetch(queryregioni).then(response => response.json()).then(json => {
    for (i = 0; i < json.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", json[i].Codice);
      option.innerHTML = json[i].Denominazione;
      select.appendChild(option);
    }
  });
}

function popolaClienti(select, filtro) {
  let query = queryaziende;
  if (filtro != null) {
    query += "?cod_regione=" + filtro;
  }
  select.innerHTML = "";
  let option = document.createElement("option");
  option.innerHTML = "Tutti";
  option.setAttribute("value", "");
  select.appendChild(option);
  fetch(query).then(response => response.json()).then(json => {
    for (i = 0; i < json.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", json[i].Codice);
      option.innerHTML = json[i].Denominazione;
      select.appendChild(option);
    }
  })
}

function popolaAudits(container, codCliente, codRegione, codAuditor, query) {
  fetch("riservata/rowaudit").then(response => response.text()).then(scheletro_row => {
    container.getElementsByClassName("no-audits")[0].classList.add("d-none");
    container.querySelectorAll("tbody").forEach(b => b.remove());
    fetch(query).then(response => response.json()).then(json => {
      container.getElementsByClassName("tot_audits")[0].innerHTML = "TOT: " + json.length;
      for (i = 0; i < json.length; i++) {
        let row_audit = document.createElement("tbody");
        row_audit.id = json[i].ID_audit;
        row_audit.className = "row_audit border-top";
        row_audit.innerHTML = scheletro_row;
        row_audit.addEventListener("click", showAuditView);
        row_audit.getElementsByClassName("localita_audit")[0].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
        row_audit.getElementsByClassName("data_audit")[0].innerHTML = json[i].Data_audit;
        row_audit.getElementsByClassName("auditor_audit")[0].innerHTML = json[i].Audit_Auditor;
        row_audit.getElementsByClassName("naudit")[0].innerHTML = i + 1;
        row_audit.getElementsByClassName("azienda_audit")[0].innerHTML = json[i].Azienda;
        row_audit.getElementsByClassName("status_audit")[0].setAttribute("src", "resources/img/riservata/status" + json[i].Cod_esito + ".svg");
        
        container.getElementsByTagName("table")[0].appendChild(row_audit);
      }
    }).catch(err => {
      console.log(err)
      container.getElementsByClassName("no-audits")[0].classList.remove("d-none");
      container.getElementsByClassName("tot_audits")[0].innerHTML = "";
    });
  })
}

function generaQueryAudits(codCliente, codRegione, codAuditor) {
  let query = queryaudits;
  if (codCliente != "" || codRegione != "" || codAuditor != "") {
    if (codCliente != "") {
      query += "?Cod_azienda=" + codCliente;
      if (codRegione != "") {
        query += "&Cod_regione=" + codRegione;
      }
      if (codAuditor != "") {
        query += "&Cod_utente=" + codAuditor;
      }
    } else if (codRegione != "") {
      query += "?Cod_regione=" + codRegione;
      if (codAuditor != "") {
        query += "&Cod_utente=" + codAuditor;
      }
    } else {
      query += "?Cod_utente=" + codAuditor;
    }
  }
  return query;
}

function appendChilds(father, children) {
  for (let i = 0; i < children.length; i++) {
    father.appendChild(children[i]);
  }
}

function createElement(selector, classe) {
  let el = document.createElement(selector);
  el.className = classe;
  return el;
}

function popolaAuditors(select) {
  fetch(queryauditors).then(response => response.json()).then(json => {
    for (i = 0; i < json.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", json[i].Codice);
      option.innerHTML = json[i].Denominazione;
      select.appendChild(option);
    }
  });
}

var audit = ""
function showAuditView() {
  let query = queryviewaudit + "?ID_audit=" + this.id;
  fetch(query).then(response => response.arrayBuffer()).then(buffer => {
    const decoder = new TextDecoder("iso-8859-1");
    const decoded = decoder.decode(buffer);
    const json = eval(decoded);
    fetch("riservata/auditview").then(response => response.text()).then(html => {
      document.getElementById('audit_view').innerHTML = html;
      let view_container = document.getElementById("audit_view_container");
      view_container.classList.remove("d-none");
      
      document.getElementById('modal__overlay').classList.remove("d-none");
      
      audit = json[0];
      
      view_container.getElementsByClassName("id_audit")[0].innerHTML = audit.Cod_ID_audit;
      view_container.getElementsByClassName("modal__azienda_audit")[0].innerHTML = audit.Azienda_nome;
      view_container.getElementsByClassName("modal__data_audit")[0].innerHTML = audit.Data_audit;
      view_container.getElementsByClassName("modal__ora_audit")[0].innerHTML = audit.Ora_audit;
      view_container.getElementsByClassName("modal__nome_auditor")[0].innerHTML = audit.Nome_Auditor;
      view_container.getElementsByClassName("modal__indirizzo_audit")[0].innerHTML = audit.Azienda_indirizzo;
      view_container.getElementsByClassName("modal__cap_audit")[0].innerHTML = audit.Azienda_CAP;
      view_container.getElementsByClassName("modal__localita_audit")[0].innerHTML = audit.Azienda_localita;
      view_container.getElementsByClassName("modal__telefoni_audit")[0].innerHTML = audit.Azienda_telefoni;
      view_container.getElementsByClassName("modal__mail_audit")[0].innerHTML = audit.Azienda_email;
      view_container.getElementsByClassName("modal__contatti_audit")[0].innerHTML = audit.Azienda_contatti;

      view_container.getElementsByClassName("modal__descrizione_audit")[0].innerHTML = audit.Desc_audit;
      view_container.getElementsByClassName("modal__textarea_descrizione_audit")[0].innerHTML = audit.Desc_audit.replace(/<br>/g, "\n");
      view_container.getElementsByClassName("modal__documenti_audit")[0].innerHTML = audit.Documenti_ritirati;
      view_container.getElementsByClassName("modal__textarea_documenti_audit")[0].innerHTML = audit.Documenti_ritirati.replace(/<br>/g, "\n");
      view_container.getElementsByClassName("modal__oggetto_audit")[0].innerHTML = audit.Oggetto_audit;
      view_container.getElementsByClassName("modal__textarea_oggetto_audit")[0].innerHTML = audit.Oggetto_audit.replace(/<br>/g, "\n");

      if (document.getElementsByClassName("modal__salva_btn")[0] != undefined) {
        view_container.getElementsByClassName("modal__salva_btn")[0].id = audit.Cod_ID_audit;
        view_container.getElementsByClassName("modal__modifica_btn")[0].addEventListener("click", edita);
        view_container.getElementsByClassName("modal__salva_btn")[0].addEventListener("click", salva);
      }
    })
  })
}

function closeView() {
  let view_container = document.getElementById("audit_view_container");
  // TODO
  // document.getElementsByTagName("body")[0].style.background = "white";
  document.getElementById("audit_view_container").classList.add("d-none");
  document.getElementById('modal__overlay').classList.add("d-none");
  view_container.getElementsByClassName("modal__oggetto_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__oggetto_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__descrizione_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__descrizione_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__documenti_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__documenti_audit_edit")[0].classList.add("d-none");
  // view_container.getElementsByClassName("modal__modifica_col")[0].classList.remove("d-none");
  // view_container.getElementsByClassName("modal__salva_col")[0].classList.add("d-none");
}

function edita(event) {
  let view_container = document.getElementById("audit_view_container");
  view_container.getElementsByClassName("modal__oggetto_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__oggetto_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__descrizione_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__descrizione_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__documenti_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__documenti_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modal__modifica_col")[0].classList.add("d-none");
  view_container.getElementsByClassName("modal__salva_col")[0].classList.remove("d-none");

  initTextArea("modal__textarea");
}

function salva(event) {
  let view_container = document.getElementById("audit_view_container");
  let oggetto_audit = view_container.getElementsByClassName("modal__textarea_oggetto_audit")[0].value.replace(/\n/g, "%0D%0A").replace(/ /g, "%20");;
  let descrizione_audit = view_container.getElementsByClassName("modal__textarea_descrizione_audit")[0].value.replace(/\n/g, "%0D%0A").replace(/ /g, "%20");
  let documenti_audit = view_container.getElementsByClassName("modal__textarea_documenti_audit")[0].value.replace(/\n/g, "%0D%0A").replace(/ /g, "%20");
  postData([audit.Cod_ID_audit, audit.Settimana, audit.Cod_auditor, oggetto_audit, descrizione_audit, documenti_audit], function (text) {
    if (text != "OK") {
      alert("Errore nell'aggiornamento dell'audit");
    }
    showAudit(audit.Cod_ID_audit);
    view_container.getElementsByClassName("modal__oggetto_audit")[0].classList.remove("d-none");
    view_container.getElementsByClassName("modal__oggetto_audit_edit")[0].classList.add("d-none");
    view_container.getElementsByClassName("modal__descrizione_audit")[0].classList.remove("d-none");
    view_container.getElementsByClassName("modal__descrizione_audit_edit")[0].classList.add("d-none");
    view_container.getElementsByClassName("modal__documenti_audit")[0].classList.remove("d-none");
    view_container.getElementsByClassName("modal__documenti_audit_edit")[0].classList.add("d-none");
    view_container.getElementsByClassName("modal__modifica_col")[0].classList.remove("d-none");
    view_container.getElementsByClassName("modal__salva_col")[0].classList.add("d-none");
  });
}

function generaData(data) {
  return "ID_Audit=" + data[0] + "&Settimana=" + data[1] + "&Cod_auditor=" + data[2] + "&Oggetto_audit=" + data[3] + "&Desc_audit=" + data[4] + "&Doc_audit=" + data[5];
}

async function postData(data, callback) {
  texts = generaData(data);
  // Default options are marked with *
  fetch(query_edit, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //mode: 'cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: texts // body data type must match "Content-Type" header
  }).then(response => response.text()).then(text => {
    console.log(text);
    callback(text);
  })
}
