document.addEventListener('DOMContentLoaded', function cookies() {
	const socket = io()
	socket.on('connection', console.log)
	socket.on('message', console.log)
	socket.on('response', console.log)

	socket.send({ type: 'stream-posts' })
	window.s = socket
})