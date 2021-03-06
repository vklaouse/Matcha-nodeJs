var middleware = require('../middlewares/like.js');

module.exports = {
	post: (router, isLog) => {
		router.post('/like', isLog, (req, res, next) => {
			middleware.like(req, res);
		});
	},
	delete: (router, isLog) => {
		router.delete('/like', isLog, (req, res, next) => {
			middleware.dislike(req, res);
		});
	}
}