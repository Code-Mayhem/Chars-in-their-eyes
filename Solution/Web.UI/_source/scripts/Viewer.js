(function ($, window, undefined) {

	"use strict";
	window.code = window.code || {};
	var viewer = window.code.viewer = function (options) {

		var loadModel = '[data-load-model]';

		function init() {
			//initialize();
			handleEvent();
		}

		function handleEvent() {
			$(loadModel).on('click', initialize);
		}

		function initialize() {

			var urn = $('#urn').val();

			if (urn == null || urn === "") {
				console.log("x");
				urn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZGV2YnVja2V0L0RyaWxsLmR3Zng=';
			}
			if (urn.substr(0, 4) !== 'urn:') {
				urn = 'urn:' + urn;
			}

			var options = {
				'document': urn,
				'getAccessToken': getToken,
				'refreshToken': getToken,
			};

			var viewerElement = document.getElementById('viewer');

			viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {
				extensions: ['BasicExtension']
			});


			//initializer the viewer 

			Autodesk.Viewing.Initializer(options, function () {
				viewer.start();
				loadDocument(viewer, options.document);
			});
		}

		function loadDocument(viewer, documentId) {

			Autodesk.Viewing.Document.load(documentId, function (doc) {
				var geometryItems = [];
				geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
					'type': 'geometry',
					'role': '3d'
				}, true);

				if (geometryItems.length < 0) return;

				viewer.load(doc.getViewablePath(geometryItems[0]));

			}, function (errorMsg) {
				alert("Load Error: " + errorMsg);
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

		init();
	};

}(jQuery, window));

$(function () {
	var viewer = new code.viewer();
});