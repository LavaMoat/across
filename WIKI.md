# Across ↔

> **A**llowing **C**ommunication **R**elationship **O**f **S**cripts **S**ecurely

`Across` standard allows different scripts within the same web application to communicate with each other by passing messages between one another securely.

# Unlocking Secure Messaging Between Scripts

> tl;dr - Introducing `Across` which allows for the first time
> ever for browser scripts to communicate securely with one another based on their origin

### Understanding secure messaging between windows first

One of the most fundamental functionalities that is provided by the web browser javascript ecosystem is a secure cross windows communication.

You might know it as `window.postMessage` and `window.onmessage` - using those APIs the browser lets you transfer messages between two windows that co-exist within the same web page:

```html
<iframe id="xdotcom" src="https://x.com">
    <script>
        window.onmessage = (msg) => {
            if (msg.data === 'Hi X!') {
                alert('Message received!');
            }
        };
    </script>
</iframe>

<script>
    xdotcom.postMessage('Hi X!')
</script>
```

### The importance of providing a builtin cross windows messaging API

Or in other words, why such complex API was invented in the first place? 
Why can't one window simply access properties of another window and by that exchange information?

Well there is an important security aspect that comes with this power. 

Long story short, if the two windows that wish to communicate with one another are from the same
origin (e.g. both are from `https://x.com`) then yes, they can access each other's properties.

But if they're not from the same origin, that would be a security breach. The `postMessage` API allows two windows to exchange only the information they wish to exchange - but nothing more!

### Why do we need secure cross windows communication?

The idea of websites allowing different vendors to load within their webpage while remaining secure and isolated opened a lot of doors in aspects of business, technology and much more.

This is for example how ads work. On the one hand, the website wishes to use a third party vendor to present ads, 
but on the other hand the website doesn't want the javascript that generates the ad to have access to its context, otherwise it can maliciously use 
such access to obtain sensitive information regarding the user of the website, information that should not be exposed to such vendor.

Secure windows cross messaging solves that - the ad can be displayed in an isolated iframe,
but will be shared with information regarding what to display by the website using `postMessage`.

**Bottom line - scripts under the same window can expose and be 
exposed to information by scripts from other windows**

### Can you trust the integrity of cross windows communication?

Or in other words - what stops me from sending a message from window A to window B 
while impersonating as window C?

Without a solution to that problem, this API wouldn't have made a lot of sense.

