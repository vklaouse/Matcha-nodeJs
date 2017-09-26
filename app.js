var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const request = require('request-promise');
const db = require('./configurations/initDb.js').init();
var session = require('./configurations/initSession.js').init();
var mail = require('./configurations/initMail.js').init();
var routes = require('./routes/mainRoutes.js');
var app = express();

// construct app
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.png')))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
	.use(cookieParser())
	.use(express.static(path.join(__dirname, 'public')))
	.use(session)
	.use(function(req, res, next) {
		if (!req.localisation)
			request('http://ip-api.io/api/json')
				.then(function (response) {
					req.localisation = JSON.parse(response);
					return next();
				});
	})
	.use(function(req, res, next) {
		if (!req.mail)
			req.mail = mail;
		return next();
	})
	.use(function(req, res, next) {
		if (!req.db)
			req.db = db;
		return next();
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'jade');

// routes
routes.initRoutes(app);

module.exports = app;
