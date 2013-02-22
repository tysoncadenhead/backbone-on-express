/*jslint node: true */
/*global Backbone, requirejs, _ */

module.exports = function (express, app) {

	'use strict';

  (function () {

    _.extend(Backbone.Model.prototype, {

      validateSchema: function () {
        var schema = this.schema,
            self = this,
            errors = {};

        // Loop over the schema to validate
        _.each(schema, function (val, name) {

          if (val.type === String) {
            self.attributes[name] = String(self.attributes[name]);
          }

          // Type conversion
          if (val.type === Number && self.attributes[name].length) {
            self.attributes[name] = parseFloat(self.attributes[name]);
          }

          // Missing Required
          if (val.required && (!self.attributes[name] || !self.attributes[name].length)) {
            errors[name] = {
              type: 'Required',
              message: 'This is required.'
            };

          // Type error
          } else if (val.type && typeof val.type() !== typeof self.attributes[name] && typeof self.attributes[name] !== 'undefined') {
            errors[name] = {
              type: 'Type Error',
              message: 'This is the the wrong type. A ' + (typeof val.type()) + ' was expected, but a ' + (typeof self.attributes[name]) + ' was provided.'
            };
          }

        });

        if (!_.isEmpty(errors)) {
          return errors;
        }

      },

      validate: function (attrs, options) {
        if (!options || !options.silent) {
          return this.validateSchema();
        }
      }

    });

  }.call(this));

};