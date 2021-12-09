var express = require('express');
var path = require('path');

var router = express.Router();

const dataPath = path.join(__dirname, "..", "data");

router.get('/my', function (req, res) {
  const data = require(path.join(dataPath, "myaudits.json"))
  res.json(data);
});

router.get('/all', function (req, res) {
  const data = require(path.join(dataPath, "allaudits.json"))
  res.json(data);
});

router.get('/situazione', function (req, res) {
  const data = require(path.join(dataPath, "situaaudits.json"))
  res.json(data);
});

module.exports = router;