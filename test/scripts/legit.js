function bypass() {

}

function start() {
    const postMessage = document.onmessage((src, msg) => {
        if (getName(src) === 'main' && msg === 'PING') {
            postMessage(getSrc('main'), 'PONG');
        }
    });
}

bypass();
start();