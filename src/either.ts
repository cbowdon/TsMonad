import { Monad, Functor, Eq, eq } from './monad'

/**
 * @name EitherType
 * @description Enumerate the different types contained by an Either object.
 */
export enum EitherType { Left, Right }

/**
 * @name EitherPatterns
 * @description Define a contract to unwrap Either object using callbacks
 *     for Left and Right.
 * @see Either#
 */
export interface EitherPatterns<L,R,T> {
    /**
     * @name left
     * @description Function to handle the Left.
     * @type {(l: L) => T}
     */
    left: (l: L) => T;

    /**
     * @name right
     * @description Function to handle the Right.
     * @type {(r: R) => T}
     */
    right: (r: R) => T;
}

// ditto, but optional
export interface OptionalEitherPatterns<L,R,T> {
    left?: (l: L) => T;
    right?: (r: R) => T;
}

function exists<T>(t: T) {
    return t !== null && t !== undefined;
}

/**
 * @name either
 * @description Build an Either object.
 * @function
 * @param l The object as a Left (optional).
 * @param r The object as a Right (optional).
 * @returns {Either<L, R>} Either object containing the input.
 * @throws {TypeError} If there are both or none of left and right
 *     parameter.
 * @see Either#
 */
export function either<L,R>(l?: L, r?: R) {
    if (exists(l) && exists(r)) {
        throw new TypeError('Cannot construct an Either with both a left and a right');
    }
    if (!exists(l) && !exists(r)) {
        throw new TypeError('Cannot construct an Either with neither a left nor a right');
    }
    if (exists(l) && !exists(r)) {
        return Either.left<L,R>(l);
    }
    if (!exists(l) && exists(r)) {
        return Either.right<L,R>(r);
    }
}

/**
 * @name Either
 * @class Either has exactly two sub types, Left (L) and Right (R). If an
 *     Either<L, R> object contains an instance of L, then the Either is a
 *     Left. Otherwise it contains an instance of R and is a Right. By
 *     convention, the Left constructor is used to hold an error value and
 *     the Right constructor is used to hold a correct value.
 */
export class Either<L,R> implements Monad<R>, Functor<R>, Eq<Either<L,R>> {

    /**
     * @description Build an Either object. For internal use only.
     * @constructor
     * @methodOf Either#
     * @param {EitherType} type Indicates if the Either content is a Left or a Right.
     * @param {L} l The Left value (optional).
     * @param {R} l The Right value (optional).
     */
    constructor(protected type: EitherType,
                protected l?: L,
                protected r?: R) {}

    /**
     * @name left
     * @description Helper function to build an Either with a Left.
     * @methodOf Either#
     * @static
     * @param {L} l The Left value.
     * @returns {Either<L, R>} Either object containing a Left.
     */
    static left<L,R>(l: L) {
        return new Either<L,R>(EitherType.Left, l);
    }

        /**
     * @name right
     * @description Helper function to build an Either with a Right.
     * @methodOf Either#
     * @static
     * @param {R} r The Right value.
     * @returns {Either<L, R>} Either object containing a Right.
     */
    static right<L,R>(r: R) {
        return new Either<L,R>(EitherType.Right, null, r);
    }

    /**
     * @name unit
     * @description Wrap a value inside an Either Right object.
     * @methodOf Either#
     * @public
     * @param {T} t
     * @returns {Either<L, R>} Either object containing a Right.
     * @see Monad#unit
     */
    unit<T>(t: T) {
        return Either.right<L,T>(t);
    }

    /**
     * @name bind
     * @description Apply the function passed as parameter on the object.
     * @methodOf Either#
     * @public
     * @param {(r: R) => Either<L, T>} f Function applied on the Right.
     * @returns {Either<L, T>} The result of the function f wrapped inside
     *     an Either object.
     * @see Monad#bind
     */
    bind<T>(f: (r: R) => Either<L,T>) {
        return this.type === EitherType.Right ?
            f(this.r) :
            Either.left<L,T>(this.l);
    }

    /**
     * @name of
     * @description Alias for unit.
     * @methodOf Either#
     * @public
     * @see Either#unit
     * @see Monad#of
     */
    of = this.unit;

    /**
     * @name chain
     * @description Alias for bind.
     * @methodOf Either#
     * @public
     * @see Either#bind
     * @see Monad#chain
     */
    chain = this.bind;

    /**
     * @name fmap
     * @description Apply the function passed as parameter on the object.
     * @methodOf Either#
     * @public
     * @param {(r: R) => T} f Function applied on the Right.
     * @returns {Either<L, T>} The result of the function f wrapped inside
     *     an Either object.
     * @see Functor#fmap
     */
    fmap<T>(f: (r: R) => T) {
        return this.bind(v => this.unit<T>(f(v)));
    }

    /**
     * @name lift
     * @description Alias for fmap.
     * @methodOf Either#
     * @public
     * @see Either#fmap
     * @see Functor#lift
     */
    lift = this.fmap;

    /**
     * @name map
     * @description Alias for fmap.
     * @methodOf Either#
     * @public
     * @see Either#fmap
     * @see Functor#map
     */
    map = this.fmap;

    /**
     * @name caseOf
     * @description Execute a function depending on the Either content.
     *     It allows to unwrap the object for Left or Right types.
     * @methodOf Either#
     * @public
     * @param {EitherPatterns<L, R, T>} pattern Object containing the
     *     functions to applied on each Either types.
     * @return {T} The returned value of the functions specified in the
     *     EitherPatterns interface.
     * @see EitherPatterns#
     */
    caseOf<T>(pattern: EitherPatterns<L,R,T>) {
        return this.type === EitherType.Right ?
            pattern.right(this.r) :
            pattern.left(this.l);
    }

    /**
     * @name equals
     * @description Compare the type and the content of two Either
     *     objects.
     * @methodOf Either#
     * @public
     * @param {Either<L, R>} other The Either to compare with.
     * @return {boolean} True if the type and content value are equals,
     *     false otherwise.
     * @see Eq#equals
     */
    equals(other: Either<L,R>) {
        return other.type === this.type &&
            ((this.type === EitherType.Left && eq(other.l, this.l)) ||
            (this.type === EitherType.Right && eq(other.r, this.r)));
    }

    /**
     * @name do
     * @description Execute a function based on the Either content. Returns the
     *     original value, so is meant for running functions with side-effects.
     * @methodOf Either#
     * @public
     * @param {OptionalEitherPatterns<T, U>} pattern Object containing the
     *     functions to applied on each Either type.
     * @return The original Either value.
     * @see OptionalEitherPatterns#
     */
    do(patterns: OptionalEitherPatterns<L, R, void> = {}): Either<L, R> {
        let noop_pattern = {
            left: (l: L) => {},
            right: (r: R) => {},
        };
        let merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    }
}

