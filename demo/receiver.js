(function(){
    document.onmessage((src, msg) => {
        if (src === 'file:///Users/weizman/Documents/weizman/ssc-mm/demo/sender.js') {
            alert(`Got a trusted message from "${src}": \n\n` + msg);
        }
    })
}())