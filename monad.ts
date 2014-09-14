module TsMonad {
    'use strict';

    /**
     * Utility for comparing values:
     * - if objects implement Eq, defer to their .equals
     * - if are arrays, iterate and recur
     */
    export function eq(a: any, b: any) {
        var idx = 0;
        if (a === b) {
            return true;
        }
        if (typeof a.equals === 'function') {
            return a.equals(b);
        }
        if (a.length > 0 && a.length === b.length) {
            for (; idx < a.length; idx += 1) {
                if (!eq(a[idx], b[idx])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

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
