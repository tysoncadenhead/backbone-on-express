/*jslint node: true */
/*global underscore, backbone, requirejs, express, _, app */

module.exports = function (config, done) {

	'use strict';

	var pkg = require( './package.json' ),
			fs = require( 'fs' ),
			dependencies = {}, dependency,
			passport = require('passport');

	function startApp () {

		// Include all of the files in the framework lib
		_.each(fs.readdirSync( __dirname + '/lib'), function (file) {
			if (file.indexOf('.js') !== -1) {
				require( __dirname + '/lib/' + file )(express, app);
			}
		});

		if (app.config.passport) {
			app.use(passport.initialize());
			app.use(passport.session());
		}

		// Controllers
		require( config.rootPath + 'app/controllers/app_controller.js');
		require( './lib/controllers/errors_controller.js');
		_.each(fs.readdirSync( config.rootPath + 'app/controllers' ), function (file) {
			if (file !== 'app_controller.js') {
				require( config.rootPath + 'app/controllers/' + file );
			}
		});

		// We may need to make this a config option at some point
		app.use(express.bodyParser());
		app.set('views', config.templates);
		app.set('view engine', config.viewEngine);
		app.set('layout', config.layout);

		app.use(express.cookieParser());
		app.use(express.session({ secret: app.config.secret }));

		app.use(global['express-ejs-layouts']);

		// Start the server
		app.log(' ______              __     __                                            _______                                     \n|   __ \\.---.-.----.|  |--.|  |--.-----.-----.-----.    .-----.-----.    |    ___|.--.--.-----.----.-----.-----.-----.\n|   __ <|  _  |  __||    < |  _  |  _  |     |  -__|    |  _  |     |    |    ___||_   _|  _  |   _|  -__|__ --|__ --|\n|______/|___._|____||__|__||_____|_____|__|__|_____|    |_____|__|__|    |_______||__.__|   __|__| |_____|_____|_____|\n                                                                                        |__|  ', 'yellow');
		app.log('Server started at port ' + app.config.port + '\n', 'green');
		app.listen(app.config.port);

		app.use(express['static'](app.config['public']));
		app.use(express['static']( __dirname + '/public' ));

		// Error Handler
		app.use(app.config.errorHandler);

		app.use(app.router);

		// Get the routes
		require( config.rootPath + 'app/config/routes.js' );

		app.log('Users can now access ' + app.config.url + ':' + app.config.port + '\n');

		if (typeof done === 'function') {
			done(app);
		}

	}

	// Load all of the dependencies from the package.json file and make them global variables
	for (dependency in pkg.dependencies) {
		if (pkg.dependencies.hasOwnProperty(dependency)) {
			if (dependency !== 'anvil.js') {
				global[dependency] = require(dependency);
			}
		}
	}

	// Underscore shorthand
	global._ = underscore;
	global.Backbone = backbone;
	global.define = requirejs;

	// Initialize the application
	global.app = express();

	// Add configuration to the application
	app.config = _.extend(config, _.extend(

		require( config.rootPath + 'app/config/environments/global.json' ),
		require( config.rootPath + 'app/config/environments/' + (app.settings.env || 'development') + '.json')), {

			// The default error handler
			errorHandler: function (err, req, res, next) {
				console.log(err);
				fs.appendFileSync(config.rootPath + 'log/error.log', err, 'utf8');
		  },

		  // The Access Log Writer
		  accessHandler: function (template, data) {
				fs.appendFileSync(config.rootPath + 'log/access.log', template + '\n' + new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() + ' : ' + new Date().getTime() + '\n\n', 'utf8');
		  }

		}

	);

	// Pass the configuration to requirejs
	requirejs.config(app.config.require);

	// Get the storage driver if one is specified
	if (app.config.storage) {
		require( __dirname + '/lib/storage/' + (app.config.storage.driver || 'mongoose') + '.js' )(app, function () {
			startApp();
		});
	} else {
		startApp();
	}

};