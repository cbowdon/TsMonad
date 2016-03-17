/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

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

    QUnit.test('Lift', assert => {

        assert.ok(Maybe.just(2)
            .lift(n => n * 2)
            .lift(n => n * 2)
            .caseOf({
                just: n => n === 8,
                nothing: () => false
            }));

        assert.ok(Maybe.just(2)
            .lift(n => n * 2)
            .lift(n => <number>null)
            .caseOf({
                just: n => false,
                nothing: () => true
            }));
    });

    QUnit.test('Constructors', assert => {

        assert.throws(() => { Maybe.just(<string>null) }, /null/);

        assert.ok(Maybe.maybe<string>(null)
            .caseOf({
                just: s => false,
                nothing: () => true
            }));

        assert.ok(Maybe.maybe('something')
            .caseOf({
                just: s => true,
                nothing: () => false
            }));

        assert.ok(maybe('something')
            .caseOf({
                just: s => true,
                nothing: () => false
            }));
    });

    QUnit.test('defaulting', assert => {

        assert.ok(Maybe.just(10).defaulting(20)
            .caseOf({
                just: s => s === 10,
                nothing: () => false
            }));

        assert.ok(Maybe.nothing<number>().defaulting(20)
            .caseOf({
                just: s => s === 20,
                nothing: () => false
            }));

    });

    QUnit.test('valueOr', assert => {

        assert.strictEqual(Maybe.just(10).valueOr(20), 10);

        assert.strictEqual(Maybe.nothing<number>().valueOr(20), 20);

    });
}
