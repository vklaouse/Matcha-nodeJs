var middleware = require('../middlewares/mdpForget.js');

module.exports = {
	get: function(router, isNotLog){
		router.get('/forget', isNotLog, function(req, res, next) {
			res.render('mdpForget');
		});
	},
	post: function(router, isNotLog){
		router.post('/forget', isNotLog, function(req, res, next) {
			middleware.sendNewMdp(req, res);
		});
	}
}