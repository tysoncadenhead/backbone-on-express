/*global _ */
/*jslint node: true */

module.exports = function (express, app) {

	'use strict';

	var mongoose = require( 'mongoose' ), db,
			sys = require('sys'),
			exec = require('child_process').exec;
	
	mongoose.connect(app.config.storage.server || 'localhost', app.config.storage.database || 'test');

	db = mongoose.connection;

	// Database Success
	db.on('error', function () {

		// Log the connection error
		app.log('Unable to connect to the mongoose database!', 'red');

		// Try to start mongoose, just in case it wasn't started yet
		exec("mongoose", function (error, stdout, stderr	) {
			sys.puts(stdout);
		});

	});

	// Placeholder
	app.Storage = function () {
			app.log('Mongoose database connection error!', 'red');


	};

	// Database Open
	db.once('open', function callback () {

	  app.Storage = function (config) {

			// Schema
			this.schema = new mongoose.Schema(config.fields);

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

	});

};