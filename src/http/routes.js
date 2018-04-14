module.exports = function(router) {
	router.get('/', ctx => ctx.render('index', { title: 'CambridgeCookieClickytica' }))
	router.group('/api', require('./routes-api'))
}