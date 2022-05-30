import init from "./src/index";

( function(win) { Object.defineProperty(win, 'SSC', { value: init }); }( window ) );