const tools = require('./tools.js');
var generator = require('generate-password');

module.exports = {
	sendNewMdp: function(req, res){
		if (tools.isMail(req.body.mail))
			module.exports.requestNewMdp(req, res);
		else {
			res.send({
				status : 'fail',
				data : req.body
			});
		}
	},
	requestNewMdp: function(req, res){
		var query = `SELECT mail, id FROM users WHERE mail=$1`;

		req.db.one(query, req.body.mail)
		.then(function(data){
			var password = generator.generate({
				length: 10,
				numbers: true
			});
			var message = {
				from: 'matcha@gmail.com',
				to: req.body.mail,
				subject: 'Message title',
				text: 'Plaintext version of the message',
				html: '<p>'+ password +'</p>'
			};
			req.mail.sendMail(message, function(err, info){
				if (!err){
					query = `UPDATE users SET passwd=$(password) WHERE id=$(id)`;
					req.db.none(query, {id: data.id, password: tools.hashPasswd(password)})
				}
			});
			res.send({
				status : 'success',
				data : data.id
			});
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : 'mail'
			};
			res.send(data);
		});
	}
}