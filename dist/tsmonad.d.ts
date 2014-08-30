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
        static unit: <L, R>(r: R) => Either<L, R>;
        public bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
        public lift<T>(f: (r: R) => T): Either<L, T>;
        public caseOf<T>(pattern: EitherPatterns<L, R, T>): T;
    }
}
declare module TsMonad {
    enum MaybeType {
        Just = 0,
        Nothing = 1,
    }
    interface MaybePatterns<T, U> {
        just: (t: T) => U;
        nothing: () => U;
    }
    class Maybe<T> {
        private type;
        private value;
        constructor(type: MaybeType, value?: T);
        static just<T>(t: T): Maybe<T>;
        static nothing<T>(): Maybe<T>;
        static unit: <T>(t: T) => Maybe<T>;
        public bind<U>(f: (t: T) => Maybe<U>): Maybe<U>;
        public lift<U>(f: (t: T) => U): Maybe<U>;
        public caseOf<U>(patterns: MaybePatterns<T, U>): U;
    }
}
