# TsMonad
* a simple and pragmatic monad library
* designed for TypeScript
* with the aim of limiting errors due to unhandled nulls

## Description
This library provides implementations of the most useful monads outside of Haskell (subjectively, this is Maybe and Either). It also provides a strongly-typed emulation of pattern matching to help enforce program correctness.

I won't presume to attempt a monad tutorial here. There are several online - I recommend Douglas Crockford's Monads & Gonads talk.

## License
MIT

## Usage
This library will work with vanilla ES3 JavaScript with node or in the browser. However, it is far better with [TypeScript](http://www.typescriptlang.org).

Node:

    var TsMonad = require('tsmonad');

Browser:

    <script src="node_modules/tsmonad/dist/tsmonad.js"></script>

TypeScript definitions:

    /// <reference path="node_modules/tsmonad/dist/tsmonad.d.js" />

## Examples (in TypeScript)
You can see the unit tests for the examples below at test/examples.ts.

### Pattern matching emulation

    var turns_out_to_be_100 = Maybe.just(10)
        .caseOf({
            just: n => n * n,
            nothing: () => -1
        });

    var turns_out_to_be_a_piano = Maybe.nothing<number>()
        .caseOf({
            just: n => n * n,
            nothing: () => -1 // joke, it's negative one not a piano
        });

    var turns_out_to_throw_a_compiler_error = Maybe.just(321)
        .caseOf({
            just: n => 999,
            // tsc will tell you that this "does not implement 'nothing'"
            // helping to enforce correct handling of all possible paths
        });

### General Maybe usage

The Maybe monad can simplify processing of values that may not exist:

    var canRideForFree = user.getAge()  // user might not have provided age, this is a Maybe<number>
        .bind(age => getBusPass(age))   // not all ages have a bus pass, this is a Maybe<BusPass>
        .caseOf({
            just: busPass => busPass.isValidForRoute('Weston'),
            nothing: () => false
        });

Without Maybe, this would be something like:

    var canRideForFree,
        age = user.getAge(); // might be null or undefined

    if (age) {
        var busPass = getBusPass(age); // might be null or undefined
        if (busPass) {
            canRideForFree = busPass.isValidForRoute('Weston');
        }
    }
    canRideForFree = false;

Please excuse the messy var scoping and implicit any types in the above. Again, the neat thing about the caseOf method is that it forces you to consider the failure case - it's not always obvious if you're missing a branch of your if-else statement, until it blows up at runtime.

### General Either usage

    var canRideForFree = user.getAge()  // either 42 or 'Information withheld' - type of Either<string,number>
        .bind(age => getBusPass(age))   // either busPass or 'Too young for a bus pass' - type of Either<string,BusPass>
        .caseOf({
            right: busPass => busPass.isValidForRoute('Weston'),
            left: errorMessage => { console.log(errorMessage); return false; }
        });

### General Writer usage

Somewhat contrived example of recording arithmetic operations:

    var is_true = Writer.writer(['Started with 0'], 0)
        .bind(x => Writer.writer(['+ 8'], x + 8))
        .bind(x => Writer.writer(['- 6', '* 8'], 8 * (x - 6)))
        .caseOf({
            writer: (s, v) => v === 16 && s.join(', ') === 'Started with 0, + 8, - 6, * 8'
        }));

### The lift method (fmap)

The lift method takes a lambda, applies it to the wrapped value and calls the unit function of the monad on the result (e.g. for Maybe it calls just). Useful when you want to bind to a function that doesn't return a monad.

    var turns_out_to_be_true = Maybe.just(123)
        .lift(n => n * 2)
        .caseOf({
            just: n => n === 246,
            nothing: () => false
        });

Note that for Maybe, if the lifted function returns null or undefined then it returns Nothing rather than wrapping a null in a Just, which is perverse.

## FAQ and apologies
* Why only Maybe, Either and Writer (so far)?

These monads are the most useful in a world ridden with mutable state and side effects. I'm currently evaluating which other common monads offer enough benefit to be worth implementing in TypeScript.

* Where's monad transformers/monoids/fantasy-land compliance?

Sorry. One day.
