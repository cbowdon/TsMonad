import { Monad, Functor, Eq, eq } from './monad'

export interface ReaderPattern<E, A, U> {
    reader: (k: (a: E) => A) => U;
}

export function reader<E, A>(k: (a: E) => A) {
    return Reader.reader(k);
}

export class Reader<E, A> implements Monad<A>, Eq<Reader<E,A>> {
    constructor(private k: (a: E) => A) {}    
    run = (e: E): A => this.k(e);    
    
    
    static ask = <E, A>(): Reader<E, E> => new Reader<E, E>(x => x);    
    static asks = <E, A>(f: (a: E) => A): Reader<E, A> => new Reader(f);        
    static reader = <E, A>(k: (a: E) => A) => new Reader(k)

    
    bind = <B>(f: (e: A) => Reader<E, B>): Reader<E, B> => 
        new Reader(e => f(this.k(e)).run(e));
    fmap = <B>(f: (a: A) => B): Reader<E, B> => new Reader(e => f(this.k(e)));    
    unit = <U>(u: U) => new Reader(() => u);    
    

    of = this.unit;
    chain = this.bind;
    
    
    equals(other: Reader<E,A>) {
        return this.k === other.k;
    }
}