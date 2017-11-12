const Promise = require('bluebird');

module.exports = {
	init: function(){
		const initOptions = {
			promiseLib: Promise
		};
		const connection = {
			host: 'localhost',
			port: 5432,
			database: 'matcha',
			user: 'vklaouse',
			password: 'vklaouse'
		};
		const pgp = require('pg-promise')(initOptions);
		var db = pgp(connection);
		return db;
	}
}