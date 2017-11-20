const tools = require('./tools.js');

module.exports = {
	getNbrNotif: (req, res) => {
		var query = `SELECT * FROM notif WHERE user_id=$(uId)`;
		req.db.many(query, req.session)
		.then((resp) => {
			var data = {
				status : 'success',
				data : Object.keys(resp).length
			};
			res.send(data);
		}).catch((err) => {
			console.log(err)
			var data = {
				status : 'fail',
				data : 'no-notifs'
			};
			res.send(data);
		});
	},
	getNotif: (req, res) => {
		var query = `SELECT content FROM notif WHERE user_id=$(uId)`;
		req.db.many(query, req.session)
		.then((resp) => {
			var data = {
				status : 'success',
				data : resp
			};
			query = `DELETE FROM notif WHERE user_id=$(uId)`;
			if (req.body.del)
				req.db.none(query, req.session);
			res.send(data);
		}).catch((err) => {
			console.log(err)
			var data = {
				status : 'fail',
				data : 'no-notifs'
			};
			res.send(data);
		});
	}
}