var express = require('express');
var path = require('path');

var router = express.Router();

const part_ris = path.join(partials_dir, "area_riservata");

router.get('/', function (req, res) {
  res.sendFile(path.join(pages_dir, "area_riservata.html"));
});

router.get('/myaudits', function (req, res) {
  res.sendFile(path.join(part_ris, "myaudits.html"));
});

router.get('/allaudits', function (req, res) {
  res.sendFile(path.join(part_ris, "allaudits.html"));
});

router.get('/situazioneaudits', function (req, res) {
  res.sendFile(path.join(part_ris, "situazione_audit.html"));
});

router.get('/certificati', function (req, res) {
  res.sendFile(path.join(part_ris, "certificati.html"));
});

router.get('/auditview', function (req, res) {
  res.sendFile(path.join(part_ris, "audit_view.html"));
});

router.get('/rowaudit', function (req, res) {
  res.sendFile(path.join(part_ris, "row_audit.html"));
});

module.exports = router;