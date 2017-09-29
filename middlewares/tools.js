const bcrypt = require('bcrypt');

module.exports = {
	isNotLog: function (req, res, next){
		if (req.session.login && req.session.uId)
			res.redirect('/home');
		else
			next();
	},
	isLog: function (req, res, next){
		if (req.session.login && req.session.uId)
			next();
		else
			res.redirect('/');
	},
	isAlphaNum: function(string){
		if (string){
			var regAlphaNum = new RegExp('^[ ?!\,\.0-9a-z\_\-]+$','i');
			return regAlphaNum.test(string);
		}
		return 0;
	},
	isMail: function(mail){
		if (mail){
			var regMail = new RegExp('^[0-9a-z.\_\-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			return regMail.test(mail);
		}
		return 0;
	},
	isDate: function(date){
		if (date){
			newDate = new Date(date);
			if (newDate)
				return newDate;
		}
		return 0;
	},
	getAge: function(date){
		if (date){
			date = new Date(date);
			var today = new Date();
			var years = today.getFullYear() - date.getFullYear();
			var months = today.getMonth() - date.getMonth();
			var days = today.getDate() - date.getDate();
			if (years > 18 || (years == 18 && months >= 0 && days >= 0))
				return years;
		}
		return 0;
	},
	hashPasswd: function(password){
		return bcrypt.hashSync(password, 10);
	},
	comparePasswd: function(password, hash){
		return bcrypt.compareSync(password, hash);
	}
}