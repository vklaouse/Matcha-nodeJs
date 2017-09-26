var middleware = require('../middlewares/profile.js');

module.exports = {
	get: function(router, isLog){
		router.get('/profile', isLog, function(req, res, next) {
			res.render('profile');
		});
	}
}