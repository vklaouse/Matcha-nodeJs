var middleware = require('../middlewares/logout.js');

module.exports = {
	get: (router, isLog) => {
		router.get('/logout', isLog, (req, res, next) => {
			middleware.unsetSession(req, res);
		});
	}
}