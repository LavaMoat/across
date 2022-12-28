function natively(win, cb) {
    const ifr = win.document.createElement('iframe');
    const parent = win.document.head || win.document.documentElement;
    parent.appendChild(ifr);
    const ret = cb(ifr.contentWindow);
    ifr.parentElement.removeChild(ifr);
    return ret;
}

function natives(win) {
    return natively(win, function(win) {
        const {
            Object,
            Array,
            Element,
            Attr,
            Node,
            HTMLScriptElement,
        } = win;
        const bag = {
            Object,
            Array,
            Element,
            Attr,
            Node,
            HTMLScriptElement,
        };
        bag.document = {
            currentScript: {
                get: Object.getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get,
            },
        };
        return bag;
    });
}

function setup(win) {
    const bag = natives(win);

    const {
        Object,
        Array,
        Element,
        Attr,
        Node,
        HTMLScriptElement,
    } = bag;

    Object.assign(bag, {
        scriptSrcGet: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').get,
        scriptSrcSet: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set,
        push: Object.getOwnPropertyDescriptor(Array.prototype, 'push').value,
        includes: Object.getOwnPropertyDescriptor(Array.prototype, 'includes').value,
    });

    return {
        Object,
        Array,
        Element,
        Attr,
        Node,
        stringToLowerCase,
        getDocumentCurrentScript,
        setScriptSrc,
        getScriptSrc,
        push,
        includes,
    };

    function push(arr, item) {
        return bag.push.call(arr, item);
    }

    function includes(arr, item) {
        return bag.includes.call(arr, item);
    }

    function stringToLowerCase(string) {
        return bag.String.prototype.toLowerCase.call(string);
    }

    function getDocumentCurrentScript(doc) {
        return bag.document.currentScript.get.call(doc);
    }

    function getScriptSrc(script) {
        return bag.scriptSrcGet.call(script);
    }

    function setScriptSrc(script, src) {
        return bag.scriptSrcSet.call(script, src);
    }
}

module.exports = setup(top);
