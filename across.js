/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 528:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const objects = __webpack_require__(88);
const prototypes = __webpack_require__(311);
const specifics = __webpack_require__(199);

let allowNativesAccess = false;

function shouldAllowNativesAccess() {
    return allowNativesAccess;
}

function natively(win, cb) {
    const ifr = win.document.createElement('iframe');
    win.document.head.appendChild(ifr);
    cb(ifr.contentWindow);
    ifr.parentElement.removeChild(ifr);
}

function securely(cb, a, b, c, d, e, f, g, h, i, j) {
    const state = allowNativesAccess;

    allowNativesAccess = true;

    let ret, err;
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

function secure(win, config = { objects: {}, prototypes: {}}) {
    natively(win, (nativeWin) => {
        securely(() => {
            objects(win, nativeWin, shouldAllowNativesAccess, config.objects || {});
            prototypes(win, nativeWin, shouldAllowNativesAccess, config.prototypes || {});
            specifics(win, nativeWin, shouldAllowNativesAccess);
        });
    });

    return securely;
}

module.exports = secure;

/***/ }),

/***/ 88:
/***/ ((module) => {

module.exports = function objects(win, nativeWin, shouldAllowNativesAccess, objects) {
    for (const object in objects) {
        const apis = objects[object];
        for (let i = 0; i < apis.length; i++) {
            const api = apis[i];
            let native = nativeWin[object][api];
            if (typeof native === 'function') {
                native = native.bind(win[object]);
            }
            nativeWin['Object'].defineProperty(win[object], api + 'S', {
                configurable: false,
                get: function () {
                    if (!shouldAllowNativesAccess()) {
                        return;
                    }

                    return native;
                },
            });
        }
    }
}

/***/ }),

/***/ 311:
/***/ ((module) => {

function method(func, shouldAllowNativesAccess) {
    return function(a, b, c, d, e) {
        if (!shouldAllowNativesAccess()) {
            return;
        }

        return func(this, a, b, c, d, e);
    };
}

function descriptor(nativeWin, desc, shouldAllowNativesAccess) {
    const value = desc.value;
    const set = desc.set || (() => {});
    const get = desc.get || (() => value);

    desc.configurable = false;

    delete desc.value;
    delete desc.writable;

    const getter = nativeWin['Function'].prototype.call.bind(get);
    const setter = nativeWin['Function'].prototype.call.bind(set);

    desc.get = method(getter, shouldAllowNativesAccess);
    desc.set = method(setter, shouldAllowNativesAccess);

    return desc;
}

function prototype(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
    let proto = win[prototype];
    const arr = [];
    while (true) {
        const desc = nativeWin['Object'].getOwnPropertyDescriptor(proto.prototype, property);
        nativeWin['Array'].prototype.push.call(arr, proto.prototype);
        if (desc) {
            break;
        }
        proto = nativeWin['Object'].getPrototypeOf(proto.prototype).constructor;
    }
    const desc = nativeWin['Object'].getOwnPropertyDescriptor(arr[arr.length - 1], property);
    while (arr.length) {
        const proto = nativeWin['Array'].prototype.pop.call(arr);
        if (!done[proto.constructor.name] || !nativeWin['Array'].prototype.includes.call(done[proto.constructor.name], property)) {
            nativeWin['Object'].defineProperty(proto, property + 'S', descriptor(nativeWin, desc, shouldAllowNativesAccess));
            done[proto.constructor.name] = done[proto.constructor.name] || [];
            nativeWin['Array'].prototype.push.call(done[proto.constructor.name], property);
        }
    }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
    const done = new nativeWin.Object();
    for (const proto in prototypes) {
        const native = nativeWin[proto];
        nativeWin['Object'].defineProperty(win, proto + 'S', {
            configurable: false,
            get: function() {
                if (!shouldAllowNativesAccess()) {
                    return;
                }

                return native;
            }
        });
        done[proto] = done[proto] || [];
        const properties = prototypes[proto];
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            prototype(win, nativeWin, done, shouldAllowNativesAccess, proto, property);
            prototype(win, nativeWin, done, shouldAllowNativesAccess, proto + 'S', property);
        }
    }
}

/***/ }),

