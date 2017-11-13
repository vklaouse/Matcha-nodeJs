const tools = require('./tools.js');

module.exports = {
	getMatch: (data, id) => {
		for (var i = 0; i < data.length; i++) {
			if (data[i].user_id == id) {
				for (var j = 0; j < data.length; j++) {
					if (data[i].like_for == data[j].user_id)
						console.log(data[i])
				}					
			}
		}
	},
	messages: (req, res) => {
		var query = `SELECT * FROM likes WHERE user_id=$(uId) 
					OR like_for=$(uId)`;

		req.db.many(query, req.session)
		.then((data) => {
			module.exports.getMatch(data, req.session.uId);
		}).catch((err) => {
			console.log(err)
		});
		res.render('messages', {page: 'messages'});
	}
}