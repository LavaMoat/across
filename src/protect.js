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
    return typeof attr === 'object' && (
        getAttrName.call(attr).toLowerCaseS() === 'src' ||
        getNodeName.call(attr).toLowerCaseS() === 'src' ||
        getAttrLocalName.call(attr).toLowerCaseS() === 'src'
    );
}

function hook(win, securely, prototype, property, cb) {
    const desc = win.ObjectS.getOwnPropertyDescriptor(prototype, property);
    const type = desc.set ? 'set' : 'value';
    const value = desc[type];
    desc[type] = function(a, b, c) {
        const that = this;
        const block = securely(() => !!document.currentScriptS && cb.call(that, a, b, c));
        if (!block) {
            return value.call(this, a, b, c);
        }
    }
    win.ObjectS.defineProperty(prototype, property, desc);
}

function hookCreateElement(win, securely) {
    const createElement = win.document.createElement;
    win.document.createElement = function(localName, options, src) {
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
    }
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
}