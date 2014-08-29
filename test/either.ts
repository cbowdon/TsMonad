/// <reference path="../either.ts" />

module TsMonad.Test {
    var Either = TsMonad.Either;

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

    var eh = Either.unit<string,number>(10)
        .bind(r => Either.unit<string, number>(r * 2))
        .bind(r => Either.left<string, number>('nope'))
        .caseOf({
            left: s => -1,
            right: n => n * 2
        });
}
