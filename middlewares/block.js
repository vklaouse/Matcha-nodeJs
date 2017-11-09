const tools = require('./tools.js');

module.exports = {
	block: (req, res) => {
		var query = `INSERT INTO users_block(user_id, block_for) VALUES($(uId), $(id))`;
		req.body.uId = req.session.uId;
		req.db.none(query, req.body)
		.then(function(ret){
			var data = {
				status: 'success',
				data: ret
			}
			res.send(data);
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : err
			};
			res.send(data);
		});
	},
	unblock: (req, res) => {
		var query = `DELETE FROM users_block WHERE user_id=$(uId) AND block_for=$(id)`;
		req.body.uId = req.session.uId;
		req.db.none(query, req.body)
		.then(function(ret){
			var data = {
				status: 'success',
				data: ret
			}
			res.send(data);
		}).catch(function(err){
			var data = {
				status : 'fail',
				data : err
			};
			res.send(data);
		});
	}
}