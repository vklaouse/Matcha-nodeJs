var middleware = require('../middlewares/mdpForget.js');

module.exports = {
	get: (router, isNotLog) => {
		router.get('/forget', isNotLog, (req, res, next) => {
			res.render('mdpForget', {page: 'mdpForget'});
		});
	},
	post: (router, isNotLog) => {
		router.post('/forget', isNotLog, (req, res, next) => {
			middleware.sendNewMdp(req, res);
		});
	}
}