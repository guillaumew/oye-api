var express  = require('express');
var app = express();
var enforce = require('express-sslify');
var port  	 = process.env.PORT || 5000; 
app.use(require('prerender-node').set('prerenderToken', 'YekBGk2uzvDAKaSLaWzq'));

if(process.env.ENV != "development"){
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use('', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'oye-api',
	'brand': 'oye-api',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7',
		},
	},
});

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	paths: 'paths',
	objects: 'objects',
	places: 'places',
	contents: 'contents',
	images: 'images',
	goals: 'goals',
});

// Start Keystone to connect to your database and initialise the web server

keystone.app = app;

keystone.start();
