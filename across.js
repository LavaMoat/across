/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 436:
/***/ ((module) => {

module.exports = {
    SRC_IS_NOT_A_WINDOW: 'provided argument "src" must be a proper window of instance Window',
    DST_IS_NOT_A_WINDOW: 'provided argument "dst" must be a proper window of instance Window',
    SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW: 'provided argument "src" must be a window in the same origin as the current context window',
}

/***/ }),

/***/ 303:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {DST_IS_NOT_A_WINDOW, SRC_IS_NOT_A_WINDOW, SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW} = __webpack_require__(436);

function isWindow(obj, Object) {
    const o = Object(obj);
    return o === o.window;
}

function isCrossOrigin(dst, src, Object) {
    return Object.getPrototypeOf.call(src, dst) === null;
}

module.exports = function(dst, src = window, Object = window.Object) {
    if (!isWindow(src, Object)) {
        throw new Error(SRC_IS_NOT_A_WINDOW);
    }
    if (!isWindow(dst, Object)) {
        throw new Error(DST_IS_NOT_A_WINDOW);
    }
    if (isCrossOrigin(window, src, Object)) {
        throw new Error(SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW);
    }
    return isCrossOrigin(dst, src, Object);
};


/***/ }),

/***/ 842:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(343),
    securely = _require.securely;

var hook = __webpack_require__(827);

var _require2 = __webpack_require__(86),
    getFramesArray = _require2.getFramesArray,
    isFrameElement = _require2.isFrameElement;

function resetOnloadAttribute(win, frame, cb) {
  if (!isFrameElement(frame)) {
    return;
  }

  securely(function () {
    var onload = frame.onloadS;

    if (onload) {
      frame.onloadS = null;
      frame.removeAttributeS('onload');
      frame.addEventListenerS('load', function () {
        hook(win, [this], cb);
      });
      frame.onloadS = onload;
    }
  });
}

function resetOnloadAttributes(win, args, cb) {
  for (var i = 0; i < args.length; i++) {
    var element = args[i];
    var frames = getFramesArray(element, true);

    for (var _i = 0; _i < frames.length; _i++) {
      var frame = frames[_i];
      resetOnloadAttribute(win, frame, cb);
    }
  }
}

module.exports = resetOnloadAttributes;

/***/ }),

/***/ 165:
/***/ ((module) => {

/*

This crazy function is a workaround to support 'object' in this project
in chromium due to a bug that can be reproduced by running:

<script>
    document.body.innerHTML = ('<object id="wow" data="/" />');
    alert(window[0]); // undefined
    wow.contentWindow.frameElement;
    alert(window[0]); // [object Window]
</script>

Seems that in order for the object frame to appear in window.frames,
one must first try to access any property of it.

This for some reason registers it to the window.frames list, otherwise it won't be there.

*/
function workaroundChromiumBug(frame) {
  frame && frame.contentWindow;
}

module.exports = workaroundChromiumBug;

/***/ }),

/***/ 827:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(343),
    securely = _require.securely;

var isCrossOrigin = __webpack_require__(303);

var workaroundChromiumBug = __webpack_require__(165);

function findWin(win, frameElement) {
  var frame = null,
      i = -1;

  while (win[++i]) {
    var cross = securely(function () {
      return isCrossOrigin(win[i], win, win.ObjectS);
    });

    if (!cross) {
      if (win[i].frameElement === frameElement) {
        frame = win[i];
        break;
      }
    }
  }

  return frame;
}

function hook(win, frames, cb) {
  for (var i = 0; i < frames.length; i++) {
    var frame = frames[i];
    workaroundChromiumBug(frame);
    var contentWindow = findWin(win, frame);

    if (contentWindow) {
      cb(contentWindow);
    }
  }
}

module.exports = hook;

/***/ }),

/***/ 168:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(343),
    securely = _require.securely;

var _require2 = __webpack_require__(86),
    getFramesArray = _require2.getFramesArray;

var WARN_OF_ONLOAD_ATTRIBUTES = false; // DEBUG MODE ONLY!

var WARN_OF_ONLOAD_ATTRIBUTES_MSG = 'WARN: Snow: Removing html string iframe onload attribute:';

function dropOnLoadAttributes(frames) {
  var _loop = function _loop(i) {
    var frame = frames[i];

    if (WARN_OF_ONLOAD_ATTRIBUTES) {
      var onload = securely(function () {
        return frame.getAttributeS('onload');
      });

      if (onload) {
        console.warn(WARN_OF_ONLOAD_ATTRIBUTES_MSG, frame, onload);
      }
    }

    securely(function () {
      return frame.removeAttributeS('onload');
    });
  };

  for (var i = 0; i < frames.length; i++) {
    _loop(i);
  }
}

