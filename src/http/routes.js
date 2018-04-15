const random_name = require('node-random-name');
const markov = require('../services/markov');

//let m = markov.default;
let m = markov.init({ path: 'data/tweets.txt' }, { stateSize: 1 }).then(console.log('tt'));

module.exports = function (router) {
	router.get('/', ctx => ctx.render('index', { title: 'CambridgeCookieClickytica' }))
	router.get('/posts', async ctx => {
		ctx.body = await getPosts(ctx.query.number);
	})
	router.group('/api', require('./routes-api'))
}

async function getPosts(number = 10) {
	m = await m; // Ensure Markov is ready

	// Generate posts
	const tasks = [];
	for (let i = 0; i < number; i++) {
		tasks.push(m.string());
	}
	let posts = await Promise.all(tasks);
	
	// Add usernames
	posts = posts.map(content => ({ content, username: random_name() }));
	
	return posts;
}