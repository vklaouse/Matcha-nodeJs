const tools = require('./tools.js');

module.exports = {
	like: (req, res) => {
		var query = `SELECT * FROM likes WHERE user_id=$(uId) AND like_for=$(id)`;
		req.body.uId = req.session.uId;
		req.db.one(query, req.body)
		.then((ret) => {
			var data = {
				status : 'fail',
				data : ret
			};
			res.send(data);
		}).catch((err) => {
			query = `INSERT INTO likes(user_id, like_for)
						SELECT $(uId), $(id) WHERE EXISTS
						(SELECT * FROM images WHERE user_id=$(uId));
						SELECT * FROM images WHERE user_id=$(uId);`;

			req.db.many(query, req.body)
			.then((data) => {
				var data = {
					status : 'success'
				};
				res.send(data);
			}).catch((err) => {
				var data = {
					status : 'fail',
					data : err
				};
				res.send(data);
			});
		});
	},
	dislike: (req, res) => {
		var query = `DELETE FROM likes WHERE user_id=$(uId) AND like_for=$(id)`;
		req.body.uId = req.session.uId;
		req.db.none(query, req.body)
		.then((data) => {
			var data = {
				status : 'success'
			};
			res.send(data);
		}).catch((err) => {
			var data = {
				status : 'fail',
				data : err
			};
			res.send(data);
		});
	}
}