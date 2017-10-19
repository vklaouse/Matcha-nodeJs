const tools = require('./tools.js');

module.exports = {
	initEditUser: (req, res) => {
		// var query = 'SELECT first_name, name, sex, sex_pref, mail, bio, path, main FROM users'
						// + ' LEFT JOIN images ON users.id=images.user_id WHERE users.id=$(uId)';
		var query = 'SELECT first_name, name, sex, sex_pref, mail, bio FROM users WHERE users.id=$(uId)'
						+ ' UNION SELECT path, main, NULL as sex, NULL as sex_pref, NULL as mail, NULL as bio FROM images WHERE images.user_id=$(uId)';
						// + ' LEFT JOIN tags '
						// + ' UNION SELECT * FROM user_tags WHERE user_tags.user_id=$(uId)';
		req.db.many(query, req.session)
		.then(data => {
			console.log(data);
			var from = {
				first_name: data[0].first_name, name: data[0].name,
				sex: data[0].sex, sex_pref: data[0].sex_pref,
				mail: data[0].mail, bio: data[0].bio
			};
			var img = [];
			for (var i = 0; i < data.length; i++){
				img[i] = {
					path: data[i].path, main: data[i].main,
				}
			}
			res.render('editProfile', {from: from, img: img});
		}).catch(err => {
			console.log(err)
			res.render('editProfile');
		});

	},
	validData: (data) => {
		if (data){
			if (data.mail && (data.mail != data.mail_confirm || !tools.isMail(data.mail)))
				return data;
			if (data.passwd && (data.passwd != data.passwd_confirm || !tools.isAlphaNum(data.passwd)))
				return data;
			if (tools.isAlphaNum(data.first_name) && tools.isAlphaNum(data.name) 
				&& (data.sex == '' || data.sex == 'H' || data.sex == 'F') 
				&& (data.sex_pref == 'B' || data.sex_pref == 'H' || data.sex_pref == 'F'))
				return 1;
		}
		return data;

	},
	saveModif: (req, res) => {
		if (req.body.passwd){
			var query = `UPDATE users SET passwd=$(passwd), mail=$(mail), name=$(name),
						first_name=$(first_name), sex=$(sex), sex_pref=$(sex_pref),
						bio=$(bio) WHERE id=$(id)`;
			req.body.passwd = tools.hashPasswd(req.body.passwd);
		}
		else 
			var query = `UPDATE users SET mail=$(mail), name=$(name), first_name=$(first_name),
						sex=$(sex), sex_pref=$(sex_pref), bio=$(bio) WHERE id=$(id)`;
		req.body.bio = req.xssFilters.inHTMLData(req.body.bio);
		req.body.id = req.session.uId;
		req.db.none(query, req.body)
		.then(data => {
			console.log(data)
			res.send({
				status: 'success',
				data: data
			});
		}).catch(err => {
			var data = {};
			if (err.constraint)
				data = {
					status : 'fail',
					data : err.constraint.split('_')[1]
				};
			res.send(data);
		});
	},
	editUser: (req, res) => {
		console.log(req.body);
		if (1 == module.exports.validData(req.body)) {
			module.exports.saveModif(req, res);
		}
		else {
			res.send({
				status: 'fail',
				data: data
			});
		}
	}
}