function handleHTML(win, args) {
  var _loop2 = function _loop2(i) {
    var html = args[i];

    if (typeof html !== 'string') {
      return "continue";
    }

    var template = securely(function () {
      return document.createElementS('template');
    });
    securely(function () {
      return template.innerHTMLS = html;
    });
    var frames = getFramesArray(template.content, false);
    dropOnLoadAttributes(frames);
    args[i] = securely(function () {
      return template.innerHTMLS;
    });
  };

  for (var i = 0; i < args.length; i++) {
    var _ret = _loop2(i);

    if (_ret === "continue") continue;
  }
}

module.exports = handleHTML;

/***/ }),

/***/ 854:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(343),
    securely = _require.securely,
    secureNewWin = _require.secureNewWin;

var hook = __webpack_require__(827);

var hookOpen = __webpack_require__(45);

var hookLoadSetters = __webpack_require__(392);

var hookDOMInserters = __webpack_require__(762);

var callback;

module.exports = function onWin(cb) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

  function hookWin(contentWindow) {
    onWin(cb, contentWindow);
    securely(function () {
      contentWindow.frameElement.addEventListenerS('load', function () {
        hook(win, [this], function () {
          onWin(cb, contentWindow);
        });
      });
    });
  }

  callback = callback || cb;

  if (callback !== cb) {
    return;
  }

  secureNewWin(win);
  hookOpen(win, hookWin);
  hookLoadSetters(win, hookWin);
  hookDOMInserters(win, hookWin);
  cb(win, securely);
};

/***/ }),

/***/ 762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var resetOnloadAttributes = __webpack_require__(842);

var _require = __webpack_require__(343),
    securely = _require.securely;

var _require2 = __webpack_require__(86),
    getFramesArray = _require2.getFramesArray,
    getArguments = _require2.getArguments;

var handleHTML = __webpack_require__(168);

var hook = __webpack_require__(827);

var map = {
  Document: ['replaceChildren', 'append', 'prepend', 'write', 'writeln'],
  Node: ['appendChild', 'insertBefore', 'replaceChild'],
  Element: ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'replaceWith', 'insertAdjacentElement', 'append', 'before', 'prepend', 'after', 'replaceChildren']
};

function getHook(win, native, cb) {
  return function () {
    var _this = this;

    var args = getArguments(arguments);
    var element = securely(function () {
      return _this.parentElementS || _this;
    });
    resetOnloadAttributes(win, args, cb);
    handleHTML(win, args);
    var ret = securely(function () {
      return native.applyS(_this, args);
    });
    var frames = getFramesArray(element, false);
    hook(win, frames, cb);
    hook(win, args, cb);
    return ret;
  };
}

function hookDOMInserters(win, cb) {
  var _loop = function _loop(proto) {
    var funcs = map[proto];

    var _loop2 = function _loop2(i) {
      var func = funcs[i];
      securely(function () {
        var desc = ObjectS.getOwnPropertyDescriptor(win[proto].prototype, func);
        var prop = desc.set ? 'set' : 'value';
        desc[prop] = getHook(win, desc[prop], cb);
        ObjectS.defineProperty(win[proto].prototype, func, desc);
      });
    };

    for (var i = 0; i < funcs.length; i++) {
      _loop2(i);
    }
  };

  for (var proto in map) {
    _loop(proto);
  }
}

module.exports = hookDOMInserters;

/***/ }),

/***/ 392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hook = __webpack_require__(827);

var _require = __webpack_require__(343),
    securely = _require.securely;

var _require2 = __webpack_require__(86),
    getArguments = _require2.getArguments;

function callOnload(that, onload, args) {
  if (onload) {
    if (onload.handleEvent) {
      return onload.handleEvent.apply(onload, args);
    } else {
      return onload.apply(that, args);
    }
  }
}

function getHook(win, addEventListener, cb) {
  return function () {
    var _this = this;

    var args = getArguments(arguments);
    var index = typeof args[0] === 'function' ? 0 : 1;
    var onload = args[index];

    args[index] = function listener() {
      hook(win, [this], cb);
      var args = getArguments(arguments);
      callOnload(this, onload, args);
    };

    return securely(function () {
      return _this.addEventListenerS(args[0], args[1], args[2], args[3]);
    });
  };
}

function hookLoadSetters(win, cb) {
  securely(function () {
    return ObjectS.defineProperty(win.EventTarget.prototype, 'addEventListener', {
      value: getHook(win, addEventListener, cb)
    });
  });
}