/***/ 199:
/***/ ((module) => {

module.exports = function specifics(win, nativeWin, shouldAllowNativesAccess) {
    let getDocumentCurrentScript = nativeWin['Object'].getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get.bind(win.document);
    nativeWin['Object'].defineProperty(win.document, 'currentScript' + 'S', {
        configurable: false,
        get: function() {
            if (!shouldAllowNativesAccess()) {
                return;
            }

            return getDocumentCurrentScript();
        }
    });
}

/***/ }),

/***/ 973:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hook = __webpack_require__(640);
const {getFramesArray, isFrameElement} = __webpack_require__(845);
const {getOnload, setOnload, removeAttribute, addEventListener} = __webpack_require__(882);

function resetOnloadAttribute(win, frame, cb) {
    if (!isFrameElement(frame)) {
        return;
    }

    const onload = getOnload(frame);
    if (onload) {
        setOnload(frame, null);
        removeAttribute(frame, 'onload');
        addEventListener(frame, 'load', function() {
            hook(win, [this], cb);
        });
        setOnload(frame, onload);
    }
}

function resetOnloadAttributes(win, args, cb) {
    for (let i = 0; i < args.length; i++) {
        const element = args[i];
        const frames = getFramesArray(element, true);
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            resetOnloadAttribute(win, frame, cb);
        }
    }
}

module.exports = resetOnloadAttributes;

/***/ }),

/***/ 993:
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

/***/ 640:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {securely} = __webpack_require__(519);
const isCrossOrigin = __webpack_require__(851);
const workaroundChromiumBug = __webpack_require__(993);

function findWin(win, frameElement) {
    let frame = null, i = -1;
    while (win[++i]) {
        const cross = securely(() => isCrossOrigin(win[i], win, win.ObjectS));
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
    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        workaroundChromiumBug(frame);
        const contentWindow = findWin(win, frame);
        if (contentWindow) {
            cb(contentWindow);
        }
    }
}

module.exports = hook;

/***/ }),

/***/ 254:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {securely} = __webpack_require__(519);
const {getFramesArray} = __webpack_require__(845);
const {removeAttribute, getAttribute} = __webpack_require__(882);

const WARN_OF_ONLOAD_ATTRIBUTES = false; // DEBUG MODE ONLY!
const WARN_OF_ONLOAD_ATTRIBUTES_MSG = 'WARN: Snow: Removing html string iframe onload attribute:';

function dropOnLoadAttributes(frames) {
    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (WARN_OF_ONLOAD_ATTRIBUTES) {
            const onload = getAttribute(frame, 'onload');
            if (onload) {
                console.warn(WARN_OF_ONLOAD_ATTRIBUTES_MSG, frame, onload);
            }
        }
        removeAttribute(frame, 'onload');
    }
}

function handleHTML(win, args) {
    for (let i = 0; i < args.length; i++) {
        const html = args[i];
        if (typeof html !== 'string') {
            continue;
        }
        securely(() => {
            const template = document.createElementS('template');
            template.innerHTMLS = html;
            const frames = getFramesArray(template.contentS, false);
            dropOnLoadAttributes(frames);
            args[i] = template.innerHTMLS;
        });
    }
}

module.exports = handleHTML;

/***/ }),

/***/ 604:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {securely, secureNewWin} = __webpack_require__(519);
const hook = __webpack_require__(640);
const hookOpen = __webpack_require__(201);
const hookLoadSetters = __webpack_require__(862);
const hookDOMInserters = __webpack_require__(507);
const {addEventListener} = __webpack_require__(882);

let callback;

