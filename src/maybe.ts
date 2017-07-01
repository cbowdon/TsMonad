import { Monad, Functor, Eq, eq } from './monad'
import { isNull, isUndefined } from 'underscore'

/**
 * @name MaybeType
 * @description Enumerate the different types contained by an Maybe object.
 * @see Maybe#
 */
export enum MaybeType { Nothing, Just }

/**
 * @name MaybePatterns
 * @description Define a contract to unwrap Maybe object using callbacks
 *     for Just and Nothing.
 * @see Maybe#
 */
export interface MaybePatterns<T,U> {
    /**
     * @name just
     * @description Function to handle the Just.
     * @type {(t: T) => U}
     */
    just: (t: T) => U;

    /**
     * @name nothing
     * @description Function to handle the Nothing.
     * @type {() => U}
     */
    nothing: () => U;
}

// ditto, but optional
export interface OptionalMaybePatterns<T,U> {
    just?: (t: T) => U;
    nothing?: () => U;
}

/**
 * @name maybe
 * @description Build a Maybe object.
 * @function
 * @param {T} t The object to wrap.
 * @returns {Maybe<T>} A Maybe object containing the input. If t is null
 *     or undefined, the Maybe object is filled with Nothing.
 * @see Maybe#
 */
export function maybe<T>(t: T) {
    return Maybe.maybe(t);
}

/**
 * @name Maybe
 * @class Encapsulates an optional value. A value of type Maybe a either
 *     contains a value of type a (represented as Just a), or it is empty
 *     (represented as Nothing).
 */
export class Maybe<T> implements Monad<T>, Functor<T>, Eq<Maybe<T>> {

    /**
     * @description Build a Maybe object. For internal use only.
     * @constructor
     * @methodOf Maybe#
     * @param {MaybeType} type Indicates if the Maybe content is a Just or a Nothing.
     * @param {T} value The value to wrap (optional).
     */
    constructor(private type: MaybeType,
                private value?: T) {}

    /**
     * @name sequence
     * @description Helper function to convert a map of Maybe objects into a Maybe of a map of objects.
     * @methodOf Maybe#
     * @static
     * @param {{[id: string]: Maybe<T>}} t The value to unwrap Maybe values from.
     * @returns {Maybe<{[id: string]: T}>} A Maybe object containing the value passed in input with fields unwrapped from Maybes.
     */
    static sequence<T>(t: {[k: string]: Maybe<T>}): Maybe<{[k: string]: T}> {
        if (Object.keys(t).filter(k => t[k].type === MaybeType.Nothing).length) {
            return Maybe.nothing<{[k: string]: T}>();
        }
        var result: {[k: string]: any} = {};
        for (var k in t) {
            if (t.hasOwnProperty(k)) {
                result[k] = t[k].value;
            }
        }
        return Maybe.just(result);
    }

    /**
     * @name all
     * @description Alias for Maybe.sequence
     * @methodOf Maybe#
     * @static
     * @see Maybe#sequence
     */
    static all = (t: {[k: string]: Maybe<any>}) => Maybe.sequence<any>(t);

    /**
     * @name maybe
     * @description Helper function to build a Maybe object.
     * @methodOf Maybe#
     * @static
     * @param {T} t The value to wrap.
     * @returns {Maybe<T>} A Maybe object containing the value passed in input. If t is null
     *     or undefined, the Maybe object is filled with Nothing.
     */
    static maybe<T>(t?: T): Maybe<T> {
        const or = (a: (x: T) => boolean, b: (y: T) => boolean) => 
          a || b;

        const eitherNil = or(isNull, isUndefined);

        return eitherNil(t)
          ? new Maybe<T>(MaybeType.Nothing) 
          : new Maybe<T>(MaybeType.Just, t);
    }

    /**
     * @name just
     * @description Helper function to build a Maybe object filled with a
     *     Just type.
     * @methodOf Maybe#
     * @static
     * @param {T} t The value to wrap.
     * @returns {Maybe<T>} A Maybe object containing the value passed in input.
     * @throws {TypeError} If t is null or undefined.
     */
    static just<T>(t: T) {
        if (t === null || t === undefined) {
            throw new TypeError('Cannot Maybe.just(null)');
        }
        return new Maybe<T>(MaybeType.Just, t);
    }

    /**
     * @name nothing
     * @description Helper function to build a Maybe object filled with a
     *     Nothing type.
     * @methodOf Maybe#
     * @static
     * @returns {Maybe<T>} A Maybe with a Nothing type.
     */
    static nothing<T>() {
        return new Maybe<T>(MaybeType.Nothing);
    }

    /**
     * @name unit
     * @description Wrap an object inside a Maybe.
     * @public
     * @methodOf Maybe#
     * @param {U} u The object to wrap.
     * @returns {Monad<U>} A Monad with the value wrapped inside.
     * @see Monad#unit
     */
    unit<U>(u: U) {
        return Maybe.maybe<U>(u); // Slight deviation from Haskell, since sadly null does exist in JS
    }

