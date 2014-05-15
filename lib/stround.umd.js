/* jshint esnext:true, undef:true, unused:true */
/* global define, window, module */

import {
  modes,
  shift,
  round,
  parse,
  format,
  shiftParts
} from './stround';

var stround = {
  modes: modes,
  shift: shift,
  round: round,
  parse: parse,
  format: format,
  shiftParts: shiftParts
};

if (typeof define === 'function' && define.amd) {
  define(function() { return stround; });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = stround;
} else if (typeof window !== 'undefined') {
  window.stround = stround;
} else {
  this.stround = stround;
}
