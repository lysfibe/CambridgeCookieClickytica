$(function cookies() {
	const state = {
		posts: 0,
		postBonus: 0,
		linkedAccounts: 0,
		linkedAccountPopularityMetric: 1,
		linkedAccountBackoff: 5000
	}

	let linkedAccountTimer = 0
	let lastTick = performance.now()

	const stateListeners = []

	function getStateModifiers() {
		return 1 + state.postBonus
	}

	function addPost(n = 1) {
		state.posts += n
		stateListeners.map(l => l(state))
	}

	function addLinkedAccount(n = 1) {
		if (state.linkedAccounts < 1 && state.linkedAccounts + n > 0) {
			console.log("foo")
			linkedAccountTimer = 0
			tickLinkedAccount(performance.now())
		}
		state.linkedAccounts += n
		stateListeners.map(l => l(state))
	}

	$(document.body).on('click', '#add-post', () => {
		addPost(getStateModifiers())
	})


	function tickLinkedAccount(timestamp) {
		const delta = timestamp - lastTick
		lastTick = performance.now()
		linkedAccountTimer += lastTick
		if (linkedAccountTimer > state.linkedAccountBackoff) {
			linkedAccountTimer -= state.linkedAccountBackoff
			addPost(state.linkedAccounts * state.linkedAccountPopularityMetric)
		}
		requestAnimationFrame(tickLinkedAccount)
	}

	window._debug = {
		addLinkedAccount,
		addPost,
		getState() {
			return state
		}
	}


	// const socket = io()
	// socket.on('connection', e => console.log(e))
	// socket.on('my-lovely-babies', e => console.log(e))
	// socket.on('response', e => console.log(e))

	// socket.send({ type: 'stream-posts' })
	// window.s = socket
})