var middleware = require('../middlewares/editProfile.js');

module.exports = {
	get: (router, isLog) => {
		router.get('/editProfile', isLog, (req, res, next) => {
			middleware.initEditUser(req, res);
		});
	},
	post: (router, isLog) => {
		router.post('/editProfile', isLog, (req, res, next) => {
			middleware.editUser(req, res);
		});
	},
	patch: (router, isLog) => {
		router.patch('/editProfile', isLog, (req, res, next) => {
			middleware.modifLocalisation(req, res);
		});
	}
}