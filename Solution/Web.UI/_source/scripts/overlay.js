(function ($, window, undefined) {

	"use strict";
	window.code = window.code || {};
	var overlay = window.code.overlay = function (options) {

		var loadModel = '[data-load-model]';
		var overlayBg = '[data-overlay-bg]';
		var closeBtn = '[data-close-btn]';

		var displayNone = 'u-display--none';

		var model = '#viewer';

		function init() {
			handleEvent();
		}

		function handleEvent() {
			$(loadModel).on('click', showOverlayBg);
			$(closeBtn).on('click', hideOverlayBg);
		}

		function showOverlayBg() {
			$(overlayBg).removeClass(displayNone);
			$(closeBtn).removeClass(displayNone);
		}

		function hideOverlayBg() {
			$(overlayBg).addClass(displayNone);
			$(closeBtn).addClass(displayNone);

			$(model).empty();
		}

		init();
	};

}(jQuery, window));

$(function () {
	var overlay = new code.overlay();
});