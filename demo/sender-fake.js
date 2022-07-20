(function(){
    const postMessage = document.onmessage(() => {})
    bt.addEventListener('click', () => {
        postMessage('https://lavamoat.github.io/across/demo/receiver.js', 'BYPASS ACROSS SUCCEEDED!');
    })
}())