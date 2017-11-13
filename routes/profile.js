var middleware = require('../middlewares/profile.js');

module.exports = {
	getWithId: (router, isLog) => {
		router.get('/profile/:id', isLog, (req, res, next) => {
			middleware.getProfile(req, res);
		});
	},
	get: (router, isLog) => {
		router.get('/profile', isLog, (req, res, next) => {
			req.params = {id: `` + req.session.uId};
			middleware.getProfile(req, res);
		});
	}
}