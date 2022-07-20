(function(){
    document.onmessage((src, msg) => {
        if (src === 'https://lavamoat.github.io/across/demo/sender.js') {
            alert(`Got a trusted message from "${src}": \n\n` + msg);
        } else {
            alert(`Got a fake message from "${src}": \n\n` + msg + '\n\nNICE TRY!');
        }
    })
}())