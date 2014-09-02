/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('Type class laws');

    QUnit.test('Eq', assert => {
        // TODO auto generate all permutations given possible types
        assert.ok(Maybe.just(20).equals(Maybe.just(20)));
        assert.ok(!Maybe.just(20).equals(Maybe.just(10)));
        assert.ok(!Maybe.just(20).equals(Maybe.nothing()));
        assert.ok(Maybe.nothing().equals(Maybe.nothing()));

        assert.ok(Either.right<string,number>(10).equals(Either.right<string,number>(10)));
        assert.ok(!Either.right<string,number>(10).equals(Either.right<string,number>(20)));
        assert.ok(!Either.right<string,number>(10).equals(Either.left<string,number>('oook')));
        assert.ok(Either.left<string,number>('oook').equals(Either.left<string,number>('oook')));
    });

    QUnit.test('Functor 1: fmap id = id', assert => {

        [ Maybe.just(20), Maybe.nothing<number>() ]
            .forEach(t => assert.ok(t.equals(t.fmap(x => x))));

        [ Either.right<string,number>(20), Either.left<string,number>('oook') ]
            .forEach(t => assert.ok(t.equals(t.fmap(x => x))));
    });

    QUnit.test('Functor 2: fmap (f . g) = fmap f . fmap g', assert => {
        var f = (x: number) => x * 2,
            g = (x: number) => x - 3;

        [ Maybe.just(10), Maybe.nothing<number>() ]
            .forEach(t => {
                var lhs = t.fmap(f).fmap(g),
                    rhs = t.fmap(x => g(f(x)));
                assert.ok(lhs.equals(rhs));
            });

        [ Either.right<string,number>(10), Either.left<string,number>('oook') ]
            .forEach(t => {
                var lhs = t.fmap(f).fmap(g),
                    rhs = t.fmap(x => g(f(x)));
                assert.ok(lhs.equals(rhs));
            });
    });
}
