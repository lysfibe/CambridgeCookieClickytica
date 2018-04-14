const pathUtils = require('path')
const server = new (require('@commander-lol/server'))
const mustache = require('@commander-lol/koa-mustache')

server.serve('/', pathUtils.join(__dirname, 'public'))
server.use(mustache(pathUtils.join(__dirname, 'views')))
server.routes(require('./src/http/routes'))

server.listen(8000)
console.log("Listening on http://localhost:8000")