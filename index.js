const pathUtils = require('path')
const server = new (require('@commander-lol/server'))

server.serve('/', pathUtil.join(__dirname, 'public'))

server.listen(8000)
