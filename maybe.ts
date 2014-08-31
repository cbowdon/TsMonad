/// <reference path="monad.ts" />

module TsMonad {
    'use strict';

    export enum MaybeType { Nothing, Just }

    export interface MaybePatterns<T,U> {
        just: (t: T) => U;
        nothing: () => U;
    }

    export class MaybeX<X,T> implements Monad<X,T> {
        constructor(private type: MaybeType,
                    private value?: T) {}

        // </Data constructors>
        static maybe<X,T>(t: T) {
            return t === null || t === undefined ?
                new MaybeX<X,T>(MaybeType.Nothing) :
                new MaybeX<X,T>(MaybeType.Just, t);
        }

        static just<X,T>(t: T) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new MaybeX<X,T>(MaybeType.Just, t);
        }

        static nothing<X,T>() {
            return new MaybeX<X,T>(MaybeType.Nothing);
        }
        // </Data constructors>

        // <Monad laws>
        unit<U>(u: U) {
            return MaybeX.maybe<X,U>(u); // Slight deviation from Haskell, since sadly null does exist in JS
        }

        bind<U>(f: (t: T) => MaybeX<X,U>) {
            return this.type === MaybeType.Just ?
                f(this.value) :
                MaybeX.nothing<X,U>();
        }

        fmap<U>(f: (t: T) => U) {
            return this.bind(v => this.unit<U>(f(v)));
        }

        lift = this.fmap;
        // </Monad laws>

        caseOf<U>(patterns: MaybePatterns<T, U>) {
            return this.type === MaybeType.Just ?
                patterns.just(this.value) :
                patterns.nothing();
        }
    }

    export class Maybe<T> extends MaybeX<number,T> {

        static maybe<T>(t: T) {
            return MaybeX.maybe<number,T>(t);
        }
    }

    /*
     *  aVarThatMightBeNothing.caseOf({
     *      just: s => s
     *      // no 'nothing' implementation - COMPILER ERROR
     *  });
     */
}
