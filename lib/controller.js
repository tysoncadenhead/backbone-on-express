/*jslint node: true */
/*global Backbone, _ */

var fs = require( 'fs' ),
		ejs = require( 'ejs' );

module.exports = function (express, app) {

	'use strict';

	app.controllers = {};

	Backbone.Controller = {

		extend: function (obj) {

			// Extend the app controller to every controller
			if (obj.name.toLowerCase() !== 'app') {
				obj = _.extend(app.controllers.app, obj);
			}

			app.controllers[obj.name.toLowerCase()] = _.extend({

				render: function (template, data) {

					// Removes functions from an object
					function removeFns (obj) {
						var rtn = {};
						_.each(obj, function (val, name) {
							if (typeof val !== 'function') {
								rtn[name] = val;
							}
						});
						return rtn;
					}

					var self = this;

					// If no data is provided, get it from the controller "this"
					if (!data) {
						data = removeFns(this);

					// Extend the app controller params
					} else if (!app.config.enableJSON ) {
						data = removeFns(_.extend(app.controllers.app, data));
					}

					// Magic Variables
					data.location = this.req.originalUrl;
					data.session = {};

					if (self.req.session) {
						data.session = self.req.session;
					}

					// Render JSON
					if (app.config.enableJSON && data.location.indexOf('json/') !== -1) {

						// Error Code Handling
						if (typeof template === 'number') {
							this.res.send(template);

						// Normal Render
						} else {
							this.res.json(data);
						}

					// Render with the view engine
					} else {

						// Error code handling
						if (typeof template === 'number') {

							// Render the error with a view
							if (fs.existsSync(app.config.templates + '/errors/' + template + '.' + app.config.viewEngine)) {
								data.title = template;
								this.res.render('errors/' + template, data);	

							// Respond with the error code
							} else {
								this.res.send(template);
							}
						
						// View engine rendering
						} else {
							console.log(data);
							this.res.render(template, data);
						}

					}

					if (self.req.session.flash) {
						self.req.session.flash = undefined;
					}

				}

			}, obj);

		}

	};

};