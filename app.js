var connect = require('connect')
var serve = require('serve-static')

connect().use(serve(__dirname)).listen(3000, () => console.log('localhost:3000'))