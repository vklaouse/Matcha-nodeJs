let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let request = require('request-promise');
let xssFilters = require('xss-filters');
let db = require('./configurations/initDb.js').init();
let session = require('./configurations/initSession.js').init();
let mail = require('./configurations/initMail.js').init();
let routes = require('./routes/mainRoutes.js');
let app = express();

// construct app
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.png')))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
	.use(cookieParser())
	.use(express.static(path.join(__dirname, 'public')))
	.use(session)
	.use((req, res, next) => {
		if (!req.localisation)
			request('http://ip-api.io/api/json')
			.then(response => {
				req.localisation = JSON.parse(response);
				return next();
			})
			.catch(err => {
				req.localisation = {latitude: 0, longitude: 0, ip: 0};
				return next();
			});
	})
	.use((req, res, next) => {
		if (!req.mail)
			req.mail = mail;
		if (!req.db)
			req.db = db;
		if (!req.xssFilters)
			req.xssFilters = xssFilters;
		return next();
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'jade');

// routes
routes.initRoutes(app);

module.exports = {
	app: app, 
	session: session
};