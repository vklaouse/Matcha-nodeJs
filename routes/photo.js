var middleware = require('../middlewares/photo.js');

module.exports = {
	post: function(router, isLog, photo){
		router.post('/photo', isLog, photo, function(req, res, next) {
			middleware.imgUpload(req, res);
		});
	},
	delete: function(router, isLog){
		router.delete('/photo', isLog, function(req, res, next) {
			middleware.delImg(req, res);
		});
	},
	patch: function(router, isLog){
		router.patch('/photo', isLog, function(req, res, next) {
			middleware.saveMainImg(req, res);
		});
	}
}