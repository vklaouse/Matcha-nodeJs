const tools = require('./tools.js');

module.exports = {
	initEditUser: (req, res) => {
		var from = {
			first_name: '', name: '',
			sex: '', sex_pref: '',
			mail: '', bio: ''
		};
		var img = [];
		var tags = [];
		var user_tags = [];
		var query = 'SELECT first_name, name, sex, sex_pref, mail, bio, latitude, longitude, active, NULL as path, FALSE as main, NULL as user_tags, NULL as tags FROM users WHERE id=$(uId)'
					+ ' UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL, NULL FROM images WHERE user_id=$(uId)'
					+ ' UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL FROM user_tags WHERE user_id=$(uId)'
					+ ' UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, name FROM tags';
		req.db.many(query, req.session)
		.then(data => {
			for (var i = 0; i < data.length; i++){
				if (data[i].tags) {
					tags.push(data[i].tags);
				}
				else if (data[i].user_tags) {
					user_tags.push(data[i].user_tags);
				}
				else if (data[i].path) {
					img.push({
						path: data[i].path, main: data[i].main,
					});
				}
				else {
					from = {
						first_name: data[i].first_name, name: data[i].name,
						sex: data[i].sex, sex_pref: data[i].sex_pref,
						mail: data[i].mail, bio: data[i].bio, active: data[i].active,
						lat: data[i].latitude, longi: data[i].longitude
					};
				}
				
			}
			res.render('editProfile', {from: from, img: img, tags: tags, user_tags: user_tags, page: 'myAccount'});
		}).catch(err => {
			res.render('editProfile', {from: from, img: img, tags: tags, user_tags: user_tags, page: 'myAccount'});
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
			req.session.sex_pref = req.body.sex_pref;
			req.session.sex = req.body.sex;
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
		if (1 == module.exports.validData(req.body)) {
			module.exports.saveModif(req, res);
		}
		else {
			res.send({
				status: 'fail',
				data: data
			});
		}
	},
	modifLocalisation: (req, res) => {
		var query = `UPDATE users SET latitude=$(lat), longitude=$(long) WHERE id=$(id)`;
		req.body.id = req.session.uId;
		req.db.none(query, req.body)
		.then(data => {
			req.session.longitude = req.body.long;
			req.session.latitude = req.body.lat;
			res.send({
				status: 'success',
				data: data
			});
		}).catch(err => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	}
}