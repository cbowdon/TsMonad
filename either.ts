module TsMonad {
    'use strict';

    export enum EitherType { Left, Right }

    export interface EitherPatterns<L,R,T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }

    export class Either<L,R> {

        constructor(private type: EitherType,
                    private l?: L,
                    private r?: R) {}

        static left<L,R>(l: L) {
            return new Either<L,R>(EitherType.Left, l);
        }

        static right<L,R>(r: R) {
            return new Either<L,R>(EitherType.Right, null, r);
        }

        static unit = Either.right;

        bind<T>(f: (r: R) => Either<L,T>) {
            return this.type === EitherType.Right ?
                f(this.r) :
                Either.left<L,T>(this.l);
        }

        lift<T>(f: (r: R) => T) {
            return this.type === EitherType.Right ?
                Either.unit<L,T>(f(this.r)) :
                Either.left<L,T>(this.l);
        }

        caseOf<T>(pattern: EitherPatterns<L,R,T>) {
            return this.type === EitherType.Right ?
                pattern.right(this.r) :
                pattern.left(this.l);
        }
    }
}
