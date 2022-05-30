# SSC (Secure Scripts Communication)

The SSC standard allows different scripts within the same web application to communicate with each other by passing messages between one another.

This capability obviously already exists (by reading/writing from/to `window`), however SSC's edge is its core added values:

## Core Values

1. It makes sure that a message passed on from script A to script B **really did came from script A** and not any other entity.
2. It makes sure that a message passed on from script A to script B **was not tampered** by any other entity.
3. It makes sure that a message passed on from script A to script B **was not read** by any other entity.

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
