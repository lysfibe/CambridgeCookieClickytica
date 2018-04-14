module.exports = function (router) {
	router.register('stream-posts', (data, event) => {
		event.socket.emit('my-lovely-babies', { foo: 123, bae: 243 })
	})
}