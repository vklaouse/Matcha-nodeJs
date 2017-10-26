const tools = require('./tools.js');

module.exports = {
	getProfile: (req, res) => {
		var query = ``;
		if (req.session.uId == req.params.id)
			query = `SELECT first_name, name, sex, sex_pref, mail, bio, NULL as path, FALSE as main, NULL as user_tags, NULL as tags FROM users WHERE id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL, NULL FROM images WHERE user_id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL FROM user_tags WHERE user_id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, name FROM tags`;
		else
			query = `SELECT first_name, name, sex, sex_pref, mail, bio, NULL as path, FALSE as main, NULL as user_tags, NULL as tags FROM users WHERE id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL, NULL FROM images WHERE user_id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL FROM user_tags WHERE user_id=$(id)`
					+ ` UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, name FROM tags`;
		req.db.many(query, req.params).then(data => {
			console.log(data);
		}).catch(err => {
			console.log(err)
		});
		res.render('profile');
	}
}