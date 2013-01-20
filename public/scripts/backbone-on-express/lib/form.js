/*global define, Backbone, $ */

define([
  'jquery',
	'backbone'
], function ($, b) {

	'use strict';

 Backbone.Form = {

  extend: function (obj) {

		var model = new obj.Model(),
				values = {},
				invalid,
				fieldTypes = 'input, select, textarea';

		$('#' + obj.id).find(fieldTypes).bind('keyup', function () {

			$('#' + obj.id).find(fieldTypes).each(function () {
				if ($(this).attr('name')) {
					values[$(this).attr('name')] = $(this).val();
				}
			});

			model.set(values);

			if (typeof obj.change === 'function') {
				obj.change(model, model.validate());
			}

		});

    $('#' + obj.id).bind('submit', function () {

		$(this).find(fieldTypes).each(function () {
			if ($(this).attr('name')) {
				values[$(this).attr('name')] = $(this).val();
			}
		});

		model.set(values);

		invalid = model.validate();

		if (invalid && typeof obj.error) {
			obj.error(model, invalid);

		} else if (obj.save) {

			model.on('sync', function (model, data) {
				if (typeof obj.success) {
					obj.success(model, data);
				}
			});

			model.save();

		} else {
			return true;
		}

    return false;
  
  });

  }

 };

});