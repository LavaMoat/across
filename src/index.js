const glaze = require('../../glazier/src/index');
const protect = require('./protect');

let securely;
const scripts = [];
const scriptCB = {};

function onmessage(cb) {
    return securely(() => {
        const script = document.currentScriptS;
        if (!script || scripts.includesS(script)) {
            return function() {};
        }

        const src = script.srcS;
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

module.exports = function init() {
    Object.defineProperty(document, 'onmessage', {value: onmessage});
    glaze((win, securelyAPI) => {
        securely = securely || securelyAPI;
        securely(() => protect(win, securely, (s) => securely(() => scripts.pushS(s))));
    });
}
