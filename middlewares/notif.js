const tools = require('./tools.js');

module.exports = {
	getNbrNotif: (req, res) => {
		var query = `SELECT * FROM notif WHERE user_id=$(uId)`;
		req.db.many(query, req.session)
		.then((resp) => {
			var data = {
				status : 'success',
				data : {nbr: Object.keys(resp).length, 
					content: resp}
			};
			res.send(data);
		}).catch((err) => {
			var data = {
				status : 'fail',
				data : 'no-notifs'
			};
			res.send(data);
		});
	},
	getNotif: (req, res) => {
		var query = `DELETE FROM notif WHERE user_id=$(uId)`;
		req.db.none(query, req.session)
		.then((resp) => {
			var data = {
				status : 'success',
				data : {}
			};
			res.send(data);
		}).catch((err) => {
			var data = {
				status : 'fail',
				data : 'no-notifs'
			};
			res.send(data);
		});
	}
}