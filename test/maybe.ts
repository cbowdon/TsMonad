/// <reference path="../maybe.ts" />

module TsMonad.Test {

    var Maybe = TsMonad.Maybe;

    var mayhaps = Maybe.just(10)
        .bind(x => Maybe.nothing<number>())
        .bind(x => Maybe.just(20))
        .caseOf({
            just: n => 2 * n,
            nothing: () => 0
        });

    console.log(mayhaps);

    /*
    Maybe.just('hello')
        .caseOf({
            just: s => s
            // COMPILER ERROR
        });
    */
}