module.exports = function onWin(cb, win = window) {
    function hookWin(contentWindow) {
        onWin(cb, contentWindow);
        addEventListener(contentWindow.frameElement, 'load', function() {
            hook(win, [this], function() {
                onWin(cb, contentWindow);
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
}


/***/ }),

/***/ 507:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resetOnloadAttributes = __webpack_require__(973);
const {securely} = __webpack_require__(519);
const {getFramesArray, getArguments} = __webpack_require__(845);
const handleHTML = __webpack_require__(254);
const hook = __webpack_require__(640);

const map = {
    Document: ['replaceChildren', 'append', 'prepend', 'write', 'writeln'],
    Node: ['appendChild', 'insertBefore', 'replaceChild'],
    Element: ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'replaceWith', 'insertAdjacentElement', 'append', 'before', 'prepend', 'after', 'replaceChildren'],
};

function getHook(win, native, cb) {
    return function() {
        const args = getArguments(arguments)
        const element = securely(() => this.parentElementS || this);
        resetOnloadAttributes(win, args, cb);
        handleHTML(win, args);
        const ret = securely(() => FunctionS.prototype.apply).call(native, this, args);
        const frames = getFramesArray(element, false);
        hook(win, frames, cb);
        hook(win, args, cb);
        return ret;
    };
}

function hookDOMInserters(win, cb) {
    for (const proto in map) {
        const funcs = map[proto];
        for (let i = 0; i < funcs.length; i++) {
            const func = funcs[i];
            securely(() => {
                const desc = ObjectS.getOwnPropertyDescriptor(win[proto].prototype, func);
                const prop = desc.set ? 'set' : 'value';
                desc[prop] = getHook(win, desc[prop], cb);
                ObjectS.defineProperty(win[proto].prototype, func, desc);
            });
        }
    }
}

module.exports = hookDOMInserters;

/***/ }),

/***/ 862:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hook = __webpack_require__(640);
const {securely} = __webpack_require__(519);
const {getArguments} = __webpack_require__(845);
const {addEventListener} = __webpack_require__(882);

function callOnload(that, onload, args) {
    if (onload) {
        if (onload.handleEvent) {
            return onload.handleEvent.apply(onload, args);
        }
        else {
            return onload.apply(that, args);
        }
    }
}

function getHook(win, cb) {
    return function(type, listener, options) {
        let onload = listener;
        if (type === 'load') {
            onload = function () {
                hook(win, [this], cb);
                const args = getArguments(arguments);
                callOnload(this, listener, args);
            };
        }
        return addEventListener(this, type, onload, options);
    }
}

function hookLoadSetters(win, cb) {
    securely(() => {
        ObjectS.defineProperty(win.EventTarget.prototype, 'addEventListener', { value: getHook(win, cb) });
    });
}

module.exports = hookLoadSetters;

/***/ }),

/***/ 882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {securely} = __webpack_require__(519);

function nodeType(node) {
    return natives.nodeType.call(node);
}

function toString(object) {
    return natives.toString.call(object);
}

function getOnload(element) {
    return natives.getOnload.call(element);
}

function setOnload(element, onload) {
    return natives.setOnload.call(element, onload);
}

function removeAttribute(element, attribute) {
    return natives.removeAttribute.call(element, attribute);
}

function getAttribute(element) {
    return natives.getAttribute.call(element);
}

function addEventListener(element, event, listener, options) {
    return natives.addEventListener.call(element, event, listener, options);
}

const natives = securely(() => ({
    nodeType: Object.getOwnPropertyDescriptor(NodeS.prototype, 'nodeType').get,
    toString: Object.getOwnPropertyDescriptor(ObjectS.prototype, 'toString').value,
    getOnload: Object.getOwnPropertyDescriptor(HTMLElementS.prototype, 'onload').get,
    setOnload: Object.getOwnPropertyDescriptor(HTMLElementS.prototype, 'onload').set,
    getAttribute: Object.getOwnPropertyDescriptor(ElementS.prototype, 'getAttribute').value,
    removeAttribute: Object.getOwnPropertyDescriptor(ElementS.prototype, 'removeAttribute').value,
    addEventListener: Object.getOwnPropertyDescriptor(EventTargetS.prototype, 'addEventListener').value,
}));

