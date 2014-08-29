module TsMonad {
    'use strict';

    export interface EitherPatterns<L,R,T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }

    export class Either<L,R> {

        constructor(private l?: L, private r?: R) {}

        static left<L,R>(l: L) {
            return new Either<L,R>(l);
        }

        static right<L,R>(r: R) {
            return new Either<L,R>(null, r);
        }

        static unit<L,R>(r: R) {
            return this.right<L,R>(r);
        }

        bind<T>(f: (r: R) => Either<L,T>) {
            return this.r ?
                f(this.r) :
                Either.left<L,T>(this.l);
        }

        lift<T>(f: (r: R) => T) {
            return this.r ?
                Either.unit<L,T>(f(this.r)) :
                Either.left<L,T>(this.l);
        }

        caseOf<T>(pattern: EitherPatterns<L,R,T>) {
            return this.l ?
                pattern.left(this.l) :
                pattern.right(this.r);
        }
    }
}
