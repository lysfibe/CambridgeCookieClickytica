$(function cookies() {

	const els = {
		posts: $('#post-count'),
		linkedAccounts: $('#linked-accounts-count'),
	}

	const ui = {
		updatePosts(n) {
			els.posts.text(n)
		},
		updateLinked(n) {
			els.linkedAccounts.text(n)
		}
	}

	const state = (function loadState() {
		const serialised = localStorage.getItem('serial-state')
		if (serialised != null) {
			return JSON.parse(serialised)
		} else {
			return {
				posts: 0,
				postBonus: 0,
				linkedAccounts: 0,
				linkedAccountPopularityMetric: 1,
				linkedAccountBackoff: 10000
			}
		}
	}())

	ui.updatePosts(state.posts)
	ui.updateLinked(state.linkedAccounts)


	let linkedAccountTimer = 0
	let lastTick = performance.now()

	const stateListeners = []

	function getStateModifiers() {
		return 1 + state.postBonus
	}


	function addPost(n = 1) {
		let oldState = Object.assign({}, state)
		state.posts += n
		stateListeners.map(l => l(oldState, state))
	}
	
	function addLinkedAccount(n = 1) {
		if (state.linkedAccounts < 1 && state.linkedAccounts + n > 0) {
			console.log("foo")
			linkedAccountTimer = 0
			setTimeout(() => tickLinkedAccount(performance.now()))
		}
		let oldState = Object.assign({}, state)
		state.linkedAccounts += n
		stateListeners.map(l => l(oldState, state))
	}

	$(document.body).on('click', '#add-post', () => {
		addPost(getStateModifiers())
	})

	function tickLinkedAccount(timestamp) {
		const delta = timestamp - lastTick
		lastTick = performance.now()
		linkedAccountTimer += delta
		
		if (linkedAccountTimer > state.linkedAccountBackoff) {
			linkedAccountTimer -= state.linkedAccountBackoff
			addPost(state.linkedAccounts * state.linkedAccountPopularityMetric)
		}
		
		setTimeout(() => tickLinkedAccount(performance.now()))
	}

	stateListeners.push((old, current) => {
		if (old.posts !== current.posts) {
			ui.updatePosts(current.posts)
		}
		if (old.linkedAccounts !== current.linkedAccounts) {
			ui.updateLinked(current.linkedAccounts)
		}
	})

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