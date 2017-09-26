var middleware = require('../middlewares/photo.js');

module.exports = {
	post: function(router, isLog, photo){
		router.post('/photo', isLog, photo, function(req, res, next) {
			middleware.imgUpload(req, res);
		});
	}
}