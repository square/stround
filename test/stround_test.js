var expect = require('expect.js');
var stround = require('../lib');
var round = stround.round;
var modes = stround.modes;

describe('round (ceiling)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.CEILING)).to.be('4');
    expect(round('-4', 0, modes.CEILING)).to.be('-4');
    expect(round('4.000000', 0, modes.CEILING)).to.be('4');
  });

  it('rounds toward positive infinity', function() {
    expect(round('4.0000001', 0, modes.CEILING)).to.be('5');
    expect(round('-4.9999999', 0, modes.CEILING)).to.be('-4');
    expect(round('0.0000000000000000000000001', 0, modes.CEILING)).to.be('1');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.CEILING)).to.be('4.00');
    expect(round('4.00003', 2, modes.CEILING)).to.be('4.01');
    expect(round('9.901', 1, modes.CEILING)).to.be('10.0');
  });
});

describe('round (floor)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.FLOOR)).to.be('4');
    expect(round('-4', 0, modes.FLOOR)).to.be('-4');
    expect(round('4.000000', 0, modes.FLOOR)).to.be('4');
  });

  it('rounds toward negative infinity', function() {
    expect(round('4.9999999', 0, modes.FLOOR)).to.be('4');
    expect(round('-4.0000001', 0, modes.FLOOR)).to.be('-5');
    expect(round('0.999999999999999999999999999', 0, modes.FLOOR)).to.be('0');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.FLOOR)).to.be('4.00');
    expect(round('4.01999', 2, modes.FLOOR)).to.be('4.01');
    expect(round('-9.901', 1, modes.FLOOR)).to.be('-10.0');
  });
});

describe('round (down)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.DOWN)).to.be('4');
    expect(round('-4', 0, modes.DOWN)).to.be('-4');
    expect(round('4.000000', 0, modes.DOWN)).to.be('4');
  });

  it('rounds toward zero', function() {
    expect(round('4.9999999', 0, modes.DOWN)).to.be('4');
    expect(round('-4.0000001', 0, modes.DOWN)).to.be('-4');
    expect(round('0.999999999999999999999999999', 0, modes.DOWN)).to.be('0');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.DOWN)).to.be('4.00');
    expect(round('4.01999', 2, modes.DOWN)).to.be('4.01');
    expect(round('-9.901', 1, modes.DOWN)).to.be('-9.9');
  });
});

describe('round (up)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.UP)).to.be('4');
    expect(round('-4', 0, modes.UP)).to.be('-4');
    expect(round('4.000000', 0, modes.UP)).to.be('4');
  });

  it('rounds away from zero', function() {
    expect(round('4.9999999', 0, modes.UP)).to.be('5');
    expect(round('-4.0000001', 0, modes.UP)).to.be('-5');
    expect(round('0.999999999999999999999999999', 0, modes.UP)).to.be('1');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.UP)).to.be('4.00');
    expect(round('4.01999', 2, modes.UP)).to.be('4.02');
    expect(round('-9.901', 1, modes.UP)).to.be('-10.0');
  });
});

describe('round (half-even)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.HALF_EVEN)).to.be('4');
    expect(round('-4', 0, modes.HALF_EVEN)).to.be('-4');
    expect(round('4.000000', 0, modes.HALF_EVEN)).to.be('4');
  });

  it('rounds toward nearest integer or even if equidistant', function() {
    expect(round('4.4', 0, modes.HALF_EVEN)).to.be('4');
    expect(round('4.5', 0, modes.HALF_EVEN)).to.be('4');
    expect(round('4.50000000000000000001', 0, modes.HALF_EVEN)).to.be('5');
    expect(round('5.5', 0, modes.HALF_EVEN)).to.be('6');
    expect(round('5.6', 0, modes.HALF_EVEN)).to.be('6');
    expect(round('-4.4', 0, modes.HALF_EVEN)).to.be('-4');
    expect(round('-4.5', 0, modes.HALF_EVEN)).to.be('-4');
    expect(round('-4.50000000000000000001', 0, modes.HALF_EVEN)).to.be('-5');
    expect(round('-5.5', 0, modes.HALF_EVEN)).to.be('-6');
    expect(round('-5.6', 0, modes.HALF_EVEN)).to.be('-6');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.HALF_EVEN)).to.be('4.00');
    expect(round('4.015', 2, modes.HALF_EVEN)).to.be('4.02');
    expect(round('4.025', 2, modes.HALF_EVEN)).to.be('4.02');
    expect(round('-4.015', 2, modes.HALF_EVEN)).to.be('-4.02');
    expect(round('-4.025', 2, modes.HALF_EVEN)).to.be('-4.02');
  });
});

