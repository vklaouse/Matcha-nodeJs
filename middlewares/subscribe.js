const tools = require('./tools.js');
const request = require('request-promise');

module.exports = {
	validData: function(data){
		if (data){
			if ((data.password != data.password_confirm 
				&& data.password.length <= 7)
				|| data.mail != data.mail_confirm)
				return data;

			if (tools.isAlphaNum(data.password) && tools.isAlphaNum(data.login)
				&& tools.isAlphaNum(data.first_name) && tools.isAlphaNum(data.name)
				&& tools.isMail(data.mail) && tools.isDate(data.birth)){
				if (!tools.getAge(data.birth))
					return data;
				return 1;
			}
		}
		return data;
	},
	createAccount: function(req, res) {
		var valid = module.exports.validData(req.body);

		if (valid == 1){
			req.body.password = tools.hashPasswd(req.body.password);
			module.exports.saveUser(req, res);
		}
		else {
			var data = {
				status : 'fail',
				data : valid
			};
			res.send(data);
		}
	},
	saveUser: function(req, res){
		var query = `INSERT INTO 
			users (name, first_name, birth,
				login, mail, passwd,
				sex, sex_pref, bio,
				latitude, longitude, ip) 
			values ($(name), $(first_name), $(birth),
				$(login), $(mail), $(password),
				$(sex), $(sex_pref), $(bio),
				$(latitude), $(longitude), $(ip))
			RETURNING id`;
		!req.body.longitude ? req.body.longitude = req.localisation.longitude : 0;
		!req.body.latitude ? req.body.latitude = req.localisation.latitude : 0;
		!req.body.ip ? req.body.ip = req.localisation.ip : 0;
		!req.body.latitude ? req.body.bio = '' : 0;
		!req.body.bio ? req.body.bio = '' : 0;
		!req.body.sex ? req.body.sex = '' : 0;
		!req.body.sex_pref ? req.body.sex_pref = 'B' : 0;
		req.db.one(query, req.body)
		.then(function(data){
			var data = {
				status : 'success',
				data : data
			};
			res.send(data);
		}).catch(function(err){
			var data = {};
			if (err.constraint)
				data = {
					status : 'fail',
					data : err.constraint.split('_')[1]
				};
			res.send(data);
		});
	}

}