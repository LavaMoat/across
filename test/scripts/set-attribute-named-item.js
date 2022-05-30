function bypass() {
    document.head.setAttribute('src', getSrc('legit'));
    const attr = document.head.attributes[0].cloneNode();
    attr.value = getSrc('legit');
    document.currentScript.attributes.setNamedItem(attr);
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();