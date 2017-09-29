var login = require('./login.js');
var logout = require('./logout.js');
var subscribe = require('./subscribe.js');
var mdpForget = require('./mdpForget.js');
var profile = require('./profile.js');
var editProfile = require('./editProfile.js');
var photo = require('./photo.js');
var home = require('./home.js');
var error = require('./error.js');
var tools = require('../middlewares/tools.js');
const multer = require('multer');


module.exports = {
	initRoutes: function(router){
		var storage =   multer.memoryStorage();
		const upload = multer({ storage: storage })

		// Not login
		login.get(router, tools.isNotLog);
		login.post(router, tools.isNotLog);

		subscribe.get(router, tools.isNotLog);
		subscribe.post(router, tools.isNotLog);

		mdpForget.get(router, tools.isNotLog);
		mdpForget.post(router, tools.isNotLog);

		// Login
		profile.get(router, tools.isLog);

		editProfile.get(router, tools.isLog);
		editProfile.post(router, tools.isLog);

		photo.post(router, tools.isLog, upload.single('file'));
		photo.delete(router, tools.isLog);
		photo.patch(router, tools.isLog);

		home.get(router, tools.isLog);

		logout.get(router, tools.isLog)

		// All
		error.create(router);
		error.show(router);
	}
}
