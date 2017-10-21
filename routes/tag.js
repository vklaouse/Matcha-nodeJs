var middleware = require('../middlewares/tag.js');

module.exports = {
	post: function(router, isLog){
		router.post('/tag', isLog, function(req, res, next) {
			middleware.addNewTag(req, res);
		});
	},
	delete: function(router, isLog){
		router.delete('/tag', isLog, function(req, res, next) {
			middleware.removeUserTag(req, res);
		});
	}
}