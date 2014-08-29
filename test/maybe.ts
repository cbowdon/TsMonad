/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../maybe.ts" />

module TsMonad.Test {
    'use strict';

    var Maybe = TsMonad.Maybe;

    QUnit.module('Maybe');

    QUnit.test('Case of', assert => {

        assert.ok(Maybe.just(10)
            .caseOf({
                just: x => true,
                nothing: () => false
            }));

        assert.ok(Maybe.nothing()
            .caseOf({
                just: x => false,
                nothing: () => true
            }));
    });

    QUnit.test('Bind', assert => {

        assert.ok(Maybe.just(2)
            .bind(n => Maybe.just(n * 2))
            .bind(n => Maybe.just(n * 2))
            .caseOf({
                just: n => n === 8,
                nothing: () => false
            }));

        assert.ok(Maybe.just(2)
            .bind(n => Maybe.just(n * 2))
            .bind(n => Maybe.nothing())
            .caseOf({
                just: n => false,
                nothing: () => true
            }));
    });

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
