(function(){
    const postMessage = document.onmessage(() => {})
    bt.addEventListener('click', () => {
        postMessage('file:///Users/weizman/Documents/weizman/ssc-mm/demo/receiver.js', 'BYPASS ACROSS SUCCEEDED!');
    })
}())