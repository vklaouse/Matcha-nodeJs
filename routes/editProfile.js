var middleware = require('../middlewares/editProfile.js');

module.exports = {
	get: function(router, isLog){
		router.get('/editProfile', isLog, function(req, res, next) {
			res.render('editProfile');
		});
	}
}