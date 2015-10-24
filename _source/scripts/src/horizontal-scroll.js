(function(window, $, undefined){
	"use strict";


	$.horizontalScroll = function(obj, options){
		var $obj = $(obj);
		var _self = this;
		var $scroller = $obj;
		var scrollerItem = '[data-hs-item]';
		var $win = $(window);
		var itemWidth = null;
		var $inner = null;
		var $original = null;
		var isDead = false;
		var docHeight = null;
		var widthExpander = 80;

		function init(){
			docHeight = $(document).height();
			$scroller = $obj;
			$original = $obj.html();
			setupScroller();
			//fix for mobile chrome
			docHeight = $(document).outerHeight();
			$win.on('device-type', resizeHappened);
		}


		function resizeHappened(){
			if(docHeight === $(document).height()) return;
			if(!isDead){
				destroy();
				setupScroller();
			}
		}

		function setupScroller(){
			var i = getItems();
			var l = getItemsLength(i);
			
			setContainerWidth();
			var innerWidth = getInnerWidth(i, l);
			setItemWidth(i);
			addInnerScroll(innerWidth);
		}

		function getInnerWidth(itemsArr, len){
			itemWidth = getItemWidth(itemsArr);
			var itemFullWidth = getItemWidth(itemsArr, true);
			var innerWidth = (itemFullWidth * len) + getPadding(itemsArr);
			return innerWidth;
		}

		function getPadding(itemsArr){
			var padding = 0;
			for(var i = 0; i < itemsArr.length; i++){
				padding += (parseInt($(itemsArr[i]).css('padding-left')) + parseInt($(itemsArr[i]).css('padding-right')));
				padding += widthExpander;
			}
			return padding;
		}

		function addInnerScroll(innerWidth){
			$inner = $('<div />', {
				width: innerWidth + 'px'
			})
			$scroller.wrapInner($inner);
		}

		function setContainerWidth(){
			$scroller.width($scroller.width());
		}

		function getItemWidth(itemsArr, margin){
			var margin = margin || false;
			return itemsArr.outerWidth(margin) + widthExpander;
		}

		function setItemWidth(itemsArr){
			$(itemsArr).width(itemWidth);
		}

		function getItems(){
			return $scroller.find(scrollerItem);
		}

		function getItemsLength(itemsArr){
			return itemsArr.length;
		}

		function destroy(){
			$obj.removeAttr('style').html($original);
		};

		_self.destroy = function(){
			destroy();
			isDead = true;
			$.removeData(obj);
		}

		init();

	};


	$.fn.horizontalScroll = function(options){
	
		return this.each(function(){
			//create new instance
			if (undefined === $(this).data('horizontalScroll') || '' === $(this).data('horizontalScroll')) {
				 var hs = new $.horizontalScroll(this, options);
				 $(this).data('horizontalScroll', hs);
			}
	
		});
	};


})(window, jQuery);