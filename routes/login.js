var middleware = require('../middlewares/login.js');

module.exports = {
	get: function(router, isNotLog){
		router.get('/', isNotLog, function(req, res, next) {
			res.render('login');
		});
	},
	post: function(router, isNotLog){
		router.post('/', isNotLog, function(req, res, next) {
			middleware.login(req, res);
		});
	}
}