var middleware = require('../middlewares/home.js');

module.exports = {
	get: (router, isLog) => {
		router.get('/home', isLog, (req, res, next) => {
			middleware.getInterestingProfiles(req, res);
		});
	}
}