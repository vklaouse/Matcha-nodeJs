const tools = require('./tools.js');

module.exports = {
	initEditUser: function (req, res){
		var query = 'SELECT first_name, name, sex, sex_pref, mail, bio, path, main FROM users'
						+ ' LEFT JOIN images ON users.id=images.user WHERE users.id=$(uId)';
		req.db.many(query, req.session)
		.then(data => {
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
		})
		.catch(err =>{
			console.log(err);
			res.render('editProfile');
		})

	},
	editUser: function (req, res){
		console.log(req.body);
		res.send({});
	}
}