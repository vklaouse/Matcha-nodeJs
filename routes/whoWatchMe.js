var middleware = require('../middlewares/whoWatchMe.js');

module.exports = {
	getViews: (router, isLog) => {
		router.get('/whoWatchMe', isLog, (req, res, next) => {
			middleware.whoWatchMe(req, res);
		});
	},
	getLikes: (router, isLog) => {
		router.get('/whoLikeMe', isLog, (req, res, next) => {
			middleware.whoLikeMe(req, res);
		});
	}
}