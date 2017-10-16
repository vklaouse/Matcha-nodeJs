const tools = require('./tools.js');
const fs = require('fs');
const fileType = require('file-type');
const uniqid = require('uniqid');

module.exports = {
	saveMainImg: (req, res) => {
		var query = 'UPDATE images SET main = (CASE path WHEN $(src) THEN '+ true +' ELSE '+ false +' END) WHERE images.user_id=$(uId)';
		req.body.src = req.xssFilters.inHTMLData(req.body.src);
		req.body.uId = req.session.uId;
		req.db.any(query, req.body)
		.then((data) => {
			res.send({
				status: 'success',
			});
		}).catch((err) => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	},
	delImg: (req, res) => {
		var query = 'DELETE FROM images WHERE images.path=$(src) AND images.user_id=$(uId)';
		req.body.src = req.xssFilters.inHTMLData(req.body.src);
		req.body.uId = req.session.uId;
		req.db.any(query, req.body)
		.then((data) => {
			res.send({
				status: 'success',
			});
		}).catch((err) => {
			res.send({
				status: 'fail',
				data: err
			});
		});
	},
	imgUpload: (req, res) => {
		var querySave = `INSERT INTO images ("user_id", path)
							values($(user), $(path))`;

		var queryCount = `SELECT COUNT(*) AS nb_img
							FROM images
							WHERE "user_id"=$(user)`;

		var allowed = ['jpg', 'jpeg', 'png'];
		if (typeof(req.file.buffer) !== 'undefined'){
			var fd = req.file.buffer;
			var chunk = fd.slice(0, 262);
			var type = fileType(chunk);
		}
		if (typeof(type) !== 'undefined' && type && allowed.includes(type.ext)){
			var path = process.argv[1].split('/');
			path.pop();
			var id = uniqid();
			var filename = (path.join('/')) +'/../public/uploads/'+ id +'.'+ type.ext;
			var params = {
				user: req.session.uId,
				path: '/uploads/' + id + '.' + type.ext
			};
			req.db.any(queryCount, params)
			.then((data) => {
				if (data[0].nb_img <= 4)
					return req.db.none(querySave, params);
				else
					throw 'Too much images';
			}).then(() => {
				fs.writeFile(filename, fd, (err) => {});
				var data = {
					status : 'success',
					data : {'path': params.path}
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
		else {
			var data = {
				status : 'fail',
				data : null
			};
			res.send(data);
		}
	}
}