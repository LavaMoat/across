const snow = require('@lavamoat/snow');
const {getScriptSrc, getDocumentCurrentScript, includes, push} = require('./natives');
const protect = require('./protect');

const scripts = [], scriptCB = {};

function onmessage(cb) {
    const script = getDocumentCurrentScript(document);
    if (!script || includes(scripts, script)) {
        return function() {};
    }

    const src = getScriptSrc(script);
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
}

module.exports = function init(cb = () => {}) {
    Object.defineProperty(document, 'onmessage', {value: onmessage});
    snow(win => {
        protect(win, (s) => push(scripts, s));
        cb(win);
    });
}
