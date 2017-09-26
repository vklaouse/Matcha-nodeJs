var middleware = require('../middlewares/home.js');

module.exports = {
	get: function(router, isLog){
		router.get('/home', isLog, function(req, res, next) {
			res.render('home');
		});
	}
}