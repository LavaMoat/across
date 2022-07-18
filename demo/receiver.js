(function(){
    document.onmessage((src, msg) => {
        if (src === 'https://weizman.github.io/across/demo/sender.js') {
            alert(`Got a trusted message from "${src}": \n\n` + msg);
        }
    })
}())