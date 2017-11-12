var middleware = require('../middlewares/messages.js');

module.exports = {
	get: (router, isLog) => {
		router.get('/messages', isLog, function(req, res, next) {
			middleware.messages(req, res);
		});
	}
}