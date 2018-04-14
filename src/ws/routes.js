module.exports = function (router) {
	router.register('stream-posts', (data, event) => {
		event.socket.emit({ foo: 123, bae: 243 })
	})
}