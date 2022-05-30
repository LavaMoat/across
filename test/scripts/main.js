(function(){
    const postMessage = document.onmessage((src, msg) => {
        done('GOT MESSAGE FROM SCRIPT "' + getName(src) + '" : ' + msg);
    });
    setTimeout(() => {
        postMessage(getSrc('legit'), 'PING');
        setTimeout(() => {
            done('GOT NO MESSAGES');
        }, 30);
    }, 30);
}())