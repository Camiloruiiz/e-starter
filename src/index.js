window.$ = window.jQuery = require('jquery')
window.Popper = require('popper.js')

// import bootstrap
//require('bootstrap')

// import plugins individually
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/popover';

import './scss/main.scss'

console.log("hello world!")

// use tooltip and popover components everywhere
$(function (){
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
})
