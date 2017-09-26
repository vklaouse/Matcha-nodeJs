const nodemailer = require('nodemailer');

module.exports = {
	init: function(){
		var smtpTransport = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: "matcha.42born2code@gmail.com",
						pass: "42born2code"
					}
				});
		return smtpTransport;
	}
}