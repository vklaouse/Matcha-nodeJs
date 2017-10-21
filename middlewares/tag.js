const tools = require('./tools.js');

module.exports = {
	saveTag: (req, res) => {
		var query = 'SELECT * FROM tags WHERE name=$(tag)';
		req.body.uId = req.session.uId;
		req.db.one(query, req.body)
		.then((response) => {
			query = ' INSERT INTO user_tags (user_id, tags) VALUES($(uId), $(tag));';
			req.db.none(query, req.body)
			.then((response) => {
				res.send({
					status: 'success-new-userTag',
					data: req.body.tag
				});
			}).catch((err) => {
				res.send({
					status: 'fail',
					data: err
				});
			});
		}).catch((err) => {
			query = 'BEGIN;'
					+ ' INSERT INTO tags (name) VALUES($(tag));'
					+ ' INSERT INTO user_tags (user_id, tags) VALUES($(uId), $(tag));'
					+ ' COMMIT;';
			req.db.none(query, req.body)
			.then((response) => {
				res.send({
					status: 'success-new-tag',
					data: req.body.tag
				});
			}).catch((err) => {
				res.send({
					status: 'fail',
					data: err
				});
			});
		});
	},
	addNewTag: (req, res) => {
		if (tools.isAlphaNum(req.body.tag))
			module.exports.saveTag(req, res);
		else
			res.send({
				status: 'fail',
				data: req.body
			});
	},
	removeUserTag: (req, res) => {
		var query = `DELETE FROM user_tags WHERE user_id=$(uId) AND tags=$(tag)`;
		req.body.uId = req.session.uId;
		req.db.none(query, req.body)
		.then((response) => {
			res.send({
				status: 'success',
				data: req.body.tag
			});
		}).catch((err) => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	}
}