let login = require('./login.js');
let logout = require('./logout.js');
let subscribe = require('./subscribe.js');
let mdpForget = require('./mdpForget.js');
let profile = require('./profile.js');
let editProfile = require('./editProfile.js');
let photo = require('./photo.js');
let home = require('./home.js');
let tag = require('./tag.js');
let block = require('./block.js');
let like = require('./like.js');
let report = require('./report.js');
let accountState = require('./accountState.js');
let whoWatchMe = require('./whoWatchMe.js');
let messages = require('./messages.js');
let error = require('./error.js');
let tools = require('../middlewares/tools.js');
let multer = require('multer');


module.exports = {
	initRoutes: (router) => {
		let storage =   multer.memoryStorage();
		let upload = multer({ storage: storage })

		// Not loged
		login.get(router, tools.isNotLog);
		login.post(router, tools.isNotLog);

		subscribe.get(router, tools.isNotLog);
		subscribe.post(router, tools.isNotLog);

		mdpForget.get(router, tools.isNotLog);
		mdpForget.post(router, tools.isNotLog);

		// Loged
		profile.get(router, tools.isLog);
		profile.getWithId(router, tools.isLog);

		like.post(router, tools.isLog);
		like.delete(router, tools.isLog);

		block.post(router, tools.isLog);
		block.delete(router, tools.isLog);

		report.post(router, tools.isLog);

		whoWatchMe.getViews(router, tools.isLog);
		whoWatchMe.getLikes(router, tools.isLog);

		editProfile.get(router, tools.isLog);
		editProfile.post(router, tools.isLog);
		editProfile.patch(router, tools.isLog);

		accountState.patch(router, tools.isLog);
		accountState.delete(router, tools.isLog);

		photo.post(router, tools.isLog, upload.single('file'));
		photo.delete(router, tools.isLog);
		photo.patch(router, tools.isLog);

		tag.post(router, tools.isLog);
		tag.delete(router, tools.isLog);

		home.get(router, tools.isLog);

		messages.get(router, tools.isLog);
		messages.post(router, tools.isLog);

		logout.get(router, tools.isLog)

		// All
		error.create(router);
		error.show(router);
	}
}
