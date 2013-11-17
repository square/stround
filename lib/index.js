var CEILING = 0;
var FLOOR = 1;
var DOWN = 2;
var UP = 3;
var HALF_EVEN = 4;
var HALF_DOWN = 5;
var HALF_UP = 6;

var modes = {
  CEILING: CEILING,
  FLOOR: FLOOR,
  DOWN: DOWN,
  UP: UP,
  HALF_EVEN: HALF_EVEN,
  HALF_DOWN: HALF_DOWN,
  HALF_UP: HALF_UP
};

var NEG = '-';
var SEP = '.';

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

function round(strnum, precision, mode) {
  var negative = strnum[0] === NEG;

  if (negative) {
    strnum = strnum.slice(1);
  }

  var parts = strnum.split(SEP);

  var intPart = parts[0];
  var fracPart = parts[1] || '';

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

module.exports = { round: round, modes: modes };
