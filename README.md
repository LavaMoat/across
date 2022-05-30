# SSC (Secure Scripts Communication)

The SSC standard allows different scripts within the same web application to communicate with each other by passing messages between one another.

This capability obviously already exists (by reading/writing from/to `window`), however SSC's edge is its core added values:

## Core Values

1. It makes sure that a message passed on from script A to script B **really did came from script A** and not any other entity.
2. It makes sure that a message passed on from script A to script B **was not tampered** by any other entity.
3. It makes sure that a message passed on from script A to script B **was not read** by any other entity.

## Usage

In order for SSC to apply within the web app, implement a script tag that loads it at the beginning of the webpage similarly to this:

```html
<script src="./ssc.prod.js"></script>
```

Make sure this runs first - any javascript that runs before the SSC can easily break the SSC from securely working!

Once you register your `onmessage` callback by calling the `document.onmessage()` API by SSC, you'll get a `postMessage` function that can be used to send messages to other scripts within the web app:

### receive message example

```html
<script src="https://x.com/script-a.js">
  (function(){
    const postMessage = document.onmessage((src, msg) => {
        if (src !== 'htts://y.com/script-b.js') {
          console.log('message is not really from "script-b.js"');
          return;
        }
        console.log('got a message from "' + src + '" : ', msg);
    });
  }())
</script>
```

### send message example

```html
<script src="https://y.com/script-b.js">
  (function(){
    const postMessage = document.onmessage((src, msg) => {
      // do nothing    
    });
    setTimeout(() => {
        postMessage('https://x.com/script-a.js', 'hi A, this is B!');
    }, 30);
  }())
</script>
```

Due to security limitations, registering a script to send and recieve messages from other scripts can only be done before DOM is loaded (that's when `document.currentScript` API is still relevant).

## SSC Technically Explained

This model is a solution that is based on a combination of multiple strong capabilities:

### Securely

Securely allows SSC to execute native javascript operations without worrying about them being hijacked by a malicious entity in runtime.
Such hijack can easily harm the SSC ecosystem and allow a malicious entity to break any one of the SSC core values.

Read more about [Securely](https://github.com/weizman/securely) to better understand how it works.

### Glazier

SSC applies itself in the window when it first comes up, in order to create a state within the page that allows the core values to actually exist.
If a malicious entity gets to run code before SSC init, it can break SSC's core values - SSC must execute first.
Furthermore, SSC running first in the top window is not enough - it must do so in every new window that is born within the web app, otherwise
any malicious entity can use iframe native functionalities to bypass the SSC's core values and eventually break it.

In order to apply itself within every newborn window, SSC uses Glazier which does exactly that - provided a certain callback, Glazier will
make sure to execute that callback within every newborn window in the web app (in our case, apply SSC).

Read more about [Glazier](https://github.com/weizman/glazier) to better understand how it works.

### document.currentScript

SSC uses the native browser API `document.currentScript` to verify a script is really who it claims to be.
Without `document.currentScript` telling script A really sent a certain message and not another script that impersonates it would have been impossible.

### disable script src property reseting

All of the above are not enough. In fact they all are the enablers for securely and hermatically allow SSC to shape all windows in the web app in such a way that allows the core values to be enforced.

That is achieved by tracking scripts that change their own src dynamically and prevent them from participating in the SSC, 
because if they had that option they could have changed their own src to impersonate a different script and by that break the core values.

That way, a script can only participate in the SSC if:

1. it was loaded via `html`:

```html
<script src="https://x.com/script-a.js"></script>
```

2. or if it uses the SSC extension for `document.createElement` API to create its script (if you must create your script dynamically):

```javascript
const script = document.createElement('script', 'https://x.com/script-a.js');
// or incase you want to use the @options argument, this will also work:
const script = document.createElement('script', {}, 'https://x.com/script-a.js');
```

This infect allows SSC to actually enforce its core values - a script that wishes to send/recieve messages can only do so if its current src property was at no point changed. That is the only way to tell a script was truly loaded by its current src property.
