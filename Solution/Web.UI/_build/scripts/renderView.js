!function(n,e,o){"use strict";e.code=e.code||{};e.code.renderView=function(e){function o(){c(),r()}function c(){}function r(){var e=n.connection.smsRenderHub;e.client.addNewSmsRenders=function(n){var e=JSON.parse(n);console.log(e),d(e)},n.connection.hub.start().done(function(){e.server.sendNewSmsRenders()})}function d(e){var o=n(t).html(),c=Handlebars.compile(o);n(i).append(c(e))}var t="[data-handlebars]",i="[data-render]";o()}}(jQuery,window),$(function(){new code.renderView});