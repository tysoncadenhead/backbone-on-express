/*jslint node: true */
/*global Backbone, requirejs, _ */

module.exports = function (express, app) {

	'use strict';

	app.schema = {};
	app.models = {};
	app.collections = {};

	Backbone.Schema = {

		extend: function (obj) {

			requirejs([
				'models/' + obj.name.toLowerCase() + '_model',
				'collections/' + obj.name.toLowerCase() + 's_collection'
			], function (Model, Collection) {

				var storage = new app.Storage(obj);

				Model.prototype.storage = storage;
				Model.prototype.schema = obj.fields;

				Model.prototype.fetch = function (done) {
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

					this.storage.find(where, function (err, data) {
						self.set(data);
						done(self, data);
					});

				};

				Model.prototype.save = function (config) {
					var self = this;
					this.storage.save(this.attributes, function (err, data) {
						if (err) {
							config.error(self, err);
						} else {
							self.set(data);
							config.success(self, data);
						}
					});
				};

				Model.prototype.destroy = function (done) {
					var self = this;
					this.storage.destroy(this.get('_id'), function (err, data) {
						done(self, data);
					});
				};

				Model.prototype.initialize = function (config) {
					if (!config || !config.keepEmptyValues) {
						var defaultConfig = {};
						_.each(this.schema, function (field, name) {
							defaultConfig[name] = '';
						});
						config = _.extend(defaultConfig, config);
						this.set(config, {
							silent: true
						});
					} else {
						this.keepEmptyValues = true;
						this.set(_.omit(config, 'keepEmptyValues'));
					}
				};

				app.models[obj.name] = Model;

				Collection.prototype.model = app.models[obj.name];
				Collection.prototype.storage = storage;

				Collection.prototype.fetch = function (done) {
					var self = this;
					this.storage.all(function (err, data) {
						if (err && typeof done === 'object' && typeof done.error === 'function') {
							done.error(self, err, done);

						} else {
							_.each(data, function (value) {
								self.add(value);
							});

							if (typeof done === 'object' && typeof done.success === 'function') {
								done.success(self, data);
							}
							
						}
					});
				};

				Collection.prototype.where = function (where, done) {
					var self = this;
					this.storage.all(where, function (err, data) {
						self.add(data);
						done(self, data);
					});
				};

				app.collections[obj.name + 's'] = Collection;

			});

		}

	};

};