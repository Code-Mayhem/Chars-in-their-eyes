﻿(function ($, window, undefined) {

	"use strict";
	window.code = window.code || {};
	var renderView = window.code.renderView = function (options) {

		var temp = '[data-handlebars]';
		var render = '[data-render]';

		function init() {
			handleEvent();

			getData();
		}

		function handleEvent() {
			
		}

		function getData() {
			var smsRenderHub = $.connection.smsRenderHub;

			smsRenderHub.client.addNewSmsRenders = function (renderModel) {

				var dec = decodeURI(renderModel);
				var test = JSON.parse(dec);


				//console.log(test);
				
				for (var i = 0; i < test.length; i++) {

					var urnCode = test[i].Urn;

					var url = 'https://developer.api.autodesk.com/viewingservice/v1/thumbnails/' + urnCode;

					var req = new XMLHttpRequest();
					req.open("GET", url, false);
					req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
					req.setRequestHeader('Authorization', 'Bearer' + getToken());
					req.send(null);
					//console.log(req.responseText);

					test[i].thumbNail = url;
				}
				
				console.log(test);

				handlebarsObject(test);
			};

			$.connection.hub.start().done(function () {
				smsRenderHub.server.sendNewSmsRenders();
			});
		}

		function getToken() {

			var xmlHttp = null;
			xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", "GetAccessToken.aspx", false);
			xmlHttp.send(null);
			var res = xmlHttp.responseText;
			var newToken = JSON.parse(res);

			if (newToken.error) {
				console.log(newToken.error);
				return;
			}

			return newToken.access_token;
		}

		function handlebarsObject(data) {
				
			var source = $(temp).html();
			var template = Handlebars.compile(source);

			$(render).append(template(data));

		}

		init();
	};

}(jQuery, window));

$(function () {
	var renderView = new code.renderView();
});