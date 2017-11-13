var middleware = require('../middlewares/tag.js');

module.exports = {
	post: (router, isLog) => {
		router.post('/tag', isLog, (req, res, next) => {
			middleware.addNewTag(req, res);
		});
	},
	delete: (router, isLog) => {
		router.delete('/tag', isLog, (req, res, next) => {
			middleware.removeUserTag(req, res);
		});
	}
}