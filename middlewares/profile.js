const tools = require('./tools.js');

module.exports = {
	getProfile: (req, res) => {
		var query = ``;
		var from = {
			first_name: '', name: '',
			sex: '', sex_pref: '',
			login: '', bio: ''
		};
		var img = [];
		var main = {path: ''};
		var user_tags = [];
		if (req.session.uId == req.params.id)
			query = `SELECT login, first_name, name, sex, sex_pref, bio, latitude, longitude, NULL as path, FALSE as main, NULL as user_tags FROM users WHERE id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL FROM images WHERE user_id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags FROM user_tags WHERE user_id=$(id)`
		else
			query = `SELECT login, first_name, name, sex, sex_pref, bio, latitude, longitude, NULL as path, FALSE as main, NULL as user_tags FROM users WHERE id=$(id) AND active=true
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL FROM images WHERE user_id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags FROM user_tags WHERE user_id=$(id)`
		req.db.many(query, req.params).then(data => {
			for (var i = 0; i < data.length; i++){
				if (data[i].user_tags) {
					user_tags.push(data[i].user_tags);
				}
				else if (data[i].path) {
					img.push({
						path: data[i].path, main: data[i].main,
					});
					if (data[i].main)
						main.path = data[i].path;
				}
				else {
					from = {
						first_name: data[i].first_name, name: data[i].name,
						sex: data[i].sex, sex_pref: data[i].sex_pref,
						login: data[i].login, bio: data[i].bio, active: data[i].active,
						lat: data[i].latitude, longi: data[i].longitude
					};
				}
			}
			if (from.login)
				res.render('profile', {from: from, img: img, user_tags: user_tags, main: main, exist: true});
			else
				res.render('profile', {exist: false});
		}).catch(err => {
			res.render('profile', {exist: false});
		});
	}
}