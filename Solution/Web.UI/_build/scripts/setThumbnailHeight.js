!function(t,i,n){"use strict";i.code=i.code||{};i.code.setThumbnailHeight=function(n){function e(){c(),h()}function h(){t(i).on("resize",c)}function c(){t(o).each(function(){var i=t(this).closest(u),n=t(i).height(),e=t(i).width();t(this).width(e),t(this).height(n)})}var o="[data-thumbnail]",u="[data-grid-item]";e()}}(jQuery,window),$(function(){new code.setThumbnailHeight});