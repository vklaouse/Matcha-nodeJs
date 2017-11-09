const tools = require('./tools.js');

module.exports = {
	whoWatchMe: (req, res) => {
		var query = `SELECT watch.date, watch.user_id, users.login, users.birth, users.sex FROM watch, users
					WHERE watch.watching=$(uId) AND users.id=watch.user_id`;
		req.body.uId = req.session.uId;
		req.db.many(query, req.body)
		.then(function(data){
			var data = {
				status : 'success',
				data: data
			};
			res.send(data);
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : err
			};
			if (err.received == 0)
				var data = {
					status : 'success',
					data : 0
				};
			res.send(data);
		});
	},
	whoLikeMe: (req, res) => {
		var query = `SELECT likes.user_id, users.login, users.birth, users.sex FROM likes, users
					WHERE likes.like_for=$(uId) AND users.id=likes.user_id`;
		req.body.uId = req.session.uId;
		req.db.many(query, req.body)
		.then(function(data){
			var data = {
				status : 'success',
				data: data
			};
			res.send(data);
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : err
			};
			if (err.received == 0)
				var data = {
					status : 'success',
					data : 0
				};
			res.send(data);
		});
	}
}