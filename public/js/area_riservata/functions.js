const queryaziende = "http://www.eurokosher.it/api/EUK_API_codici_nomi_aziende.asp";
const queryregioni = "http://www.eurokosher.it/api/EUK_API_codici_nomi_regioni.asp";
const queryauditors = "http://www.eurokosher.it/api/EUK_API_codici_nomi_auditors.asp";
const queryaudits = "http://www.eurokosher.it/api/EUK_API_audits.asp";
const queryviewaudit = "http://www.eurokosher.it/api/EUK_API_leggi_scheda_audit.asp"
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

function popolaAudits(container, codCliente, codRegione, codAuditor) {
  fetch("riservata/rowaudit").then(response => response.text()).then(scheletro_row => {
    container.getElementsByClassName("no-audits")[0].classList.add("d-none");
    container.querySelectorAll("tbody").forEach(b => b.remove())
    
    let query = generaQueryAudits(codCliente, codRegione, codAuditor);
    fetch(query).then(response => response.json()).then(json => {
      container.getElementsByClassName("tot_audits")[0].innerHTML = "TOT: " + json.length;
      for (i = 0; i < json.length; i++) {
        let row_audit = document.createElement("tbody");
        row_audit.id = json[i].ID_audit;
        row_audit.className = "row_audit border-top";
        row_audit.innerHTML = scheletro_row;
        row_audit.addEventListener("click", showAuditView);
        row_audit.getElementsByClassName("localita_audit")[0].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
        row_audit.getElementsByClassName("localita_audit")[1].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
        row_audit.getElementsByClassName("data_audit")[0].innerHTML = json[i].Data_audit;
        row_audit.getElementsByClassName("data_audit")[1].innerHTML = json[i].Data_audit;
        row_audit.getElementsByClassName("auditor_audit")[0].innerHTML = json[i].Audit_Auditor;
        row_audit.getElementsByClassName("auditor_audit")[1].innerHTML = json[i].Audit_Auditor;
        row_audit.getElementsByClassName("naudit")[0].innerHTML = i + 1;
        row_audit.getElementsByClassName("naudit")[1].innerHTML = i + 1;
        row_audit.getElementsByClassName("azienda_audit")[0].innerHTML = json[i].Azienda;
        row_audit.getElementsByClassName("azienda_audit")[1].innerHTML = json[i].Azienda;
        row_audit.getElementsByClassName("status_audit")[0].setAttribute("src", "resources/img/riservata/status" + json[i].Cod_esito + ".svg");
        row_audit.getElementsByClassName("status_audit")[1].setAttribute("src", "resources/img/riservata/status" + json[i].Cod_esito + ".svg");
        container.getElementsByTagName("table")[0].appendChild(row_audit);
      }
    }).catch(err => {
      console.log("ERR", err)
      console.log(container.getElementsByClassName("no-audits"))
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
  fetch(query).then(response => response.json()).then(json => {
    let view_container = document.getElementById("audit_view_container");
    view_container.classList.remove("d-none");
    audit = json[0];
    console.log(audit);
    view_container.getElementsByClassName("id_audit")[0].innerHTML = audit.Cod_ID_audit;
    view_container.getElementsByClassName("azienda_audit")[0].innerHTML = audit.Azienda_nome;
    view_container.getElementsByClassName("indirizzo_audit")[0].innerHTML = audit.Azienda_indirizzo;
    view_container.getElementsByClassName("cap_audit")[0].innerHTML = audit.Azienda_CAP;
    view_container.getElementsByClassName("localita_audit")[0].innerHTML = audit.Azienda_localita;
    view_container.getElementsByClassName("telefoni_audit")[0].innerHTML = audit.Azienda_telefoni;
    view_container.getElementsByClassName("mail_audit")[0].innerHTML = audit.Azienda_email;
    view_container.getElementsByClassName("contatti_audit")[0].innerHTML = audit.Azienda_contatti;
    view_container.getElementsByClassName("descrizione_audit")[0].innerHTML = audit.Desc_audit;
    view_container.getElementsByClassName("textarea_descrizione_audit")[0].innerHTML = audit.Desc_audit.replace(/<br>/g, "\n");
    view_container.getElementsByClassName("documenti_audit")[0].innerHTML = audit.Documenti_ritirati;
    view_container.getElementsByClassName("textarea_documenti_audit")[0].innerHTML = audit.Documenti_ritirati.replace(/<br>/g, "\n");
    view_container.getElementsByClassName("nome_auditor")[0].innerHTML = audit.Nome_Auditor;
    view_container.getElementsByClassName("oggetto_audit")[0].innerHTML = audit.Oggetto_audit;
    view_container.getElementsByClassName("textarea_oggetto_audit")[0].innerHTML = audit.Oggetto_audit.replace(/<br>/g, "\n");
    view_container.getElementsByClassName("ora_audit")[0].innerHTML = audit.Ora_audit;
    view_container.getElementsByClassName("data_audit")[0].innerHTML = audit.Data_audit;
    document.getElementsByClassName("salva_btn")[0].id = audit.Cod_ID_audit;
    document.getElementsByClassName("modifica_btn")[0].addEventListener("click", edita);
    document.getElementsByClassName("salva_btn")[0].addEventListener("click", salva);
    // document.getElementsByTagName("body")[0].style.background = "grey";
  })
}

function closeView() {
  let view_container = document.getElementById("audit_view_container");
  // document.getElementsByTagName("body")[0].style.background = "white";
  document.getElementById("audit_view_container").classList.add("d-none");
  view_container.getElementsByClassName("oggetto_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("oggetto_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("descrizione_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("descrizione_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("documenti_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("documenti_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modifica_col")[0].classList.remove("d-none");
  view_container.getElementsByClassName("salva_col")[0].classList.add("d-none");
}

function edita(event) {
  let view_container = document.getElementById("audit_view_container");
  view_container.getElementsByClassName("oggetto_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("oggetto_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("descrizione_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("descrizione_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("documenti_audit")[0].classList.add("d-none");
  view_container.getElementsByClassName("documenti_audit_edit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("modifica_col")[0].classList.add("d-none");
  view_container.getElementsByClassName("salva_col")[0].classList.remove("d-none");
}

function salva(event) {
  let view_container = document.getElementById("audit_view_container");
  view_container.getElementsByClassName("oggetto_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("oggetto_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("descrizione_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("descrizione_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("documenti_audit")[0].classList.remove("d-none");
  view_container.getElementsByClassName("documenti_audit_edit")[0].classList.add("d-none");
  view_container.getElementsByClassName("modifica_col")[0].classList.remove("d-none");
  view_container.getElementsByClassName("salva_col")[0].classList.add("d-none");
}
