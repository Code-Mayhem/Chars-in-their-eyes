!function(e,n,t){"use strict";n.code=n.code||{};var o=n.code.viewer=function(n){function t(){r()}function r(){e(d).on("click",i),e(d).on("click",c)}function i(n){var t=e(n.target);s=t.data(l)}function c(){var n=e("#urn").val();(null==n||""===n)&&(n=s),"urn:"!==n.substr(0,4)&&(n="urn:"+n);var t={document:n,getAccessToken:a,refreshToken:a},r=document.getElementById("viewer");o=new Autodesk.Viewing.Private.GuiViewer3D(r,{extensions:["BasicExtension"]}),Autodesk.Viewing.Initializer(t,function(){o.start(),u(o,t.document)})}function u(e,n){Autodesk.Viewing.Document.load(n,function(n){var t=[];t=Autodesk.Viewing.Document.getSubItemsWithProperties(n.getRootItem(),{type:"geometry",role:"3d"},!0),t.length<0||e.load(n.getViewablePath(t[0]))},function(e){alert("Load Error: "+e)})}function a(){var e=null;e=new XMLHttpRequest,e.open("GET","GetAccessToken.aspx",!1),e.send(null);var n=e.responseText,t=JSON.parse(n);return t.error?void console.log(t.error):t.access_token}var s,d="[data-load-model]",l="loadModel";t()}}(jQuery,window),$(function(){new code.viewer});