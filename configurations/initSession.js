const session = require('express-session');

module.exports = {
	init: () => {
		return session({
			secret: 'born2code',
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false }
		});
	}
}