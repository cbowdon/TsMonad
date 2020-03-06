
/**
 * @name eq
 * @description Compare two objects :
 *     1. if objects implement Eq, defer to their .equals
 *     2. if are arrays, iterate and recur
 * @function
 * @param {any} a Any object.
 * @param {any} b Any object.
 * @returns {boolean} In case 1, the `.equals()` function returned value.
 *     In case 2, true if each elements are equals, false otherwise.
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

/**
 * @name Eq
 * @description Define a contract to compare (in)equalities between
 *     objects.
 */
export interface Eq<T> {
  /**
   * @name equals
   * @description Determine if two objects are equals.
   * @methodOf Eq
   * @public
   * @param {T} The object to compare with.
   * @returns {boolean} True if the objects are equals, false otherwise.
   */
  equals(t: T): boolean;
}

export interface Monad<T> {
  /**
   * @name unit
   * @description Wrap an object inside a monad.
   * @methodOf Monad#
   * @public
   * @param {U} t The object to wrap.
   * @returns {Monad<U>} A Monad with the value wrapped inside.
   */
  unit<U>(t: U): Monad<U>;

  /**
   * @name of
   * @description Alias for unit. Fantasy Land Monad conformance.
   * @methodOf Monad#
   * @public
   * @static
   * @param {U} t The object to wrap.
   * @returns {Monad<U>} A Monad with the value wrapped inside.
   * @see Monad#unit
   */
  of<U>(t: U): Monad<U>;

  /**
   * @name bind
   * @description Apply the function passed as parameter on the object.
   * @methodOf Monad#
   * @public
   * @static
   * @param {(t: T) => Monad<U>} f Function applied on the Monad content.
   * @returns {Monad<U>} The result of the function f wrapped inside
   *     a Monad object.
   */
  bind<U>(f: (t: T) => Monad<U>): Monad<U>;

  /**
   * @name chain
   * @description Alias for bind. Fantasy Land Monad conformance.
   * @methodOf Monad#
   * @public
   * @see Monad#bind
   */
  chain<U>(f: (t: T) => Monad<U>): Monad<U>;

}

/**
 * @name Functor
 * @description Define a contract to add basic functor functions to an
 *     object.
 */
export interface Functor<T> {
  /**
   * @name fmap
   * @description Apply the function passed as parameter on the object.
   * @methodOf Functor#
   * @public
   * @param {(t: T) => U} f Function applied on the functor content.
   * @returns {Functor<U>} The result of the function f wrapped inside
   *     an Functor object.
   * @see Functor#fmap
   */
  fmap<U>(f: (t: T) => U): Functor<U>;

  /**
   * @name lift
   * @description Alias for fmap.
   * @methodOf Functor#
   * @public
   * @see Functor#fmap
   */
  lift<U>(f: (t: T) => U): Functor<U>;

  /**
   * @name map
   * @description Alias for fmap. Fantasy Land Monad conformance.
   * @methodOf Functor#
   * @public
   * @see Functor#fmap
   */
  map<U>(f: (t: T) => U): Functor<U>;
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

