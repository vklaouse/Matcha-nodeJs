var middleware = require('../middlewares/editProfile.js');

module.exports = {
	get: function(router, isLog){
		router.get('/editProfile', isLog, function(req, res, next) {
			middleware.initEditUser(req, res);
		});
	},
	post: function(router, isLog){

		router.post('/editProfile', isLog, function(req, res, next) {
			middleware.editUser(req, res);
		});
	}
}