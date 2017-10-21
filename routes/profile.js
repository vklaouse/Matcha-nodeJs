var middleware = require('../middlewares/profile.js');

module.exports = {
	getWithId: function(router, isLog){
		router.get('/profile/:id', isLog, function(req, res, next) {
			middleware.getProfile(req, res);
		});
	},
	get: function(router, isLog){
		router.get('/profile', isLog, function(req, res, next) {
			req.params = {id: `` + req.session.uId};
			middleware.getProfile(req, res);
		});
	}
}