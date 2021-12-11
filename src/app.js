const express = require("express");
const path = require('path');

const app = express();
app.use(express.static('public'));

global.pages_dir = path.join(__dirname, "pages");
global.partials_dir = path.join(__dirname, "partials");

// routes
app.get('/', function (req, res) {
  res.sendFile(path.join(pages_dir, "index.html"));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(pages_dir, "login.html"));
});

var riservata = require('./routes/areaRiservata');
app.use('/riservata', riservata);

var mockData = require('./routes/mockData');
app.use('/data', mockData);

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));