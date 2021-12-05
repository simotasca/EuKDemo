const express = require("express");
const path = require('path');

const app = express()

//app.use(express.static('public'));

app.get('/', function (req, res) {
	res.send("CIAOOOOOO");
});

const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})