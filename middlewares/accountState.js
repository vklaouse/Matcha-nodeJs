const tools = require('./tools.js');

module.exports = {
	stateAccount: (req, res) => {
		var query = `UPDATE users SET active=$(active) WHERE id=$(id) RETURNING active`;
		req.body.id = req.session.uId;
		req.db.one(query, req.body)
		.then(data => {
			res.send({
				status: 'success',
				data: data
			});
		}).catch(err => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	},
	deleteAccount: (req, res) => {
		var query = `
			DELETE FROM users WHERE id=$(id);
			DELETE FROM images WHERE user_id=$(id);
			DELETE FROM user_tags WHERE user_id=$(id);
			DELETE FROM likes WHERE user_id=$(id);
			DELETE FROM users_block WHERE user_id=$(id);
		`;
		req.body.id = req.session.uId;
		req.db.none(query, req.body)
		.then(data => {
			res.send({
				status: 'success',
				data: data
			});
		}).catch(err => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	}
}