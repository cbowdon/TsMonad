module TsMonad {
    'use strict';

    export interface Monad<T> {
        bind<U>(f: (t: T) => Monad<U>): Monad<U>;
        unit<U>(t: U): Monad<U>;
    }

    export interface Functor<T> {
        fmap<U>(f: (t: T) => U): Functor<U>;
        lift<U>(f: (t: T) => U): Functor<U>; // lift is an alias for fmap
    }

    export interface Eq<T> {
        equals(t: T): boolean;
    }

    // Not yet used
    export interface Applicative<T> extends Functor<T> {
        pure(t: T): Applicative<T>;
        ap<U>(f: (t: Applicative<T>) => U): Applicative<U>;
    }

    // Not yet used
    export interface Monoid<T> {
        mempty: Monoid<T>;
        mappend(t: Monoid<T>): Monoid<T>;
        mconcat(t: Monoid<T>[]): Monoid<T>;
    }

    // Not yet used
    export interface MonadPlus<T> extends Monad<T> {
        mzero: Monad<T>;
        mplus(t: Monad<T>): Monad<T>;
    }
}
