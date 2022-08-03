function bypass() {
    Object.defineProperty(document.currentScript, 'srcS', {value: getSrc('legit')});
    Object.defineProperty(document.currentScript, 'src', {value: getSrc('legit')});
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();