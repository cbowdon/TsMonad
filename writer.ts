module TsMonad {
    'use strict';

    export interface WriterPatterns<S,T,U> {
        writer: (story: S[], value: T) => U;
    }

    export class Writer<S,T> implements Monad<T>, Eq<Writer<S,T>> {

        constructor(private story: S[], private value: T) {}

        // <Data constructors>
        static writer<S,T>(story: S[], value: T) {
            return new Writer(story, value);
        }

        static tell<S>(s: S) {
            return new Writer([s], 0);
        }
        // </Data constructors>

        // <Monad>
        unit<U>(u: U) {
            return new Writer([], u);
        }

        bind<U>(f: (t: T) => Writer<S,U>): Writer<S,U> {
            var wu = f(this.value),
                newStory = this.story.concat(wu.story);
            return new Writer(newStory, wu.value);
        }
        // </Monad>

        // <Functor>
        fmap<U>(f: (t: T) => U) {
            return this.bind(v => this.unit<U>(f(v)));
        }

        lift = this.fmap;
        // </Functor>

        caseOf<U>(patterns: WriterPatterns<S,T,U>) {
            return patterns.writer(this.story, this.value);
        }

        equals(other: Writer<S,T>) {
            var i: number,
                sameStory: boolean = true;
            for (i = 0; i < this.story.length; i += 1) {
                sameStory = sameStory && this.story[i] === other.story[i];
            }
            return sameStory && this.value === other.value;
        }
    }
}