When receiving a message from a window, that message includes information regarding its sender 
that cannot be fabricated (taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#the_dispatched_event)):

```javascript
window.addEventListener("message", (event) => {
  if (event.origin !== "http://example.org:8080")
    // accept messages only from an origin you trust!
    return;

  // …
}, false);
```

**So not only that scripts can share information across windows, they can also verify 
the origin of any received messages.** 

### What about secure messaging between scripts?

Now that we established that there is a clear isolation between windows and that they 
can communicate with one another on top of that isolation - do scripts enjoy similar isolation
and communication layers?

Or to break down the question:

1. Can scripts enjoy a certain level of isolation between one another (similarly to windows)?
2. Can scripts communicate on top of that isolation with one another (similarly to windows)?
3. Can we trust the integrity of such communication (similarly to windows)?

### 1. Isolation

I won't go into details about one of the most basic and important concepts in Javascript, so
if you're not clear about what is [scoping](https://developer.mozilla.org/en-US/docs/Glossary/Scope) 
and how it works, I recommend you read about it first.

But bottom line, **yes** - Thanks to scoping, scripts can enjoy isolation between one another and
to manage values and references that won't be accessible to other scripts that are running under the
same DOM.

### 2. Communication

The answer here is **yes** again - scripts can communicate with one another. 
They can do so by reading and writing from and to the global object that all scripts have access to - the window.

So if script A goes `window.MY_MESSAGE = "THIS IS A""`, script B have access to that message and can read its value.

### 3. Integrity

However, can scripts that share messages be certain which script was responsible to which message?

When it comes to cross windows communication, as described above, the browser enriches each message 
with reliable information of the sender based on their origin.

But that level of integrity does **not** exist when it comes to scripts communicating with on another.
Because although script A can post its message to the global window object, there is no way of telling
that it was really script A that did so.

**Enters `Across`**

## [The Secure Scripts Communication Protocol](https://github.com/weizman/across)

In the form of a shim, `Across` when applied in the webpage exposes a new API that allows scripts to exchange
information with one another securely, and by that I mean it makes sure that a message passed on from script A to script B:

1. **really did come from the sender script** and not any other entity. 
2. **was not tampered** by any other entity. 
3. **was not read** by any other entity.

(Taken from [`Across` Core Values section](https://github.com/weizman/across/blob/master/README.md#core-values))

Thus allowing scripts to communicate with one another the same way windows can when they use `window.postMessage`!

### How does it work? Is it really secure?

Although the API is very simple and straight forward, `Across` can only be achieved by combining a number of
different technologies that together allow `Across` to exist and provide full security and integrity.

The most important API `Across` relies on is [document.currentScript](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript).
This is because it is the only reliable way to tell the origin of the script that wishes to send messages.

In addition to `Across` using `document.currentScript`, it also uses [Snow](https://github.com/weizman/snow-mm) 
to make sure `Across` is applied within any newborn window within the webpage, 
otherwise attackers can use them to bypass `Across` protocol.

`Across` leans on these principles and a few more in order to make sure it cannot be bypassed.

Refer to the full [technical explanation](https://github.com/weizman/across/blob/master/README.md#across-technically-explained) 
of `Across` To understand it completely and what it depends on in order to work and stay secured.

### Usage

Here's a small example just to get the hang of how it looks like:

##### receive message example

```html
<script src="https://x.com/script-a.js">
  (function(){
    document.onmessage((src, msg) => {
        if (src !== 'htts://y.com/script-b.js') {
          console.log('message is not really from "script-b.js"');
          return;
        }
        console.log('got a message from "' + src + '" : ', msg);
    });
  }())
</script>
```

##### send message example

```html
<script src="https://y.com/script-b.js">
  (function(){
    const postMessage = document.onmessage((src, msg) => {
      // do nothing    
    });
    setTimeout(() => {
        // postMessage(to, msg)
        postMessage('https://x.com/script-a.js', 'hi A, this is B!');
    }, 30);
  }())
</script>
```

Even though the API is very simple and straight froward, there are some limitations to the protocol
that must be correctly understood in order to use `Across` safely.

Refer to the [usage section](https://github.com/weizman/across/blob/master/README.md#usage)
to understand how to correctly consume and use `Across`.

## `Across` Technically Explained

This model is a solution that is based on a combination of multiple strong capabilities:

### Securely

Securely allows `Across` to execute native javascript operations without worrying about them being hijacked by a malicious entity in runtime.
Such hijack can easily harm `Across` ecosystem and allow a malicious entity to break any one of `Across` core values.

Read more about [Securely](https://github.com/weizman/securely) to better understand how it works.

### Snow

`Across` applies itself in the window when it first comes up, in order to create a state within the page that allows the core values to actually exist.
If a malicious entity gets to run code before `Across` init, it can break `Across`'s core values - `Across` must execute first.
Furthermore, `Across` running first in the top window is not enough - it must do so in every new window that is born within the web app, otherwise
any malicious entity can use iframe native functionalities to bypass `Across`'s core values and eventually break it.

In order to apply itself within every newborn window, `Across` uses Snow which does exactly that - provided a certain callback, Snow will
make sure to execute that callback within every newborn window in the web app (in our case, apply `Across`).

Read more about [Snow](https://github.com/weizman/snow) to better understand how it works.

### document.currentScript

`Across` uses the native browser API `document.currentScript` to verify a script is really who it claims to be.
Without `document.currentScript` telling script A really sent a certain message and not another script that impersonates it would have been impossible.

### disable script src property resetting

All of the above are not enough. In fact, they all are the enablers for securely and hermetically allow `Across` to shape all windows in the web app in such a way that allows the core values to be enforced.

That is achieved by tracking scripts that change their own src dynamically and prevent them from participating in `Across`,
because if they had that option they could have changed their own src to impersonate a different script and by that break the core values.

That way, a script can only participate in `Across` if:

1. it was loaded via `html`:

```html
<script src="https://x.com/script-a.js"></script>
```

2. or if it uses `Across` extension for `document.createElement` API to create its script (if you must create your script dynamically):

```javascript
const script = document.createElement('script', 'https://x.com/script-a.js');
// or incase you want to use the @options argument, this will also work:
const script = document.createElement('script', {}, 'https://x.com/script-a.js');
```

This in fact allows `Across` to actually enforce its core values - a script that wishes to send/receive messages can only do so if its current src property was at no point changed. That is the only way to tell a script was truly loaded by its current src property.

## Unlocking possibilities with `Across`

Or in other words - why unlocking secure scripts communication is exciting?

I'll try to give you a taste of how I feel about this project, but I'll make sure to
elaborate on future posts about possibilities `Across` unlocks with actual examples. 

To me `Across` is exciting because it was not possible before. At all. To the point where
the web industry created and invented so much based on the 
assumption that scripts cannot securely communicate with one another.

But now that it can, might it change how we think of client side possibilities?

Here are some thoughts and ideas I have:

### Privileges management of in browser APIs consumption

With `Across`, you can also override APIs within the browser to only go through a "proxy script" to those APIs.
With such technique, you can manage privileges of consumption of any APIs based on the consumer script.

**In other words, you can decide whether to allow or deny a call of a certain API in the browser based on
who is the script that requests to consume the API**

#### localStorage separation per script

For example, I created `vault` which separates the `localStorage` to vaults where each
vault is only accessible by its destined script.

So assuming `https://x.com/script-a.js` wants to read/write from/to `localStorage`, it can only
access values that it stored itself - no other script in the page has access to its values.

The separation of the storage per script based on its src is new. As of today, any piece of Javascript
code can access all values in the storage of a certain domain. But with `Across`, we can now implement a real
separation of the storage for each script!

This is achieved thanks to the unlocking of the "Privileges management of in browser APIs consumption" concept.
With `Across`, we no longer allow direct access to window.localStorage, so any script that wishes to access it must
go through `vault` which is the "proxy script" that grants access to the storage based on the src of the requesting script.

#### window.ethereum access to allowed scripts only

This is another example for how the "privileges management" concept can help solving a real world problem.

(This not might make sense to you if you're not too familiar with Web3)

Today, for a dapp to communicate with a wallet it does so by calling `window.ethereum` API which is
exported to the global window object by a script that is injected to the page by the wallet extension.

The problem with this approach is the fact that `window.ethereum` is accessible to all scripts
in the web app. This means that any script can initiate communication with the wallet.
So for example, if a certain third party script the web app consumes was breached, it can maliciously 
initiate communication with the wallet extension on behalf of the dapp - a major security breach.

But if instead of this approach `window.ethereum` API was exposed using `Across`, it could have denied 
requests to the wallet from the dapp that originate by a script that should not be able to do so normally.

In other words, you can decide to only transfer requests to the wallet from scripts that start with `https://opensea.io`
when using OpenSea, thus trashing requests that come from scripts with irrelevant or unknown origins (including XSS).

### Third party vendors clientside collaboration

Web apps, as are built today, consume third party services by including third party scripts in their web page.

These vendors provide services to the web app owner in fields such as 
advertisement, payments, authentication, information security and much more.

Such vendors sometimes gain from exchanging information with one another or with the web app itself, 
but if we're talking about sensitive information they either do so via the backend or refrain from doing so at all.

However, a new architecture of secure clientside exchange of sensitive info can rise up around `Across`, thus 
allowing such vendors to exchange information in the browser and by that avoid the overhead of
moving it through the backend where it is really needed in real time in the website itself.

In other words, imagine a scenario where Google Ads script can benefit from some extra information regarding the user
in order to provide with more accurate and targeted ad content, information that the web app holds for example.

The two can now exchange such info, even if sensitive, in the clientside without worrying of the information
being leaked to another entity within the webpage.
 
### Anything!

This is a new concept to wrap your head around. But once you do, you might be able to come up
with interesting ideas for how this technology can help with changing things and consuming services differently
then how we're used to.

But to me, the ability for secure communication between scripts is exciting!

## Is it production ready?

Even though the hard part of proving this is fully possible and fully secure is done, There
are still some reasons why `Across` is not production ready:

1. Browsers Support - All efforts went toward making sure `Across` works smoothly with no errors on Chromium
based browsers, it was not tested on Firefox/Safari. Help with applying support in these to this
project is needed.
2. Performance - In order for `Across` to stay secured it uses Snow. Currently, in order for 
Snow to remain fully secure, it harms the performance significantly. This is something
that the Snow project can use a lot of help with, but until then, Snow harms the 
performance in some websites (there will be however a version of `Across` for extensions 
that will not have to use Snow and by that will cut performance almost entirely, 
but it will serve extension products only)
3. Security - `Across` is worthless if it's not fully secure. What mainly lead this project was to make sure
it is hermetically secured, so it is very safe to use. 
However, this project is new and any help on the security side will be much appreciated!

### Reach out!

Can you help with any of the above? Do you have any insights on possible solutions? 
Want me to focus on specific aspects of this project? feel free to reach out in any way.
Feedback or any help are highly appreciated!

I hope you'd find `Across` as exciting as I do :)