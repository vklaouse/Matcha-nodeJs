var middleware = require('../middlewares/block.js');

module.exports = {
	post: (router, isLog) => {
		router.post('/block', isLog, function(req, res, next) {
			middleware.block(req, res);
		});
	},
	delete: (router, isLog) => {
		router.delete('/block', isLog, function(req, res, next) {
			middleware.unblock(req, res);
		});
	}
}