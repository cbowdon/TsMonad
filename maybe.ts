module TsMonad {
    'use strict';

    export enum MaybeType { Just, Nothing }

    export interface MaybePatterns<T,U> {
        just: (t: T) => U;
        nothing: () => U;
    }

    export class Maybe<T> {

        constructor(private type: MaybeType, private value?: T) {}

        static just<T>(t: T) {
            return new Maybe(MaybeType.Just, t);
        }

        static nothing<T>() {
            return new Maybe<T>(MaybeType.Nothing);
        }

        static unit = Maybe.just;

        bind<U>(f: (t: T) => Maybe<U>) {
            return this.type === MaybeType.Just ?
                f(this.value) :
                Maybe.nothing<U>();
        }

        lift<U>(f: (t: T) => U) {
            var res: U;
            if (this.type === MaybeType.Just) {
                res = f(this.value);
                // the lifted function returns null, become Nothing
                if (res !== null && res !== undefined) {
                    return Maybe.unit(res);
                }
            }
            return Maybe.nothing<U>();
        }

        caseOf<U>(patterns: MaybePatterns<T, U>) {
            return this.type === MaybeType.Just ?
                patterns.just(this.value) :
                patterns.nothing();
        }
    }
}