module.exports = hookLoadSetters;

/***/ }),

/***/ 45:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(86),
    getArguments = _require.getArguments; // https://github.com/weizman/snow/issues/2


var ISSUE_2_SOLVED = false;

function hookOpen(win, cb) {
  var realOpen = win.open;

  win.open = function () {
    if (!ISSUE_2_SOLVED) {
      return null;
    }

    var args = getArguments(arguments);
    var opened = realOpen.apply(this, args);
    cb(opened);
    return opened;
  };
}

module.exports = hookOpen;

/***/ }),

/***/ 343:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var secure = __webpack_require__(983);

var wins = [top];
var config = {
  objects: {
    'document': ['createElement'],
    'Object': ['defineProperty', 'getOwnPropertyDescriptor']
  },
  prototypes: {
    'Attr': ['localName', 'name', 'nodeName'],
    'String': ['toLowerCase'],
    'Function': ['apply', 'call', 'bind'],
    'Map': ['get', 'set'],
    'Node': ['nodeType', 'parentElement', 'toString'],
    'Document': ['querySelectorAll'],
    'DocumentFragment': ['querySelectorAll', 'toString'],
    'Object': ['toString'],
    'Array': ['includes', 'push', 'slice'],
    'Element': ['innerHTML', 'toString', 'querySelectorAll', 'getAttribute', 'removeAttribute', 'tagName'],
    'HTMLElement': ['onload', 'toString'],
    'HTMLScriptElement': ['src'],
    'EventTarget': ['addEventListener']
  }
};
var securely = secure(top, config);

function secureNewWin(win) {
  securely(function () {
    if (!wins.includesS(win)) {
      wins.pushS(win);
      secure(win, config);
    }
  });
}

module.exports = {
  securely: securely,
  secureNewWin: secureNewWin
};

/***/ }),

/***/ 86:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _require = __webpack_require__(343),
    securely = _require.securely;

function getArguments(oldArgs) {
  var args = [];

  for (var i = 0; i < oldArgs.length; i++) {
    args[i] = oldArgs[i];
  }

  return args;
}

function isTrustedHTML(node) {
  return securely(function () {
    return node.toStringS();
  }) === '[object TrustedHTML]';
}

function getPrototype(node) {
  switch (securely(function () {
    return node.toStringS();
  })) {
    case '[object HTMLDocument]':
      return securely(function () {
        return window.Document;
      });

    case '[object DocumentFragment]':
      return securely(function () {
        return window.DocumentFragment;
      });

    default:
      return securely(function () {
        return window.Element;
      });
  }
}

function isFrameElement(element) {
  return securely(function () {
    return ['[object HTMLIFrameElement]', '[object HTMLFrameElement]', '[object HTMLObjectElement]', '[object HTMLEmbedElement]'].includesS(element.toStringS());
  });
}

function canNodeRunQuerySelector(node) {
  return securely(function () {
    return [ElementS.prototype.ELEMENT_NODE, ElementS.prototype.DOCUMENT_FRAGMENT_NODE, ElementS.prototype.DOCUMENT_NODE].includesS(node.nodeTypeS);
  });
}

function getFramesArray(element, includingParent) {
  var frames = [];

  if (null === element || _typeof(element) !== 'object') {
    return frames;
  }

  if (isTrustedHTML(element) || !canNodeRunQuerySelector(element)) {
    return frames;
  }

  var list = securely(function () {
    return getPrototype(element).prototype.querySelectorAllS.call(element, 'iframe,frame,object,embed');
  });
  fillArrayUniques(frames, securely(function () {
    return Array.prototype.sliceS.call(list);
  }));

  if (includingParent) {
    fillArrayUniques(frames, [element]);
  }

  return frames;
}

function fillArrayUniques(arr, items) {
  var isArrUpdated = false;

  var _loop = function _loop(i) {
    securely(function () {
      if (!arr.includesS(items[i])) {
        arr.pushS(items[i]);
        isArrUpdated = true;
      }
    });
  };

  for (var i = 0; i < items.length; i++) {
    _loop(i);
  }

  return isArrUpdated;
}

module.exports = {
  getArguments: getArguments,
  getFramesArray: getFramesArray,
  isFrameElement: isFrameElement
};

/***/ }),

/***/ 983:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var objects = __webpack_require__(586);

var prototypes = __webpack_require__(587);

var specifics = __webpack_require__(172);

var allowNativesAccess = false;

function shouldAllowNativesAccess() {
  return allowNativesAccess;
}

