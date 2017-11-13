var middleware = require('../middlewares/report.js');

module.exports = {
	post: (router, isLog) => {
		router.post('/report', isLog, (req, res, next) => {
			middleware.report(req, res);
		});
	}
}