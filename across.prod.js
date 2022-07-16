(()=>{var t={436:t=>{t.exports={SRC_IS_NOT_A_WINDOW:'provided argument "src" must be a proper window of instance Window',DST_IS_NOT_A_WINDOW:'provided argument "dst" must be a proper window of instance Window',SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW:'provided argument "src" must be a window in the same origin as the current context window'}},303:(t,e,n)=>{const{DST_IS_NOT_A_WINDOW:r,SRC_IS_NOT_A_WINDOW:o,SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW:u}=n(436);function c(t,e){const n=e(t);return n===n.window}function i(t,e,n){return null===n.getPrototypeOf.call(e,t)}t.exports=function(t,e=window,n=window.Object){if(!c(e,n))throw new Error(o);if(!c(t,n))throw new Error(r);if(i(window,e,n))throw new Error(u);return i(t,e,n)}},842:(t,e,n)=>{var r=n(343).securely,o=n(827),u=n(86),c=u.getFramesArray,i=u.isFrameElement;function a(t,e,n){i(e)&&r((function(){var r=e.onloadS;r&&(e.onloadS=null,e.removeAttributeS("onload"),e.addEventListenerS("load",(function(){o(t,[this],n)})),e.onloadS=r)}))}t.exports=function(t,e,n){for(var r=0;r<e.length;r++)for(var o=e[r],u=c(o,!0),i=0;i<u.length;i++)a(t,u[i],n)}},165:t=>{t.exports=function(t){t&&t.contentWindow}},827:(t,e,n)=>{var r=n(343).securely,o=n(303),u=n(165);function c(t,e){for(var n=null,u=-1;t[++u];)if(!r((function(){return o(t[u],t,t.ObjectS)}))&&t[u].frameElement===e){n=t[u];break}return n}t.exports=function(t,e,n){for(var r=0;r<e.length;r++){var o=e[r];u(o);var i=c(t,o);i&&n(i)}}},168:(t,e,n)=>{var r=n(343).securely,o=n(86).getFramesArray;t.exports=function(t,e){for(var n=function(t){var n=e[t];if("string"!=typeof n)return"continue";var u=r((function(){return document.createElementS("template")}));r((function(){return u.innerHTMLS=n})),function(t){for(var e=function(e){var n=t[e];r((function(){return n.removeAttributeS("onload")}))},n=0;n<t.length;n++)e(n)}(o(u.content,!1)),e[t]=r((function(){return u.innerHTMLS}))},u=0;u<e.length;u++)n(u)}},854:(t,e,n)=>{var r,o=n(343),u=o.securely,c=o.secureNewWin,i=n(827),a=n(45),f=n(392),p=n(762);t.exports=function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window;function o(r){t(e,r),u((function(){r.frameElement.addEventListenerS("load",(function(){i(n,[this],(function(){t(e,r)}))}))}))}(r=r||e)===e&&(c(n),a(n,o),f(n,o),p(n,o),e(n,u))}},762:(t,e,n)=>{var r=n(842),o=n(343).securely,u=n(86),c=u.getFramesArray,i=u.getArguments,a=n(168),f=n(827),p={Document:["replaceChildren","append","prepend","write","writeln"],Node:["appendChild","insertBefore","replaceChild"],Element:["innerHTML","outerHTML","insertAdjacentHTML","replaceWith","insertAdjacentElement","append","before","prepend","after","replaceChildren"]};t.exports=function(t,e){var n=function(n){for(var u=p[n],l=function(p){var l=u[p];o((function(){var u=ObjectS.getOwnPropertyDescriptor(t[n].prototype,l),p=u.set?"set":"value";u[p]=function(t,e,n){return function(){var u=this,p=i(arguments),l=o((function(){return u.parentElementS||u}));r(t,p,n),a(t,p);var s=o((function(){return e.applyS(u,p)})),d=c(l,!1);return f(t,d,n),f(t,p,n),s}}(t,u[p],e),ObjectS.defineProperty(t[n].prototype,l,u)}))},s=0;s<u.length;s++)l(s)};for(var u in p)n(u)}},392:(t,e,n)=>{var r=n(827),o=n(343).securely,u=n(86).getArguments;function c(t,e,n){if(e)return e.handleEvent?e.handleEvent.apply(e,n):e.apply(t,n)}function i(t,e,n){return function(){var e=this,i=u(arguments),a="function"==typeof i[0]?0:1,f=i[a];return i[a]=function(){r(t,[this],n);var e=u(arguments);c(this,f,e)},o((function(){return e.addEventListenerS(i[0],i[1],i[2],i[3])}))}}t.exports=function(t,e){o((function(){return ObjectS.defineProperty(t.EventTarget.prototype,"addEventListener",{value:i(t,addEventListener,e)})}))}},45:(t,e,n)=>{n(86).getArguments,t.exports=function(t,e){t.open,t.open=function(){return null}}},343:(t,e,n)=>{var r=n(983),o=[top],u={objects:{document:["createElement"],Object:["defineProperty","getOwnPropertyDescriptor"]},prototypes:{Attr:["localName","name","nodeName"],String:["toLowerCase"],Function:["apply","call","bind"],Map:["get","set"],Node:["nodeType","parentElement","toString"],Document:["querySelectorAll"],DocumentFragment:["querySelectorAll","toString"],Object:["toString"],Array:["includes","push","slice"],Element:["innerHTML","toString","querySelectorAll","getAttribute","removeAttribute","tagName"],HTMLElement:["onload","toString"],HTMLScriptElement:["src"],EventTarget:["addEventListener"]}},c=r(top,u);t.exports={securely:c,secureNewWin:function(t){c((function(){o.includesS(t)||(o.pushS(t),r(t,u))}))}}},86:(t,e,n)=>{function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}var o=n(343).securely;function u(t,e){for(var n=!1,r=function(r){o((function(){t.includesS(e[r])||(t.pushS(e[r]),n=!0)}))},u=0;u<e.length;u++)r(u);return n}t.exports={getArguments:function(t){for(var e=[],n=0;n<t.length;n++)e[n]=t[n];return e},getFramesArray:function(t,e){var n,c=[];if(null===t||"object"!==r(t))return c;if(n=t,"[object TrustedHTML]"===o((function(){return n.toStringS()}))||!function(t){return o((function(){return[ElementS.prototype.ELEMENT_NODE,ElementS.prototype.DOCUMENT_FRAGMENT_NODE,ElementS.prototype.DOCUMENT_NODE].includesS(t.nodeTypeS)}))}(t))return c;var i=o((function(){return function(t){switch(o((function(){return t.toStringS()}))){case"[object HTMLDocument]":return o((function(){return window.Document}));case"[object DocumentFragment]":return o((function(){return window.DocumentFragment}));default:return o((function(){return window.Element}))}}(t).prototype.querySelectorAllS.call(t,"iframe,frame,object,embed")}));return u(c,o((function(){return Array.prototype.sliceS.call(i)}))),e&&u(c,[t]),c},isFrameElement:function(t){return o((function(){return["[object HTMLIFrameElement]","[object HTMLFrameElement]","[object HTMLObjectElement]","[object HTMLEmbedElement]"].includesS(t.toStringS())}))}}},983:(t,e,n)=>{var r=n(586),o=n(587),u=n(172),c=!1;function i(){return c}function a(t,e){var n=t.document.createElement("iframe");t.document.head.appendChild(n),e(n.contentWindow),n.parentElement.removeChild(n)}function f(t,e,n,r,o,u,i,a,f,p,l){var s,d,m=c;c=!0;try{s=t(e,n,r,o,u,i,a,f,p,l)}catch(u){d=u}if(m||(c=!1),d)throw d;return s}t.exports=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{objects:{},prototypes:{}};return a(t,(function(n){f((function(){r(t,n,i,e.objects||{}),o(t,n,i,e.prototypes||{}),u(t,n,i)}))})),f}},586:t=>{t.exports=function(t,e,n,r){for(var o in r)for(var u=r[o],c=function(r){var c=u[r],i=e[o][c];"function"==typeof i&&(i=i.bind(e[o])),e.Object.defineProperty(t[o],c+"S",{configurable:!1,get:function(){if(n())return i}})},i=0;i<u.length;i++)c(i)}},587:t=>{function e(t,e){return function(n,r,o,u,c){if(e())return t(this,n,r,o,u,c)}}function n(t,n,r){var o=n.value,u=n.set||function(){},c=n.get||function(){return o};n.configurable=!1,delete n.value,delete n.writable;var i=t.Function.prototype.call.bind(c),a=t.Function.prototype.call.bind(u);return n.get=e(i,r),n.set=e(a,r),n}function r(t,e,r,o,u,c){for(var i=t[u],a=[];;){var f=e.Object.getOwnPropertyDescriptor(i.prototype,c);if(e.Array.prototype.push.call(a,i.prototype),f)break;i=e.Object.getPrototypeOf(i.prototype).constructor}for(var p=e.Object.getOwnPropertyDescriptor(a[a.length-1],c);a.length;){var l=e.Array.prototype.pop.call(a);r[l.constructor.name]&&e.Array.prototype.includes.call(r[l.constructor.name],c)||(e.Object.defineProperty(l,c+"S",n(e,p,o)),r[l.constructor.name]=r[l.constructor.name]||[],e.Array.prototype.push.call(r[l.constructor.name],c))}}t.exports=function(t,e,n,o){var u=new e.Object,c=function(c){var i=e[c];e.Object.defineProperty(t,c+"S",{configurable:!1,get:function(){if(n())return i}}),u[c]=u[c]||[];for(var a=o[c],f=0;f<a.length;f++){var p=a[f];r(t,e,u,n,c,p),r(t,e,u,n,c+"S",p)}};for(var i in o)c(i)}},172:t=>{t.exports=function(t,e,n){var r=e.Object.getOwnPropertyDescriptor(t.Document.prototype,"currentScript").get.bind(t.document);e.Object.defineProperty(t.document,"currentScriptS",{configurable:!1,get:function(){if(n())return r()}})}},352:(t,e,n)=>{var r,o=n(854),u=n(944),c=[],i={};function a(t){return r((function(){var e=document.currentScriptS;if(!e||c.includesS(e))return function(){};var n=e.srcS;return n?(i[n]||(i[n]=t),function(t,e){var r=i[t];return!!r&&(r(n,e),!0)}):function(){}}))}t.exports=function(){Object.defineProperty(document,"onmessage",{value:a}),o((function(t,e){(r=r||e)((function(){return u(t,r,(function(t){return r((function(){return c.pushS(t)}))}))}))}))}},944:t=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function n(t){return"string"==typeof t&&"script"===t.toLowerCaseS()}function r(t,e){return function(t){return"string"==typeof t&&"src"===t.toLowerCaseS()}(t)&&function(t){return n(t.tagNameS)}(e)}function o(t){return"object"===e(t)&&("src"===t.localNameS.toLowerCaseS()||"src"===t.nameS.toLowerCaseS()||"src"===t.nodeNameS.toLowerCaseS())}function u(t,e,n,r,o){var u=e((function(){return t.ObjectS.getOwnPropertyDescriptor(n,r)})),c=u.set?"set":"value",i=u[c];u[c]=function(t,n,r){var u=this;if(!e((function(){return!!document.currentScriptS&&o.call(u,t,n,r)})))return i.call(this,t,n,r)},e((function(){return t.ObjectS.defineProperty(n,r,u)}))}t.exports=function(t,e,c){function i(t,e){return(r(t,this)||r(e,this))&&c(this),!1}function a(t){return r(t.name,this)&&c(this),!1}function f(t,e){return o(t)||o(e)}u(t,e,t.Element.prototype,"setAttribute",i),u(t,e,t.Element.prototype,"setAttributeNS",i),u(t,e,t.Element.prototype,"setAttributeNode",a),u(t,e,t.Element.prototype,"setAttributeNodeNS",a),u(t,e,t.HTMLScriptElement.prototype,"src",(function(){return c(this),!1})),u(t,e,t.Attr.prototype,"value",(function(t){return o(this)})),u(t,e,t.NamedNodeMap.prototype,"setNamedItem",f),u(t,e,t.NamedNodeMap.prototype,"setNamedItemNS",f),function(t,e){var r=t.document.createElement;t.document.createElement=function(o,u,c){var i=r.call(t.document,o,u,c);return e((function(){n(o)&&("string"==typeof u&&(i.srcS=u),"string"==typeof c&&(i.srcS=c))})),i}}(t,e)}}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var u=e[r]={exports:{}};return t[r](u,u.exports,n),u.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";var t,e=n(352),r=n.n(e);t=window,Object.defineProperty(t,"ACROSS",{value:r()})})()})();