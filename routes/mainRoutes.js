let login = require('./login.js');
let logout = require('./logout.js');
let subscribe = require('./subscribe.js');
let mdpForget = require('./mdpForget.js');
let profile = require('./profile.js');
let editProfile = require('./editProfile.js');
let photo = require('./photo.js');
let home = require('./home.js');
let tag = require('./tag.js');
let error = require('./error.js');
let tools = require('../middlewares/tools.js');
let multer = require('multer');


module.exports = {
	initRoutes: function(router){
		let storage =   multer.memoryStorage();
		let upload = multer({ storage: storage })

		// Not login
		login.get(router, tools.isNotLog);
		login.post(router, tools.isNotLog);

		subscribe.get(router, tools.isNotLog);
		subscribe.post(router, tools.isNotLog);

		mdpForget.get(router, tools.isNotLog);
		mdpForget.post(router, tools.isNotLog);

		// Login
		profile.get(router, tools.isLog);
		profile.getWithId(router, tools.isLog);

		editProfile.get(router, tools.isLog);
		editProfile.post(router, tools.isLog);

		photo.post(router, tools.isLog, upload.single('file'));
		photo.delete(router, tools.isLog);
		photo.patch(router, tools.isLog);

		tag.post(router, tools.isLog);
		tag.delete(router, tools.isLog);

		home.get(router, tools.isLog);

		logout.get(router, tools.isLog)

		// All
		error.create(router);
		error.show(router);
	}
}
