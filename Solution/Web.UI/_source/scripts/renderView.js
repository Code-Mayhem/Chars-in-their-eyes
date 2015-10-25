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
				console.log(renderModel);

				handlebarsObject(renderModel);
			};

			$.connection.hub.start().done(function () {
				smsRenderHub.server.sendNewSmsRenders();
			});

			//console.log(data);

			//return data;
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