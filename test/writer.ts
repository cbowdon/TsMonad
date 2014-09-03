/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('WriterString');

    QUnit.test('Bind', assert => {

        assert.ok(WriterString.tell('This ')
            .bind(x => WriterString.writer(['is a '], [1,2,3]))
            .bind(x => WriterString.writer(['story'], 99))
            .equals(WriterString.writer(['This ', 'is a ', 'story'], 99)));
    });

    QUnit.test('Case of', assert => {

        assert.ok(WriterString.tell('all about')
            .caseOf({
                writer: (s, v) => _.isEqual(s, ['all about']) && v === 0
            }));
    });

    QUnit.test('Lift', assert => {

        assert.ok(WriterString.tell('how')
            .lift(x => [0,0,0,0])
            .lift(x => 99)
            .caseOf({
                writer: (s, v) => _.isEqual(s, ['how']) && v === 99
            }));
    });

}
