const querySituaAudits = "http://www.eurokosher.it/api/EUK_API_situazione_audit_aziende.asp";

function showinfoPc() {
  let row = this.parentNode.parentNode.parentNode;
  let infopc = row.getElementsByClassName("info_pc")[0];
  if (infopc.classList.contains("d-md-none")) {
    infopc.classList.remove("d-md-none");
  } else {
    infopc.classList.add("d-md-none");
  }
}

function auditSitReady() {
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
  let query = generaQuerySituaAudits(regione);
  fetch(query).then(response => response.json()).then(json => {
    let rows_container = document.getElementById("situa_audits_container").getElementsByTagName("table")[0];
    // rows_container.innerHTML = "";
    rows_container.querySelectorAll("tbody").forEach(b => b.remove())
    for (let i = 0; i < json.length; i++) {
      // let row_audit = document.createElement("div");
      let row_audit = document.createElement("tbody");
      row_audit.id = "row_" + i;
      row_audit.className = "row_audit border-top";
      row_audit.innerHTML = scheletro_situazione_audit;
      row_audit.getElementsByClassName("auditor_audit")[0].innerHTML = json[i].Ente + "-" + json[i].Rav;
      row_audit.getElementsByClassName("auditor_audit")[1].innerHTML = json[i].Ente + "-" + json[i].Rav;
      row_audit.getElementsByClassName("naudit")[0].innerHTML = i;
      row_audit.getElementsByClassName("naudit")[1].innerHTML = i;
      row_audit.getElementsByClassName("data_audit")[0].innerHTML = json[i].UltimoAudit;
      row_audit.getElementsByClassName("data_audit")[1].innerHTML = json[i].UltimoAudit;
      row_audit.getElementsByClassName("localita_audit")[0].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
      row_audit.getElementsByClassName("localita_audit")[1].innerHTML = json[i].Localita + " (" + json[i].Provincia + ")";
      row_audit.getElementsByClassName("azienda_audit")[0].innerHTML = json[i].Azienda;
      row_audit.getElementsByClassName("azienda_audit")[1].innerHTML = json[i].Azienda;

      row_audit.getElementsByClassName("indirizzo_audit")[0].innerHTML = json[i].Indirizzo + " (" + json[i].Provincia + ")";
      // row_audit.getElementsByClassName("indirizzo_audit")[1].innerHTML = json[i].Indirizzo + " (" + json[i].Provincia + ")";
      row_audit.getElementsByClassName("cellulare_audit")[0].innerHTML = json[i].Telefoni;
      // row_audit.getElementsByClassName("cellulare_audit")[1].innerHTML = json[i].Telefoni;
      row_audit.getElementsByClassName("mail_audit")[0].innerHTML = json[i].Email;
      // row_audit.getElementsByClassName("mail_audit")[1].innerHTML = json[i].Email;
      let info = row_audit.getElementsByClassName("info_audit")[0];
      info.id = "info_" + i;
      row_audit.addEventListener("click", () => toggleInfo(info.id));
      // row_audit.getElementsByClassName("contatti_generali")[0].addEventListener("click", showinfocell);
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

function showinfocell() {
  let row = this.parentNode.parentNode;
  let infocell = row.getElementsByClassName("info_cell")[0];
  let attributescell = row.getElementsByClassName("row_attributes_cell")[0];
  let contatti_generali = row.getElementsByClassName("contatti_generali")[0];
  if (infocell.classList.contains("d-none")) {
    attributescell.classList.add("d-none");
    infocell.classList.remove("d-none");
    contatti_generali.innerHTML = "Generali";
  } else {
    attributescell.classList.remove("d-none");
    infocell.classList.add("d-none");
    contatti_generali.innerHTML = "Contatti";
  }
}
