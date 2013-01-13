/*jslint node: true */
/*global Backbone, _ */

module.exports = function (express, app) {

	"use strict";

	Backbone.Router = {

		extend: function (obj) {

			var routes = _.extend(this, obj);

			if (routes.crud && routes.crud.length) {
				_.each(routes.crud, function (crud) {
					routes.routes[crud] = crud + "#index";
					routes.routes[crud + "/new"] = crud + "#new";
					routes.routes[crud + "/edit/:id"] = crud + "#edit";
					routes.routes[crud + "/:id"] = crud + "#show";
					routes.routes[crud + "|post"] = crud + "#create";
					routes.routes[crud + "/:id|put"] = crud + "#update";
					routes.routes[crud + "/update/:id|post"] = crud + "#update";
					routes.routes[crud + "/:id|delete"] = crud + "#destroy";
					routes.routes[crud + "/delete/:id"] = crud + "#destroy";
				});
			}

			_.each(routes.routes, function (path, route) {

				var method = route.split("|")[1] || "get",
						url = route.split("|")[0];

				// JSON
				if (app.config.enableJSON) {
					app[method]("/json/" + url, function(req, res){

						app.log("--------------------------------------");
						app.log(method.toUpperCase(), "white");
						app.log(req.originalUrl, "green");
						app.log(JSON.stringify(req.body) || "{}", "white");
						app.log("--------------------------------------\n");

						app.controllers[path.split("#")[0]].req = req;
						app.controllers[path.split("#")[0]].res = res;
						app.controllers[path.split("#")[0]][path.split("#")[1]](req, res);
					});
				}

				// Render
				app[method]("/" + url, function(req, res){

					app.log("--------------------------------------");
					app.log(method.toUpperCase(), "white");
					app.log(req.originalUrl, "yellow");
					app.log(JSON.stringify(req.body) || "{}", "white");
					app.log("--------------------------------------\n");

					app.controllers[path.split("#")[0]].req = req;
					app.controllers[path.split("#")[0]].res = res;
					app.controllers[path.split("#")[0]][path.split("#")[1]](req, res);
				});

			});

		}

	};

};