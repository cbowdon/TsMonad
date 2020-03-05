import { Either, either } from '../src/either'

import * as assert from 'assert'

describe('Either', () => {

  it('Case of', () => {

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

  it('isLeft', () => {
    assert.ok(Either.left(2).isLeft());

    assert.strictEqual(Either.right(2).isLeft(), false);
  });

  it('isRight', () => {
    assert.ok(Either.right(2).isRight());

    assert.strictEqual(Either.left(2).isRight(), false);
  });

  it('Do', () => {

    assert.throws(() =>
      either('l', null).do({
        left: (l) => { throw 'left'; },
        right: (r) => { throw 'right'; },
      }),
      /left/,
      'do has a `left` path'
    );

    assert.throws(() =>
      either(null, 'r').do({
        left: (l) => { throw 'left'; },
        right: (r) => { throw 'right'; },
      }),
      /right/,
      'do has a `right` path'
    );

  });

  it('Bind', () => {

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

  it('Lift', () => {

    assert.ok(Either.right<string, number>(2)
      .lift(n => n * 2)
      .lift(n => n * 2)
      .caseOf({
        left: s => false,
        right: n => n === 8
      }));

    assert.ok(Either.right<string, number>(2)
      .lift(n => n * 2)
      .lift(n => null)
      .caseOf({
        left: s => false,
        right: n => !n
        // unlike Maybe, lifting a null into Either has no special behaviour
        // so try to avoid this kind of sociopathic behaviour
      }));
  });

  it('Constructors', () => {

    assert.ok(either<string, number>('oh noes')
      .caseOf({
        left: s => s === 'oh noes',
        right: n => false
      }));

    assert.ok(either<string, number>(undefined, 123)
      .caseOf({
        left: s => false,
        right: n => n === 123
      }));

    assert.throws(() => either('not both', 123), /both/);
    assert.throws(() => either<string, number>(), /neither/);
  });

})
