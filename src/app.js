const express = require("express");

const app = express();

// static files
app.use(express.static('public'));

// paths
// const path = require('path');
/*app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});*/

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));