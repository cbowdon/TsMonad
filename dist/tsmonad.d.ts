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
    class Either<L, R> {
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
    }
}
declare module TsMonad {
    interface Monad<A, B> {
        bind<C>(f: (t: B) => Monad<A, C>): Monad<A, C>;
        unit<C>(t: C): Monad<A, C>;
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
    class MaybeX<X, T> implements Monad<X, T> {
        private type;
        private value;
        constructor(type: MaybeType, value?: T);
        static maybe<X, T>(t: T): MaybeX<X, T>;
        static just<X, T>(t: T): MaybeX<X, T>;
        static nothing<X, T>(): MaybeX<X, T>;
        public unit<U>(u: U): MaybeX<X, U>;
        public bind<U>(f: (t: T) => MaybeX<X, U>): MaybeX<X, U>;
        public fmap<U>(f: (t: T) => U): MaybeX<X, U>;
        public lift: <U>(f: (t: T) => U) => MaybeX<X, U>;
        public caseOf<U>(patterns: MaybePatterns<T, U>): U;
    }
    class Maybe<T> extends MaybeX<number, T> {
        static maybe<T>(t: T): MaybeX<number, T>;
    }
}
