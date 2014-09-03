module TsMonad {
    'use strict';

    export interface WriterStringPatterns<T,U> {
        writer: (story: string[], value: T) => U;
    }

    export class WriterString<T> implements Monad<T>, Eq<WriterString<T>> {

        constructor(private story: string[], private value: T) {}

        // <Data constructors>
        static writer<T>(story: string[], value: T) {
            return new WriterString(story, value);
        }

        static tell(s: string) {
            return new WriterString([s], 0);
        }
        // </Data constructors>

        // <Monad>
        unit<U>(u: U) {
            return new WriterString([], u);
        }

        bind<U>(f: (t: T) => WriterString<U>): WriterString<U> {
            var wu = f(this.value),
                newStory = this.story.concat(wu.story);
            return new WriterString(newStory, wu.value);
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
            var i: number,
                sameStory: boolean = true;
            for (i = 0; i < this.story.length; i += 1) {
                sameStory = sameStory && this.story[i] === other.story[i];
            }
            return sameStory && this.value === other.value;
        }
    }
}
