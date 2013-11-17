/** @const */ var CEILING = 0;
/** @const */ var FLOOR = 1;
/** @const */ var DOWN = 2;
/** @const */ var UP = 3;
/** @const */ var HALF_EVEN = 4;
/** @const */ var HALF_DOWN = 5;
/** @const */ var HALF_UP = 6;

/**
 * Enum for the available rounding modes.
 *
 * @type {number}
 */
var RoundingMode = {
  CEILING: CEILING,
  FLOOR: FLOOR,
  DOWN: DOWN,
  UP: UP,
  HALF_EVEN: HALF_EVEN,
  HALF_DOWN: HALF_DOWN,
  HALF_UP: HALF_UP
};

/** @const */ var NEG = '-';
/** @const */ var SEP = '.';
/** @const */ var NEG_PATTERN = '-';
/** @const */ var SEP_PATTERN = '\\.';
/** @const */ var NUMBER_PATTERN = new RegExp('^('+NEG_PATTERN+')?(\\d*)(?:'+SEP_PATTERN+'(\\d*))?$');

/**
 * Increments the given integer represented by a string by one.
 *
 *   increment('1');  // '2'
 *   increment('99'); // '100'
 *   increment('');   // '1'
 *
 * @param {string} strint
 * @return {string}
 * @private
 */
function increment(strint) {
  var length = strint.length;

  if (length === 0) {
    return '1';
  }

  var last = parseInt(strint[length-1], 10);

  if (last === 9) {
    return increment(strint.slice(0, length-1)) + '0';
  } else {
    return strint.slice(0, length-1) + (last+1);
  }
}

/**
 * Round the given number represented by a string according to the given
 * precision and mode.
 *
 * @param {string|number} strnum
 * @param {number} precision
 * @param {RoundingMode} mode
 * @return {string}
 */
function round(strnum, precision, mode) {
  if (typeof strnum === 'number') {
    strnum = ''+strnum;
  }

  if (typeof strnum !== 'string') {
    throw new Error('expected a string or number, got: '+strnum);
  }

  if (strnum.length === 0) {
    return strnum;
  }

  if (typeof precision === 'undefined') {
    precision = 0;
  }

  if (typeof mode === 'undefined') {
    mode = HALF_EVEN;
  }

  switch (strnum) {
    case 'NaN': case 'Infinity': case '-Infinity':
      return strnum;
  }

  var match = strnum.match(NUMBER_PATTERN);

  if (!match) {
    throw new Error('cannot round malformed number: '+strnum);
  }

  var negative = match[1] !== undefined;
  var intPart = match[2];
  var fracPart = match[3] || '';

  if (precision > 0) {
    var partToMove = fracPart.slice(0, precision);
    while (partToMove.length < precision) {
      partToMove += '0';
    }
    intPart += partToMove;
    fracPart = fracPart.slice(precision);
  }

  switch (mode) {
    case CEILING: case FLOOR: case UP:
      var foundNonZeroDigit = false;
      for (var i = 0, length = fracPart.length; i < length; i++) {
        if (fracPart[i] !== '0') {
          foundNonZeroDigit = true;
          break;
        }
      }
      if (foundNonZeroDigit) {
        if (mode === UP || (negative !== (mode === CEILING))) {
          intPart = increment(intPart);
        }
      }
      break;

    case HALF_EVEN: case HALF_DOWN: case HALF_UP:
      var shouldRoundUp = false;
      var firstFracPartDigit = parseInt(fracPart[0], 10);

      if (firstFracPartDigit > 5) {
        shouldRoundUp = true;
      } else if (firstFracPartDigit === 5) {
        if (mode === HALF_UP) {
          shouldRoundUp = true;
        }

        if (!shouldRoundUp) {
          for (var i = 1, length = fracPart.length; i < length; i++) {
            if (fracPart[i] !== '0') {
              shouldRoundUp = true;
              break;
            }
          }
        }

        if (!shouldRoundUp && mode === HALF_EVEN) {
          var lastIntPartDigit = parseInt(intPart[intPart.length-1], 10);
          shouldRoundUp = lastIntPartDigit % 2 !== 0;
        }
      }

      if (shouldRoundUp) {
        intPart = increment(intPart);
      }
      break;
  }

  if (negative) {
    intPart = NEG + intPart;
  }

  if (precision === 0) {
    return intPart;
  } else {
    var separatorIndex = intPart.length - precision;
    return intPart.slice(0, separatorIndex) +
           SEP +
           intPart.slice(separatorIndex);
  }
}

module.exports = { round: round, modes: RoundingMode };
