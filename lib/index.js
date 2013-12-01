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
 * @enum {number}
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
 * Parses the given decimal string into its component parts.
 *
 *   parse('3.14');  // [false, '3', '14']
 *   parse('-3.45'); // [true, '3', '45']
 *
 * @param {string} strnum
 * @return {Array}
 */
function parse(strnum) {
  switch (strnum) {
    case 'NaN': case 'Infinity': case '-Infinity':
      return strnum;
  }

  var match = strnum.match(NUMBER_PATTERN);

  if (!match) {
    throw new Error('cannot round malformed number: '+strnum);
  }

  return [
    match[1] !== undefined,
    match[2],
    match[3] || ''
  ];
}

/**
 * Format the given number configuration as a number string.
 *
 *   format([false, '12', '34']); // '12.34'
 *   format([true, '8', '']);     // '-8'
 *   format([true, '', '7']);     // '-0.7'
 *
 * @param {Array} parts
 * @return {string}
 */
function format(parts) {
  var negative = parts[0];
  var intPart = parts[1];
  var fracPart = parts[2];

  if (intPart.length === 0) {
    intPart = '0';
  } else {
    var firstNonZeroIndex;
    for (firstNonZeroIndex = 0; firstNonZeroIndex < intPart.length; firstNonZeroIndex++) {
      if (intPart[firstNonZeroIndex] !== '0') {
        break;
      }
    }

    if (firstNonZeroIndex !== intPart.length) {
      intPart = intPart.slice(firstNonZeroIndex);
    }
  }

  return (negative ? NEG+intPart : intPart) + (fracPart.length ? SEP+fracPart : '');
}

/**
 * Shift the exponent of the given number (as a string) by the given amount.
 *
 *   shift('12', 2);  // '1200'
 *   shift('12', -2); // '0.12'
 *
 * @param {string|number|Array} strnum
 * @param {number} exponent
 * @return {string|Array}
 */
function shift(strnum, exponent) {
  if (typeof strnum === 'number') {
    strnum = ''+strnum;
  }

  var parsed;
  var shouldFormatResult = true;

  if (typeof strnum === 'string') {
    parsed = parse(strnum);

    if (typeof parsed === 'string') {
      return strnum;
    }

  } else {
    parsed = strnum;
    shouldFormatResult = false;
  }

  var negative = parsed[0];
  var intPart = parsed[1];
  var fracPart = parsed[2];
  var partToMove;

  if (exponent > 0) {
    partToMove = fracPart.slice(0, exponent);
    while (partToMove.length < exponent) {
      partToMove += '0';
    }
    intPart += partToMove;
    fracPart = fracPart.slice(exponent);
  } else if (exponent < 0) {
    while (intPart.length < -exponent) {
      intPart = '0' + intPart;
    }
    partToMove = intPart.slice(intPart.length + exponent);
    fracPart = partToMove + fracPart;
    intPart = intPart.slice(0, intPart.length - partToMove.length);
  }

  var result = [negative, intPart, fracPart];

  if (shouldFormatResult) {
    return format(result);
  } else {
    return result;
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

  var parsed = parse(strnum);

  if (typeof parsed === 'string') {
    return parsed;
  }

  if (precision > 0) {
    parsed = shift(parsed, precision);
  }

  var i, length;

  var negative = parsed[0];
  var intPart = parsed[1];
  var fracPart = parsed[2];

  switch (mode) {
    case CEILING: case FLOOR: case UP:
      var foundNonZeroDigit = false;
      for (i = 0, length = fracPart.length; i < length; i++) {
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
          for (i = 1, length = fracPart.length; i < length; i++) {
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

  return format(shift([negative, intPart, ''], -precision));
}

module.exports = {
  round: round,
  shift: shift,
  modes: RoundingMode
};
