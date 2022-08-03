const snow = require('@weizman/snow');
const protect = require('./protect');

const scripts = [], scriptCB = {};

let getSrc;

function onmessage(cb) {
    return securely(() => {
        getSrc = getSrc || ObjectS.getOwnPropertyDescriptor(HTMLScriptElementS.prototype, 'src').get;

        const script = document.currentScriptS;
        if (!script || scripts.includesS(script)) {
            return function() {};
        }

        const src = getSrc.call(script);
        if (!src) {
            return function() {};
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

let securely;

module.exports = function init(cb = () => {}) {
    Object.defineProperty(document, 'onmessage', {value: onmessage});
    snow((win, securelyAPI) => {
        securely = securely || securelyAPI;
        securely(() => protect(win, securely, (s) => securely(() => scripts.pushS(s))));
        cb(win);
    });
}
