/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/tsmonad.d.ts" />

module TsMonad.Test {
    'use strict';

    QUnit.module('WriterString');

    QUnit.test('Bind', assert => {

        assert.ok(WriterString.tell('This ')
            .bind(x => new WriterString('is a ', [1,2,3]))
            .bind(x => new WriterString('story', 0))
            .equals(WriterString.tell('This is a story')));
    });

    QUnit.test('Case of', assert => {

        assert.ok(WriterString.tell('all about')
            .caseOf({
                writer: (s, v) => s === 'all about' && v === 0
            }));
    });

    QUnit.test('Lift', assert => {

        assert.ok(WriterString.tell('how')
            .lift(x => [0,0,0,0])
            .lift(x => 99)
            .caseOf({
                writer: (s, v) => s === 'how' && v === 99
            }));
    });

}
