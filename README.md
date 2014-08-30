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

## Examples
### Pattern matching (TypeScript)

    var turns_out_to_be_100 = Maybe.just(10)
        .caseOf({
            just: n => n * n,
            nothing: () => -1
        });

    var turns_out_to_be_a_piano = Maybe.nothing()
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

### General Maybe usage (TypeScript)

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

### The lift method

The lift method takes a lambda, applies it to the wrapped value and calls the unit function of the monad on the result (e.g. for Maybe it calls just). Useful when you want to bind to a function that doesn't return a monad.

    var turns_out_to_be_true = Maybe.just(123)
        .lift(n => n * 2)
        .caseOf({
            just: n => n === 456,
            nothing: () => false
        });

Note that for Maybe, if the lifted function returns null or undefined then it returns Nothing rather than wrapping a null in a Just, which is perverse.

## FAQ and apologies
* What, no monad interface? Isn't that mandatory when porting monads to an OO language?
    Sorry. PITA with the different number of type parameters of Maybe and Either. You won't miss it, I hope.

* Where's Writer/monad transformers/monoids/fantasy-land compliance?
    Sorry. One day.
