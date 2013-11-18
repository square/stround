# stround

stround provides arbitrary precision rounding of the types supported by typical
number formatting libraries (e.g. NSNumberFormatter, BigDecimal) for numbers
represented as strings. The purpose is to avoid floating point errors while
still working with decimal values.

## Install

```
$ npm install stround
```

## Usage

```js
$ node
> var stround = require('stround');
{}
> var round = stround.round;
[Function]
```

Round to integers if no precision is specified:

```js
> round('5.025');
'5'
> round('12.8');
'13'
```

Round specifying a precision:

```js
> round('1.18', 1);
'1.2'
> round('1.18', 2);
'1.18'
> round('1.68', 0);
'2'
```

The result will have the specified precision:

```js
> round('1', 2);
'1.00'
> round('84.9', 2);
'84.90'
```

Round toward positive infinity:

```js
> round('1.1', 0, stround.modes.CEILING);
'2'
> round('-1.1', 0, stround.modes.CEILING);
'-1'
```

Round toward negative infinity:

```js
> round('1.8', 0, stround.modes.FLOOR);
'1'
> round('-1.8', 0, stround.modes.FLOOR);
'-2'
```

Round toward zero:

```js
> round('1.8', 0, stround.modes.DOWN);
'1'
> round('-1.8', 0, stround.modes.DOWN);
'-1'
```

Round away from zero:

```js
> round('1.1', 0, stround.modes.UP);
'2'
> round('-1.1', 0, stround.modes.UP);
'-2'
```

Round towards the nearest integer, or towards an even number if equidistant
(this is the default):

```js
> round('1.4', 0, stround.modes.HALF_EVEN);
'1'
> round('1.5', 0, stround.modes.HALF_EVEN);
'2'
> round('2.5', 0, stround.modes.HALF_EVEN);
'2'
> round('-2.5', 0, stround.modes.HALF_EVEN);
'-2'
> round('2.6', 0, stround.modes.HALF_EVEN);
'3'
```

Round towards the nearest integer, or towards zero if equidistant:

```js
> round('1.4', 0, stround.modes.HALF_DOWN);
'1'
> round('1.5', 0, stround.modes.HALF_DOWN);
'1'
> round('2.5', 0, stround.modes.HALF_DOWN);
'2'
> round('-2.5', 0, stround.modes.HALF_DOWN);
'-2'
> round('2.6', 0, stround.modes.HALF_DOWN);
'3'
```

Round towards the nearest integer, or away from zero if equidistant:

```js
> round('1.4', 0, stround.modes.HALF_UP);
'1'
> round('1.5', 0, stround.modes.HALF_UP);
'2'
> round('2.5', 0, stround.modes.HALF_UP);
'3'
> round('-2.5', 0, stround.modes.HALF_UP);
'-3'
> round('2.6', 0, stround.modes.HALF_UP);
'3'
```

## Contributing

### Setup

First, install the development dependencies:

```
$ npm install
```

Then, try running the tests:

```
$ npm test
```

### Pull Requests

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Any contributors to the master lgtm repository must sign the [Individual
Contributor License Agreement (CLA)][cla].  It's a short form that covers our
bases and makes sure you're eligible to contribute.

[cla]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1

When you have a change you'd like to see in the master repository, [send a pull
request](https://github.com/square/stround/pulls). Before we merge your request,
we'll make sure you're in the list of people who have signed a CLA.
