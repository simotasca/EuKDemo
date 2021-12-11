const querySituaAudits = "http://www.eurokosher.it/api/EUK_API_situazione_audit_aziende.asp";

function auditSitReady() {
  // TODO: ho creato un toggle universale con la classe d-none di bootstrap
  // la pecca è che deve essere impostato nel momento in cui la partial è caricata
  setToggle();
  popolaRegioni(document.getElementById("select_region_situaaudits"));
  popolaSituaAudits();
}

function sa_regioneselected() {
  popolaSituaAudits();
}

function popolaSituaAudits() {
  let scheletro_situazione_audit = document.getElementById("row_situa_audit").innerHTML;
  let regione = document.getElementById("select_region_situaaudits").value;
  // FIXME: server pacco
  // let query = generaQuerySituaAudits(regione);
  fetch("data/situazione").then(response => response.json()).then(json => {
    // TODO: evito doppio getElementById
    let rows_container = document.getElementById("situa_audits_container").getElementsByTagName("table")[0];
    // TODO: per tabella
    // rows_container.innerHTML = "";
    rows_container.querySelectorAll("tbody").forEach(b => b.remove());
    for (let i = 0; i < json.length; i++) {
      // TODO: let row_audit = document.createElement("div");
      let row_audit = document.createElement("tbody");
      row_audit.id = "row_" + i;
      row_audit.className = "row_audit border-top";
      row_audit.innerHTML = scheletro_situazione_audit;

      //GENERALI
      row_audit.getElementsByClassName("auditor_audit")[0].innerHTML = json[i].Ente + "-" + json[i].Rav;
      row_audit.getElementsByClassName("naudit")[0].innerHTML = i;
      row_audit.getElementsByClassName("data_audit")[0].innerHTML = json[i].UltimoAudit;
      row_audit.getElementsByClassName("localita_audit")[0].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
      row_audit.getElementsByClassName("azienda_audit")[0].innerHTML = json[i].Azienda;
      // row_audit.getElementsByClassName("auditor_audit")[1].innerHTML = json[i].Ente + "-" + json[i].Rav;
      // row_audit.getElementsByClassName("naudit")[1].innerHTML = i;
      // row_audit.getElementsByClassName("data_audit")[1].innerHTML = json[i].UltimoAudit;
      // row_audit.getElementsByClassName("localita_audit")[1].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
      // row_audit.getElementsByClassName("azienda_audit")[1].innerHTML = json[i].Azienda;
      // INFO
      row_audit.getElementsByClassName("indirizzo_audit")[0].innerHTML = json[i].Indirizzo + " (" + json[i].Provincia + ")";
      // row_audit.getElementsByClassName("indirizzo_audit")[1].innerHTML = json[i].Indirizzo + " (" + json[i].Provincia + ")";
      row_audit.getElementsByClassName("cellulare_audit")[0].innerHTML = json[i].Telefoni;
      // row_audit.getElementsByClassName("cellulare_audit")[1].innerHTML = json[i].Telefoni;
      row_audit.getElementsByClassName("mail_audit")[0].innerHTML = json[i].Email;
      // row_audit.getElementsByClassName("mail_audit")[1].innerHTML = json[i].Email;

      // TODO: il tuo codice era troppo specifico per il tuo modello per il toggle
      // FIXME: dovrei usare anche qui il mio toggler generico ma l'ho fatto dopo
      let info = row_audit.getElementsByClassName("info_audit")[0];
      info.id = "info_" + i;
      row_audit.addEventListener("click", () => toggleInfo(info.id));

      rows_container.appendChild(row_audit);
    }
  })
}

function toggleInfo(id) {
  Array.from(document.getElementsByClassName("info_audit"))
    .filter(i => i.id != id)
    .forEach(i => i.classList.remove("info_audit--open"));

  document.getElementById(id).classList.toggle("info_audit--open");
}

function generaQuerySituaAudits(regione) {
  if (regione != "" && regione != null) {
    return querySituaAudits + "?cod_regione=" + regione;
  }
  return querySituaAudits;
}
