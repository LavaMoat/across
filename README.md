# Across ↔

> **A**llowing **C**ommunication **R**elationship **O**f **S**cripts **S**ecurely

`Across` standard allows different scripts within the same web application to communicate with each other by passing messages between one another securely.

* [Test](https://lavamoat.github.io/across/demo/) `Across` for yourself with this live demo!
* [Learn](https://github.com/lavamoat/across/wiki/Introducing-Across) more about the motivation behind `Across`
* `Across` is still experimental ⚠️ - your [help](#contribute) is highly appreciated!

This capability obviously already exists (by reading/writing from/to `window`), however the edge `Across` brings 
is its core added values:

## Core Values

`Across` makes sure that a message passed on from script A to script B

1. **really did come from the sender script** and not any other entity.
2. **was not tampered** by any other entity.
3. **was not read** by any other entity.

## Install

The latest `across` [production version](https://raw.githubusercontent.com/lavamoat/across/main/across.prod.js) is included in the official repo
and also in [upkg cdn](https://unpkg.com/@lavamoat/across/across.prod.js), so in order to
install `across` in the website, simply place it wherever and serve it to the website as-is:

```html
<script src="https://unpkg.com/@lavamoat/across/across.prod.js"></script>
<script>
    // apply Across by running:
    ACROSS();
</script>
```

Make sure this runs first - any javascript that runs before `Across` can easily break it from securely working!

`ACROSS` API can also be required as part of a bundle instead of a script tag:

```
yarn add @lavamoat/across
```

```javascript
const across = require('@lavamoat/across');
across(); // remember to call Across in order for it to apply
```

## Usage

Once you register your `onmessage` callback by calling the `document.onmessage()` API by `Across`, you'll get a `postMessage` function that can be used to send messages to other scripts within the web app:

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

Due to security limitations, registering a script to send and receive messages from other scripts can only be done before DOM is loaded (that's when `document.currentScript` API is still relevant).

## Contribute

This project is an important POC aspiring to standardize how scripts can securely communicate 
with each other, however it is not yet production ready:

### Support

Currently `across` is written to support chromium based browsers only, it was
never tested on anything else.

### Performance

Achieving an hermetic solution costs in performance. Injecting this script into some major
websites went smoothly while with some others it caused them some performance issues.

### Security

Although this project takes the hermetic concept very seriously and massively tests for
potential flaws, `across` might potentially still have flaws which might enable attackers
to bypass its hooks.

Bottom line - `across` might have security vulnerabilities!

### Tests

In order to assure security, there are many tests that verify that `across`
is fully hermetic as promised - everything that `across` supports is fully tested.

The tests mainly try to bypass `across` in any possible way.

If you found a vulnerability in `across`, open a PR with a test that demonstrates it.

### Help

Help with promoting any of the topics above is very much appreciated in order for this project
to become production ready and reshape how browser scripts can communicate with one another!

## Supporters

Funded by [Consensys 💙](https://github.com/consensys)

Maintained and developed by [MetaMask 🦊](https://github.com/MetaMask)

Invented and developed by [Gal Weizman 👋🏻](https://weizman.github.io/)

Runs on [Snow ❄️](https://github.com/lavamoat/snow)
