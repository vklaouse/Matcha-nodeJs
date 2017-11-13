var middleware = require('../middlewares/messages.js');

module.exports = {
	get: (router, isLog) => {
		router.get('/messages', isLog, (req, res, next) => {
			middleware.messages(req, res);
		});
	}
}