function bypass() {
    document.head.setAttributeNS('http://www.mozilla.org/ns/specialspace', 'src', getSrc('legit'));
    const n = document.head.getAttributeNodeNS('http://www.mozilla.org/ns/specialspace', 'src').cloneNode()
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