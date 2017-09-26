var middleware = require('../middlewares/subscribe.js');

module.exports = {
	get: function(router, isNotLog){
		router.get('/subscribe', isNotLog, function(req, res, next) {
			res.render('subscribe');
		});
	},
	post: function(router, isNotLog){
		router.post('/subscribe', isNotLog, function(req, res, next) {
			middleware.createAccount(req, res);
		});
	}
}