import {Maybe, maybe} from '../src/maybe'

import * as assert from 'assert'


describe('Maybe', () => {

    it('Case of', () => {

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

    it('isJust', () => {
        assert.ok(Maybe.isJust(Maybe.just(10)));

        assert.strictEqual(Maybe.isJust(Maybe.nothing()), false);
    });

    it('isNothing', () => {
        assert.ok(Maybe.isNothing(Maybe.nothing()));

        assert.strictEqual(Maybe.isNothing(Maybe.just(10)), false);
    });

    it('Do', () => {

        assert.throws(() =>
            Maybe.just(123).do({
                just: (v) => { throw 'yes'; },
                nothing: () => { throw 'no'; },
            }),
            /yes/,
            'do has a `just` path'
        );

        assert.throws(() =>
            Maybe.nothing().do({
                just: (v) => { throw 'yes'; },
                nothing: () => { throw 'no'; },
            }),
            /no/,
            'do has a `nothing` path'
        );

    });

    it('Bind', () => {

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

    it('Lift', () => {

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

    it('Constructors', () => {

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

    it('defaulting', () => {

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

    it('valueOr', () => {

        assert.strictEqual(Maybe.just(10).valueOr(20), 10);

        assert.strictEqual(Maybe.nothing<number>().valueOr(20), 20);
    });

    it('valueOrCompute', () => {

        assert.strictEqual(Maybe.just(10).valueOrCompute(() => 20), 10);

        assert.strictEqual(Maybe.nothing<number>().valueOrCompute(() => 20), 20);

        assert.strictEqual(Maybe.just(10).valueOrCompute<any>(() => { throw new Error() }), 10);

        assert.throws(() => Maybe.nothing().valueOrCompute<any>(() => { throw new Error() }));
    });

    it('valueOrThrow', () => {

        assert.strictEqual(Maybe.just(10).valueOrThrow(), 10);
        assert.strictEqual(Maybe.just(10).valueOrThrow(new Error('boo')), 10);

        assert.throws(() => Maybe.nothing().valueOrThrow());
        assert.throws(() => Maybe.nothing<number>().valueOrThrow());
        let err = new Error('boo');
        assert.throws(() => Maybe.nothing<number>().valueOrThrow(err),
            (e: Error) => e === err);
    });

    it('sequence', () => {

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

        assert.ok(Maybe.all({
            num: Maybe.just(10),
            str: Maybe.just('alias')
        }).caseOf({
            just: (x: any) => x.num === 10 && x.str === 'alias',
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

})
