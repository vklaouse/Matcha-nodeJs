var middleware = require('../middlewares/accountState.js');

module.exports = {
	patch: (router, isLog) => {
		router.patch('/accountState', isLog, (req, res, next) => {
			middleware.stateAccount(req, res);
		});
	},
	delete: (router, isLog) => {
		router.delete('/accountState', isLog, (req, res, next) => {
			middleware.deleteAccount(req, res);
		});
	}
}