var middleware = require('../middlewares/photo.js');

module.exports = {
	post: (router, isLog, photo) => {
		router.post('/photo', isLog, photo, (req, res, next) => {
			middleware.imgUpload(req, res);
		});
	},
	delete: (router, isLog) => {
		router.delete('/photo', isLog, (req, res, next) => {
			middleware.delImg(req, res);
		});
	},
	patch: (router, isLog) => {
		router.patch('/photo', isLog, (req, res, next) => {
			middleware.saveMainImg(req, res);
		});
	}
}