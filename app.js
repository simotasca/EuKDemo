const express = require("express");
const path = require('path');

const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));