function natively(win, cb) {
  var ifr = win.document.createElement('iframe');
  win.document.head.appendChild(ifr);
  cb(ifr.contentWindow);
  ifr.parentElement.removeChild(ifr);
}

function securely(cb, a, b, c, d, e, f, g, h, i, j) {
  var state = allowNativesAccess;
  allowNativesAccess = true;
  var ret, err;

  try {
    ret = cb(a, b, c, d, e, f, g, h, i, j);
  } catch (e) {
    err = e;
  }

  if (!state) {
    allowNativesAccess = false;
  }

  if (err) {
    throw err;
  }

  return ret;
}

function secure(win) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    objects: {},
    prototypes: {}
  };
  natively(win, function (nativeWin) {
    securely(function () {
      objects(win, nativeWin, shouldAllowNativesAccess, config.objects || {});
      prototypes(win, nativeWin, shouldAllowNativesAccess, config.prototypes || {});
      specifics(win, nativeWin, shouldAllowNativesAccess);
    });
  });
  return securely;
}

module.exports = secure;

/***/ }),

/***/ 586:
/***/ ((module) => {

module.exports = function objects(win, nativeWin, shouldAllowNativesAccess, objects) {
  for (var object in objects) {
    var apis = objects[object];

    var _loop = function _loop(i) {
      var api = apis[i];
      var native = nativeWin[object][api];

      if (typeof native === 'function') {
        native = native.bind(nativeWin[object]);
      }

      nativeWin['Object'].defineProperty(win[object], api + 'S', {
        configurable: false,
        get: function get() {
          if (!shouldAllowNativesAccess()) {
            return;
          }

          return native;
        }
      });
    };

    for (var i = 0; i < apis.length; i++) {
      _loop(i);
    }
  }
};

/***/ }),

/***/ 587:
/***/ ((module) => {

function zzz(func, shouldAllowNativesAccess) {
  return function (a, b, c, d, e) {
    if (!shouldAllowNativesAccess()) {
      return;
    }

    return func(this, a, b, c, d, e);
  };
}

function xxx(nativeWin, desc, shouldAllowNativesAccess) {
  var value = desc.value;

  var set = desc.set || function () {};

  var get = desc.get || function () {
    return value;
  };

  desc.configurable = false;
  delete desc.value;
  delete desc.writable;
  var getter = nativeWin['Function'].prototype.call.bind(get);
  var setter = nativeWin['Function'].prototype.call.bind(set);
  desc.get = zzz(getter, shouldAllowNativesAccess);
  desc.set = zzz(setter, shouldAllowNativesAccess);
  return desc;
}

function yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
  var proto = win[prototype];
  var arr = [];

  while (true) {
    var _desc = nativeWin['Object'].getOwnPropertyDescriptor(proto.prototype, property);

    nativeWin['Array'].prototype.push.call(arr, proto.prototype);

    if (_desc) {
      break;
    }

    proto = nativeWin['Object'].getPrototypeOf(proto.prototype).constructor;
  }

  var desc = nativeWin['Object'].getOwnPropertyDescriptor(arr[arr.length - 1], property);

  while (arr.length) {
    var _proto = nativeWin['Array'].prototype.pop.call(arr);

    if (!done[_proto.constructor.name] || !nativeWin['Array'].prototype.includes.call(done[_proto.constructor.name], property)) {
      nativeWin['Object'].defineProperty(_proto, property + 'S', xxx(nativeWin, desc, shouldAllowNativesAccess));
      done[_proto.constructor.name] = done[_proto.constructor.name] || [];
      nativeWin['Array'].prototype.push.call(done[_proto.constructor.name], property);
    }
  }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
  var done = new nativeWin.Object();

  var _loop = function _loop(prototype) {
    var native = nativeWin[prototype];
    nativeWin['Object'].defineProperty(win, prototype + 'S', {
      configurable: false,
      get: function get() {
        if (!shouldAllowNativesAccess()) {
          return;
        }

        return native;
      }
    });
    done[prototype] = done[prototype] || [];
    var properties = prototypes[prototype];

    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property);
      yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype + 'S', property);
    }
  };

  for (var prototype in prototypes) {
    _loop(prototype);
  }
};

/***/ }),

/***/ 172:
/***/ ((module) => {

module.exports = function specifics(win, nativeWin, shouldAllowNativesAccess) {
  var getDocumentCurrentScript = nativeWin['Object'].getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get.bind(win.document);
  nativeWin['Object'].defineProperty(win.document, 'currentScript' + 'S', {
    configurable: false,
    get: function get() {
      if (!shouldAllowNativesAccess()) {
        return;
      }

      return getDocumentCurrentScript();
    }
  });
};

/***/ }),

