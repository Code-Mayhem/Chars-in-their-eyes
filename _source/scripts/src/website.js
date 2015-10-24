var website;
(function(window, $, undefined){
	"use strict";

	var Website = Website || {};

	Website = function(){

		var _self = this;

		function init(){
			$(window).on('device-type', loadJS);
			site.init();
		}

		function hasClass(el, classMatch){
			if (el.classList){
 				return el.classList.contains(classMatch);
 			} else {
  				return new RegExp('(^| )' + classMatch + '( |$)', 'gi').test(el.className);
  			}
		}

		function addClass(el, classMatch){
			if(el.className.length > 0 && el.className.charAt(el.className.length) !== ' '){
				el.className += ' ' + classMatch;
			}else{
				el.className = classMatch;
			}
		}

		function removeClass(el, classMatch){
			var reg = new RegExp('(\\s|^)'+classMatch+'(\\s|$)');
			var classList = el.className.replace(reg, '');
			el.className = classList;
		}

		function loadJS(e, val){
			loadHorizontalScrollJS(val);
		}

		function loadHorizontalScrollJS(val){
			var $hs = $('[data-horizontal-scroll]');
			if($hs.length < 1) return;
			if(val === 'small' || val === 'medium'){
				$hs.horizontalScroll();
			}else{
				if($hs.data('horizontalScroll') !== ''){
					$hs.data('horizontalScroll').destroy();
				}
			}
		}

		init();

		var publicFunc = {
			hasClass: hasClass,
			addClass: addClass,
			removeClass: removeClass
		}

		return publicFunc;
	};

	$().ready(function(){
		website = new Website();

	});
  	

})(window, jQuery);