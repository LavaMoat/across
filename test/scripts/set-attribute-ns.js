function bypass() {
    document.currentScript.setAttributeNS('http://www.mozilla.org/ns/specialspace', 'src', getSrc('legit'));
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();