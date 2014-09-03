module TsMonad {
    'use strict';

    export interface WriterStringPatterns<T,U> {
        writer: (story: string, value: T) => U;
    }

    export class WriterString<T> implements Monad<T>, Eq<WriterString<T>> {

        constructor(private story: string, private value: T) {}

        // <Data constructors>
        static tell(story: string) {
            return new WriterString<number>(story, 0);
        }
        // </Data constructors>

        // <Monad>
        unit<U>(u: U) {
            return new WriterString('', u);
        }

        bind<U>(f: (t: T) => WriterString<U>): WriterString<U> {
            var wu = f(this.value);
            return new WriterString(this.story + wu.story, wu.value);
        }
        // </Monad>

        // <Functor>
        fmap<U>(f: (t: T) => U) {
            return this.bind(v => this.unit<U>(f(v)));
        }

        lift = this.fmap;
        // </Functor>

        caseOf<U>(patterns: WriterStringPatterns<T,U>) {
            return patterns.writer(this.story, this.value);
        }

        equals(other: WriterString<T>) {
            return this.story === other.story && this.value === other.value;
        }
    }
}
