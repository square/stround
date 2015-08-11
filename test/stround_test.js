const testMode = process.env.TEST_MODE;
const { round, shift, shiftParts, modes } = testMode === 'dist' ? require('../dist/stround')
                                      : testMode === 'dist-min' ? require('../dist/stround.min') :
                                                                  require('../lib/stround');
import { deepEqual, strictEqual, throws } from 'assert';

describe('round', () => {
  it('accepts strings', () => {
    strictEqual(round('123.45'), '123');
  });

  it('accepts numbers', () => {
    strictEqual(round(123.45), '123');
  });

  it('does not interpret an empty string and simply returns it', () => {
    strictEqual(round(''), '');
  });

  it('uses half-even rounding and zero precision by default', () => {
    strictEqual(round('2.5'), '2');
    strictEqual(round('3.5'), '4');
  });

  it('throws when given a malformed number', () => {
    throws(() => round('1.1.1'), /cannot round malformed number: 1\.1\.1/);
    throws(() => round(undefined), /expected a string or number, got: undefined/);
    throws(() => round('hey'), /cannot round malformed number: hey/);
  });

  it('handles special numbers correctly', () => {
    strictEqual(round('NaN'), 'NaN');
    strictEqual(round('Infinity'), 'Infinity');
    strictEqual(round('-Infinity'), '-Infinity');
  });
});

describe('round (ceiling)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.CEILING), '4');
    strictEqual(round('-4', 0, modes.CEILING), '-4');
    strictEqual(round('4.000000', 0, modes.CEILING), '4');
  });

  it('rounds toward positive infinity', () => {
    strictEqual(round('4.0000001', 0, modes.CEILING), '5');
    strictEqual(round('-4.9999999', 0, modes.CEILING), '-4');
    strictEqual(round('0.0000000000000000000000001', 0, modes.CEILING), '1');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.CEILING), '4.00');
    strictEqual(round('4.00003', 2, modes.CEILING), '4.01');
    strictEqual(round('9.901', 1, modes.CEILING), '10.0');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.9', 0, modes.CEILING), '1000000000000000000000000000');
  });
});

describe('round (floor)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.FLOOR), '4');
    strictEqual(round('-4', 0, modes.FLOOR), '-4');
    strictEqual(round('4.000000', 0, modes.FLOOR), '4');
  });

  it('rounds toward negative infinity', () => {
    strictEqual(round('4.9999999', 0, modes.FLOOR), '4');
    strictEqual(round('-4.0000001', 0, modes.FLOOR), '-5');
    strictEqual(round('0.999999999999999999999999999', 0, modes.FLOOR), '0');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.FLOOR), '4.00');
    strictEqual(round('4.01999', 2, modes.FLOOR), '4.01');
    strictEqual(round('-9.901', 1, modes.FLOOR), '-10.0');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.9', 0, modes.FLOOR), '999999999999999999999999999');
  });
});

describe('round (down)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.DOWN), '4');
    strictEqual(round('-4', 0, modes.DOWN), '-4');
    strictEqual(round('4.000000', 0, modes.DOWN), '4');
  });

  it('rounds toward zero', () => {
    strictEqual(round('4.9999999', 0, modes.DOWN), '4');
    strictEqual(round('-4.0000001', 0, modes.DOWN), '-4');
    strictEqual(round('0.999999999999999999999999999', 0, modes.DOWN), '0');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.DOWN), '4.00');
    strictEqual(round('4.01999', 2, modes.DOWN), '4.01');
    strictEqual(round('-9.901', 1, modes.DOWN), '-9.9');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.9', 0, modes.DOWN), '999999999999999999999999999');
  });
});

describe('round (up)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.UP), '4');
    strictEqual(round('-4', 0, modes.UP), '-4');
    strictEqual(round('4.000000', 0, modes.UP), '4');
  });

  it('rounds away from zero', () => {
    strictEqual(round('4.9999999', 0, modes.UP), '5');
    strictEqual(round('-4.0000001', 0, modes.UP), '-5');
    strictEqual(round('0.999999999999999999999999999', 0, modes.UP), '1');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.UP), '4.00');
    strictEqual(round('4.01999', 2, modes.UP), '4.02');
    strictEqual(round('-9.901', 1, modes.UP), '-10.0');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.9', 0, modes.UP), '1000000000000000000000000000');
  });
});

describe('round (half-even)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.HALF_EVEN), '4');
    strictEqual(round('-4', 0, modes.HALF_EVEN), '-4');
    strictEqual(round('4.000000', 0, modes.HALF_EVEN), '4');
  });

  it('rounds toward nearest integer or even if equidistant', () => {
    strictEqual(round('4.4', 0, modes.HALF_EVEN), '4');
    strictEqual(round('4.5', 0, modes.HALF_EVEN), '4');
    strictEqual(round('4.50000000000000000001', 0, modes.HALF_EVEN), '5');
    strictEqual(round('5.5', 0, modes.HALF_EVEN), '6');
    strictEqual(round('5.6', 0, modes.HALF_EVEN), '6');
    strictEqual(round('-4.4', 0, modes.HALF_EVEN), '-4');
    strictEqual(round('-4.5', 0, modes.HALF_EVEN), '-4');
    strictEqual(round('-4.50000000000000000001', 0, modes.HALF_EVEN), '-5');
    strictEqual(round('-5.5', 0, modes.HALF_EVEN), '-6');
    strictEqual(round('-5.6', 0, modes.HALF_EVEN), '-6');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.HALF_EVEN), '4.00');
    strictEqual(round('4.015', 2, modes.HALF_EVEN), '4.02');
    strictEqual(round('4.025', 2, modes.HALF_EVEN), '4.02');
    strictEqual(round('-4.015', 2, modes.HALF_EVEN), '-4.02');
    strictEqual(round('-4.025', 2, modes.HALF_EVEN), '-4.02');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.5', 0, modes.HALF_EVEN), '1000000000000000000000000000');
  });
});

