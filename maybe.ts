module TsMonad {

    interface MaybePatterns<T,U> {
        just: (T) => U;
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

        static unit(t: T) {
            return Maybe.just(t);
        }

        bind<U>(f: (T) => Maybe<U>) {
            return this.value ?
                f(this.value) :
                Maybe.nothing();
        }

        caseOf<U>(patterns: MaybePatterns<T, U>) {
            return this.value ?
                patterns.just(this.value) :
                patterns.nothing();
        }
    }
}
