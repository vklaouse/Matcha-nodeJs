const tools = require('./tools.js');

module.exports = {
	getInterestingProfiles: (req, res) => {
		var query = '';
		var profils = [];
		if (req.session.sex == 'H' && req.session.sex_pref == 'H')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='H' AND (sex_pref='H' OR sex_pref='B') AND active=true`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'F')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='F' AND (sex_pref='F' OR sex_pref='B') AND active=true`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'H')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE sex='H' AND (sex_pref='F' OR sex_pref='B') AND active=true`;
		else if (req.session.sex == 'H' && req.session.sex_pref == 'F')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users
				WHERE sex='F' AND (sex_pref='H' OR sex_pref='B') AND active=true`;
		else if (req.session.sex == 'H' && req.session.sex_pref == 'B')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE (sex='H' OR sex='F') AND (sex_pref='H' OR sex_pref='B') AND active=true`;
		else if (req.session.sex == 'F' && req.session.sex_pref == 'B')
			query = `SELECT longitude, latitude, id, sex, sex_pref, birth, login FROM users 
				WHERE (sex='H' OR sex='F') AND (sex_pref='F' OR sex_pref='B') AND active=true`;
		else {
			res.render('home');
			return ;
		}
		req.db.many(query, req.session)
		.then(data => {
			query = `SELECT user_id, path FROM images WHERE main=TRUE AND user_id IN (`;
			for (var i = 0; i < data.length; i++){
				if (data.length == i + 1)
					query = query + data[i].id + ')';
				else
					query = query + data[i].id + ',';
			}
			req.db.many(query)
			.then(response => {
				for (var i = 0; i < data.length; i++) {
					for (var y = 0; y < response.length; y++) {
						if (response[y].user_id == data[i].id) {
							console.log(tools.getDist(Math.cos(data[i].latitude) * Math.cos(data[i].longitude),
												Math.cos(data[i].latitude) * Math.sin(data[i].longitude),
												Math.sin(data[i].latitude),
												Math.cos(req.session.latitude) * Math.cos(req.session.longitude),
												Math.cos(req.session.latitude) * Math.sin(req.session.longitude),
												Math.sin(req.session.latitude)), 'AAAAAA')
							profils.push({
								login: data[i].login,
								id: data[i].id,
								sex: data[i].sex,
 								age: tools.getAge(data[i].birth),
 								dist: tools.getDist(Math.cos(data[i].latitude) * Math.cos(data[i].longitude),
												Math.cos(data[i].latitude) * Math.sin(data[i].longitude),
												Math.sin(data[i].latitude),
												Math.cos(req.session.latitude) * Math.cos(req.session.longitude),
												Math.cos(req.session.latitude) * Math.sin(req.session.longitude),
												Math.sin(req.session.latitude)),
 								path: response[i].path
							});

							break ;
						}
						else if (y + 1 == response.length) {
							console.log(tools.getDist(Math.cos(data[i].latitude) * Math.cos(data[i].longitude),
												Math.cos(data[i].latitude) * Math.sin(data[i].longitude),
												Math.sin(data[i].latitude),
												Math.cos(req.session.latitude) * Math.cos(req.session.longitude),
												Math.cos(req.session.latitude) * Math.sin(req.session.longitude),
												Math.sin(req.session.latitude)), 'AAAAAA')
							profils.push({
								login: data[i].login,
								id: data[i].id,
								sex: data[i].sex,
								dist: tools.getDist(Math.cos(data[i].latitude) * Math.cos(data[i].longitude),
												Math.cos(data[i].latitude) * Math.sin(data[i].longitude),
												Math.sin(data[i].latitude),
												Math.cos(req.session.latitude) * Math.cos(req.session.longitude),
												Math.cos(req.session.latitude) * Math.sin(req.session.longitude),
												Math.sin(req.session.latitude)),
 								age: tools.getAge(data[i].birth)
							});
						}
					}
				}
				console.log(profils)
				res.render('home', profils);
			}).catch(err => {
				console.log(err);
				res.render('home');
			});
		}).catch(err => {
			console.log(err);
			res.render('home');
		});
	}
}