describe('round (half-down)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.HALF_DOWN)).to.be('4');
    expect(round('-4', 0, modes.HALF_DOWN)).to.be('-4');
    expect(round('4.000000', 0, modes.HALF_DOWN)).to.be('4');
  });

  it('rounds toward nearest integer or zero if equidistant', function() {
    expect(round('4.4', 0, modes.HALF_DOWN)).to.be('4');
    expect(round('4.5', 0, modes.HALF_DOWN)).to.be('4');
    expect(round('4.50000000000000000001', 0, modes.HALF_DOWN)).to.be('5');
    expect(round('5.5', 0, modes.HALF_DOWN)).to.be('5');
    expect(round('5.6', 0, modes.HALF_DOWN)).to.be('6');
    expect(round('-4.4', 0, modes.HALF_DOWN)).to.be('-4');
    expect(round('-4.5', 0, modes.HALF_DOWN)).to.be('-4');
    expect(round('-4.50000000000000000001', 0, modes.HALF_DOWN)).to.be('-5');
    expect(round('-5.5', 0, modes.HALF_DOWN)).to.be('-5');
    expect(round('-5.6', 0, modes.HALF_DOWN)).to.be('-6');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.HALF_DOWN)).to.be('4.00');
    expect(round('4.015', 2, modes.HALF_DOWN)).to.be('4.01');
    expect(round('4.025', 2, modes.HALF_DOWN)).to.be('4.02');
    expect(round('-4.015', 2, modes.HALF_DOWN)).to.be('-4.01');
    expect(round('-4.025', 2, modes.HALF_DOWN)).to.be('-4.02');
  });
});

describe('round (half-up)', function() {
  it('leaves integers as-is', function() {
    expect(round('4', 0, modes.HALF_UP)).to.be('4');
    expect(round('-4', 0, modes.HALF_UP)).to.be('-4');
    expect(round('4.000000', 0, modes.HALF_UP)).to.be('4');
  });

  it('rounds toward nearest integer or away from zero if equidistant', function() {
    expect(round('4.4', 0, modes.HALF_UP)).to.be('4');
    expect(round('4.5', 0, modes.HALF_UP)).to.be('5');
    expect(round('4.50000000000000000001', 0, modes.HALF_UP)).to.be('5');
    expect(round('5.5', 0, modes.HALF_UP)).to.be('6');
    expect(round('5.6', 0, modes.HALF_UP)).to.be('6');
    expect(round('-4.4', 0, modes.HALF_UP)).to.be('-4');
    expect(round('-4.5', 0, modes.HALF_UP)).to.be('-5');
    expect(round('-4.50000000000000000001', 0, modes.HALF_UP)).to.be('-5');
    expect(round('-5.5', 0, modes.HALF_UP)).to.be('-6');
    expect(round('-5.6', 0, modes.HALF_UP)).to.be('-6');
  });

  it('rounds with a specific precision', function() {
    expect(round('4', 2, modes.HALF_UP)).to.be('4.00');
    expect(round('4.015', 2, modes.HALF_UP)).to.be('4.02');
    expect(round('4.025', 2, modes.HALF_UP)).to.be('4.03');
    expect(round('-4.015', 2, modes.HALF_UP)).to.be('-4.02');
    expect(round('-4.025', 2, modes.HALF_UP)).to.be('-4.03');
  });
});
