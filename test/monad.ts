/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('Type class laws');

    class TestEq implements Eq<TestEq> {
        constructor(private value: string) {}
        equals(t: TestEq) {
            return this.value === t.value;
        }
    }

    QUnit.test('Eq', assert => {
        // functions rather than values so as to avoid identity equality
        var wizard  = () => new TestEq('wizard'),
            wizzard = () => new TestEq('wizzard');

        // TODO auto generate all permutations given possible types
        assert.ok(Maybe.just(20).equals(Maybe.just(20)));
        assert.ok(!Maybe.just(20).equals(Maybe.just(10)));
        assert.ok(!Maybe.just(20).equals(Maybe.nothing()));
        assert.ok(Maybe.nothing().equals(Maybe.nothing()));

        assert.ok(Either.right<string,number>(10).equals(Either.right<string,number>(10)));
        assert.ok(!Either.right<string,number>(10).equals(Either.right<string,number>(20)));
        assert.ok(!Either.right<string,number>(10).equals(Either.left<string,number>('oook')));
        assert.ok(Either.left<string,number>('oook').equals(Either.left<string,number>('oook')));

        assert.ok(maybe(wizzard()).equals(maybe(wizzard())));
        assert.ok(!maybe(wizzard()).equals(maybe(wizard())));
        assert.ok(either<string,TestEq>(null, wizzard()).equals(either<string,TestEq>(null, wizzard())));
        assert.ok(!either<string,TestEq>(null, wizzard()).equals(either<string,TestEq>(null, wizard())));

        assert.ok(maybe([1,2,3,4]).equals(maybe([1,2,3,4])));
        assert.ok(!maybe([1,2,3,4]).equals(maybe([1,2,3,4,5])));
        assert.ok(either<string,number[]>(null, [1,2,3,4]).equals(either<string,number[]>(null, [1,2,3,4])));
        assert.ok(!either<string,number[]>(null, [1,2,3,4]).equals(either<string,number[]>(null, [1,2,3,99])));
        assert.ok(either<number[],string>([1,2,3,4]).equals(either<number[],string>([1,2,3,4])));
        assert.ok(!either<number[],string>([1,2,3,4]).equals(either<number[],string>([1,2,3,4,5])));
    });

    // TODO is it worth making Monad extend Eq just to reduce the duplication here?

    QUnit.test('Functor 1: fmap id = id', assert => {

        _.each([ Maybe.just(20), Maybe.nothing<number>() ],
            t => assert.ok(t.equals(t.fmap(x => x))));

        _.each([ Either.right<string,number>(20), Either.left<string,number>('oook') ],
            t => assert.ok(t.equals(t.fmap(x => x))));

        _.each([ Writer.writer(['(^_^)'], 99) ],
            t => assert.ok(t.equals(t.fmap(x => x))));
    });

    QUnit.test('Functor 2: fmap (f . g) = fmap f . fmap g', assert => {
        var f = (x: number) => x * 2,
            g = (x: number) => x - 3;

        _.each([ Maybe.just(10), Maybe.nothing<number>() ],
            t => {
                var lhs = t.fmap(f).fmap(g),
                    rhs = t.fmap(x => g(f(x)));
                assert.ok(lhs.equals(rhs));
            });

        _.each([ Either.right<string,number>(10), Either.left<string,number>('oook') ],
            t => {
                var lhs = t.fmap(f).fmap(g),
                    rhs = t.fmap(x => g(f(x)));
                assert.ok(lhs.equals(rhs));
            });

        _.each([ Writer.writer(['(^_^)'], 99) ],
            t => {
                var lhs = t.fmap(f).fmap(g),
                    rhs = t.fmap(x => g(f(x)));
                assert.ok(lhs.equals(rhs));
            });
    });

    QUnit.test('Monad 1: left identity', assert => {
        // (return x >>= f) = f x
        var n = 10,
            fm = (x: number) => Maybe.just(2 * x),
            fe = (x: number) => Either.right<string,number>(2 * x),
            fw = (x: number) => Writer.writer([n], 2 * n);

        assert.ok(Maybe.maybe(n) // unit
            .bind(fm)
            .equals(fm(n)));

        assert.ok(Either.right<string,number>(n) // unit
            .bind(fe)
            .equals(fe(n)));

        assert.ok(Writer.writer<number,number>([], n)
            .bind(fw)
            .equals(fw(n)));
    });

    QUnit.test('Monad 2: right identity', assert => {
        // (m >>= return) = m
        var m = Maybe.just(20),
            e = Either.right<string,number>(20),
            w = Writer.writer(['(^_^)'], 20);

        assert.ok(m.bind(m.unit).equals(m));

        assert.ok(e.bind(e.unit).equals(e));

        assert.ok(w.bind(w.unit).equals(w));
    });

    QUnit.test('Monad 3: associativity', assert => {
        // ((m >>= f) >>= g) = (m >>= (\x -> f x >>= g))
        var n = 10,
            m = Maybe.just(n),
            e = Either.right<string,number>(n),
            w = Writer.writer([n], n),
            fm = (x: number) => Maybe.just(2 * x),
            gm = (x: number) => Maybe.just(x - 3),
            fe = (x: number) => Either.right<string,number>(2 * x),
            ge = (x: number) => Either.right<string,number>(x - 3),
            fw = (x: number) => Writer.writer([x], 2 * x),
            gw = (x: number) => Writer.writer([x], x - 3);

        assert.ok(m.bind(fm).bind(gm)
            .equals(m.bind(x => fm(x).bind(gm))));

        assert.ok(e.bind(fe).bind(ge)
            .equals(e.bind(x => fe(x).bind(ge))));

        assert.ok(w.bind(fw).bind(gw)
            .equals(w.bind(x => fw(x).bind(gw))));
    });
}
