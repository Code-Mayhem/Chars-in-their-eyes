
(function(window, $, undefined){
	"use strict";

	var Postcode = Postcode || {};

	Postcode = function(){

		var _self = this;
		var postcode = '';
		var form = '[data-postcode-form]';
		var postcodeField = '[data-postcode-field]';
		var submit = '[data-postcode-submit]';
		var errorClass = 'validation-error';

		function init(){
			addListeners();
		}

		function addListeners(){
			$(form).on('submit', function(e){
				e.preventDefault();
				submitForm(e);
			});

			$(submit).on('click', function(e){
				e.preventDefault();
				submitForm(e);
			});
		}

		function submitForm(e){
			var $postcodeField = $(postcodeField);
			var postcode = $postcodeField.val();
			if(postcode === ''){
				addError($postcodeField);
				return;
			}

			var postUrl = 'http://storelocator.asda.com/#!/search/index?qs= ' + postcode + '&imageField=Go&cmpid=ahc-_-otc-storeloc-_-asdacom-_-hp-_-store-loc-_-store';

			window.location = postUrl;

		}

		function addError($field){
			$field.addClass(errorClass);
		}

		init();
	};

	var postcode = new Postcode();

})(window, jQuery);