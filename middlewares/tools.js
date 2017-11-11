const bcrypt = require('bcrypt');

module.exports = {
	isNotLog: (req, res, next) => {
		if (req.session.login && req.session.uId)
			res.redirect('/home');
		else
			next();
	},
	isLog: (req, res, next) => {
		if (req.session.login && req.session.uId)
			next();
		else
			res.redirect('/');
	},
	isAlphaNum: (string) => {
		if (string){
			var regAlphaNum = new RegExp('^[ ?!\,\.0-9a-z\_\-]+$','i');
			return regAlphaNum.test(string);
		}
		return 0;
	},
	isMail: (mail) => {
		if (mail){
			var regMail = new RegExp('^[0-9a-z.\_\-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			return regMail.test(mail);
		}
		return 0;
	},
	isDate: (date) => {
		if (date){
			newDate = new Date(date);
			if (newDate)
				return newDate;
		}
		return 0;
	},
	getAge: (date) => {
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
	hashPasswd: (password) => {
		return bcrypt.hashSync(password, 10);
	},
	comparePasswd: (password, hash) => {
		return bcrypt.compareSync(password, hash);
	},
	getDist: (xA, yA, zA, xB, yB, zB) => {
		console.log(xA, yA, zA, xB, yB, zB)
		var dist = Math.acos( xA.xB+xB.yB+zA.zB) * 20000 / Math.PI;
		return dist;
	}
}