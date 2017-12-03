const tools = require('./tools.js');

module.exports = {
	getMatch: (data, id) => {
		var matchs = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].user_id == id) {
				for (var j = 0; j < data.length; j++) {
					if (data[i].like_for == data[j].user_id)
						matchs.push(data[i].like_for);
				}					
			}
		}
		return matchs;
	},
	buildStrWithIds: (idArray) => {
		var str = '(';
		for (var i = 0; i < idArray.length; i++) {
			if (i + 1 == idArray.length)
				str = str + idArray[i] + ') ';
			else
				str = str + idArray[i] + ', ';

		}
		return str;
	},
	buildObjectMessageButton: (data) => {
		var discussion = [];
		for (var i = 0; i < data.length; i++)
			if (data[i].id)
				for (var j = 0; j < data.length; j++) {
					if (data[j].user_id_img == data[i].id) {
						discussion.push({id: data[i].id, login: data[i].login, path: data[j].path_img})
						break ;
					}
					else if (j + 1 == data.length)
						discussion.push({id: data[i].id, login: data[i].login, path: '/images/profile.png'})
				}
		return discussion;
	},
	getBlock: (block, match) => {
		var matchs = [];
		for (var i = 0; i < match.length; i++) {
			for (var j = 0; j < block.length; j++) {
				if (match[i] == block[j].user_id || match[i] == block[j].block_for)
					break ;
				else if (j == block.length - 1)
					matchs.push(match[i]);
			}
		}
		if (block.length == 0)
			matchs = match;
		return matchs;
	},
	messages: (req, res) => {
		var query = `SELECT * FROM users_block WHERE user_id=$(uId) 
					OR block_for=$(uId)`;
		req.db.many(query, req.session)
		.then((data) => {
			module.exports.message(req, res, data);
		}).catch((err) => {
			module.exports.message(req, res, []);
		});
	},
	message: (req, res, block) => {

		var query = `SELECT * FROM likes WHERE user_id=$(uId) 
					OR like_for=$(uId)`;
		var matchs = [];
		var discussion = [];
		req.db.many(query, req.session)
		.then((data) => {
			matchs = module.exports.getMatch(data, req.session.uId);
			matchs = module.exports.getBlock(block, matchs);
			query = `SELECT id, login, NULL as path_img, NULL as user_id_img FROM users WHERE id IN `;
			query = query + module.exports.buildStrWithIds(matchs);
			query = query + `UNION ALL SELECT NULL, NULL , path, user_id FROM images WHERE main=TRUE AND user_id IN `;
			query = query + module.exports.buildStrWithIds(matchs);
			req.db.many(query, req.session)
			.then((data) => {
				discussion = module.exports.buildObjectMessageButton(data);
				res.render('messages', {discussion: discussion, page: 'messages'});
			}).catch((err) => {
				res.render('messages', {discussion: discussion, page: 'messages'});
			});
		}).catch((err) => {
			// console.log(err)
			res.render('messages', {discussion: discussion, page: 'messages'});
		});
	},
	getMessages: (req, res) => {
		var query = `SELECT * FROM messages WHERE (send_by=$(uId) 
					AND received_by=$(id)) OR (send_by=$(id) 
					AND received_by=$(uId))`;
		req.body.uId = req.session.uId;
		req.db.many(query, req.body)
		.then((data) => {
			res.send({
				status: 'success',
				data: data
			});
		}).catch((err) => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	}
}