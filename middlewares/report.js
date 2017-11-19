const tools = require('./tools.js');

module.exports = {
	report: (req, res) => {
		var message = {
			from: `matcha@gmail.com`,
			to: `vivien.klaousen@laposte.net`,
			subject: `Matcha report`,
			html: `<h1>`+ req.xssFilters.inHTMLData(req.body.report) +`</h1>`
		};
		req.mail.sendMail(message, (err, info) => {
			if (!err)
				res.send({status: `success`});
			else
				res.send({status: `fail`});

		});
		
	}
}