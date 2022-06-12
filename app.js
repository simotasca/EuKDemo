var connect = require('connect')
var serve = require('serve-static')

const PORT = 3000 || process.env.PORT
connect().use(serve(__dirname)).listen(3000, () => console.log(`localhost:${PORT}`))