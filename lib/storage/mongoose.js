/*global _ */
/*jslint node: true */

module.exports = function (app, done) {

	'use strict';

	var mongoose = require( 'mongoose' ), db,
			sys = require('sys'),
			exec = require('child_process').exec,
			connectionTimeout;
	
	mongoose.connect(app.config.storage.server || 'localhost', app.config.storage.database || 'test');

	db = mongoose.connection;

	connectionTimeout = setTimeout(function () {
		console.log('ERROR - Unable to connect to the mongoose database!');
	}, 5000);

	// Database Success
	db.on('error', function () {

		// Log the connection error
		app.log('Unable to connect to the mongoose database!', 'red');

		done();

	});

	// Database Open
	db.on('open', function callback () {

		clearTimeout(connectionTimeout);

	  app.Storage = function (config) {

			// Schema
			this.schema = new mongoose.Schema(config.schema);

			// Model
			this.Model = mongoose.model(config.name, this.schema);

			this.save = function (data, done) {
				var model;

				// Update
				if (data._id) {
					this.Model.update({
						_id: data._id
					}, _.omit(data, '_id'), function (err, num, raw) {
						done(err, data);
					});

				// Create
				} else {
					model = new this.Model(data);
					model.save(done);
				}

			};

			this.destroy = function (id, done) {
				this.Model.findById(id, function (err, model) {
					model.remove(done);
				});
			};

			this.find = function (where, done) {
				this.Model.findOne(where, done);
			};

			this.all = function (where, done) {
				this.Model.find(where, done);
			};

		};

		done();

	});

};