module.exports = {
    nodeType, toString,
    getOnload, setOnload,
    removeAttribute, getAttribute,
    addEventListener,
}

/***/ }),

/***/ 201:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getArguments} = __webpack_require__(845);

// https://github.com/lavamoat/snow/issues/2
const ISSUE_2_SOLVED = false;

function hookOpen(win, cb) {
    const realOpen = win.open;
    win.open = function() {
        if (!ISSUE_2_SOLVED) {
            return null;
        }

        const args = getArguments(arguments);
        const opened = realOpen.apply(this, args);
        cb(opened);
        return opened;
    }
}

module.exports = hookOpen;

/***/ }),

/***/ 519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const secure = __webpack_require__(528);

const wins = [top];

const config = {
    objects: {
        'document': ['createElement'],
        'Object': ['defineProperty', 'getOwnPropertyDescriptor'],
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
        'HTMLTemplateElement': ['content'],
        'EventTarget': ['addEventListener'],
    }
};

const securely = secure(top, config);

function secureNewWin(win) {
    securely(() => {
        if (!wins.includesS(win)) {
            wins.pushS(win);
            secure(win, config);
        }
    });
}

module.exports = {securely, secureNewWin};

/***/ }),

/***/ 845:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {securely} = __webpack_require__(519);
const {toString, nodeType} = __webpack_require__(882);

function getArguments(oldArgs) {
    const args = [];
    for (let i = 0; i < oldArgs.length; i++) {
        args[i] = oldArgs[i];
    }
    return args;
}

function isTrustedHTML(node) {
    return toString(node) === '[object TrustedHTML]';
}

function getPrototype(node) {
    switch (toString(node)) {
        case '[object HTMLDocument]':
            return DocumentS;
        case '[object DocumentFragment]':
            return DocumentFragmentS;
        default:
            return ElementS;
    }
}

function isFrameElement(element) {
    return securely(() => [
        '[object HTMLIFrameElement]',
        '[object HTMLFrameElement]',
        '[object HTMLObjectElement]',
        '[object HTMLEmbedElement]',
    ].includesS(toString(element)));
}

function canNodeRunQuerySelector(node) {
    return securely(() => [
        ElementS.prototype.ELEMENT_NODE,
        ElementS.prototype.DOCUMENT_FRAGMENT_NODE,
        ElementS.prototype.DOCUMENT_NODE,
    ].includesS(nodeType(node)));
}

function getFramesArray(element, includingParent) {
    const frames = [];

    if (null === element || typeof element !== 'object') {
        return frames;
    }

    if (isTrustedHTML(element) || !canNodeRunQuerySelector(element)) {
        return frames;
    }

    const list = securely(() => {
        return getPrototype(element).prototype.querySelectorAll.call(element, 'iframe,frame,object,embed');
    });

    fillArrayUniques(frames, securely(() => ArrayS.prototype.slice.call(list)));
    if (includingParent) {
        fillArrayUniques(frames, [element]);
    }

    return frames;
}

function fillArrayUniques(arr, items) {
    let isArrUpdated = false;

    securely(() => {
        for (let i = 0; i < items.length; i++) {
            if (!arr.includesS(items[i])) {
                arr.pushS(items[i]);
                isArrUpdated = true;
            }

        }
    });

    return isArrUpdated;
}

module.exports = {getArguments, getFramesArray, isFrameElement};

/***/ }),

/***/ 352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const snow = __webpack_require__(604);

const protect = __webpack_require__(944);

let securely;
const scripts = [];
const scriptCB = {};
let getSrc;

