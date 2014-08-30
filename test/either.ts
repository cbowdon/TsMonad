/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('Either');

    QUnit.test('Case of', assert => {

        assert.ok(TsMonad.Either.left<string, number>('on noes')
            .caseOf({
                left: s => true,
                right: n => false
            }));

        assert.ok(TsMonad.Either.right<string, number>(1)
            .caseOf({
                left: s => false,
                right: n => true
            }));
    });

    QUnit.test('Bind', assert => {

        assert.ok(TsMonad.Either.unit<string, number>(2)
            .bind(n => TsMonad.Either.unit<string, number>(n * 2))
            .bind(n => TsMonad.Either.unit<string, number>(n * 2))
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(TsMonad.Either.unit<string, number>(2)
            .bind(n => TsMonad.Either.unit<string, number>(n * 2))
            .bind(n => TsMonad.Either.left<string, number>('nooo'))
            .caseOf({
                left: s => s === 'nooo',
                right: n => false
            }));
    });

    QUnit.test('Lift', assert => {

        assert.ok(TsMonad.Either.unit<string, number>(2)
            .lift(n => n * 2)
            .lift(n => n * 2)
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(TsMonad.Either.unit<string, number>(2)
            .lift(n => n * 2)
            .lift(n => <number>null)
            .caseOf({
                left: s => false,
                right: n => !n
                // unlike Maybe, lifting a null into Either has no special behaviour
                // so try to avoid this kind of sociopathic behaviour
            }));
    });
}
