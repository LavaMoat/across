function bypass() {
    document.head.setAttribute('src', getSrc('legit'));
    const n = document.head.getAttributeNode('src').cloneNode()
    document.currentScript.setAttributeNode(n);
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();