(function(){
    const postMessage = document.onmessage(() => {})
    bt.addEventListener('click', () => {
        postMessage('https://weizman.github.io/across/demo/receiver.js', 'HI! THIS IS THE SENDER!');
    })
}())