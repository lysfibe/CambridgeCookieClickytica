const pathUtils = require('path')
const server = new (require('@commander-lol/server'))
const mustache = require('@commander-lol/koa-mustache')
const Socket = require('koa-socket')

const dispatcher = require('./src/ws/dispatcher')

server.serve('/', pathUtils.join(__dirname, 'public'))
server.use(mustache(pathUtils.join(__dirname, 'views')))
server.routes(require('./src/http/routes'))

const socket = new Socket()

// socket.use(ctx => {
// 	console.log(ctx)
// })

socket.on('message', (event, data) => dispatcher.trigger(data, event))

socket.attach(server)
server.listen(8000)
console.log("Listening on http://localhost:8000")