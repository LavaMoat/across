import init from "./src/index";

( function(win) { Object.defineProperty(win, 'ACROSS', { value: init }); }( window ) );