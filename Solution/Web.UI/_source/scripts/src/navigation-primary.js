(function(window, $, undefined){
	"use strict";

	var NavigationPrimary = NavigationPrimary || {};

	NavigationPrimary = function(){

		var _self = this;
		var np = $('[data-np]')[0];
		var subNav = $('[data-np-subnav]')[0];
		var moreBtn = $('[data-np-more-btn]')[0];
		var isActive = 'is-active';

		function init(){
			addListeners();
		}

		function addListeners(){

			if(moreBtn.addEventListener){
				moreBtn.addEventListener('click', toggleActive, false);
			}else{
				moreBtn.attachEvent('onclick', function(){ return toggleActive.apply(moreBtn, [window.event])});
			}
		}

		function toggleActive(e){
			if(website.hasClass(np, isActive)){
				website.removeClass(np, isActive);
			}else{
				website.addClass(np, isActive);
			}
		}

		init();
	};

	var np = new NavigationPrimary();

})(window, jQuery);