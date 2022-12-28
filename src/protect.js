const {Object, Attr, Element, Node, getDocumentCurrentScript, stringToLowerCase, setScriptSrc} = require('./natives')

function isStringScript(str) {
    return typeof str === 'string' && stringToLowerCase(str) === 'script';
}

function isSrcProp(prop) {
    return typeof prop === 'string' && stringToLowerCase(prop) === 'src';
}

function isScript(script) {
    return isStringScript(getTagName.call(script));
}

function isScriptSrc(prop, script) {
    return isSrcProp(prop) && isScript(script);
}

function isAttrNodeSrc(attr) {
    return typeof attr === 'object' && (
        stringToLowerCase(getAttrName.call(attr)) === 'src' ||
        stringToLowerCase(getNodeName.call(attr)) === 'src' ||
        stringToLowerCase(getAttrLocalName.call(attr)) === 'src'
    );
}

function hook(win, prototype, property, cb) {
    const desc = Object.getOwnPropertyDescriptor(prototype, property);
    const type = desc.set ? 'set' : 'value';
    const value = desc[type];
    desc[type] = function(a, b, c) {
        const that = this;
        const block = getDocumentCurrentScript(document) && cb.call(that, a, b, c);
        if (!block) {
            return value.call(this, a, b, c);
        }
    }
    Object.defineProperty(prototype, property, desc);
}

function hookCreateElement(win) {
    const createElement = win.document.createElement;
    win.document.createElement = function(localName, options, src) {
        const element = createElement.call(win.document, localName, options, src);
        if (isStringScript(localName)) {
            if (typeof options === 'string') {
                setScriptSrc(element, options);
            }
            if (typeof src === 'string') {
                setScriptSrc(element, src);
            }
        }
        return element;
    }
}

let getTagName, getAttrName, getAttrLocalName, getNodeName;

module.exports = function protect(win, cb) {
    getAttrName = getAttrName || Object.getOwnPropertyDescriptor(Attr.prototype, 'name').get;
    getAttrLocalName = getAttrLocalName || Object.getOwnPropertyDescriptor(Attr.prototype, 'localName').get;
    getNodeName = getNodeName || Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName').get;
    getTagName = getTagName || Object.getOwnPropertyDescriptor(Element.prototype, 'tagName').get;

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

    hook(win, win.Element.prototype, 'setAttribute', setAttributeHook);
    hook(win, win.Element.prototype, 'setAttributeNS', setAttributeHook);
    hook(win, win.Element.prototype, 'setAttributeNode', setAttributeNodeHook);
    hook(win, win.Element.prototype, 'setAttributeNodeNS', setAttributeNodeHook);
    hook(win, win.HTMLScriptElement.prototype, 'src', setSrcHook);
    hook(win, win.Attr.prototype, 'value', setAttrNodeValueHook);
    hook(win, win.NamedNodeMap.prototype, 'setNamedItem', setNamedItemHook);
    hook(win, win.NamedNodeMap.prototype, 'setNamedItemNS', setNamedItemHook);

    hookCreateElement(win);
}