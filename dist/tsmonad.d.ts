/// <reference path="../typings/tsd.d.ts" />
declare module TsMonad {
    enum EitherType {
        Left = 0,
        Right = 1,
    }
    interface EitherPatterns<L, R, T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }
    class Either<L, R> implements Monad<R>, Functor<R>, Eq<Either<L, R>> {
        private type;
        private l;
        private r;
        constructor(type: EitherType, l?: L, r?: R);
        static left<L, R>(l: L): Either<L, R>;
        static right<L, R>(r: R): Either<L, R>;
        public unit<T>(t: T): Either<L, T>;
        public bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
        public fmap<T>(f: (r: R) => T): Either<L, T>;
        public lift: <T>(f: (r: R) => T) => Either<L, T>;
        public caseOf<T>(pattern: EitherPatterns<L, R, T>): T;
        public equals(other: Either<L, R>): boolean;
    }
}
declare module TsMonad {
    interface Monad<T> {
        bind<U>(f: (t: T) => Monad<U>): Monad<U>;
        unit<U>(t: U): Monad<U>;
    }
    interface Functor<T> {
        fmap<U>(f: (t: T) => U): Functor<U>;
        lift<U>(f: (t: T) => U): Functor<U>;
    }
    interface Eq<T> {
        equals(t: T): boolean;
    }
    interface Applicative<T> extends Functor<T> {
        pure(t: T): Applicative<T>;
        ap<U>(f: (t: Applicative<T>) => U): Applicative<U>;
    }
    interface Monoid<T> {
        mempty: Monoid<T>;
        mappend(t: Monoid<T>): Monoid<T>;
        mconcat(t: Monoid<T>[]): Monoid<T>;
    }
    interface MonadPlus<T> extends Monad<T> {
        mzero: Monad<T>;
        mplus(t: Monad<T>): Monad<T>;
    }
}
declare module TsMonad {
    enum MaybeType {
        Nothing = 0,
        Just = 1,
    }
    interface MaybePatterns<T, U> {
        just: (t: T) => U;
        nothing: () => U;
    }
    class Maybe<T> implements Monad<T>, Functor<T>, Eq<Maybe<T>> {
        private type;
        private value;
        constructor(type: MaybeType, value?: T);
        static maybe<T>(t: T): Maybe<T>;
        static just<T>(t: T): Maybe<T>;
        static nothing<T>(): Maybe<T>;
        public unit<U>(u: U): Maybe<U>;
        public bind<U>(f: (t: T) => Maybe<U>): Maybe<U>;
        public fmap<U>(f: (t: T) => U): Maybe<U>;
        public lift: <U>(f: (t: T) => U) => Maybe<U>;
        public caseOf<U>(patterns: MaybePatterns<T, U>): U;
        public equals(other: Maybe<T>): boolean;
    }
}
