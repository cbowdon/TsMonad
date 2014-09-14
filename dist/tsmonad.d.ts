declare module TsMonad {
    enum EitherType {
        Left = 0,
        Right = 1,
    }
    interface EitherPatterns<L, R, T> {
        left: (l: L) => T;
        right: (r: R) => T;
    }
    function either<L, R>(l?: L, r?: R): Either<L, R>;
    class Either<L, R> implements Monad<R>, Functor<R>, Eq<Either<L, R>> {
        private type;
        private l;
        private r;
        constructor(type: EitherType, l?: L, r?: R);
        static left<L, R>(l: L): Either<L, R>;
        static right<L, R>(r: R): Either<L, R>;
        public unit<T>(t: T): Either<L, T>;
        public bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
        public of: <T>(t: T) => Either<L, T>;
        public chain: <T>(f: (r: R) => Either<L, T>) => Either<L, T>;
        public fmap<T>(f: (r: R) => T): Either<L, T>;
        public lift: <T>(f: (r: R) => T) => Either<L, T>;
        public map: <T>(f: (r: R) => T) => Either<L, T>;
        public caseOf<T>(pattern: EitherPatterns<L, R, T>): T;
        public equals(other: Either<L, R>): any;
    }
}
declare module TsMonad {
    /**
    * Utility for comparing values:
    * - if objects implement Eq, defer to their .equals
    * - if are arrays, iterate and recur
    */
    function eq(a: any, b: any): any;
    interface Eq<T> {
        equals(t: T): boolean;
    }
    interface Monad<T> {
        unit<U>(t: U): Monad<U>;
        bind<U>(f: (t: T) => Monad<U>): Monad<U>;
        of<U>(t: U): Monad<U>;
        chain<U>(f: (t: T) => Monad<U>): Monad<U>;
    }
    interface Functor<T> {
        fmap<U>(f: (t: T) => U): Functor<U>;
        lift<U>(f: (t: T) => U): Functor<U>;
        map<U>(f: (t: T) => U): Functor<U>;
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
    function maybe<T>(t: T): Maybe<T>;
    class Maybe<T> implements Monad<T>, Functor<T>, Eq<Maybe<T>> {
        private type;
        private value;
        constructor(type: MaybeType, value?: T);
        static maybe<T>(t: T): Maybe<T>;
        static just<T>(t: T): Maybe<T>;
        static nothing<T>(): Maybe<T>;
        public unit<U>(u: U): Maybe<U>;
        public bind<U>(f: (t: T) => Maybe<U>): Maybe<U>;
        public of: <U>(u: U) => Maybe<U>;
        public chain: <U>(f: (t: T) => Maybe<U>) => Maybe<U>;
        public fmap<U>(f: (t: T) => U): Maybe<U>;
        public lift: <U>(f: (t: T) => U) => Maybe<U>;
        public map: <U>(f: (t: T) => U) => Maybe<U>;
        public caseOf<U>(patterns: MaybePatterns<T, U>): U;
        public equals(other: Maybe<T>): any;
    }
}
declare module TsMonad {
    interface WriterPatterns<S, T, U> {
        writer: (story: S[], value: T) => U;
    }
    function writer<S, T>(story: S[], value: T): Writer<S, T>;
    class Writer<S, T> implements Monad<T>, Eq<Writer<S, T>> {
        private story;
        private value;
        constructor(story: S[], value: T);
        static writer<S, T>(story: S[], value: T): Writer<S, T>;
        static tell<S>(s: S): Writer<S, number>;
        public unit<U>(u: U): Writer<any, U>;
        public bind<U>(f: (t: T) => Writer<S, U>): Writer<S, U>;
        public of: <U>(u: U) => Writer<any, U>;
        public chain: <U>(f: (t: T) => Writer<S, U>) => Writer<S, U>;
        public fmap<U>(f: (t: T) => U): Writer<S, U>;
        public lift: <U>(f: (t: T) => U) => Writer<S, U>;
        public map: <U>(f: (t: T) => U) => Writer<S, U>;
        public caseOf<U>(patterns: WriterPatterns<S, T, U>): U;
        public equals(other: Writer<S, T>): boolean;
    }
}
declare var module: {
    exports: any;
    require(id: string): any;
    id: string;
    filename: string;
    loaded: boolean;
    parent: any;
    children: any[];
};
