module TsMonad {
    'use strict';

    export enum EitherType { Left, Right }

    export interface EitherPatterns<L,R,T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }

    export class Either<L,R> implements Monad<R>, Functor<R> {

        // Constructor for internal use only - use the data constructors below
        constructor(private type: EitherType,
                    private l?: L,
                    private r?: R) {}

        // <Data constructors>
        static left<L,R>(l: L) {
            return new Either<L,R>(EitherType.Left, l);
        }

        static right<L,R>(r: R) {
            return new Either<L,R>(EitherType.Right, null, r);
        }
        // </Data constructors>

        // <Monad laws>
        unit<T>(t: T) {
            return Either.right<L,T>(t);
        }

        bind<T>(f: (r: R) => Either<L,T>) {
            return this.type === EitherType.Right ?
                f(this.r) :
                Either.left<L,T>(this.l);
        }

        fmap<T>(f: (r: R) => T) {
            return this.bind(v => this.unit<T>(f(v)));
        }

        lift = this.fmap;
        // </Monad laws>

        caseOf<T>(pattern: EitherPatterns<L,R,T>) {
            return this.type === EitherType.Right ?
                pattern.right(this.r) :
                pattern.left(this.l);
        }
    }
}