function onmessage(cb) {
  return securely(() => {
    getSrc = getSrc || ObjectS.getOwnPropertyDescriptor(HTMLScriptElementS.prototype, 'src').get;
    const script = document.currentScriptS;

    if (!script || scripts.includesS(script)) {
      return function () {};
    }

    const src = getSrc.call(script);

    if (!src) {
      return function () {};
    }

    if (!scriptCB[src]) {
      scriptCB[src] = cb;
    }

    return function postMessage(dst, msg) {
      const cb = scriptCB[dst];
      return cb && cb(src, msg);
    };
  });
}

module.exports = function init() {
  let cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : () => {};
  Object.defineProperty(document, 'onmessage', {
    value: onmessage
  });
  snow((win, securelyAPI) => {
    securely = securely || securelyAPI;
    securely(() => protect(win, securely, s => securely(() => scripts.pushS(s))));
    cb(win);
  });
};

/***/ }),

/***/ 944:
/***/ ((module) => {

function isStringScript(str) {
  return typeof str === 'string' && str.toLowerCaseS() === 'script';
}

function isSrcProp(prop) {
  return typeof prop === 'string' && prop.toLowerCaseS() === 'src';
}

function isScript(script) {
  return isStringScript(getTagName.call(script));
}

function isScriptSrc(prop, script) {
  return isSrcProp(prop) && isScript(script);
}

function isAttrNodeSrc(attr) {
  return typeof attr === 'object' && (getAttrName.call(attr).toLowerCaseS() === 'src' || getNodeName.call(attr).toLowerCaseS() === 'src' || getAttrLocalName.call(attr).toLowerCaseS() === 'src');
}

function hook(win, securely, prototype, property, cb) {
  const desc = win.ObjectS.getOwnPropertyDescriptor(prototype, property);
  const type = desc.set ? 'set' : 'value';
  const value = desc[type];

  desc[type] = function (a, b, c) {
    const that = this;
    const block = securely(() => !!document.currentScriptS && cb.call(that, a, b, c));

    if (!block) {
      return value.call(this, a, b, c);
    }
  };

  win.ObjectS.defineProperty(prototype, property, desc);
}

function hookCreateElement(win, securely) {
  const createElement = win.document.createElement;

  win.document.createElement = function (localName, options, src) {
    const element = createElement.call(win.document, localName, options, src);
    securely(() => {
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

let getTagName, getAttrName, getAttrLocalName, getNodeName;

module.exports = function protect(win, securely, cb) {
  getAttrName = getAttrName || win.ObjectS.getOwnPropertyDescriptor(win.AttrS.prototype, 'name').get;
  getAttrLocalName = getAttrLocalName || win.ObjectS.getOwnPropertyDescriptor(win.AttrS.prototype, 'localName').get;
  getNodeName = getNodeName || win.ObjectS.getOwnPropertyDescriptor(win.Node.prototype, 'nodeName').get;
  getTagName = getTagName || win.ObjectS.getOwnPropertyDescriptor(win.ElementS.prototype, 'tagName').get;

  function setAttributeHook(prop1, prop2) {
    if (isScriptSrc(prop1, this) || isScriptSrc(prop2, this)) {
      cb(this);
    }

    return false;
  }

  function setAttributeNodeHook(node) {
    if (isScriptSrc(getNodeName(node), this)) {
      cb(this);
    }

    return false;
  }

  function setSrcHook() {
    cb(this);
    return false;
  }

  function setAttrNodeValueHook() {
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

/***/ }),

/***/ 626:
/***/ ((module) => {

module.exports = {
    SRC_IS_NOT_A_WINDOW: 'provided argument "src" must be a proper window of instance Window',
    DST_IS_NOT_A_WINDOW: 'provided argument "dst" must be a proper window of instance Window',
    SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW: 'provided argument "src" must be a window in the same origin as the current context window',
}

/***/ }),

/***/ 851:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {DST_IS_NOT_A_WINDOW, SRC_IS_NOT_A_WINDOW, SRC_IS_NOT_SAME_ORIGIN_AS_WINDOW} = __webpack_require__(626);

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