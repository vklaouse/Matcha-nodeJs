const tools = require('./tools.js');

module.exports = {
	buildFirstQuery: (req) => {
		if (req.session.sex == 'H' && req.session.sex_pref == 'H')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='H' AND (sex_pref='H' OR sex_pref='B') AND active=true AND id!=$(uId)`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'F')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='F' AND (sex_pref='F' OR sex_pref='B') AND active=true AND id!=$(uId)`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'H')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='H' AND (sex_pref='F' OR sex_pref='B') AND active=true AND id!=$(uId)`;
		else if (req.session.sex == 'H' && req.session.sex_pref == 'F')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users
				WHERE sex='F' AND (sex_pref='H' OR sex_pref='B') AND active=true AND id!=$(uId)`;
		else if (req.session.sex == 'H' && req.session.sex_pref == 'B')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE (sex='H' OR sex='F') AND (sex_pref='H' OR sex_pref='B') AND active=true AND id!=$(uId)`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'B')
			return `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE (sex='H' OR sex='F') AND (sex_pref='F' OR sex_pref='B') AND active=true AND id!=$(uId)`;
	},
	buildSecondQuery: (data) => {
		var query = '';
		query = 'SELECT NULL AS user_id, NULL AS path, like_for, NULL as tags, NULL as user_id_tag, NULL as blocked FROM likes WHERE like_for IN ('
		for (var i = 0; i < data.length; i++){
			if (data.length == i + 1)
				query = query + data[i].id + ')'
				+ '';
			else
				query = query + data[i].id + ',';
		}
		query = query + ` UNION ALL SELECT user_id, path, NULL, NULL, NULL, NULL FROM images WHERE main=TRUE AND user_id IN (`;
		for (var i = 0; i < data.length; i++){
			if (data.length == i + 1)
				query = query + data[i].id + ')';
			else
				query = query + data[i].id + ',';
		}
		query = query + ` UNION ALL SELECT NULL, NULL, NULL, tags, user_id::text, NULL FROM user_tags WHERE user_id IN (`;
		for (var i = 0; i < data.length; i++){
			if (data.length == i + 1)
				query = query + data[i].id + ')';
			else
				query = query + data[i].id + ',';
		}
		query = query + ` AND tags IN (SELECT tags FROM user_tags WHERE user_id=$(uId))
						UNION SELECT NULL, NULL, NULL, NULL, NULL, block_for::text FROM users_block WHERE user_id=$(uId) AND block_for IN (`;
		for (var i = 0; i < data.length; i++){
			if (data.length == i + 1)
				query = query + data[i].id + ')';
			else
				query = query + data[i].id + ',';
		}
		return query;
	},
	getBlockedUsers: (response, id) => {
		for (var y = 0; y < response.length; y++)
			if (response[y].blocked == id)
				return 0;
		return 1;
	},
	getPop: (response, id) => {
		var pop = 0;
		for (var i = 0; i < response.length; i++) {
			if (id == response[i].like_for)
				pop++;
		}
		return pop;
	},
	getTags: (response, id) => {
		var tags = [];
		for (var i = 0; i < response.length; i++)
			if (id == response[i].user_id_tag)
				tags.push(response[i].tags);
		return tags;
	},
	getValue: (profil) => {
		var value = 0;
		value = -profil.dist + profil.pop * 5 + profil.tags.length * 10;
		return value;
	},
	getInterestingProfiles: (req, res) => {
		var profils = [];
		if (!req.session.sex) {
			res.render('home', {profils: profils});
			return ;
		}
		var query = module.exports.buildFirstQuery(req);
		req.db.many(query, req.session)
		.then(data => {
			query = module.exports.buildSecondQuery(data);
			req.db.many(query, req.session)
			.then(response => {
				for (var i = 0; i < data.length; i++) {
					if (module.exports.getBlockedUsers(response, data[i].id)) {
						for (var y = 0; y < response.length; y++) {
							if (response[y].user_id == data[i].id) {
								profils.push({
									login: data[i].login,
									id: data[i].id,
									sex: data[i].sex,
	 								age: tools.getAge(data[i].birth),
	 								dist: tools.getDist(data[i].latitude, data[i].longitude,
										req.session.latitude, req.session.longitude),
	 								path: response[y].path,
	 								pop: module.exports.getPop(response, response[y].user_id),
	 								tags: module.exports.getTags(response, response[y].user_id),
	 								value: 0
								});
								break ;
							}
							else if (y + 1 == response.length) {
								profils.push({
									login: data[i].login,
									id: data[i].id,
									sex: data[i].sex,
									dist: tools.getDist(data[i].latitude, data[i].longitude,
										req.session.latitude, req.session.longitude),
	 								age: tools.getAge(data[i].birth),
	 								path: '/images/profile.png',
	 								pop: module.exports.getPop(response, data[i].id),
	 								tags: module.exports.getTags(response, data[i].id),
	 								value: 0
								});
							}
						}
						console.log('AA', profils[i])
						profils[i].value = module.exports.getValue(profils[i]);
						console.log('BB')
					}
				}
				profils.sort(tools.compareByValue);
				console.log(profils, 'test')
				res.render('home', {profils: profils});
			}).catch(err => {
				console.log(err, 'test')
				res.render('home', {profils: profils});
			});
		}).catch(err => {
			res.render('home', {profils: profils});
		});
	}
}