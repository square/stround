/* jshint sub:true, esnext:true, undef:true, unused:true */

/**
 * Enum for the available rounding modes.
 *
 * @enum {number}
 */
export var modes = {
  CEILING: 0,
  FLOOR: 1,
  DOWN: 2,
  UP: 3,
  HALF_EVEN: 4,
  HALF_DOWN: 5,
  HALF_UP: 6
};


/**
 * @const
 * @private
 * */
var NEG = '-';

/**
 * @const
 * @private
 * */
var SEP = '.';

/**
 * @const
 * @private
 * */
var NEG_PATTERN = '-';

/**
 * @const
 * @private
 * */
var SEP_PATTERN = '\\.';

/**
 * @const
 * @private
 * */
var NUMBER_PATTERN = new RegExp(
  '^(' + NEG_PATTERN + ')?(\\d*)(?:' + SEP_PATTERN + '(\\d*))?$'
);

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
 *   stround.parse('3.14');  // [false, '3', '14']
 *   stround.parse('-3.45'); // [true, '3', '45']
 *
 * @param {string} strnum
 * @return {?Array}
 */
export function parse(strnum) {
  switch (strnum) {
    case 'NaN': case 'Infinity': case '-Infinity':
      return null;
  }

  var match = strnum.match(NUMBER_PATTERN);

  if (!match) {
    throw new Error('cannot round malformed number: '+strnum);
  }

  return [
    match[1] === NEG_PATTERN,
    match[2],
    match[3] || ''
  ];
}

/**
 * Format the given number configuration as a number string.
 *
 *   stround.format([false, '12', '34']); // '12.34'
 *   stround.format([true, '8', '']);     // '-8'
 *   stround.format([true, '', '7']);     // '-0.7'
 *
 * @param {Array} parts
 * @return {string}
 */
export function format(parts) {
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

  return (negative ? NEG + intPart : intPart) + (fracPart.length ? SEP + fracPart : '');
}

/**
 * Shift the exponent of the given number (in parts) by the given amount.
 *
 *   stround.shiftParts([false, '12', ''], 2);  // [false, '1200', '']
 *   stround.shiftParts([false, '12', ''], -2); // [false, '', '12']
 *
 * @param {Array} parts
 * @param {number} exponent
 * @return {Array}
 */
export function shiftParts(parts, exponent) {
  var negative = parts[0];
  var intPart = parts[1];
  var fracPart = parts[2];
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

  return [negative, intPart, fracPart];
}

/**
 * Shift the exponent of the given number (as a string) by the given amount.
 *
 *   shift('12', 2);  // '1200'
 *   shift('12', -2); // '0.12'
 *
 * @param {string|number} strnum
 * @param {number} exponent
 * @return {string}
 */
export function shift(strnum, exponent) {
  if (typeof strnum === 'number') {
    strnum = ''+strnum;
  }

  var parsed = parse(strnum);
  if (parsed === null) {
    return strnum;
  } else {
    return format(shiftParts(parsed, exponent));
  }
}

/**
 * Round the given number represented by a string according to the given
 * precision and mode.
 *
 * @param {string|number} strnum
 * @param {number|null|undefined} precision
 * @param {stround.modes} mode
 * @return {string}
 */
export function round(strnum, precision, mode) {
  if (typeof strnum === 'number') {
    strnum = ''+strnum;
  }

  if (typeof strnum !== 'string') {
    throw new Error('expected a string or number, got: '+strnum);
  }

  if (strnum.length === 0) {
    return strnum;
  }

  if (precision === null || precision === undefined) {
    precision = 0;
  }

  if (mode === undefined) {
    mode = modes.HALF_EVEN;
  }

  var parsed = parse(strnum);

  if (parsed === null) {
    return strnum;
  }

  if (precision > 0) {
    parsed = shiftParts(parsed, precision);
  }

  var i, length;

  var negative = parsed[0];
  var intPart = parsed[1];
  var fracPart = parsed[2];

  switch (mode) {
    case modes.CEILING: case modes.FLOOR: case modes.UP:
      var foundNonZeroDigit = false;
      for (i = 0, length = fracPart.length; i < length; i++) {
        if (fracPart[i] !== '0') {
          foundNonZeroDigit = true;
          break;
        }
      }
      if (foundNonZeroDigit) {
        if (mode === modes.UP || (negative !== (mode === modes.CEILING))) {
          intPart = increment(intPart);
        }
      }
      break;

    case modes.HALF_EVEN: case modes.HALF_DOWN: case modes.HALF_UP:
      var shouldRoundUp = false;
      var firstFracPartDigit = parseInt(fracPart[0], 10);

      if (firstFracPartDigit > 5) {
        shouldRoundUp = true;
      } else if (firstFracPartDigit === 5) {
        if (mode === modes.HALF_UP) {
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

        if (!shouldRoundUp && mode === modes.HALF_EVEN) {
          var lastIntPartDigit = parseInt(intPart[intPart.length-1], 10);
          shouldRoundUp = lastIntPartDigit % 2 !== 0;
        }
      }

      if (shouldRoundUp) {
        intPart = increment(intPart);
      }
      break;
  }

  return format(shiftParts([negative, intPart, ''], -precision));
}
