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
    class Either<L, R> implements Monad<R>, Functor<R> {
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
    interface Monad<T> {
        bind<U>(f: (t: T) => Monad<U>): Monad<U>;
        unit<U>(t: U): Monad<U>;
    }
    interface Functor<T> {
        fmap<U>(f: (t: T) => U): Functor<U>;
        lift<U>(f: (t: T) => U): Functor<U>;
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
    class Maybe<T> implements Monad<T>, Functor<T> {
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
    }
}
