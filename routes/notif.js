var middleware = require('../middlewares/notif.js');

module.exports = {
	post: (router, isLog) => {
		router.post('/notif', isLog, (req, res, next) => {
			middleware.getNbrNotif(req, res);
		});
	},
	getNotif: (router, isLog) => {
		router.post('/getNotif', isLog, (req, res, next) => {
			middleware.getNotif(req, res);
		});
	}
}