/*jslint node: true */
/*global Backbone, requirejs, _ */

module.exports = function (express, app) {

	'use strict';

	(function () {

	  _.extend(Backbone.Collection.prototype, {

			getStorage: function (done) {
				var model = new this.model();
				return new app.Storage({
					name: model.name,
					schema: model.schema
				});
			},

			fetch: function (done) {
					var self = this;
					this.getStorage().all({}, function (err, data) {

						if (err && typeof done === 'object' && typeof done.error === 'function') {
							done.error(self, err, done);

						} else {

							self.add(data, { silent: true });

							if (typeof done === 'object' && typeof done.success === 'function') {
								done.success(self, data);
							}
							
						}
					});
				},

				where: function (where, done) {
					var self = this;
					this.getStorage().all(where, function (err, data) {
						self.add(data, { silent: true });
						done(self, data);
					});
				}

	  });

	}.call(this));

};