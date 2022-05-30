function bypass() {
    document.head.setAttributeNS('http://www.mozilla.org/ns/specialspace', 'src', getSrc('legit'));
    const attr = document.head.attributes[0].cloneNode();
    attr.value = getSrc('legit');
    document.currentScript.attributes.setNamedItemNS('http://www.mozilla.org/ns/specialspace', attr);
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();