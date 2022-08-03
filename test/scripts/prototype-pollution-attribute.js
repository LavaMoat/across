function bypass() {
    const a = document.createAttribute('src');
    Object.defineProperty(a, 'localNameS', {value: ''});
    Object.defineProperty(a, 'nameS', {value: ''});
    Object.defineProperty(a, 'nodeNameS', {value: ''});
    a.value = getSrc('legit');
    Object.defineProperty(a, 'name', {value: ''});
    document.currentScript.setAttributeNode(a);
}

function start() {
    const postMessage = document.onmessage((src, msg) => {});
    setTimeout(() => {
        postMessage(getSrc('main'), 'PONG');
    }, 30);
}

bypass();
start();