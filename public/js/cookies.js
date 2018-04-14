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
				linkedAccountBackoff: 1000
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
			var id = "post" + Date.now();

			els.newsFeed.prepend(`
			<article id="${id}" data-post-id="${id}" class="post">
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
		
		setTimeout(function() {
			document.querySelector('#'+id).style.opacity = 1;
		}, 250);
		
			
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
			name: 'CubeYou',
			content: 'Our platform brings together the most robust consumer data sources available, both online and offline.',
			price: 10,
			purchased: 0,
			rate: 10,
			perks: {
				postBonus: 1
			}
		},
		{
			name: 'AggregateIQ',
			content: 'AggregateIQ delivers proven technologies and data driven strategies that help you make timely decisions, reach new audiences and ultimately achieve your goals.',
			price: 50,
			purchased: 0,
			rate: 50,
			onPurchase: addLinkedAccount,
		},
		{
			name: 'Ashley Madison',
			content: 'Meet bored men & lonely housewives. Define your experience, and live life to the fullest! Life is short. Have an affair.®',
			price: 250,
			purchased: 0,
			rate: 250,
			onPurchase: () => addLinkedAccount(3),
		},
		{
			name: 'Cambridge Analytica',
			content: 'Data drives all we do. Cambridge Analytica uses data to change audience behavior.',
			price: 1250,
			purchased: 0,
			rate: 1250,
			perks: {
				postBonus: 625
			}
		},
		{
			name: 'IBM',
			content: 'Put the power of cognitive computing to work for you to gain greater insights so you can innovate faster.',
			price: 1250,
			purchased: 0,
			rate: 1250,
			perks: {
				postBonus: 625
			}
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
		if (state.posts > 20) {
			$( ".posts" ).slice( -n ).remove()
		}
		let oldState = Object.assign({}, state)
		state.posts += n
		stateListeners.map(l => l(oldState, state))
		if (n > 0) {
			fetchPosts(n).then(renderPosts)
			triggerRealThumb(n < 10 ? n : 10)
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
		for (let i = 0; i < thumbs; i += 1) {
			
			const width = Math.floor(Math.random() * (150 - 20)) + 20
			const height = Math.floor(width * 1.33)
			
			const image = new Image(width, height)
			image.src = '/images/real_thumb.png'
			image.className = 'realthumb'
			image.style.position = 'absolute'
			image.style.opacity = 0
			image.style.top = Math.floor(((window.innerHeight) * Math.random())) + 'px'
			image.style.left = Math.floor(((window.innerWidth) * Math.random())) + 'px'
			document.body.appendChild(image)
			


			// window.innerWidth / 100 * Math.random()
			
			setTimeout(function() {
				$( image ).addClass('animated rollIn')
				setTimeout(function() {
					$( image ).removeClass('rollIn')
					$( image ).addClass('rollOut')
					setTimeout(function() {
						$( image ).remove()
					}, 750)
				}, 500)
			}, 125)
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
			
			var realPostCount = $('.post').length
			console.log(realPostCount)

			if (realPostCount > 20) {
				$( '.post' ).slice( -(realPostCount - 20) ).remove();
			}

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