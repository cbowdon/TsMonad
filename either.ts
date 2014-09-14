module TsMonad {
    'use strict';

    export enum EitherType { Left, Right }

    export interface EitherPatterns<L,R,T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }

    function exists<T>(t: T) {
        return t !== null && t !== undefined;
    }

    export function either<L,R>(l?: L, r?: R) {
        if (exists(l) && exists(r)) {
            throw new TypeError('Cannot construct an Either with both a left and a right');
        }
        if (!exists(l) && !exists(r)) {
            throw new TypeError('Cannot construct an Either with neither a left nor a right');
        }
        if (exists(l) && !exists(r)) {
            return Either.left<L,R>(l);
        }
        if (!exists(l) && exists(r)) {
            return Either.right<L,R>(r);
        }
    }

    export class Either<L,R> implements Monad<R>, Functor<R>, Eq<Either<L,R>> {

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

        // <Monad>
        unit<T>(t: T) {
            return Either.right<L,T>(t);
        }

        bind<T>(f: (r: R) => Either<L,T>) {
            return this.type === EitherType.Right ?
                f(this.r) :
                Either.left<L,T>(this.l);
        }

        of = this.unit;
        chain = this.bind;
        // </Monad>

        // <Functor>
        fmap<T>(f: (r: R) => T) {
            return this.bind(v => this.unit<T>(f(v)));
        }

        lift = this.fmap;
        map = this.fmap;
        // </Functor>

        caseOf<T>(pattern: EitherPatterns<L,R,T>) {
            return this.type === EitherType.Right ?
                pattern.right(this.r) :
                pattern.left(this.l);
        }

        equals(other: Either<L,R>) {
            return other.type === this.type &&
                ((this.type === EitherType.Left && eq(other.l, this.l)) ||
                (this.type === EitherType.Right && eq(other.r, this.r)));
        }
    }
}
