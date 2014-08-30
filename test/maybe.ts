/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('Maybe');

    QUnit.test('Case of', assert => {

        assert.ok(TsMonad.Maybe.just(10)
            .caseOf({
                just: x => true,
                nothing: () => false
            }));

        assert.ok(TsMonad.Maybe.nothing()
            .caseOf({
                just: x => false,
                nothing: () => true
            }));
    });

    QUnit.test('Bind', assert => {

        assert.ok(TsMonad.Maybe.just(2)
            .bind(n => TsMonad.Maybe.just(n * 2))
            .bind(n => TsMonad.Maybe.just(n * 2))
            .caseOf({
                just: n => n === 8,
                nothing: () => false
            }));

        assert.ok(TsMonad.Maybe.just(2)
            .bind(n => TsMonad.Maybe.just(n * 2))
            .bind(n => TsMonad.Maybe.nothing())
            .caseOf({
                just: n => false,
                nothing: () => true
            }));
    });

    QUnit.test('Lift', assert => {

        assert.ok(TsMonad.Maybe.just(2)
            .lift(n => n * 2)
            .lift(n => n * 2)
            .caseOf({
                just: n => n === 8,
                nothing: () => false
            }));

        assert.ok(TsMonad.Maybe.just(2)
            .lift(n => n * 2)
            .lift(n => <number>null)
            .caseOf({
                just: n => false,
                nothing: () => true
            }));
    });
}
