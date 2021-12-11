const codice_cliente = "MRC";

function myauditsReady() {
  // TODO: vedi situa_audits.js auditSitReady()
  setToggle();
  popolaSelectsMyAudits();
  popolaAuditsMyAudits();
}

function popolaSelectsMyAudits() {
  let select_region = document.getElementById("select_region_myaudits");
  let select_client = document.getElementById("select_client_myaudits");
  // TODO: meglio lasciare ste cose al css
  // document.getElementById("audits_container").style.height = window.innerHeight  + "px";
  popolaClienti(select_client);
  popolaRegioni(select_region);
}

function popolaAuditsMyAudits() {
  let codCliente = document.getElementById("select_client_myaudits").value;
  let codAuditor = codice_cliente;
  let codRegione = document.getElementById("select_region_myaudits").value;
  popolaAudits(document.getElementById("audits_container") ,codCliente, codRegione, codAuditor, "data/my");
}

function regioneselected() {
  let cod_regione = document.getElementById("select_region_myaudits").value;
  let select_client = document.getElementById("select_client_myaudits");
  popolaClienti(select_client, cod_regione);
  popolaAuditsMyAudits();
}

function clientselected() {
  popolaAuditsMyAudits();
}
