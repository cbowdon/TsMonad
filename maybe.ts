module TsMonad {
    'use strict';

    export interface MaybePatterns<T,U> {
        just: (t: T) => U;
        nothing: () => U;
    }

    export class Maybe<T> {

        constructor(private value?: T) {}

        static just<T>(t: T) {
            return new Maybe(t);
        }

        static nothing<T>() {
            return new Maybe<T>();
        }

        static unit<T>(t: T) {
            return Maybe.just(t);
        }

        bind<U>(f: (t: T) => Maybe<U>) {
            return this.value ?
                f(this.value) :
                Maybe.nothing<U>();
        }

        lift<U>(f: (t: T) => U) {
            return this.value ?
                Maybe.unit(f(this.value)) :
                Maybe.nothing<U>();
        }

        caseOf<U>(patterns: MaybePatterns<T, U>) {
            return this.value ?
                patterns.just(this.value) :
                patterns.nothing();
        }
    }
}
