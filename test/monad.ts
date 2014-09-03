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

    QUnit.test('Monad 1: left identity', assert => {
        // (return x >>= f) = f x
        var n = 10,
            fm = (x: number) => Maybe.just(2 * x),
            fe = (x: number) => Either.right<string,number>(2 * x);

        assert.ok(Maybe.maybe(n) // unit
            .bind(fm)
            .equals(fm(n)));

        assert.ok(Either.right<string,number>(n) // unit
            .bind(fe)
            .equals(fe(n)));
    });

    QUnit.test('Monad 2: right identity', assert => {
        // (m >>= return) = m
        var m = Maybe.just(20),
            e = Either.right<string,number>(20);

        assert.ok(m.bind(m.unit).equals(m));

        assert.ok(e.bind(e.unit).equals(e));
    });

    QUnit.test('Monad 3: associativity', assert => {
        // ((m >>= f) >>= g) = (m >>= (\x -> f x >>= g))

        throw new Error('not yet implemented');
    });
}
