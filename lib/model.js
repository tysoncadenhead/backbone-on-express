/*jslint node: true */
/*global Backbone, requirejs, _ */

module.exports = function (express, app) {

	'use strict';

	(function () {

	  _.extend(Backbone.Model.prototype, {

	  	getStorage: function (done) {
	  		return new app.Storage({
					name: this.name,
					schema: this.schema
				});
	  	},

	    fetch: function (done) {
				var self = this,
						where = this.attributes;

				if (!this.keepEmptyValues) {
					_.each(where, function (item, name) {
						if (!item || !item.length) {
							delete where[name];
						}
					});
				} else {
					delete where.keepEmptyValues;
				}

				this.getStorage().find(where, function (err, data) {
					self.set(data, { silent: true });
					done(self, data);
				});

			},

			save: function (config) {
				var self = this,
						invalid = this.validate(this.attributes);

				console.log(invalid);

				if (invalid) {
					config.error(self, invalid);

				} else {
					this.getStorage().save(this.attributes, function (err, data) {
						if (err) {
							config.error(self, err);
						} else {
							self.set(data);
							config.success(self, data);
						}
					});
				}
				
			},

			destroy: function (done) {
				var self = this;
				this.getStorage().destroy(this.get('_id'), function (err, data) {
					done(self, data);
				});
			}

	  });

	}.call(this));

};