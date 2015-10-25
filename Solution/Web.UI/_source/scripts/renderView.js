(function ($, window, undefined) {

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

				
				for (var i = 0; i < test.length; i++) {

					var url = 'https://developer.api.autodesk.com/viewingservice/v1/thumbnails/' + test[i].Urn;

					var req = new XMLHttpRequest();
					req.open("GET", url, false);
					req.send(null);
					console.log(req.responseText);
				}
				
				handlebarsObject(test);
			};

			$.connection.hub.start().done(function () {
				smsRenderHub.server.sendNewSmsRenders();
			});
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