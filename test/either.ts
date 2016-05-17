/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('Either');

    QUnit.test('Case of', assert => {

        assert.ok(Either.left<string, number>('on noes')
            .caseOf({
                left: s => true,
                right: n => false
            }));

        assert.ok(Either.right<string, number>(1)
            .caseOf({
                left: s => false,
                right: n => true
            }));
    });

    QUnit.test('Do', assert => {

      assert.throws(
          Either.either('l', null).do({
              left: (l) => { throws 'left'; },
              right: (r) => { throws 'right'; },
          }),
          /left/,
          'do has a `left` path'
      );

      assert.throws(
          Either.either(null, 'r').do({
            left: (l) => { throws 'left'; },
            right: (r) => { throws 'right'; },
          }),
          /right/,
          'do has a `right` path'
      );

    });

    QUnit.test('Bind', assert => {

        assert.ok(Either.right<string, number>(2)
            .bind(n => Either.right<string, number>(n * 2))
            .bind(n => Either.right<string, number>(n * 2))
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(Either.right<string, number>(2)
            .bind(n => Either.right<string, number>(n * 2))
            .bind(n => Either.left<string, number>('nooo'))
            .caseOf({
                left: s => s === 'nooo',
                right: n => false
            }));
    });

    QUnit.test('Lift', assert => {

        assert.ok(Either.right<string, number>(2)
            .lift(n => n * 2)
            .lift(n => n * 2)
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(Either.right<string, number>(2)
            .lift(n => n * 2)
            .lift(n => <number>null)
            .caseOf({
                left: s => false,
                right: n => !n
                // unlike Maybe, lifting a null into Either has no special behaviour
                // so try to avoid this kind of sociopathic behaviour
            }));
    });

    QUnit.test('Constructors', assert => {

        assert.ok(either<string, number>('oh noes')
            .caseOf({
                left: s => s === 'oh noes',
                right: n => false
            }));

        assert.ok(either<string, number>(null, 123)
            .caseOf({
                left: s => false,
                right: n => n === 123
            }));

        assert.throws(() => either('not both', 123), /both/);
        assert.throws(() => either<string,number>(), /neither/);
    });
}
