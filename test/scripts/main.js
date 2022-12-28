(function(){
    const postMessage = document.onmessage((src, msg) => {
        setTimeout(() => {
            done('GOT MESSAGE FROM SCRIPT "' + getName(src) + '" : ' + msg);
        }, 30);
    });
    setTimeout(() => {
        postMessage(getSrc('legit'), 'PING');
        setTimeout(() => {
            done('GOT NO MESSAGES');
        }, 30);
    }, 30);
}())