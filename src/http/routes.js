const random_name = require('node-random-name');
const markov = require('../services/markov');

module.exports = function (router) {
	router.get('/', ctx => ctx.render('index', { title: 'CambridgeCookieClickytica' }))
	router.get('/posts', async ctx => {
		ctx.body = await getPosts();
	})
	router.group('/api', require('./routes-api'))
}

async function getPosts(number = 10) {
	const m = await markov.default;
	const tasks = [];
	for (let i = 0; i < 10; i++) {
		tasks.push(m.string());
	}
	let posts = await Promise.all(tasks);
	posts = posts.map(content => ({ content, username: random_name() }));
	return posts;
}