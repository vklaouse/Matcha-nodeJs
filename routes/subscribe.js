var middleware = require('../middlewares/subscribe.js');

module.exports = {
	get: (router, isNotLog) => {
		router.get('/subscribe', isNotLog, (req, res, next) => {
			res.render('subscribe', {page: 'subscribe'});
		});
	},
	post: (router, isNotLog) => {
		router.post('/subscribe', isNotLog, (req, res, next) => {
			middleware.createAccount(req, res);
		});
	}
}