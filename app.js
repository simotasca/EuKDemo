var connect = require('connect')
var serve = require('serve-static')

const PORT = process.env.PORT || 3000 
connect().use(serve(__dirname)).listen(3000, () => console.log(`localhost:${PORT}`))