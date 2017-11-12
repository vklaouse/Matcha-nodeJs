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
	getDist: (latA, lngA, latB, lngB) => {
		earth_radius = 6378137;			// Terre = sphère de 6378km de rayon
		rlo1 = Math.PI * lngA / 180;	// CONVERSION
		rla1 = Math.PI * latA / 180;
		rlo2 = Math.PI * lngB / 180;
		rla2 = Math.PI * latB / 180;
		dlo = (rlo2 - rlo1) / 2;
		dla = (rla2 - rla1) / 2;
		a = (Math.sin(dla) * Math.sin(dla)) + Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo));
		d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return ((earth_radius * d / 1000).toFixed(3));
	},
	compareByValue: (a, b) => {
		if (a.value > b.value)
			return -1;
		if (a.value < b.value)
			return 1;
		return 0;
	}
}