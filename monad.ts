module TsMonad {
    'use strict';

    // TODO Eq implementations so far use just using '===', but pulling in _.IsEqual would be better
    export interface Eq<T> {
        equals(t: T): boolean;
    }

    export interface Monad<T> {
        unit<U>(t: U): Monad<U>;
        bind<U>(f: (t: T) => Monad<U>): Monad<U>;

        // Fantasy Land Monad conformance
        of<U>(t: U): Monad<U>; // alias for unit (Fantasy Land Applicative)
        chain<U>(f: (t: T) => Monad<U>): Monad<U>; // alias for bind (Fantasy Land Chain)
    }

    export interface Functor<T> {
        fmap<U>(f: (t: T) => U): Functor<U>;
        lift<U>(f: (t: T) => U): Functor<U>; // lift is an alias for fmap

        // Fantasy Land Functor conformance
        map<U>(f: (t: T) => U): Functor<U>; // alias for fmap (Fantasy Land Functor)
    }

    // Not yet used
    interface Monoid<T> {
        mempty: Monoid<T>;
        mappend(t: Monoid<T>): Monoid<T>;
        mconcat(t: Monoid<T>[]): Monoid<T>;
    }

    // Not yet used
    interface MonadPlus<T> extends Monad<T> {
        mzero: Monad<T>;
        mplus(t: Monad<T>): Monad<T>;
    }
}
