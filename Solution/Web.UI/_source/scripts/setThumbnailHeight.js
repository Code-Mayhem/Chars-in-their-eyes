(function ($, window, undefined) {

	"use strict";
	window.code = window.code || {};
	var setThumbnailHeight = window.code.setThumbnailHeight = function (options) {

		var thumbNail = '[data-thumbnail]';
		var gridItem = '[data-grid-item]';

		function init() {
			setThumbNailHeight();
			handleEvent();
		}

		function handleEvent() {
			$(window).on('resize', setThumbNailHeight);
		}

		function setThumbNailHeight() {

			$(thumbNail).each(function () {

				var parent = $(this).closest(gridItem);
				
				var height = $(parent).height();
				var width = $(parent).width();

				$(this).width(width);
				$(this).height(height);

			});

		}


		init();
	};

}(jQuery, window));

$(function () {
	var setThumbnailHeight = new code.setThumbnailHeight();
});