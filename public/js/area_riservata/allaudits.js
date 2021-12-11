function allAuditsReady() {
  // TODO: vedi situa_audits.js auditSitReady()
  setToggle();
  popolaSelectsAllAudits();
  popolaAuditsAllAudits();
  // TODO: meglio lasciare ste cose al css
  //document.getElementById("all_audits_container").style.height = window.innerHeight + "px";
}

function aa_regioneselected() {
  let cod_regione = document.getElementById("select_region_allaudits").value;
  let select_client = document.getElementById("select_client_allaudits");
  popolaClienti(select_client, cod_regione);
  popolaAuditsAllAudits();
}

function aa_clientselected() {
  popolaAuditsAllAudits();
}

function auditorselected() {
  popolaAuditsAllAudits();
}

function popolaSelectsAllAudits() {
  let select_region = document.getElementById("select_region_allaudits");
  let select_client = document.getElementById("select_client_allaudits");
  let select_auditor = document.getElementById("select_auditor");
  popolaClienti(select_client);
  popolaRegioni(select_region);
  popolaAuditors(select_auditor);
}



function popolaAuditsAllAudits() {
  let codCliente = document.getElementById("select_client_allaudits").value;
  let codAuditor = document.getElementById("select_auditor").value;
  let codRegione = document.getElementById("select_region_allaudits").value;
  popolaAudits(document.getElementById("all_audits_container"), codCliente, codRegione, codAuditor, "data/all");
}
