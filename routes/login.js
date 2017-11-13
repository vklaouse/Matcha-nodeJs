var middleware = require('../middlewares/login.js');

module.exports = {
	get: (router, isNotLog) => {
		router.get('/', isNotLog, (req, res, next) => {
			res.render('login', {page: 'login'});
		});
	},
	post: (router, isNotLog) => {
		router.post('/', isNotLog, (req, res, next) => {
			middleware.login(req, res);
		});
	}
}