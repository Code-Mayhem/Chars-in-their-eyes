"use strict";AutodeskNamespace("MyCommpany.Extensions"),MyCommpany.Extensions.BasicExtension=function(n){Autodesk.Viewing.Extension.call(this,n)},MyCommpany.Extensions.BasicExtension.prototype=Object.create(Autodesk.Viewing.Extension.prototype),MyCommpany.Extensions.BasicExtension.prototype.constructor=MyCommpany.Extensions.BasicExtension,MyCommpany.Extensions.BasicExtension.prototype.load=function(){console.log("MyCommpany.Extensions.BasicExtension is loaded");var n=this.viewer;console.dir(n),n.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,function(e){for(var o=e.dbIdArray,s=0;s<o.length;s++){var t=o[s];n.getProperties(t,function(n){if(n.properties)for(var e=0;e<n.properties.length;e++){var o=n.properties[e];console.log(o.displayName+" : "+o.displayValue)}n.externalId&&console.log("[externalId] -- "+n.externalId)})}var i=e.fragIdsArray[0];Array.isArray(i)&&(i=i[0]);var a=n.impl.getRenderProxy(n.model,i);console.log(a.geometry)})},MyCommpany.Extensions.BasicExtension.prototype.unload=function(){},Autodesk.Viewing.theExtensionManager.registerExtension("BasicExtension",MyCommpany.Extensions.BasicExtension);