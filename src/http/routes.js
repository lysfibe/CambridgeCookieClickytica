module.exports = function(router) {
	router.get('/', ctx => ctx.render('index', { title: 'CambridgeCookieClickytica' }))
}