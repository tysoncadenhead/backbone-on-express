/*global requirejs, define, Backbone, _ */

// Add all of the core libraries to the config
requirejs.config({
    paths: {
        jquery: '/scripts/backbone-on-express/vendor/jquery',
				underscore: '/scripts/backbone-on-express/vendor/underscore',
				backbone: '/scripts/backbone-on-express/vendor/backbone'
    },
    shim: {
			bootstrap: {
				deps: ['jquery']
			},
			backbone: {
				deps: ['jquery', 'underscore']
			}
    }
});

// Return an AMD module
define([
	'underscore',
	'backbone',
	'/scripts/backbone-on-express/lib/model.js',
	'/scripts/backbone-on-express/lib/form.js'
], function(u, b, Model, Form) {

	'use strict';

	return Backbone;

});