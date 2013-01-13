/*jslint node: true */

module.exports = function (express, app) {

	'use strict';

	var colors = require('colors');

	app.log = function (message, color) {
		console.log(message[color || 'grey']);
	};

};