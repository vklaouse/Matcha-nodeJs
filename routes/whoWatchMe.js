var middleware = require('../middlewares/whoWatchMe.js');

module.exports = {
	getViews: (router, isLog) => {
		router.get('/whoWatchMe', isLog, function(req, res, next) {
			middleware.whoWatchMe(req, res);
		});
	},
	getLikes: (router, isLog) => {
		router.get('/whoLikeMe', isLog, function(req, res, next) {
			middleware.whoLikeMe(req, res);
		});
	}
}