const tools = require('./tools.js');

module.exports = {
	login: function(req, res){
		if (tools.isAlphaNum(req.body.password) && tools.isMail(req.body.mail))
			module.exports.logUser(req, res);
		else {
			res.send({
				status : 'fail',
				data : req.body
			});
		}
	},
	logUser: function(req, res){
		var query = `SELECT * FROM users WHERE mail=$(mail) LIMIT 1`;

		req.db.one(query, req.body)
		.then(function(data){
			query = `UPDATE users SET last_log=CURRENT_TIMESTAMP WHERE id=$1`
			if (tools.comparePasswd(req.body.password, data.passwd)){
				req.session.uId = data.id;
				req.session.sex_pref = data.sex_pref;
				req.session.sex = data.sex;
				req.session.login = data.login;
				req.db.none(query, data.id);
				res.send({id: data.id});
			}
			else {
				var data = {
					status : 'fail',
					data : 'password'
				};
				res.send(data);
			}
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : 'mail'
			};
			res.send(data);
		});
	}
}