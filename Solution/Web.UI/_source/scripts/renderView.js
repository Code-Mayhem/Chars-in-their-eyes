(function ($, window, undefined) {

	"use strict";
	window.code = window.code || {};
	var renderView = window.code.renderView = function (options) {

		var temp = '[data-handlebars]';
		var render = '[data-render]';

		var strip = '[data-strip]';

		function init() {
			handleEvent();

			runHub();
		  
			setInterval(function () {
			  var smsRenderHub = $.connection.smsRenderHub;
			  timerCounter += 1;
			  smsRenderHub.server.sendNewSmsRenders();
			  console.log("timeout: " + timerCounter);
			}, 15000);
		}

		function handleEvent() {
			
		}

		var dataCount = 0;
	  var timerCounter = 0;
		function runHub() {
		  var smsRenderHub = $.connection.smsRenderHub;

			smsRenderHub.client.addNewSmsRenders = function (renderModel) {
				var dec = decodeURI(renderModel);
				var parse= JSON.parse(dec);
				
				for (var i = 0; i < parse.length; i++) {

					var urnCode = parse[i].Urn;

					var url = 'https://developer.api.autodesk.com/viewingservice/v1/thumbnails/' + urnCode;

					var req = new XMLHttpRequest();
					req.open("GET", url, false);
					req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
					req.setRequestHeader('Authorization', 'Bearer' + getToken());
					req.send(null);
					
					parse[i].thumbNail = url;
				}

				if (parse.length > dataCount) {
			    dataCount = parse.length;
			    handlebarsObject(parse);
			  }
			};

		  $.connection.hub.start();
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

		  $(render).empty();
			$(render).append(template(data));

		}

		init();
	};

}(jQuery, window));

$(function () {
	var renderView = new code.renderView();
});