    /**
     * @name bind
     * @description Apply the function passed as parameter on the object.
     * @methodOf Maybe#
     * @public
     * @param {(t: T) => Maybe<U>} f Function applied on the Maybe content.
     * @returns {Maybe<U>} The result of the function f wrapped inside
     *     a Maybe object.
     * @see Monad#bind
     */
    bind<U>(f: (t: T) => Maybe<U>) {
        return this.type === MaybeType.Just ?
            f(this.value) :
            Maybe.nothing<U>();
    }

    /**
     * @name of
     * @description Alias for unit.
     * @methodOf Maybe#
     * @public
     * @see Maybe#unit
     * @see Monad#of
     */
    of = this.unit;

    /**
     * @name chain
     * @description Alias for bind.
     * @methodOf Maybe#
     * @public
     * @see Maybe#unit
     * @see Monad#of
     */
    chain = this.bind;

    /**
     * @name fmap
     * @description Apply the function passed as parameter on the object.
     * @methodOf Maybe#
     * @public
     * @param {(t: T) => U} f Function applied on the Maybe content.
     * @returns {Maybe<U>} The result of the function f wrapped inside
     *     an Maybe object.
     * @see Functor#fmap
     */
    fmap<U>(f: (t: T) => U) {
        return this.bind(v => this.unit<U>(f(v)));
    }

    /**
     * @name lift
     * @description Alias for fmap.
     * @methodOf Maybe#
     * @public
     * @see Maybe#fmap
     * @see Monad#of
     */
    lift = this.fmap;

    /**
     * @name map
     * @description Alias for fmap.
     * @methodOf Maybe#
     * @public
     * @see Maybe#fmap
     * @see Monad#of
     */
    map = this.fmap;

    /**
     * @name caseOf
     * @description Execute a function depending on the Maybe content. It
     *     allows to unwrap the object for Just or Nothing types.
     * @methodOf Maybe#
     * @public
     * @param {MaybePatterns<T, U>} pattern Object containing the
     *     functions to applied on each Maybe types.
     * @return {U} The returned value of the functions specified in the
     *     MaybePatterns interface.
     * @see MaybePatterns#
     */
    caseOf<U>(patterns: MaybePatterns<T, U>) {
        return this.type === MaybeType.Just ?
            patterns.just(this.value) :
            patterns.nothing();
    }

    /**
     * @name defaulting
     * @description Convert a possible Nothing into a guaranteed Maybe.Just.
     * @methodOf Maybe#
     * @public
     * @param {T} pattern Default value to have if Nothing
     * @return {Maybe<T>}
     */
    defaulting(defaultValue: T) {
        return Maybe.just(this.valueOr(defaultValue))
    }

    /**
     * @name equals
     * @description Compare the type and the content of two Maybe
     *     objects.
     * @methodOf Maybe#
     * @public
     * @param {Maybe<T>} other The Maybe to compare with.
     * @return {boolean} True if the type and content value are equals,
     *     false otherwise.
     * @see Eq#equals
     */
    equals(other: Maybe<T>) {
        return other.type === this.type &&
            (this.type === MaybeType.Nothing || eq(other.value, this.value));
    }

    /**
     * @name valueOr
     * @description Unwrap a Maybe with a default value
     * @methodOf Maybe#
     * @public
     * @param {T} defaultValue Default value to have if Nothing
     * @return {T}
     * Separate U type to allow Maybe.nothing().valueOr() to match
     * without explicitly typing Maybe.nothing.
     */
    valueOr<U extends T>(defaultValue: U): T|U {
        return this.valueOrCompute(() => defaultValue);
    }


    /**
     * @name valueOrCompute
     * @description Unwrap a Maybe with a default value computed from a thunk
     * @methodOf Maybe#
     * @public
     * @param {T} defaultValueFunction Default value to compute if Nothing
     * @return {T}
     * Separate U type to allow Maybe.nothing().valueOrCompute() to match
     * without explicitly typing Maybe.nothing.
     */
    valueOrCompute<U extends T>(defaultValueFunction: () => U): T|U {
        return this.type === MaybeType.Just ? this.value : defaultValueFunction();
    }

    /**
     * @name valueOrThrow
     * @description Unwrap a Maybe throwing if it is nothing
     * @methodOf Maybe#
     * @public
     * @param {Error} [error] Optional error to throw
     * @return {T}
     */
    valueOrThrow(error?: Error): T {
        if (this.type === MaybeType.Just) {
            return this.value;
        }
        throw (error || new Error('No value is available.'));
    }

    /**
     * @name do
     * @description Execute a function based on the Maybe content. Returns the
     *     original value, so is meant for running functions with side-effects.
     * @methodOf Maybe#
     * @public
     * @param {OptionalMaybePatterns<T, U>} pattern Object containing the
     *     functions to applied on each Maybe type.
     * @return The original Maybe value.
     * @see OptionalMaybePatterns#
     */
    do(patterns: OptionalMaybePatterns<T, void> = {}): Maybe<T> {
        let noop_pattern = {
            just: (t: T) => {},
            nothing: () => {},
        };
        let merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    }

}
