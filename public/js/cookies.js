$(function cookies() {

	const els = {
		posts: $('#post-count'),
		linkedAccounts: $('#linked-accounts-count'),
		buyableLists: $('#firend-requst_continasd'),
		newsFeed: $('#news-feed'),
	}

	const ui = {
		updatePosts(n) {
			els.posts.text(n)
		},
		updateLinked(n) {
			els.linkedAccounts.text(n)
		},
		updateBuyable(list) {
			const elms = list.map(createFriendRequest)
			els.buyableLists.text('')
			console.log(els.buyableLists)
			elms.forEach(el => els.buyableLists[0].appendChild(el))
		},
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

	async function fetchPosts(n = 1) {
		const res = await fetch('/posts?number=' + String(n))
		const values = await res.json()
		return values
	}

	function renderPosts(posts) {
		posts.forEach(post => setTimeout(() => {
			els.newsFeed.prepend(`
			<article data-post-id="" class="post">
			<header class="post__header">
				<div class="post__avatar">
					<img src="">
				</div>
				<div class="post__usermeta">
					<h3>${post.username}</h3>
					<span>Southampton Central Hall</span>
				</div>
			</header>
			<p class="post__content">
				${post.content}
			</p>
			<div class="post__footer">
				<a class="twitter-share-button"
					href="https://twitter.com/intent/tweet?text=${encodeURI(post.content)}http%3A%2F%2Fanaclytica.apps.lysfibe.co.uk">
					Tweet This!
				</a>
			</div>
		</article>`)
		}, Math.random() * 2000))
	}

	function createFriendRequest(data) {
		const price = (data.price + (data.purchased * data.rate))
		const container = document.createElement('div')
		container.classList.add('friend-request')

		const infoContainer = document.createElement('div')
		infoContainer.classList.add('friend-request__info')

		const title = document.createElement('h4')
		title.textContent = data.name

		const content = document.createElement('p')
		content.textContent = data.content

		const button = document.createElement('button')
		button.textContent = 'Accept Friend Request for ' + price + ' posts'
		button.addEventListener('click', function() {
			addPost(-price)
			if (data.onPurchase) {
				data.onPurchase()
			} else {
				bought.push(data)
			}

			container.parentNode.removeChild(container)
		})

		infoContainer.appendChild(title)
		infoContainer.appendChild(content)
		infoContainer.appendChild(button)

		container.appendChild(infoContainer)

		return container

		/**
		 * 
					<div class="friend-request">
						<div class="friend-request__info">
							<h4>AggregateIQ</h4>
							<p>
								AggregateIQ delivers proven technologies and data driven strategies that help you make timely decisions, reach new audiences and ultimately achieve your goals.
							</p>
							<button>Accept Friend Request for 750 posts</button>
						</div>
					</div>
		 */
	}
	let locked = [
		{
			name: '',
			content: 'Increase your PPC and get an extra Post Per Click',
			price: 10,
			purchased: 0,
			rate: 10,
			perks: {
				postBonus: 123
			}
		},
		{
			name: '',
			content: 'Link your friends account',
			price: 50,
			purchased: 0,
			rate: 50,
			onPurchase: addLinkedAccount,
		}
	]
	let buyable = []
	let bought = []

	let linkedAccountTimer = 0
	let lastTick = performance.now()

	const stateListeners = []

	function getStateModifiers() {
		return 1 + bought.map(p => p.perks ? p.perks.postBonus : 0).reduce((t, c) => t + c, 0)
	}

	function addPost(n = 1) {
		let oldState = Object.assign({}, state)
		state.posts += n
		stateListeners.map(l => l(oldState, state))
		if (n > 0) {
			fetchPosts(n).then(renderPosts)
			triggerRealThumb(n)
		}
	}
	
	function addLinkedAccount(n = 1) {
		if (state.linkedAccounts < 1 && state.linkedAccounts + n > 0) {
			linkedAccountTimer = 0
			setTimeout(() => tickLinkedAccount(performance.now()))
		}
		let oldState = Object.assign({}, state)
		state.linkedAccounts += n
		stateListeners.map(l => l(oldState, state))
	}

	function triggerRealThumb(thumbs) {
		return
		for (let i = 0; i < thumbs; i += 1) {
			const image = new Image(300, 400)
			image.src = '/images/real_thumb.png'
			image.style.position = 'absolute'
			image.style.top = String(0)
			console.log(window.innerWidth)
			image.left = String(window.innerWidth)
			console.log(image.style)
			let lastTime = Date.now()
			let speed = 10
			function dothumbo() {
				const now = Date.now()
				const delta = now - lastTime
				// console.log(delta)
				image.style.left = parseInt(image.style.left, 10) - (speed * delta)
				if (image.style.left + image.width > 10) {
					setTimeout(dothumbo)
				} else {
					document.body.removeChild(image)
				}
			}
			
			document.body.appendChild(image)
			setTimeout(dothumbo)
		}
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

	stateListeners.push((_, state) => {
		const getPrice = p => p.price + (p.purchased * p.rate)
		
		const canNowBuy = locked.filter(p => getPrice(p) <= state.posts)
		const cantBuy = buyable.filter(p => getPrice(p) > state.posts)

		locked = locked.filter(p => getPrice(p) > state.posts).concat(cantBuy)
		buyable = buyable.filter(p => getPrice(p) <= state.posts).concat(canNowBuy)

		ui.updateBuyable(buyable)
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