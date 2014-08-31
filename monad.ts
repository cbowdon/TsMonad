module TsMonad {

    export interface Monad<A,B> {
        // A is the fixed type (Haskell: the argument to the type constructor, e.g. Either a)
        // in the case where the type constructor does not take an argument, use a dummy parameter for A
        // B is the main type parameter (e.g. Maybe b, Either string b)
        bind<C>(f: (t: B) => Monad<A,C>): Monad<A,C>;
        unit<C>(t: C): Monad<A,C>;
    }

}