/***/ 352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var glaze = __webpack_require__(854);

var protect = __webpack_require__(944);

var securely;
var scripts = [];
var scriptCB = {};

function onmessage(cb) {
  return securely(function () {
    var script = document.currentScriptS;

    if (!script || scripts.includesS(script)) {
      return function () {};
    }

    var src = script.srcS;

    if (!src) {
      return function () {};
    }

    if (!scriptCB[src]) {
      scriptCB[src] = cb;
    }

    return function postMessage(dst, msg) {
      var cb = scriptCB[dst];
      return cb && cb(src, msg);
    };
  });
}

module.exports = function init() {
  Object.defineProperty(document, 'onmessage', {
    value: onmessage
  });
  glaze(function (win, securelyAPI) {
    securely = securely || securelyAPI;
    securely(function () {
      return protect(win, securely, function (s) {
        return securely(function () {
          return scripts.pushS(s);
        });
      });
    });
  });
};

/***/ }),

/***/ 944:
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function isStringScript(str) {
  return typeof str === 'string' && str.toLowerCaseS() === 'script';
}

function isSrcProp(prop) {
  return typeof prop === 'string' && prop.toLowerCaseS() === 'src';
}

function isScript(script) {
  return isStringScript(script.tagNameS);
}

function isScriptSrc(prop, script) {
  return isSrcProp(prop) && isScript(script);
}

function isAttrNodeSrc(attr) {
  return _typeof(attr) === 'object' && (attr.localNameS.toLowerCaseS() === 'src' || attr.nameS.toLowerCaseS() === 'src' || attr.nodeNameS.toLowerCaseS() === 'src');
}

function hook(win, securely, prototype, property, cb) {
  var desc = securely(function () {
    return win.ObjectS.getOwnPropertyDescriptor(prototype, property);
  });
  var type = desc.set ? 'set' : 'value';
  var value = desc[type];

  desc[type] = function (a, b, c) {
    var that = this;
    var block = securely(function () {
      return !!document.currentScriptS && cb.call(that, a, b, c);
    });

    if (!block) {
      return value.call(this, a, b, c);
    }
  };

  securely(function () {
    return win.ObjectS.defineProperty(prototype, property, desc);
  });
}

function hookCreateElement(win, securely) {
  var createElement = win.document.createElement;

  win.document.createElement = function (localName, options, src) {
    var element = createElement.call(win.document, localName, options, src);
    securely(function () {
      if (isStringScript(localName)) {
        if (typeof options === 'string') {
          element.srcS = options;
        }

        if (typeof src === 'string') {
          element.srcS = src;
        }
      }
    });
    return element;
  };
}

module.exports = function protect(win, securely, cb) {
  function setAttributeHook(prop1, prop2) {
    if (isScriptSrc(prop1, this) || isScriptSrc(prop2, this)) {
      cb(this);
    }

    return false;
  }

  function setAttributeNodeHook(node) {
    if (isScriptSrc(node.name, this)) {
      cb(this);
    }

    return false;
  }

  function setSrcHook() {
    cb(this);
    return false;
  }

  function setAttrNodeValueHook(value) {
    return isAttrNodeSrc(this);
  }

  function setNamedItemHook(attr1, attr2) {
    return isAttrNodeSrc(attr1) || isAttrNodeSrc(attr2);
  }

  hook(win, securely, win.Element.prototype, 'setAttribute', setAttributeHook);
  hook(win, securely, win.Element.prototype, 'setAttributeNS', setAttributeHook);
  hook(win, securely, win.Element.prototype, 'setAttributeNode', setAttributeNodeHook);
  hook(win, securely, win.Element.prototype, 'setAttributeNodeNS', setAttributeNodeHook);
  hook(win, securely, win.HTMLScriptElement.prototype, 'src', setSrcHook);
  hook(win, securely, win.Attr.prototype, 'value', setAttrNodeValueHook);
  hook(win, securely, win.NamedNodeMap.prototype, 'setNamedItem', setNamedItemHook);
  hook(win, securely, win.NamedNodeMap.prototype, 'setNamedItemNS', setNamedItemHook);
  hookCreateElement(win, securely);
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(352);
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_index__WEBPACK_IMPORTED_MODULE_0__);


(function (win) {
  Object.defineProperty(win, 'ACROSS', {
    value: (_src_index__WEBPACK_IMPORTED_MODULE_0___default())
  });
})(window);
})();

/******/ })()
;