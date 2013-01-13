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

					function removeFns (obj) {
						var rtn = {};
						_.each(obj, function (val, name) {
							if (typeof val !== "function") {
								rtn[name] = val;
							}
						});
						return rtn;
					}

					var self = this;

					if (!data) {
						data = removeFns(this);
					} else if (!app.config.enableJSON ) {
						data = removeFns(_.extend(app.controllers.app, data));
					}

					// Magic Variables
					data.location = this.req.originalUrl;

					if (self.req.session.flash) {
						data.flash = self.req.session.flash;
						self.req.session.flash = null;
					}

					if (app.config.enableJSON && data.location.indexOf("json/") !== -1) {
						this.res.json(data);
					} else {
						this.res.render(template, data);
					}

				}

			}, obj);

		}

	};

};