describe('round (half-down)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.HALF_DOWN), '4');
    strictEqual(round('-4', 0, modes.HALF_DOWN), '-4');
    strictEqual(round('4.000000', 0, modes.HALF_DOWN), '4');
  });

  it('rounds toward nearest integer or zero if equidistant', () => {
    strictEqual(round('4.4', 0, modes.HALF_DOWN), '4');
    strictEqual(round('4.5', 0, modes.HALF_DOWN), '4');
    strictEqual(round('4.50000000000000000001', 0, modes.HALF_DOWN), '5');
    strictEqual(round('5.5', 0, modes.HALF_DOWN), '5');
    strictEqual(round('5.6', 0, modes.HALF_DOWN), '6');
    strictEqual(round('-4.4', 0, modes.HALF_DOWN), '-4');
    strictEqual(round('-4.5', 0, modes.HALF_DOWN), '-4');
    strictEqual(round('-4.50000000000000000001', 0, modes.HALF_DOWN), '-5');
    strictEqual(round('-5.5', 0, modes.HALF_DOWN), '-5');
    strictEqual(round('-5.6', 0, modes.HALF_DOWN), '-6');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.HALF_DOWN), '4.00');
    strictEqual(round('4.015', 2, modes.HALF_DOWN), '4.01');
    strictEqual(round('4.025', 2, modes.HALF_DOWN), '4.02');
    strictEqual(round('-4.015', 2, modes.HALF_DOWN), '-4.01');
    strictEqual(round('-4.025', 2, modes.HALF_DOWN), '-4.02');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.5', 0, modes.HALF_DOWN), '999999999999999999999999999');
  });
});

describe('round (half-up)', () => {
  it('leaves integers as-is', () => {
    strictEqual(round('4', 0, modes.HALF_UP), '4');
    strictEqual(round('-4', 0, modes.HALF_UP), '-4');
    strictEqual(round('4.000000', 0, modes.HALF_UP), '4');
  });

  it('rounds toward nearest integer or away from zero if equidistant', () => {
    strictEqual(round('4.4', 0, modes.HALF_UP), '4');
    strictEqual(round('4.5', 0, modes.HALF_UP), '5');
    strictEqual(round('4.50000000000000000001', 0, modes.HALF_UP), '5');
    strictEqual(round('5.5', 0, modes.HALF_UP), '6');
    strictEqual(round('5.6', 0, modes.HALF_UP), '6');
    strictEqual(round('-4.4', 0, modes.HALF_UP), '-4');
    strictEqual(round('-4.5', 0, modes.HALF_UP), '-5');
    strictEqual(round('-4.50000000000000000001', 0, modes.HALF_UP), '-5');
    strictEqual(round('-5.5', 0, modes.HALF_UP), '-6');
    strictEqual(round('-5.6', 0, modes.HALF_UP), '-6');
  });

  it('rounds with a specific precision', () => {
    strictEqual(round('4', 2, modes.HALF_UP), '4.00');
    strictEqual(round('4.015', 2, modes.HALF_UP), '4.02');
    strictEqual(round('4.025', 2, modes.HALF_UP), '4.03');
    strictEqual(round('-4.015', 2, modes.HALF_UP), '-4.02');
    strictEqual(round('-4.025', 2, modes.HALF_UP), '-4.03');
  });

  it('works with very large numbers', () => {
    strictEqual(round('999999999999999999999999999.5', 0, modes.HALF_UP), '1000000000000000000000000000');
  });
});

describe('shift', () => {
  it('leaves values alone when shifting by zero', () => {
    strictEqual(shift('12', 0), '12');
    strictEqual(shift(12, 0), '12');
  });

  it('pads the right with zeros given an integer', () => {
    strictEqual(shift('847', 4), '8470000');
  });

  it('moves fractional digits over to the integer side', () => {
    strictEqual(shift('12.34', 2), '1234');
  });

  it('leaves a fractional part if it is not entirely shifted off', () => {
    strictEqual(shift('12.34', 1), '123.4');
  });

  it('handles negative numbers correctly', () => {
    strictEqual(shift('-5.987', 5), '-598700');
  });

  it('handles negative exponents correctly', () => {
    strictEqual(shift('12', -2), '0.12');
  });

  it('round-trips correctly', () => {
    strictEqual(shift(shift('12345.678900', 4), -4), '12345.678900');
    strictEqual(shift(shift('1', -4), 4), '1');
  });

  it('handles special numbers correctly', () => {
    strictEqual(shift('Infinity', 1), 'Infinity');
    strictEqual(shift('-Infinity', 1), '-Infinity');
    strictEqual(shift('NaN', 1), 'NaN');
  });
});

describe('shiftParts', () => {
  it('works like shift but with arrays', () => {
    deepEqual(shiftParts([true, '12', '34'], 2), [true, '1234', '']);
  });
});
