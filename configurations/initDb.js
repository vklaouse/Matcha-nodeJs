const Promise = require('bluebird');

module.exports = {
	init: () => {
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