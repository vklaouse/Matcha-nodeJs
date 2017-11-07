var middleware = require('../middlewares/accountState.js');

module.exports = {
	patch: function(router, isLog){
		router.patch('/accountState', isLog, function(req, res, next) {
			middleware.stateAccount(req, res);
		});
	},
	delete: function(router, isLog){
		router.delete('/accountState', isLog, function(req, res, next) {
			middleware.deleteAccount(req, res);
		});
	}
}