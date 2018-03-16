import { Monad, Functor, Eq, eq } from "./monad";

/**
 * @name WriterPatterns
 * @description Define a contract to unwrap Writer object using a
 *     callback.
 * @see Writer#
 */
export interface WriterPatterns<S, T, U> {
  /**
   * @name writer
   * @description Function to handle the Writer content.
   * @type {(story: S[], value: T) => U}
   */
  writer: (story: S[], value: T) => U;
}

/**
 * @name writer
 * @description Build a Writer object.
 * @function
 * @param {S[]} story The collection to store logs.
 * @param {T} value The object to wrap.
 * @returns {Writer<S, T>} A Writer object containing the log collection
 *     and the wrapped value.
 * @see Writer#
 */
export function writer<S, T>(story: S[], value: T) {
  return Writer.writer(story, value);
}

/**
 * @name Writer
 * @class Allow to do computations while making sure that all the log
 *     values are combined into one log value that then gets attached to
 *     the result.
 */
export class Writer<S, T> implements Monad<T>, Eq<Writer<S, T>> {
  /**
   * @description Build a Writer object. For internal use only.
   * @constructor
   * @methodOf Writer#
   * @param {S[]} story The collection of logs.
   * @param {T} value The object to wrap.
   */
  constructor(private story: S[], private value: T) {}

  /**
   * @name writer
   * @description Helper function to build a Writer object.
   * @methodOf Writer#
   * @static
   * @param {S[]} story The collection of logs.
   * @param {T} value The object to wrap.
   * @returns {Writer<S, T>} A Writer object containing the collection of logs
   *     and the wrapped value.
   */
  static writer<S, T>(story: S[], value: T) {
    return new Writer(story, value);
  }

  /**
   * @name writer
   * @description Helper function to build a Writer object with the log
   *     passed in input only.
   * @methodOf Writer#
   * @static
   * @param {S} s A log to store.
   * @returns {Writer<S, number>} A Writer object containing the collection of logs
   *     and a zeroed value.
   */
  static tell<S>(s: S) {
    return new Writer([s], 0);
  }

  /**
   * @name unit
   * @description Wrap an object inside a Writer.
   * @public
   * @methodOf Writer#
   * @param {U} u The object to wrap.
   * @returns {Monad<U>} A Writer with the value wrapped inside and an
   *     empty collection of logs.
   * @see Monad#unit
   */
  unit<U>(u: U) {
    return new Writer([], u);
  }

  /**
   * @name bind
   * @description Apply the function passed as parameter on the object.
   * @methodOf Writer#
   * @public
   * @param {(t: T) => Writer<S, U>} f Function applied on the Writer content.
   * @returns {Writer<S, U>} The result of the function f append to the
   *     Writer object.
   * @see Monad#bind
   */
  bind<U>(f: (t: T) => Writer<S, U>): Writer<S, U> {
    var wu = f(this.value),
      newStory = this.story.concat(wu.story);
    return new Writer(newStory, wu.value);
  }

  /**
   * @name of
   * @description Alias for unit.
   * @methodOf Writer#
   * @public
   * @see Writer#unit
   * @see Monad#of
   */
  of = this.unit;

  /**
   * @name chain
   * @description Alias for bind
   * @methodOf Writer#
   * @public
   * @see Writer#unit
   * @see Monad#of
   */
  chain = this.bind;

  /**
   * @name fmap
   * @description Apply the function passed as parameter on the object.
   * @methodOf Writer#
   * @public
   * @param {(t: T) => U} f Function applied on the wrapped value.
   * @returns {Writer<S, U>} The result of the function f wrapped inside
   *     an Writer object. It has an empty collection of logs.
   * @see Functor#fmap
   */
  fmap<U>(f: (t: T) => U) {
    return this.bind(v => this.unit<U>(f(v)));
  }

  /**
   * @name lift
   * @description Alias for fmap
   * @methodOf Writer#
   * @public
   * @see Writer#fmap
   * @see Monad#of
   */
  lift = this.fmap;

  /**
   * @name map
   * @description Alias for fmap
   * @methodOf Writer#
   * @public
   * @see Writer#fmap
   * @see Monad#of
   */
  map = this.fmap;

  /**
   * @name caseOf
   * @description Execute a function on the Writer content. It allows to
   *     unwrap the object.
   * @methodOf Writer#
   * @public
   * @param {WriterPatterns<S, T, U>} pattern Object containing the
   *     functions to applied on the Writer content.
   * @return {U} The returned value of the function specified in the
   *     WriterPatterns interface.
   * @see WriterPatterns#
   */
  caseOf<U>(patterns: WriterPatterns<S, T, U>) {
    return patterns.writer(this.story, this.value);
  }

  /**
   * @name equals
   * @description Compare the type and the content of two Writer
   *     objects.
   * @methodOf Writer#
   * @public
   * @param {Writer<S, T>} other The Writer to compare with.
   * @return {boolean} True if the collection of logs and content value
   *     are equals, false otherwise.
   * @see Eq#equals
   */
  equals(other: Writer<S, T>) {
    var i: number,
      sameStory: boolean = true;
    for (i = 0; i < this.story.length; i += 1) {
      sameStory = sameStory && this.story[i] === other.story[i];
    }
    return sameStory && this.value === other.value;
  }
}
