var middleware = require('../middlewares/logout.js');

module.exports = {
	get: function(router, isLog){
		router.get('/logout', isLog, function(req, res, next) {
			middleware.unsetSession(req, res);
		});
	}
}