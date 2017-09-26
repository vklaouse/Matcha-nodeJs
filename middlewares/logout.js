const tools = require('./tools.js');

module.exports = {
	unsetSession: function(req, res) {
		req.session.destroy();
		res.redirect('/');
	}
}