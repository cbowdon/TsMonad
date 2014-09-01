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
}
