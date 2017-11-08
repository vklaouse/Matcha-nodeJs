var middleware = require('../middlewares/report.js');

module.exports = {
	post: function(router, isLog){
		router.post('/report', isLog, function(req, res, next) {
			middleware.report(req, res);
		});
	}
}