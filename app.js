const express = require("express");

const app = express();
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER LISTEN ON PORT: ${PORT}`));