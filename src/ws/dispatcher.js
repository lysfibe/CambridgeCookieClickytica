class SocketDispatcher {
	constructor() {
		this._handlers = {}

		const routes = require('./routes')
		const mapper = (event, handler) => {
			this._handlers[event] = handler
		}
		routes({ register: mapper })
	}

	trigger(data, event) {
		if (data.hasOwnProperty('type')) {
			const handler = this._handlers[data.type]
			if (handler != null) {
				handler(data, event)
			}
		}
	}
}

module.exports = new SocketDispatcher()
