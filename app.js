const express = require("express");
const path = require('path');

const app = express()
const port = process.env.port || 3000;

app.use(express.static('public'));

// sendFile will go here
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})