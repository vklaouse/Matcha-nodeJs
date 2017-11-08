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
		var my_tags = [];
		var likes = 0;
		var iLikeIt = false;
		var myLikes = [];
		var block = false;
		var mySelf;
		if (req.session.uId == req.params.id) {
			mySelf = true;
			query = `SELECT birth, login, first_name, name, sex, sex_pref, bio, latitude, longitude, NULL as path, FALSE as main, NULL as user_tags, NULL as like_to FROM users WHERE id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL, NULL FROM images WHERE user_id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL FROM user_tags WHERE user_id=$(id)`
		}
		else {
			mySelf = false;
			req.params.uId = req.session.uId;
			req.params.textId = req.params.id;
			query = `SELECT birth, login, first_name, name, sex, sex_pref, bio, latitude, longitude, NULL as path, FALSE as main, NULL as user_tags, NULL as my_tags, NULL as like_from, NULL as block, NULL as blocked FROM users WHERE id=$(id) AND active=true
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, path, main, NULL, NULL, NULL, NULL, NULL FROM images WHERE user_id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL, NULL, NULL, NULL FROM user_tags WHERE user_id=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, tags, NULL, NULL, NULL FROM user_tags WHERE user_id=$(uId)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, user_id::text, NULL, NULL FROM likes WHERE like_for=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, block_for::text, NULL FROM users_block WHERE user_id=$(uId) AND block_for=$(id)
						UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, block_for::text FROM users_block WHERE block_for=$(uId) AND user_id=$(id)`
		}
		req.db.many(query, req.params).then(data => {
			for (var i = 0; i < data.length; i++){
				if (data[i].user_tags)
					user_tags.push({tag: data[i].user_tags, matching_tag: false});
				else if (data[i].my_tags)
					my_tags.push({tag: data[i].my_tags, matching_tag: false});
				else if (data[i].path) {
					img.push({
						path: data[i].path, main: data[i].main,
					});
					if (data[i].main)
						main.path = data[i].path;
				}
				else if (data[i].like_from) {
					likes++;
					console.log(data[i].like_from, iLikeIt)
					if (data[i].like_from == req.session.uId)
						iLikeIt = true;
				}
				else if (data[i].like_to) {
					likes++;
					myLikes.push(data[i].like_to);
					console.log(data[i].like_from, iLikeIt)
				}
				else if (data[i].block)
					block = true;
				else if (data[i].blocked) {
					from.login == null;
					break ;
				}
				else
					from = {
						first_name: data[i].first_name, name: data[i].name,
						sex: data[i].sex, sex_pref: data[i].sex_pref, id: req.params.id,
						login: data[i].login, bio: data[i].bio, active: data[i].active,
						lat: data[i].latitude, longi: data[i].longitude, age: tools.getAge(data[i].birth)
					};
			}
			for (var i = 0; i < my_tags.length; i++) {
				for (var y = 0; y < user_tags.length; y++) {
					if (user_tags[y].tag == my_tags[i].tag) {
						user_tags[y].matching_tag = true;
						my_tags[i].matching_tag = true;
					}
				}
			}
			if (from.login)
				res.render('profile', {from: from, img: img, user_tags: user_tags,
								main: main, exist: true, my_tags: my_tags,
								mySelf: mySelf, likes: likes, my_likes: myLikes,
								block: block, iLikeIt: iLikeIt});
			else
				res.render('profile', {exist: false});
		}).catch(err => {
			console.log(err)
			res.render('profile', {exist: false});
		});
	}
}