/// <reference path="monad.ts" />

module TsMonad {
    'use strict';

    export enum MaybeType { Nothing, Just }

    export interface MaybePatterns<T,U> {
        just: (t: T) => U;
        nothing: () => U;
    }

    export function maybe<T>(t: T) {
        return Maybe.maybe(t);
    }

    export class Maybe<T> implements Monad<T>, Functor<T>, Eq<Maybe<T>> {

        constructor(private type: MaybeType,
                    private value?: T) {}

        // </Data constructors>
        static maybe<T>(t: T) {
            return t === null || t === undefined ?
                new Maybe<T>(MaybeType.Nothing) :
                new Maybe<T>(MaybeType.Just, t);
        }

        static just<T>(t: T) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new Maybe<T>(MaybeType.Just, t);
        }

        static nothing<T>() {
            return new Maybe<T>(MaybeType.Nothing);
        }
        // </Data constructors>

        // <Monad>
        unit<U>(u: U) {
            return Maybe.maybe<U>(u); // Slight deviation from Haskell, since sadly null does exist in JS
        }

        bind<U>(f: (t: T) => Maybe<U>) {
            return this.type === MaybeType.Just ?
                f(this.value) :
                Maybe.nothing<U>();
        }

        of = this.unit;
        chain = this.bind;
        // </Monad>

        // <Functor>
        fmap<U>(f: (t: T) => U) {
            return this.bind(v => this.unit<U>(f(v)));
        }

        lift = this.fmap;
        map = this.fmap;
        // </Functor>

        caseOf<U>(patterns: MaybePatterns<T, U>) {
            return this.type === MaybeType.Just ?
                patterns.just(this.value) :
                patterns.nothing();
        }

        equals(other: Maybe<T>) {
            return other.type === this.type &&
                (this.type === MaybeType.Nothing || eq(other.value, this.value));
        }
    }
}
