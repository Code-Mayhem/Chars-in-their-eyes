!function(n,e,d){"use strict";e.code=e.code||{};e.code.renderView=function(e){function d(){c(),o()}function c(){}function o(){var e=n.connection.smsRenderHub;e.client.addNewSmsRenders=function(n){var e=decodeURI(n),d=JSON.parse(e);r(d)},n.connection.hub.start().done(function(){e.server.sendNewSmsRenders()})}function r(e){var d=n(t).html(),c=Handlebars.compile(d);n(i).append(c(e))}var t="[data-handlebars]",i="[data-render]";d()}}(jQuery,window),$(function(){new code.renderView});