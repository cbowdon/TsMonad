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

    QUnit.test('sequence', assert => {

        assert.ok(Maybe.sequence({
            ten: Maybe.just(10),
            twenty: Maybe.just(20)
        }).caseOf({
            just: s => s['ten'] === 10 && s['twenty'] === 20,
            nothing: () => false
        }));

        assert.ok(Maybe.sequence<string|number>({
            num: Maybe.just(10),
            str: Maybe.just('union types')
        }).caseOf({
            just: x => x['num'] === 10 && x['str'] === 'union types',
            nothing: () => false
        }));

        assert.ok(Maybe.sequence<any>({
            num: Maybe.just(10),
            str: Maybe.just('dynamic types')
        }).caseOf({
            just: (x: any) => x.num === 10 && x.str === 'dynamic types',
            nothing: () => false
        }));

        assert.ok(Maybe.sequence({
            ten: Maybe.just(10),
            twenty: Maybe.nothing()
        }).caseOf({
            just: () => false,
            nothing: () => true
        }));

    });
}
