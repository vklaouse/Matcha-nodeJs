const tools = require('./tools.js');

module.exports = {
	unsetSession: (req, res) => {
		req.session.destroy();
		res.redirect('/');
	}
}