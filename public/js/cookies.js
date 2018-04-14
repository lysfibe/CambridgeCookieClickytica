$(function cookies() {

	const state = {
		posts: 0,
		postBonus: 0,
		linkedAccounts: 0,
		linkedAccountPopularityMetric: 1,
		linkedAccountBackoff: 5000
	}
	const stateListeners = []

	function getStateModifiers() {
		return 1 + state.postBonus + (linkedAccounts * linkedAccountPopularityMetric)
	}

	function addPost(n = 1) {
		state.posts += n
		stateListeners.map(l => l(state))
	}

	function addLinkedAccount(n = 1) {
		state.linkedAccounts ++ n
		stateListeners.map(l => l(state))
	}

	$(body).on('click', '#add-post', () => {
		addPost(getStateModifiers())
	})

	// const socket = io()
	// socket.on('connection', e => console.log(e))
	// socket.on('my-lovely-babies', e => console.log(e))
	// socket.on('response', e => console.log(e))

	// socket.send({ type: 'stream-posts' })
	// window.s = socket
})