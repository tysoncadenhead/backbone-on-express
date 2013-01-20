define([
	'backbone'
], function (b) {

	// Validation
	(function () {

    _.extend(Backbone.Model.prototype, {

      validateSchema: function () {
        var schema = this.schema,
            self = this,
            errors = {};

        // Loop over the schema to validate
        _.each(schema, function (val, name) {

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
          } else if (val.type && typeof val.type() !== typeof self.attributes[name]) {
            errors[name] = {
              type: 'Type Error',
              message: 'This is the the wrong type. A' + (typeof val.type()) + ' was expected, but a ' + (typeof self.attributes[name]) + ' was provided.'
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

});